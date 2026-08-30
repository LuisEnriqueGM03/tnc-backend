import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class ActualizarTablonActividadDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly messageId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly titulo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly descripcion?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  readonly emoji?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  readonly color?: string;
}
