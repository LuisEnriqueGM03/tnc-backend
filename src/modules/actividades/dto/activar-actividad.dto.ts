import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ActivarActividadDto {
  @ApiProperty({ description: 'ID de Discord del usuario' })
  @IsString()
  @IsNotEmpty()
  readonly userId!: string;
}
