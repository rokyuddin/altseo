import { getAllAssetsHistory } from '../api'
import { Card, CardContent } from '@/components/atoms/card'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { CopyButton } from '@/components/molecules/copy-button'

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/atoms/empty'
import { Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/atoms/button'



export async function HistoryGridView({ query }: { query?: string }) {
    const history = await getAllAssetsHistory(query)

    if (history.length === 0) {
        return (
            <Card className='mx-auto mt-10 max-w-lg'>
                <CardContent>
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <ImageIcon className="w-6 h-6" />
                            </EmptyMedia>
                            <EmptyTitle>No assets found</EmptyTitle>
                            <EmptyDescription>
                                {query ? `No results matching "${query}"` : "Upload your first image to see it here"}
                            </EmptyDescription>
                            <EmptyContent>
                                <Link className={cn(buttonVariants({ variant: "default" }))} href="/assets/upload">Upload Image</Link>
                            </EmptyContent>
                        </EmptyHeader>
                    </Empty>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
                <Card key={item.id} className="group overflow-hidden">
                    <CardContent className="p-0">
                        <div className="relative aspect-video">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${item.storage_path}`}
                                alt={item.alt_text || item.file_name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="right-2 bottom-2 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-md font-medium text-white text-xs">
                                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3 p-4">
                            <div className="flex justify-between items-start gap-4">
                                <h4 className="font-semibold text-sm truncate" title={item.file_name}>
                                    {item.file_name}
                                </h4>
                            </div>
                            <div className="space-y-2">
                                <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">
                                    {item.alt_text || "No description generated"}
                                </p>
                                {item.alt_text && (
                                    <div className="pt-2">
                                        <CopyButton text={item.alt_text} className="w-full" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
