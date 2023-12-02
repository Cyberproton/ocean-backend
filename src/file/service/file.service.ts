import { BucketAlreadyExists, NoSuchKey, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Inject, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Readable } from 'stream';

import { RequestContext } from 'src/common/request-context';
import { LoggerService } from 'src/logger/logger.service';
import { Role } from 'src/role/constant';
import { FileConfig, fileConfig } from '../config';
import { FileSizeUnit, FolderPath } from '../constant';
import { CreateFileDto, FileQueryDto } from '../dto';
import { DownloadFileQueryDto } from '../dto/download-file.query.dto';
import { FileOutputDto } from '../dto/file-output.dto';
import { UploadFileOutputDto } from '../dto/upload-file-output.dto';
import { FileProcessingHasNotFinished } from '../exception';
import { FileNotFoundException } from '../exception/file-not-found.exception';
import { FileModel } from '../model';
import { FileRepository } from '../repository';
import { FileUploadOptions } from '../type';

@Injectable()
export class FileService {
  private readonly client: S3;
  private readonly bucket: string;

  constructor(
    @Inject(fileConfig.KEY) fileConfigApi: FileConfig,
    private readonly fileRepo: FileRepository,
    private readonly logger: LoggerService,
  ) {
    this.client = new S3({
      endpoint: fileConfigApi.endpoint,
      region: fileConfigApi.region,
      credentials: {
        accessKeyId: fileConfigApi.accessKey,
        secretAccessKey: fileConfigApi.secretKey,
      },
    });
    this.bucket = fileConfigApi.bucket;
    this.setup();
  }

  async setup() {
    try {
      await this.client.createBucket({
        Bucket: this.bucket,
      });
    } catch (err) {
      if (!(err instanceof BucketAlreadyExists)) {
        throw err;
      }
    }
  }

  async findFiles(
    context: RequestContext,
    query: FileQueryDto,
  ): Promise<FileOutputDto[]> {
    const userRoles = context.user.roles;
    const canFindAll =
      userRoles.includes(Role.Admin) ||
      userRoles.includes(Role.SuperAdmin) ||
      userRoles.includes(Role.Operator);
    const files = await this.fileRepo.findMany({
      id: query.id,
      createdBy: canFindAll ? undefined : context.user.id,
      limit: query.limit,
      offset: query.offset,
    });
    return files.map((file) => new FileOutputDto(file));
  }

  async findFileById(
    context: RequestContext,
    id: string,
  ): Promise<FileOutputDto | null> {
    const res = await this.fileRepo.findById(id);
    if (!res) {
      return null;
    }
    return new FileOutputDto(res);
  }

  async uploadFile(
    context: RequestContext,
    uploadFile: Express.Multer.File,
    options?: FileUploadOptions,
  ): Promise<UploadFileOutputDto> {
    const key = nanoid();
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Body: uploadFile.buffer,
        Key: key,
        Metadata: {
          originalname: uploadFile.originalname,
          mimetype: uploadFile.mimetype,
        },
      },
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    });

    upload.on('httpUploadProgress', (progress) => {
      if (progress.loaded != null && progress.total != null) {
        this.logger.log(
          `file upload progress: ${Math.round(
            (progress.loaded / progress.total) * 100,
          )}%`,
        );
      }
    });

    await this.uploadFileToS3(context, upload);

    const file = {
      id: key,
      name: uploadFile.originalname,
      mimetype: uploadFile.mimetype,
      path: options?.folderPath ?? FolderPath.Root,
      size: uploadFile.size,
      sizeUnit: FileSizeUnit.B,
      createdBy: context.user.id,
    };

    const res = await this.createFile(file);
    return new UploadFileOutputDto(res);
  }

  async createFile(file: CreateFileDto): Promise<FileOutputDto> {
    const res = await this.fileRepo.create(file);
    return new FileOutputDto(res);
  }

  private async uploadFileToS3(ctx: RequestContext, upload: Upload) {
    const startTime = Date.now();
    await upload.done();
    this.logger.log(
      `upload file completed, took ${Date.now() - startTime} ms`,
      {
        ctx,
      },
    );
  }

  async downloadFileById(
    ctx: RequestContext,
    id: string,
    query?: DownloadFileQueryDto,
  ): Promise<{ stream: Readable; file: FileOutputDto }> {
    const file = await this.fileRepo.findById(id);
    if (!file) {
      throw new FileNotFoundException();
    }
    return this.downloadFile(file, query);
  }

  private async downloadFile(
    file: FileModel,
    query?: DownloadFileQueryDto,
  ): Promise<{ stream: Readable; file: FileOutputDto }> {
    const safeFile = await this.validateDownloadFile(file, query);
    try {
      const stream = await this.downloadFileFromS3(safeFile);
      return {
        stream: stream,
        file: {
          id: safeFile.id,
          name: safeFile.name,
          size: safeFile.size,
          sizeUnit: safeFile.sizeUnit,
          mimetype: safeFile.mimetype ?? undefined,
        },
      };
    } catch (err) {
      if (err instanceof NoSuchKey) {
        throw new FileProcessingHasNotFinished();
      }
      throw err;
    }
  }

  private validateDownloadFile(
    file: FileModel,
    query?: DownloadFileQueryDto,
  ): FileModel {
    if (query) {
      const type = query.type;
      const subtype = query.subtype;

      if (type != null) {
        if (!file.mimetype || !file.mimetype.startsWith(type)) {
          throw new FileNotFoundException();
        }
        if (subtype != null && file.mimetype !== `${type}/${subtype}`) {
          throw new FileNotFoundException();
        }
      }
    }

    return file;
  }

  private async downloadFileFromS3(file: FileModel): Promise<Readable> {
    const res = await this.client.getObject({
      Bucket: this.bucket,
      Key: file.id,
    });
    return res.Body as Readable;
  }
}
