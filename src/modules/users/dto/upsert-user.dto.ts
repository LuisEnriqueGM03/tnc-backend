import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpsertUserDto {
  @ApiProperty({ description: 'ID de Discord del usuario' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly discordId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly username!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly globalName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  readonly joinedAt?: string;
}
