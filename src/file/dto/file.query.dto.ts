import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

export class FileQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(21, { each: true })
  @ArrayMaxSize(64)
  @Transform(({ value }) => value.split(','))
  id?: string[];
}
