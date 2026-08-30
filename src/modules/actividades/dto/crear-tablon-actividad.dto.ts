import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CrearTablonActividadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly titulo!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly descripcion?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  readonly emoji?: string;

  @ApiProperty({ default: '#5865F2' })
  @Matches(/^#[0-9a-fA-F]{6}$/)
  readonly color!: string;

  @ApiProperty({ description: 'ID de Discord del canal' })
  @IsString()
  @IsNotEmpty()
  readonly channelId!: string;
}
