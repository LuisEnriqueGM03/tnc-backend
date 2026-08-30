import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CrearReminderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly userId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  readonly recordatorioId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  readonly title!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  readonly intervalSeconds!: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  readonly totalCount!: number;

  @ApiProperty()
  @IsDateString()
  readonly nextFireAt!: string;
}

export class PendingRemindersQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly now?: string;

  @ApiProperty({ required: false, default: 86400 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly window?: number;
}
