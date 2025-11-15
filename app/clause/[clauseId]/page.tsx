'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

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
    try {
      setLoading(true);
      let foundClause: ClauseDetails | null = null;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('document-')) {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          const matchedClause = data.clauses?.find(
            (c: any) => c.clauseId === params.clauseId
          );
          if (matchedClause) {
            const docId = key.replace('document-', '');
            foundClause = {
              ...matchedClause,
              documentId: docId,
            };
            break;
          }
        }
      }

      if (!foundClause) {
        throw new Error('Clause not found');
      }

      setClause(foundClause);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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
        <div className="mb-6 flex gap-2">
          <Link href={`/results/${clause.documentId}`}>
            <Button variant="ghost">
              ← Back to Results
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Home
            </Button>
          </Link>
        </div>

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
