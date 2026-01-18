# Next.js Adapter

> Use our Next.js adapter to smoothly build end-to-end Creem billing flows.

<Frame>
  <div style={{ textAlign: 'center', padding: '1rem 1rem 2.5rem 1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <h1
        style={{
        fontSize: '2rem',
        marginBottom: '0.5rem',
        textAlign: 'center',
        display: 'inline-block',
      }}
      >
        @creem\_io/nextjs
      </h1>
    </div>

    <p style={{ fontSize: '1.1rem', color: 'var(--mint-color-muted)' }}>
      The simplest way to integrate Creem payments into your Next.js
      application.
    </p>

    <p>
      Build beautiful checkout experiences with React components, handle
      webhooks with ease, and manage subscriptions without the headache.
    </p>

    <div style={{ marginTop: '1rem' }}>
      <a href="#installation">Installation</a> ·{' '}
      <a href="#quick-start">Quick Start</a> ·{' '}
      <a href="#components">Components</a> ·{' '}
      <a href="#server-functions">Server Functions</a>
    </div>
  </div>
</Frame>

***

## Introduction

`@creem_io/nextjs` is the official adapter for running Creem inside the Next.js App Router. It gives you:

* 🎨 **React Components** — Drop-in checkout and portal components that wrap routing logic.
* 🔐 **Type-safe APIs** — Full TypeScript coverage and sensible defaults.
* ⚡ **Zero-config setup** — Works with App Router filesystem routing.
* 🪝 **Webhook helpers** — Automatic verification and strongly typed handlers.
* 🔄 **Subscription lifecycle** — Built-in helpers for grant/revoke access flows.

Use it as your default integration path whenever you are building on Next.js. For other runtimes, you can still call the REST API or the TypeScript SDK directly, but this adapter keeps everything in one place.

***

## Installation

Install the package with your favorite manager:

<CodeGroup>
  ```bash npm theme={null}
  npm install @creem_io/nextjs
  ```

  ```bash yarn theme={null}
  yarn add @creem_io/nextjs
  ```

  ```bash pnpm theme={null}
  pnpm install @creem_io/nextjs
  ```

  ```bash bun theme={null}
  bun install @creem_io/nextjs
  ```
</CodeGroup>

### Requirements

* Next.js 13+ using the App Router
* React 18+
* A Creem account with API keys

***

## Quick Start

The adapter follows a four-step setup. The snippets below mirror what we use in production templates.

### 1. Configure environment variables

```bash  theme={null}
# .env.local
CREEM_API_KEY=your_api_key_here
CREEM_WEBHOOK_SECRET=your_webhook_secret_here
```

### 2. Create a checkout route

```ts  theme={null}
// app/checkout/route.ts
import { Checkout } from '@creem_io/nextjs';

export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: true, // flip to false in production
  defaultSuccessUrl: '/thank-you',
});
```

### 3. Drop the checkout component into your UI

```tsx  theme={null}
// page.tsx
'use client'; // Optional: Works with server side components

import { CreemCheckout } from '@creem_io/nextjs';

export default function SubscribeButton() {
  return (
    <CreemCheckout productId="prod_abc123" successUrl="/thank-you">
      <button className="btn-primary">Subscribe Now</button>
    </CreemCheckout>
  );
}
```

### 4. Handle webhooks

```ts  theme={null}
// app/api/webhook/creem/route.ts
import { Webhook } from '@creem_io/nextjs';

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  onGrantAccess: async ({ customer, metadata }) => {
    // The user should be granted access
    const userId = metadata?.referenceId as string;
    await grantAccess(userId, customer.email);
  },
  onRevokeAccess: async ({ customer, metadata }) => {
    // The user should have their access revoked
    const userId = metadata?.referenceId as string;
    await revokeAccess(userId, customer.email);
  },
});
```

Once these routes are in place you can test end-to-end by creating a checkout session, redirecting the user, and watching the webhook fire.

***

## Components

### `<CreemCheckout />`

Creates a checkout link and delegates session creation to your `/checkout` route handler.

```tsx  theme={null}
// page.tsx
import { CreemCheckout } from '@creem_io/nextjs';

<CreemCheckout
  productId="prod_abc123"
  units={2}
  discountCode="SUMMER2024"
  customer={{ email: 'user@example.com', name: 'John Doe' }}
  successUrl="/thank-you"
  metadata={{ orderId: '12345', source: 'web' }}
  referenceId="user_123"
>
  <button>Buy Now</button>
</CreemCheckout>;
```

### `<CreemPortal />`

Generate a customer portal link for managing billing:

```tsx  theme={null}
// page.tsx
import { CreemPortal } from '@creem_io/nextjs';

<CreemPortal customerId="cust_abc123">Manage Subscription</CreemPortal>;
```

***

## Server Functions

### `Checkout`

Creates a GET route handler that issues checkout sessions.

```ts  theme={null}
// app/checkout/route.ts
export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  defaultSuccessUrl: '/success',
  testMode: process.env.NODE_ENV !== 'production',
});
```

### `Portal`

Generate customer portal sessions from a server route:

```ts  theme={null}
// app/portal/route.ts
export const GET = Portal({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: true,
});
```

### `Webhook`

Verify webhooks and run lifecycle hooks:

```ts  theme={null}
// app/api/webhook/creem/route.ts
export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  onCheckoutCompleted: async ({ customer, product }) => {
    console.log(`${customer.email} purchased ${product.name}`);
  },
});
```

***

## Access Management

Leverage `onGrantAccess` and `onRevokeAccess` to keep your database in sync.

```ts  theme={null}
onGrantAccess: async ({ customer, metadata }) => {
  const userId = metadata?.referenceId as string;
  await db.user.upsert({
    where: { id: userId },
    update: { subscriptionActive: true },
    create: { id: userId, subscriptionActive: true },
  });
};
```

```ts  theme={null}
onRevokeAccess: async ({ customer, metadata }) => {
  const userId = metadata?.referenceId as string;
  await db.user.update({
    where: { id: userId },
    data: { subscriptionActive: false },
  });
};
```

***

## Best Practices

* **Use environment variables** for API keys and webhook secrets.
* **Pass `referenceId`** whenever possible to map users to Creem customers.
* **Test in `testMode`** before switching the adapter to production.
* **Keep callbacks idempotent** so multiple webhook event deliveries stay safe.

***

## Resources

<CardGroup>
  <Card title="GitHub Repository" icon="github" href="https://github.com/armitage-labs/creem-nextjs-adaptor">
    Star or contribute to the adapter on GitHub.
  </Card>

  <Card title="Creem Next.js Template" icon="rocket" href="/code/sdks/templates">
    Full-stack example with Prisma, Better Auth, and Shadcn UI.
  </Card>

  <Card title="Better Auth Integration" icon="lock" href="/code/sdks/better-auth">
    Learn how to wire auth + billing in one flow.
  </Card>
</CardGroup>

***

Need help? [Contact us](https://www.creem.io/contact) or join the [Discord community](https://discord.gg/q3GKZs92Av).


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.creem.io/llms.txt