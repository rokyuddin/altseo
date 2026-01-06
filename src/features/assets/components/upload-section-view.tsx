import { Suspense, use } from 'react'
import { UploadHeaderLoader } from './upload-header-loader';
import { UploadHeader } from './upload-header';
import { ImageUploader } from './image-uploader';
import UploadTabs from './upload-tabs';
import { HistoryView } from './history-view';


type UploadSectionViewProps = {
    params: Promise<{ tab: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export function UploadSectionView({ params, searchParams }: UploadSectionViewProps) {
    const tab = use(params).tab

    return (
        <div className="contain-inline-size">
            <UploadTabs />
            {tab === 'upload' ? <div className="space-y-10 mt-0 outline-none">
                <Suspense fallback={<UploadHeaderLoader />}>
                    <UploadHeader />
                </Suspense>
                <ImageUploader allowGuest={false} />
            </div> :
                tab === 'history' ? <div className="mt-0 outline-none">
                    <HistoryView searchParams={searchParams} />
                </div> : null}
        </div>
    )
}
