import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function UserProfileSkeleton() {
    return (
        <Card className="w-full max-w-3xl mx-auto mt-8">
            <CardHeader>
                <Skeleton className="h-8 w-64 mx-auto" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <div className="text-center">
                        <Skeleton className="h-6 w-40 mx-auto" />
                        <Skeleton className="h-4 w-32 mx-auto mt-2" />
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i}>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}