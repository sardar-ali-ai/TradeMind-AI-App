export interface MarketData {
  time: string;
  price: number;
  volume: number;
}

export type SignalType = 'BUY' | 'SELL' | 'WAIT';

export interface TradingSignal {
  id: string;
  type: SignalType;
  reasoning: string;
  timestamp: string;
  priceAtSignal: number;
}

export interface Strategy {
  text: string;
  lastUpdated: string;
}
