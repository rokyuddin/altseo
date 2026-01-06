import { Card, CardContent } from '@/components/atoms/card'
import { Skeleton } from '@/components/atoms/skeleton'

export function HistoryGridViewLoader() {
    return (
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                    <CardContent className='space-y-4'>
                        <Skeleton className='w-full h-48' />
                        <Skeleton className='w-full h-10' />
                        <Skeleton className='w-[90%] h-10' />
                        <Skeleton className='w-[80%] h-10' />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
