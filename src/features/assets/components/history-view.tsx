import { use } from 'react'
import { HistoryHeader } from './history-header'
import { HistoryGridView } from './history-grid-view'
import { Suspense } from 'react'
import { HistoryGridViewLoader } from './history-grid-view-loader'


export function HistoryView({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = use(searchParams)
  const query = params?.q as string || ''

  return (
    <div className="space-y-6">
      <HistoryHeader />
      <Suspense fallback={<HistoryGridViewLoader />}>
        <HistoryGridView query={query} />
      </Suspense>
    </div>
  )
}

