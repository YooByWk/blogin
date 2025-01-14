import { Controller, Get, Param } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) { }

  @Get(':address')
  async getTokensByUser(@Param('address') address: string) {
    return await this.tokenService.getTokensByUser(address);
  }
}
