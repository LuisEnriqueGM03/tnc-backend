import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CrearTablonDto {
  @ApiProperty()
  @IsUUID()
  readonly recordatorioId!: string;

  @ApiProperty({ description: 'ID de Discord del canal' })
  @IsString()
  @IsNotEmpty()
  readonly channelId!: string;

  @ApiProperty({ default: '#5865F2' })
  @Matches(/^#[0-9a-fA-F]{6}$/)
  readonly embedColor!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  readonly embedEmoji?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly embedDescription?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  readonly hasCustom?: boolean;
}
