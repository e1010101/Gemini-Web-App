'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    const handleViewLastReport = () => {
        // Check if there's a last report
        const lastReport = localStorage.getItem('lastReport');
        if (lastReport) {
            router.push('/view-report');
        } else {
            alert('No previous report found. Please create a new report.');
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Welcome to QiPal!</h1>
            <div className="space-y-4">
                <Button asChild className="w-full">
                    <Link href="/form">Start New Report</Link>
                </Button>
                <Button onClick={handleViewLastReport} className="w-full">
                View Last Report
                </Button>
            </div>
        </main>
    );
}