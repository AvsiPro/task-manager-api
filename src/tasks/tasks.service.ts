import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, title: string) {
    return this.prisma.task.create({
      data: { title, userId },
    });
  }

  findAll(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: number, userId: number, data: { title?: string; done?: boolean }) {
    return this.prisma.task.updateMany({
      where: { id, userId },
      data,
    });
  }

  delete(id: number, userId: number) {
    return this.prisma.task.deleteMany({
      where: { id, userId },
    });
  }
}
