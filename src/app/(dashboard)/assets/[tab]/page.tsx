import { UploadSectionView } from "@/features/assets";

type UploadPageProps = {
  params: Promise<{ tab: string }>
}


export default function UploadPage({ params, searchParams }: UploadPageProps & { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <UploadSectionView params={params} searchParams={searchParams} />
  );
}


