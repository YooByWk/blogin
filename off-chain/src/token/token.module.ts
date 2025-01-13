import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TokenListener } from './token.listener';
import { TokenLogService } from './tokenLog.service';

@Module({
  imports: [
  ],
  controllers: [TokenController],
  providers: [TokenService, TokenListener, TokenLogService,],
})
export class TokenModule { }
