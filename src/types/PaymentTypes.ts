export interface TokenizationFormData {
  actionUrl: string;
  serviceCommand: string;
  language: string;
  merchantIdentifier: string;
  accessCode: string;
  signature: string;
  returnUrl: string;
  merchantReference: string;
  merchantExtra: string;
  tokenName: string;
}

export interface PaymentRequest {
  merchantReference: string;
  amount: number;
  currency: string;
  language: string;
  customerEmail: string;
  customerIp: string;
  tokenName: string;
  customerName: string;
  orderDescription: string;
  paymentOption: string;
  eci: string;
  theme: string;
}

export interface TokenizationRequest {
  panOrderId: string;
  vivaOrderId: string;
  language: string;
  amount: number;
  currency?: string;
  customerEmail?: string;
}

export interface TokenizationApiResponse {
  actionUrl: string;
  formParameters: { [key: string]: string };
}