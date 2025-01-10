import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TokenListener } from './token.listener';

@Module({
  controllers: [TokenController],
  providers: [TokenService, TokenListener],
})
export class TokenModule { }
