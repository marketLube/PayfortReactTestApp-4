import axios from 'axios';
import type { PaymentRequest, TokenizationFormData, TokenizationRequest, TokenizationApiResponse } from '../types/PaymentTypes';
import config from '../config/config';

class PaymentApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.payfortAPI.baseUrl;
  }

  async getTokenizationFormData(paymentRequest: PaymentRequest): Promise<TokenizationFormData | null> {
    try {
      const url = `${this.baseUrl}/api/tokenization/request-tokenization`;

      // Create the request payload object
      const tokenizationRequest: TokenizationRequest = {
        vivaOrderId: paymentRequest.merchantReference,
        panOrderId: this.generateGuid(), // Generate a new GUID for PanOrderId
        amount: paymentRequest.amount,
        currency: paymentRequest.currency || 'AED',
        customerEmail: paymentRequest.customerEmail || '',
        language: paymentRequest.language || 'en'
      };

      console.log('Requesting tokenization form data from:', url, 'with merchant reference:', paymentRequest.merchantReference);

      // Send the POST request
      const response = await axios.post<TokenizationApiResponse>(url, tokenizationRequest, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 && response.data) {
        const apiResponse = response.data;

        // Map the response structure to TokenizationFormData object
        if (apiResponse.formParameters) {
          const formParams = apiResponse.formParameters;
          return {
            // Get the action URL from the top-level of the response
            actionUrl: apiResponse.actionUrl || '',

            // Get the form fields from the nested dictionary
            serviceCommand: formParams['service_command'] || '',
            accessCode: formParams['access_code'] || '',
            merchantIdentifier: formParams['merchant_identifier'] || '',
            merchantReference: formParams['merchant_reference'] || '',
            language: formParams['language'] || '',
            tokenName: formParams['token_name'] || '',
            signature: formParams['signature'] || '',
            merchantExtra: formParams['merchant_extra'] || '',
            returnUrl: formParams['return_url'] || ''
          };
        } else {
          console.warn('Tokenization response was successful but content was invalid or empty. Content:', response.data);
        }
      } else {
        console.error('Failed to get tokenization form data. Status:', response.status, 'Response:', response.data);
      }
    } catch (error) {
      console.error('Error getting tokenization form data for merchant reference', paymentRequest.merchantReference, error);
    }

    return null;
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export default new PaymentApiService();