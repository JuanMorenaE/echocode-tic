export interface Card {
  id: number;
  alias: string;
  cardholderName: string;
  last4Digits: string;
  expirationDate: string; // MM/YY
  cardType: CardType;
  isDefault: boolean;
}

export interface CardRequest {
  alias: string;
  cardholderName: string;
  cardNumber: string;
  expirationDate: string; // MM/YY
  cardType: CardType;
  isDefault?: boolean;
}

export type CardType = 'VISA' | 'MASTERCARD' | 'AMEX' | 'PREX' | 'OCA' | 'OTHER';
