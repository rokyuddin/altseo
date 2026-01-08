import type { Metadata } from 'next'
import { UploadSectionView } from "@/features/assets";

export async function generateMetadata({ params }: UploadPageProps): Promise<Metadata> {
  const { tab } = await params;
  const title = tab.charAt(0).toUpperCase() + tab.slice(1);
  return {
    title: `${title} | AltSEO - Manage Visual Assets`,
    description: `Manage your ${tab} and optimize your image accessibility and SEO.`,
  }
}

type UploadPageProps = {
  params: Promise<{ tab: string }>
}


export default function UploadPage({ params, searchParams }: UploadPageProps & { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <UploadSectionView params={params} searchParams={searchParams} />
  );
}


