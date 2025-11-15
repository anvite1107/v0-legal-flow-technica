'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ClauseDetails {
  clauseId: string;
  type: string;
  riskLevel: 'low' | 'medium' | 'high';
  text: string;
  explanation: string;
  documentId: string;
}

type RiskLevel = 'low' | 'medium' | 'high';

const getRiskLevelStyles = (riskLevel: RiskLevel) => {
  switch (riskLevel) {
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ClauseDetailsPage({
  params,
}: {
  params: { clauseId: string };
}) {
  const router = useRouter();
  const [clause, setClause] = useState<ClauseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClause = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:8000/clause/${params.clauseId}`
        );
        if (!response.ok) throw new Error('Failed to fetch clause details');
        const data = await response.json();
        setClause(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchClause();
  }, [params.clauseId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </main>
    );
  }

  if (error || !clause) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-muted-foreground">
            {error || 'Clause not found'}
          </p>
          <Button
            onClick={() => router.back()}
            className="mt-4"
            variant="outline"
          >
            Go Back
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Link href={`/results/${clause.documentId}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
        </Link>

        {/* Clause Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl">{clause.type}</CardTitle>
              </div>
              <span
                className={`inline-block rounded-full px-4 py-2 text-sm font-medium ${getRiskLevelStyles(clause.riskLevel)}`}
              >
                {clause.riskLevel.charAt(0).toUpperCase() +
                  clause.riskLevel.slice(1)}{' '}
                Risk
              </span>
            </div>
          </CardHeader>
        </Card>

        {/* Extracted Clause Text */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Extracted Clause Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto rounded-lg border border-border bg-muted p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {clause.text}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>Explanation (Plain English)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-foreground">{clause.explanation}</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
