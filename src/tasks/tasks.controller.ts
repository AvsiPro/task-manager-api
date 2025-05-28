import { UseGuards, Controller, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  @Get()
  getTasks(@Req() req) {
    return `User ID: ${req.user.userId}`;
  }
}
