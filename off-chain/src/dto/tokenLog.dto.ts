export class TokenLogDto {
  tokenId: number;
  eventType: string;
  timestamp: Date;
  blockId: number;
  topic: string;
  transactionHash: string;
  userAddress?: string;
  from: string;
  to: string;
  tokenURI?: string;
}
