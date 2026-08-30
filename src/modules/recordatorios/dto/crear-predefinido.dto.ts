import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CrearPredefinidoDto {
  @ApiProperty()
  @IsUUID()
  readonly recordatorioId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly label!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  readonly intervalSeconds!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  readonly emoji?: string;

  @ApiProperty({
    required: false,
    description: 'Descripción mostrada en el tablón',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  readonly description?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly order?: number;
}
