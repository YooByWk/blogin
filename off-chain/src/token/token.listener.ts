import { Injectable, OnModuleInit } from '@nestjs/common';
import { TokenService } from './token.service';
import { ethers } from 'ethers';
import { abi } from '../../mainAbi.json';

const provider = new ethers.WebSocketProvider('wss://holesky.drpc.org');
const contractAddress = "0x038852e125283121375032f483E61d9F1A4CE206";

@Injectable()
export class TokenListener {
  private contract: ethers.Contract;
  constructor(private readonly tokenService: TokenService) {
    this.contract = new ethers.Contract(contractAddress, abi, provider);
  }

  async onModuleInit() {
    // 'Mint' 이벤트 리스닝
    this.contract.on('Minted', async (user: string, tokenId, tokenURI: string) => {
      console.log('Mint event received:', user, tokenId.toString(), tokenURI);
      await this.handleMintEvent(user, tokenId, tokenURI);
    });

    // 'Burn' 이벤트 리스닝
    this.contract.on('Burnt', async (user: string, tokenId) => {
      console.log('Burn event received:', user, tokenId.toString());
      await this.handleBurnEvent(user, tokenId);
    });

    // 'Transfer' 이벤트 리스닝
    this.contract.on('Transfer', async (from: string, to: string, tokenId) => {
      if (from === '0x0000000000000000000000000000000000000000') { console.log('발행'); return; }

      console.log('Transfer event received:', from, to, tokenId.toString());
      await this.handleTransferEvent(from, to, tokenId);
    });
  }


  // 민팅 이벤트 처리
  async handleMintEvent(user: string, tokenId: BigInt, tokenURI: string) {
    await this.tokenService.saveMintedToken(user, parseInt(tokenId.toString()), tokenURI);
  }

  // 소각 이벤트 처리
  async handleBurnEvent(user: string, tokenId: BigInt) {
    await this.tokenService.removeBurnedToken(user, parseInt(tokenId.toString()));
  }

  // 소유권 이전 이벤트 처리
  async handleTransferEvent(from: string, to: string, tokenId: BigInt) {
    await this.tokenService.updateTokenOwnership(from, to, parseInt(tokenId.toString()));
  }
}
