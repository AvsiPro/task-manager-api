import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaService } from './prisma.service';
//import { AppService } from './app.service';

@Module({
  imports: [AuthModule, UsersModule, TasksModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
