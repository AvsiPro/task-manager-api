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
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import * as fs from 'fs';
import * as readline from 'readline';

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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadFile(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const filePath = file.path;
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const lines: string[] = [];
    for await (const line of rl) {
      const trimmed = line.trim();
      if (trimmed.length > 0) lines.push(trimmed);
    }

    if (lines.length < 2) {
      return {
        message:
          'Arquivo inválido: precisa de cabeçalho e pelo menos uma linha de dados.',
        valid: false,
      };
    }

    const header = lines[0].split(';');
    const created: string[] = [];
    const skipped: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(';');
      if (row.length !== header.length) continue;

      const taskObj = {
        title: row[0].trim(),
        description: row[1]?.trim() || '',
      };

      const exists = await this.tasksService.exists(
        req.user.userId,
        taskObj.title,
      );
      if (exists) {
        console.log('Task já existe');
        skipped.push(taskObj.title);
        continue;
      }

      await this.tasksService.create(
        req.user.userId,
        taskObj.title,
        taskObj.description,
      );
      created.push(taskObj.title);
    }

    return {
      message: 'Importação concluída',
      valid: true,
      total: lines.length - 1,
      created,
      skipped,
    };
  }
}
