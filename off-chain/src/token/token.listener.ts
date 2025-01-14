import { Injectable, Logger } from '@nestjs/common';
import { TokenLogDto } from 'src/dto/tokenLog.dto';
import { TokenService } from './token.service';
import { ethers } from 'ethers';
import { abi } from '../../mainAbi.json';

let provider = new ethers.WebSocketProvider('wss://holesky.drpc.org');
const contractAddress = "0x038852e125283121375032f483E61d9F1A4CE206"; // 해당 컨트랙트 사용을 권장합니다.

@Injectable()
export class TokenListener {
  private contract: ethers.Contract;
  private eventQueue: (() => Promise<void>)[] = [];
  private isProcessingQueue = false;

  constructor(
    private readonly tokenService: TokenService,
  ) {
    this.contract = new ethers.Contract(contractAddress, abi, provider);
  }

  /**
   * @dev 모듈 초기화 시 실행
   * @todo 웹소켓 죽는 문제 해결...
   */
  async onModuleInit() {
    console.log(provider.websocket);
    const latestSyncedBlock = await this.tokenService.getLatestSyncedBlock() + 1;
    const currentBlock = await provider.getBlockNumber();
    // console.log(latestSyncedBlock, currentBlock);
    const startBlock = latestSyncedBlock || 0;

    // 과거 블록 이벤트 저장 로직
    if (latestSyncedBlock === null || currentBlock - latestSyncedBlock > 480) { // 약 2시간 기준 (15초/블록)
      console.log('과거 블록 데이터를 전수 조사합니다.', currentBlock);
      await this.syncHistoricalEvents(startBlock, currentBlock);
    } else {
      console.log(`최신 블록 데이터만 동기화합니다. (fromBlock: ${latestSyncedBlock})`);
      await this.syncHistoricalEvents(latestSyncedBlock, currentBlock);
    }
    provider.on('debug', (code, reason) => {
      console.log(code, reason);
    });

    provider.on('error', (code, reason) => {
      console.log(code, reason);
      setTimeout(() => {
        console.log('재연결');
        provider = new ethers.WebSocketProvider('wss://holesky.drpc.org');
        this.contract = new ethers.Contract(contractAddress, abi, provider);
      }, 2000);
    });
    // 이벤트 리스닝
    await this.processQueue();
    await this.listenToContractEvents();

  }

  // 계약 이벤트 리스닝
  async listenToContractEvents() {
    console.log('리스닝');
    // 'Mint' 이벤트 리스닝
    this.contract.on('Minted', async (user: string, tokenId, tokenURI: string, event: any) => {
      this.queueEvent(() => this.handleMintEvent(user, tokenId, tokenURI, event));
      await this.processQueue(); // 큐 처리 호출
    });

    // 'Burn' 이벤트 리스닝
    this.contract.on('Burnt', async (user: string, tokenId, event) => {
      this.queueEvent(() => this.handleBurnEvent(user, tokenId, event));
      await this.processQueue(); // 큐 처리 호출

    });

    // 'Transfer' 이벤트 리스닝
    this.contract.on('Transfer', async (from: string, to: string, tokenId, event: any) => {
      if (from === '0x0000000000000000000000000000000000000000') {
        console.log('발행');
        return;
      }
      this.queueEvent(() => this.handleTransferEvent(from, to, tokenId, event));
      await this.processQueue(); // 큐 처리 호출

    });
  }

  // 큐에 이벤트 추가
  queueEvent(task: () => Promise<void>) {
    this.eventQueue.push(task);
  }

  // 큐 처리
  async processQueue() {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (this.eventQueue.length > 0) {
      const task = this.eventQueue.shift();
      if (task) {
        try {
          await task();
        } catch (error) {
          console.error('Queue processing error:', error);
        }
      }
    }
    this.isProcessingQueue = false;
  }

  // 민팅 이벤트 처리
  async handleMintEvent(user: string, tokenId: BigInt, tokenURI: string, event: ethers.ContractEventPayload) {
    const logDto = this.eventParser(event, 'Minted');
    await this.tokenService.saveMintedToken(logDto);
    console.log('Mint event handled', new Date());
  }

  // 소각 이벤트 처리
  async handleBurnEvent(user: string, tokenId: BigInt, event: ethers.ContractEventPayload) {
    const logDto = this.eventParser(event, 'Burnt');

    await this.tokenService.removeBurnedToken(logDto);
    console.log('Burn event handled');
  }


