import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CrearActividadDto {
  @ApiProperty()
  @IsUUID()
  readonly tablonId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly nombre!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  readonly cooldownSeconds!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  readonly emoji?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly descripcion?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  readonly isGlobal?: boolean;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly orden?: number;
}
