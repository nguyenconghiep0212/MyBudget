export interface VPBankData {
  currency: string;
  buyCash: number;
  buyTransfer: number;
  sellCash: number;
  sellTransfer: number;
  centralRate: number;
  ceilingRate: number;
  floorRate: number;
  currencyName: string;
  unit: any;
  parentCurrencyPair: string;
  currencyPair: string;
  termCurrency: string;
  denominations: VPBankData[] | null;
}
export interface VPBank {
  effectiveTime: string;
  effectiveDate: string;
  exchangeRates: VPBankData[];
}

export interface BIDVBankData {
  nameVI: string;
  muaTm: string;
  muaCk: string;
  currency: string;
  nameEN: string;
  ban: string;
}
export interface BIDVBank {
  hour: string;
  day_vi: string;
  data: BIDVBankData[];
  note_vi: string;
  note_en: string;
}

export interface VietcomBankData {
  currencyName: string;
  currencyCode: string;
  cash: string;
  transfer: string;
  sell: string;
}
export interface VietcomBank {
  UpdatedDate: '';
  Data: VietcomBankData[];
}

export interface ExchangeRateTable {
  flag: any;
  currencyName: string;
  currencyCode: string;
  buyRateCash: number;
  buyRateTransfer: number;
  sellRateCash: number;
  sellRateTransfer: number;
}
export interface ExchangeRateItem {
  currencyCode: string;
  rates: {
    bank: BANKENUM;
    buyRateCash: number;
    buyRateTransfer: number;
    sellRateCash: number;
    sellRateTransfer: number;
  }[];
}

export enum BANKENUM {
  VIETCOMBANK = 'vietcombank',
  BIDV = 'bidv',
  VPBANK = 'vpbank',
}