  // 소유권 이전 이벤트 처리
  async handleTransferEvent(from: string, to: string, tokenId: BigInt, event: ethers.ContractEventPayload) {
    if (from === '0x0000000000000000000000000000000000000000') { console.log('발행'); return; }
    if (to === '0x0000000000000000000000000000000000000000') { console.log('소각'); return; }

    const logDto = this.eventParser(event, 'Transfer');

    await this.tokenService.updateTokenOwnership(logDto);
    console.log('Transfer event handled');
  }

  // 최신화
  async syncHistoricalEvents(startBlock, currentBlock) {
    Logger.debug(`\n ${startBlock} 블록 부터, ${currentBlock}까지 DB 최신화를 시작합니다.`);
    try {
      const logs = await provider.getLogs({
        address: contractAddress,
        fromBlock: startBlock,  // 시작 블록을 명시적으로 설정
        toBlock: currentBlock   // 현재 블록까지 조회
      });

      // 비동기 처리 안전하게 실행
      await Promise.all(logs.map(async (log, idx) => {
        const parsedLog: ethers.LogDescription = this.contract.interface.parseLog(log);
        switch (parsedLog.name) {
          case "Minted":
            console.log('민팅 최신화', idx);
            this.handleInitialUpdate(parsedLog, log);
            break;
          case "Burnt":
            console.log('소각 최신화', idx);
            this.handleInitialUpdate(parsedLog, log);
            break;
          case "Transfer":
            console.log('전송 최신화', idx);
            this.handleInitialUpdate(parsedLog, log);
            break;
        }
      }));
    } catch (error) {
      console.error('로그 최신화 실패:', error);
    }
  }

  private async handleInitialUpdate(parsedLog: ethers.LogDescription, log: ethers.Log): Promise<void> {
    const eventType = parsedLog.name;

    const { topic } = parsedLog;
    const { blockHash, blockNumber, transactionHash } = log;
    // const detail = await provider.getBlock(blockNumber);
    // const timestamp = new Date(detail.timestamp * 1000);
    const timestamp = new Date(); // 호출 횟수 초과로 인한 현재 시간입력
    const tmpLogDto = {
      eventType,
      timestamp,
      blockId: blockNumber,
      topic,
      transactionHash,
    };

    if (eventType === "Minted") {
      const [to, tokenId, tokenURI] = parsedLog.args;
      const logDto: TokenLogDto = {
        ...tmpLogDto,
        to,
        from: "0x0000000000000000000000000000000000000000",
        tokenId,
        tokenURI,
        userAddress: to
      };
      this.queueEvent(() => this.tokenService.saveMintedToken(logDto));
      return;
    } else if (eventType === "Burnt") {
      const [from, tokenId] = parsedLog.args;
      const logDto: TokenLogDto = {
        ...tmpLogDto,
        to: "0x0000000000000000000000000000000000000000",
        from,
        tokenId,
        userAddress: from
      };
      this.queueEvent(() => this.tokenService.removeBurnedToken(logDto));

      return;
    } else if (eventType === "Transfer") {
      if (parsedLog.args[0] === '0x0000000000000000000000000000000000000000' || parsedLog.args.length === 2) {
        return;
      }
      const [from, to, tokenId] = parsedLog.args;
      const logDto: TokenLogDto = {
        ...tmpLogDto,
        tokenId,
        from,
        to,
        userAddress: to
      };
      this.queueEvent(() => this.tokenService.updateTokenOwnership(logDto));
    }
  }

  private eventParser(event: ethers.ContractEventPayload, eventType: string): TokenLogDto {
    const tmpLogDto = {
      eventType,
      timestamp: new Date(),
      blockId: event.log.blockNumber,
      transactionHash: event.log.transactionHash,
    };
    if (eventType === 'Minted') {
      const [to, tokenId, tokenURI] = event.args;

      const logDto = {
        ...tmpLogDto,
        to,
        from: "0x0000000000000000000000000000000000000000",
        tokenId,
        tokenURI,
        userAddress: to
      };
      return logDto;

    } else if (eventType === 'Burnt') {
      const [from, tokenId] = event.args;
      const logDto = {
        ...tmpLogDto,
        to: "0x0000000000000000000000000000000000000000",
        from,
        tokenId,
        userAddress: from
      };
      return;
    } else if (eventType === 'Transfer') {
      if (event.args[0] === '0x0000000000000000000000000000000000000000' || event.args.length === 2) {
        return;
      }
      const [from, to, tokenId] = event.args;
      const logDto = {
        ...tmpLogDto,
        tokenId,
        from,
        to,
        userAddress: to
      };
      return logDto;
    }


  }
}
