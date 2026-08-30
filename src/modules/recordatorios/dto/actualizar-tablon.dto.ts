import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class ActualizarTablonDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly messageId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  readonly embedColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  readonly embedEmoji?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly embedDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  readonly hasCustom?: boolean;
}
