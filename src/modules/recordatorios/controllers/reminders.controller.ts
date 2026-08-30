import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RemindersService } from '../services/reminders.service';
import {
  CrearReminderDto,
  PendingRemindersQueryDto,
} from '../dto/crear-reminder.dto';
import { ScheduledReminder } from '../entities/scheduled-reminder.entity';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('reminders')
@UseGuards(ApiKeyGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(@Body() dto: CrearReminderDto): Promise<ScheduledReminder> {
    return this.remindersService.create(dto);
  }

  @Get('pending')
  findPending(
    @Query() query: PendingRemindersQueryDto,
  ): Promise<ScheduledReminder[]> {
    const now = query.now ? new Date(query.now) : new Date();
    const windowSeconds = query.window ?? 86400;
    return this.remindersService.findPending(now, windowSeconds);
  }

  @Get('active-count')
  countActive(
    @Query('recordatorioId', ParseUUIDPipe) recordatorioId: string,
  ): Promise<number> {
    return this.remindersService.countActiveByRecordatorio(recordatorioId);
  }

  @Get()
  findByUser(
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ): Promise<ScheduledReminder[]> {
    if (!userId) {
      throw new BadRequestException('Se requiere userId');
    }
    return this.remindersService.findByUser(userId, status);
  }

  @Patch(':id/advance')
  advance(@Param('id', ParseUUIDPipe) id: string): Promise<ScheduledReminder> {
    return this.remindersService.advance(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseUUIDPipe) id: string): Promise<ScheduledReminder> {
    return this.remindersService.cancel(id);
  }
}
