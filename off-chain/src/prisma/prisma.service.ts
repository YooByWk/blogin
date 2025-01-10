import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  omitArgs<T>(...fields: (keyof T)[]): Partial<Record<keyof T, boolean>> {
    const OmitArgs = fields.reduce(
      (acc, curField) => {
        acc[curField] = true;
        return acc;
      },
      {} as Partial<Record<keyof T, boolean>>,
    ); // 초기 빈 객체 타입 단언

    return OmitArgs ?? {};
  }
}
