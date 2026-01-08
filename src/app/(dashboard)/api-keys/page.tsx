import type { Metadata } from 'next'
import { ApiKeysManager } from "@/features/api-keys/components/api-keys-manager";

export const metadata: Metadata = {
  title: 'API Keys | AltSEO - Manage Automated Access',
  description: 'Manage your API keys for programmatic image SEO and automated ALT text generation.',
}

export default function ApiKeysPage() {
  return <ApiKeysManager />;
}
