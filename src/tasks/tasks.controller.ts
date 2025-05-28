import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Req() req,
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    return this.tasksService.create(req.user.userId, title, description);
  }

  @Get()
  findAll(@Req() req) {
    return this.tasksService.findAll(req.user.userId);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() data: any) {
    return this.tasksService.update(+id, req.user.userId, data);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.tasksService.delete(+id, req.user.userId);
  }
}
