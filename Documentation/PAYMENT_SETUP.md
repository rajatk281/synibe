# Payment Gateway Integration Documentation

This document outlines the steps taken to integrate the Razorpay payment gateway into this Next.js project.

## 1. Dependency Installation
The Razorpay Node.js SDK was installed to communicate securely with the Razorpay API from the backend:
```bash
npm install razorpay
```

## 2. Environment Configuration
The required Razorpay API keys were added to the `.env` file at the root of the project. The public key is prefixed with `NEXT_PUBLIC_` so it can be exposed to the client, while the secret key remains securely on the server.
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_SECRET_ID=your_secret_key
```

## 3. Client-Side Script Injection
To enable Razorpay's checkout UI (the payment modal) on the frontend, the official Razorpay checkout script was injected into the application's root layout (`app/layout.tsx`):
```tsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
```

## 4. API Route: Order Creation
An API route (`app/api/CreateOrder/route.ts`) was created to securely generate a Razorpay order. The client must first request an order ID from the backend before initiating the payment.
```typescript
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_SECRET_ID
});

// The route receives amount details, calls razorpay.orders.create(), and returns the orderId
```

## 5. Frontend Integration
In the frontend component (`app/Components/PricingSection.tsx`), the payment flow was implemented:
1. It requests a new order from the `/api/CreateOrder` backend route.
2. It initializes the Razorpay checkout instance with the order details and the public key.
3. It handles the payment success callback.
```typescript
const paymentData = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  order_id: response.orderId,
  // Other details like name, description, amount...
  handler: async function (response: any) {
    // Sends response.razorpay_order_id, razorpay_payment_id, and razorpay_signature to the verification API
  }
};

const payment = new (window as any).Razorpay(paymentData);
payment.open();
```

## 6. API Route: Payment Verification
After the client successfully completes the payment in the Razorpay modal, the frontend sends the response to a backend verification route (`app/api/auth/verifyOrder/route.ts`). This route uses the `crypto` module to cryptographically validate the Razorpay signature, ensuring the payment is authentic and hasn't been tampered with.
```typescript
import crypto from "crypto";

const generatedSignature = (razorpayOrderId: string, razorpayPaymentId: string) => {
  const keySecret = process.env.RAZORPAY_SECRET_ID as string;
  return crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
};

// Validates if generated signature matches the razorpaySignature provided by the client
```
