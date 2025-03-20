export type Investor = {
  start: string;
  current: string;
};

export type WalletInvest = {
  symbol: string;
  amount: number;
};

export type Wallet = WalletInvest[];
