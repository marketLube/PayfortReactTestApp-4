# Amazon Payment Services - React Test Application

This is a React TypeScript application that replicates the functionality of the Blazor test application for Amazon Payment Services (formerly Payfort) integration.

## Features

- **Payment Testing**: Complete payment flow with tokenization
- **Multiple Pages**: Home, Payment Test, Order Details, and Payment Retry pages
- **Responsive Design**: Bootstrap-based responsive UI
- **TypeScript**: Full TypeScript support for type safety
- **React Router**: Client-side routing for navigation
- **API Integration**: Integration with Amazon Payment Services API

## Pages

1. **Home** (`/`) - Welcome page with application overview
2. **Payment Test** (`/payment-test`) - Main payment testing interface
3. **Order Details** (`/order-details`) - Success page showing order confirmation
4. **Payment Retry** (`/payment-failed`) - Error handling and retry functionality

## Key Components

### Payment Flow
1. User fills out payment form with customer details
2. Application calls tokenization API to get secure form data
3. Payment form is displayed in an iframe for secure card entry
4. Payment processing and redirect handling

### Test Cards
- **Successful Cards**:
  - Visa: 4005550000000001
  - MasterCard: 5123450000000008
  - AMEX: 345678000000007

- **Test Scenarios**:
  - Declined Card: 4916783391760242
  - Uncertain Visa: 4556437649762022
  - Uncertain MasterCard: 5308097663032831

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router DOM** for routing
- **Bootstrap 5** for styling
- **Bootstrap Icons** for icons
- **Axios** for HTTP requests

## Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open browser to `http://localhost:5173`

## API Configuration

The application is configured to use the Amazon Payment Services sandbox environment:
- Base URL: `https://payfort.dev.panashi.ae`
- Configuration can be modified in `src/config/config.ts`

## Project Structure

```
src/
├── components/          # Reusable components
│   └── Navbar.tsx      # Navigation component
├── pages/              # Page components
│   ├── Home.tsx        # Home page
│   ├── PaymentTest.tsx # Payment testing page
│   ├── OrderDetails.tsx # Order confirmation page
│   └── PaymentRetry.tsx # Payment failure/retry page
├── services/           # API services
│   └── PaymentApiService.ts # Payment API integration
├── types/              # TypeScript type definitions
│   └── PaymentTypes.ts # Payment-related types
├── config/             # Configuration files
│   └── config.ts       # Application configuration
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── App.css            # Custom styles
```

## Features Implemented

✅ **Complete Payment Flow**: Tokenization and payment processing
✅ **Responsive Design**: Mobile-friendly Bootstrap UI
✅ **Error Handling**: Comprehensive error messages and retry functionality
✅ **TypeScript Support**: Full type safety throughout the application
✅ **Routing**: Multi-page application with React Router
✅ **API Integration**: Real API calls to Amazon Payment Services
✅ **Test Card Support**: Built-in test card information
✅ **Order Management**: Order tracking and confirmation

## Sandbox Environment

This application is configured for the Amazon Payment Services sandbox environment. Use only the provided test card numbers for testing purposes.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.
