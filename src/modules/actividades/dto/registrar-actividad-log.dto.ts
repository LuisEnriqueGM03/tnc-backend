import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class RegistrarActividadLogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  readonly eventType!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  readonly tablonId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  readonly actividadId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly detalle?: string;
}
