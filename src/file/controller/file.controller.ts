import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Public } from 'src/auth/decorator';
import { ReqContext, RequestContext } from 'src/common/request-context';
import { FileQueryDto } from '../dto';
import { UploadFileOutputDto } from '../dto/upload-file-output.dto';
import { FileService } from '../service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  async getFiles(
    @ReqContext() context: RequestContext,
    @Query() query: FileQueryDto,
  ) {
    return this.fileService.findFiles(context, query);
  }

  @Get(':id')
  async getFileById(
    @ReqContext() context: RequestContext,
    @Param('id') id: string,
  ) {
    return this.fileService.findFileById(context, id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @ReqContext() context: RequestContext,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 200 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadFileOutputDto> {
    return this.fileService.uploadFile(context, file);
  }

  @Get('download/:id')
  async downloadFileById(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
  ): Promise<StreamableFile> {
    const fileInfo = await this.fileService.downloadFileById(ctx, id);
    return new StreamableFile(fileInfo.stream, {
      type: fileInfo.file.mimetype ?? 'application/octet-stream',
      disposition: `attachment; filename="${fileInfo.file.name}"`,
    });
  }

  @Public()
  @Get('public/image/i/:id')
  async downloadPublicImageById(
    @ReqContext() context: RequestContext,
    @Param('id') id: string,
  ): Promise<StreamableFile> {
    const fileInfo = await this.fileService.downloadFileById(context, id, {
      type: 'image',
    });
    return new StreamableFile(fileInfo.stream, {
      type: fileInfo.file.mimetype ?? 'application/octet-stream',
      disposition: `inline`,
    });
  }
}
