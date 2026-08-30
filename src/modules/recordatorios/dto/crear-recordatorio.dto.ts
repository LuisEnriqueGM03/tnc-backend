import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CrearRecordatorioDto {
  @ApiProperty({ description: 'Nombre del recordatorio' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly name!: string;

  @ApiProperty({ description: 'ID de Discord del creador' })
  @IsString()
  @IsNotEmpty()
  readonly createdBy!: string;
}
