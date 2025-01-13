// token.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // PrismaService를 통해 DB 접근
import { TokenLogService } from './tokenLog.service';
import { TokenLogDto } from 'src/dto/tokenLog.dto';
import { Prisma } from '@prisma/client';
import { ethers } from 'ethers';
import { abi } from '../../mainAbi.json';

const provider = new ethers.WebSocketProvider('wss://holesky.drpc.org');
const contractAddress = "0x038852e125283121375032f483E61d9F1A4CE206";
const contract = new ethers.Contract(contractAddress, abi, provider);
@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService, private tokenLogService: TokenLogService,
  ) { }

  // 특정 유저의 모든 토큰 조회
  async getTokensByUser(user: string) {
    return await this.findTokensByUser(user);
  }

  async getTokenById(id) {
    const Token = await this.prisma.token.findUnique(
      { where: { tokenId: parseInt(id.toString()) } }
    );
    return Token;
  }

  async upsertUser(address) {
    const user = await this.prisma.user.upsert({
      where: { address },
      create: { address },
      update: {},
    });
    return user;
  }

  // 민팅된 토큰을 오프체인 DB에 저장
  async saveMintedToken(logDto: TokenLogDto) {
    if (!await this.getTokenById(logDto.tokenId)) {
      try {
        await this.upsertUser(logDto.userAddress);
        await this.prisma.token.create({
          data: {
            userAddress: logDto.userAddress,
            tokenId: parseInt(logDto.tokenId.toString()),
            tokenURI: logDto.tokenURI,
          },
        });
        await this.tokenLogService.createLog(logDto);
      } catch (error) {
        console.log(error);
      }
    }
    return;
  }

  // 소각된 토큰을 오프체인 Soft Delete
  async removeBurnedToken(logDto: TokenLogDto) {
    try {
      // await this.createUser(logDto.from);
      await this.prisma.token.update({
        where: { tokenId: logDto.tokenId },
        data: { burntAt: new Date(), isBurnt: true, userAddress: "0x0000000000000000000000000000000000000000" }
      });
      await this.tokenLogService.createLog(logDto);
    } catch (error) {
      console.log(error);

    }
  }

  // 전송된 토큰의 소유권을 업데이트
  async updateTokenOwnership(logDto: TokenLogDto) {
    // 만에하나 추적이 안된 토큰이었던 상황에서 transfer가 일어났다.
    // 유저 확인...
    await this.upsertUser(logDto.userAddress);
    if (!await this.getTokenById(logDto.tokenId)) {
      const tokenURI = await (contract as any).tokenURI(logDto.tokenId);

      await this.prisma.token.create({
        data: {
          userAddress: logDto.userAddress,
          tokenId: parseInt(logDto.tokenId.toString()),
          tokenURI
        }
      });
      console.log(`${logDto.tokenId}가 존재하지 않아 생성됨`);
      await this.tokenLogService.createLog(logDto);
      return;
    }
    // 이후 정상로직
    try {
      await this.prisma.token.update({
        where: { tokenId: parseInt(logDto.tokenId.toString()) },
        data: {
          userAddress: logDto.to,
        }
      });
      await this.tokenLogService.createLog(logDto);
    } catch (error) {
      console.log(error, logDto.tokenId);

    }
    return;
  }

  // 특정 유저의 토큰을 조회
  private async findTokensByUser(address: string) {
    return await this.prisma.user.findMany({
      where: { address },
    });
  }

  async getLatestSyncedBlock() {
    this.prisma.log.findFirst({
      where: {}
    });
    return null;
  }

}
