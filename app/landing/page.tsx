'use client';

import { ArrowRight, Zap, Shield, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary"></div>
              <span className="text-lg font-semibold text-foreground">LegalFlow</span>
            </div>
            <Link href="/">
              <Button variant="default">Upload Contract</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Contract Analysis</span>
          </div>

          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Understand Your Contracts in Seconds
          </h1>

          <p className="mt-6 text-xl text-muted-foreground">
            LegalFlow Light uses advanced AI to extract key clauses, identify risks, and explain complex legal language in plain English. Make informed decisions faster.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button size="lg" className="gap-2">
                Upload Your Contract
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold text-foreground">
              Powerful Features for Contract Analysis
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to understand and manage your contracts
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Card 1: Clause Extraction */}
            <Card className="border border-border">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Clause Extraction</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Automatically identify and extract all key clauses from your contracts. Organize information in a structured, easy-to-review format.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 2: Risk Detection */}
            <Card className="border border-border">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <Shield className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle>Risk Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AI analyzes clauses to flag potential risks and unfavorable terms. Color-coded severity indicators help you prioritize what matters most.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 3: Plain English Summaries */}
            <Card className="border border-border">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Plain English Summaries</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Complex legal language decoded into simple, actionable summaries. Understand what each clause means without needing a lawyer.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground">
            Ready to Simplify Contract Review?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start analyzing your contracts with AI today. No credit card required.
          </p>
          <Link href="/">
            <Button size="lg" className="mt-8 gap-2">
              Upload Contract Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
