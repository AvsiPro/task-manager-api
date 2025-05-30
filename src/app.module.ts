// src/app.module.ts (Sem mudanças necessárias, apenas para referência)
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaService } from './prisma.service';
import { AppService } from './app.service';
import { TabelasModule } from './tables/tables.module';

@Module({
  imports: [AuthModule, UsersModule, TasksModule, TabelasModule], // TabelasModule já está aqui
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
