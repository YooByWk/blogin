// token.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // PrismaService를 통해 DB 접근

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) { }

  // 특정 유저의 모든 토큰 조회
  async getTokensByUser(user: string) {
    return await this.findTokensByUser(user);
  }

  // 민팅된 토큰을 오프체인 DB에 저장
  async saveMintedToken(user: string, tokenId: number, tokenURI: string) {
    await this.prisma.token.create({
      data: {
        user,
        tokenId,
        tokenURI,
      },
    });
  }

  // 소각된 토큰을 오프체인 DB에서 제거
  async removeBurnedToken(user: string, tokenId: number) {
    await this.prisma.token.delete({
      where: { user_tokenId: { tokenId, user } },
    });
  }

  // 전송된 토큰의 소유권을 업데이트
  async updateTokenOwnership(from: string, to: string, tokenId: number) {
    if (from === '0x0000000000000000000000000000000000000000') { console.log('발행'); return; }
    if (to === '0x0000000000000000000000000000000000000000') { console.log('소각'); return; }
    console.log('****************************', tokenId, '********************************');
    await this.prisma.token.update({
      where: { user_tokenId: { tokenId, user: from } },
      data: { user: to },
    });
  }

  // 특정 유저의 토큰을 조회
  private async findTokensByUser(user: string) {
    return await this.prisma.token.findMany({
      where: { user },
    });
  }
}
