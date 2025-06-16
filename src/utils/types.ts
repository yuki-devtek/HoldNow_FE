import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export type ChartTable = {
  table: {
    open: number;
    high: number;
    low: number;
    close: number;
    time: number;
  }[];
};

export type Chart = {
  time: number;
  opens: number[];
  highs: number[];
  lows: number[];
  closes: number[];
};

export interface userInfo {
  _id?: string;
  name: string;
  wallet: string;
  avatar?: string;
  isLedger?: Boolean;
  signature?: string;
}

export interface metadataInfo {
  name: string;
  symbol: string;
  image: string;
  description: string;
  createdOn: Date;
  twitter?: string;
  website?: string;
  telegram?: string;
}

export interface coinInfo {
  commit: any;
  _id?: string;
  name: string;
  creator: string | userInfo;
  ticker: string;
  description?: string;
  url: string;
  token: string;
  tokenSupply: number;
  tokenReserves: number;
  lamportReserves: number;
  progressMcap: number;
  atLaunched: Date;

  website?: string;
  telegram?: string;
  twitter?: string;
  frontBanner?: string;

  stagesNumber: number;
  stageDuration: number;
  sellTaxMax: number;
  sellTaxMin: number;
  sellTaxDecay: number;
  tokenPoolDestination: number;
  bondingCurve: boolean;
  currentStage: number;
  atStageStarted: Date;
  airdropStage: boolean;
}
export interface createCoinInfo {
  name: string;
  ticker: string;
  url: string;
  description: string;
  presale: number;
  twitter?: string;
  website?: string;
  telegram?: string;
}

export interface launchDataInfo {
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
  tokenNumberStages: number;
  tokenStageDuration: number;
  tokenSellTaxDecay: number;
  tokenSellTaxRange: number[];
  tokenPoolDestination: number;
}
export interface msgInfo {
  coinId: string | coinInfo;
  sender: string | userInfo;
  time: Date;
  img?: string;
  msg: string;
}

export interface tradeInfo {
  creator: string | coinInfo;
  record: recordInfo[];
}

export interface holderInfo {
  name: string;
  owner: string;
  amount: number;
}

export interface recordInfo {
  holder: userInfo;
  lamportAmount: number;
  price: number;
  swapDirection: number;
  time: Date;
  tokenAmount: number;
  tx: string;
}
export interface CharTable {
  table: {
    time: number;
    low: number;
    high: number;
    open: number;
    close: number;
    volume: number;
  }[];
}
export interface Bar {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  volume: number;
}
export interface replyInfo {
  coinId: string;
  sender: string;
  msg: string;
  img?: string;
}
export interface PeriodParamsInfo {
  from: number;
  to: number;
  countBack: number;
  firstDataRequest: boolean;
}

export type SwapInfo = {
  creator: string;
  solAmountInLamports: number;
  direction: 'Bought' | 'Sold';
  mintAddress: string;
  mintName: string;
  mintSymbol: string;
  mintUri: string;
};
