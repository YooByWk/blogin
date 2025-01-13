import { Injectable } from "@nestjs/common";
import { TokenLogDto } from "src/dto/tokenLog.dto";
import { PrismaService } from "src/prisma/prisma.service";



// TokenLogService에서 사용
@Injectable()
export class TokenLogService {
  constructor(private prisma: PrismaService) { }

  async createLog(logDto: TokenLogDto) {
    if (logDto.tokenURI) {
      delete logDto.tokenURI;
    }
    await this.prisma.log.create({
      data: {
        ...logDto,
        tokenId: parseInt(logDto.tokenId.toString())
      }
    });
  }
}