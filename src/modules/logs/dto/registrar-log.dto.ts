import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class RegistrarLogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  readonly eventType!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  readonly recordatorioId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  readonly reminderId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly userId?: string;

  @ApiProperty({ required: false, description: 'Título del recordatorio' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  readonly title?: string;

  @ApiProperty({ required: false, description: 'Frecuencia formateada' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly frequency?: string;

  @ApiProperty({ required: false, description: 'Repetición (ej. 2/3)' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly repetition?: string;

  @ApiProperty({ required: false, description: 'Próximo aviso' })
  @IsOptional()
  @IsDateString()
  readonly nextFireAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly detail?: string;
}
