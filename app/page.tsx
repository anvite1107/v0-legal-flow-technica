'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock document ID and store mock results in localStorage
      const documentId = `doc-${Date.now()}`;
      const mockData = {
        summary: `This contract outlines the terms and conditions between two parties. The agreement includes key provisions regarding payment terms, liability limitations, and dispute resolution. Important dates: effective date upon signing, renewal on annual basis. Overall risk assessment: MEDIUM due to broad indemnification clauses.`,
        clauses: [
          {
            clauseId: `clause-1-${documentId}`,
            type: 'Payment Terms',
            riskLevel: 'low',
            text: 'Payment shall be made within 30 days of invoice receipt. A 2% early payment discount is available if payment is received within 10 days.',
            explanation: 'This clause outlines standard payment expectations. Net-30 terms are industry standard and favorable. The early payment discount incentivizes faster payment without penalty.'
          },
          {
            clauseId: `clause-2-${documentId}`,
            type: 'Limitation of Liability',
            riskLevel: 'high',
            text: 'Neither party shall be liable for indirect, incidental, special, or consequential damages arising from this agreement, except in cases of gross negligence or willful misconduct.',
            explanation: 'This is a mutual liability cap. While it protects both parties, the exclusion is very broad and may limit recovery in significant disputes.'
          },
          {
            clauseId: `clause-3-${documentId}`,
            type: 'Confidentiality',
            riskLevel: 'medium',
            text: 'All confidential information shared under this agreement shall be kept strictly confidential for a period of 3 years after contract termination.',
            explanation: 'Standard confidentiality clause. 3 years post-termination is reasonable. Ensure your organization has processes to enforce this.'
          }
        ]
      };

      localStorage.setItem(`document-${documentId}`, JSON.stringify(mockData));
      router.push(`/results/${documentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute left-4 top-4">
        <Link href="/landing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </Link>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">LegalFlow Light — Contract Analyzer</CardTitle>
          <CardDescription className="mt-2">
            Upload a contract PDF to analyze key clauses and risks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="mb-2 text-4xl">📄</div>
            <p className="text-center text-sm font-medium">
              {file ? file.name : 'Drag and drop your PDF here'}
            </p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
              aria-label="Upload PDF file"
            />
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!file || loading}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <span className="mr-2">⏳</span>
                Analyzing...
              </>
            ) : (
              'Analyze Contract'
            )}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
