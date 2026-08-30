import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ActualizarActividadDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly nombre?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly cooldownSeconds?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  readonly emoji?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly descripcion?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  readonly isGlobal?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly orden?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
