export class TokenLogDto {
  tokenId: number;
  eventType: string;
  timestamp: Date;
  blockId: number;
  transactionHash: string;
  userAddress?: string;
  from: string;
  to: string;
  topic?: string;
  tokenURI?: string;
}
