'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ResultsPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const router = useRouter();
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const docId = resolvedParams.documentId;
        setDocumentId(docId);
        
        const key = `document-${docId}`;
        const storedData = localStorage.getItem(key);
        
        if (!storedData) {
          throw new Error('Document not found');
        }

        const data = JSON.parse(storedData);
        setFileName(data.fileName || 'Medical Report');
        setFileSize(data.fileSize || 0);
      } catch (err) {
        console.error('[Results] Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#EEF8FF] via-white to-[#EEF8FF]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📄</div>
          <div className="text-xl font-semibold text-gray-700">Loading your document...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#EEF8FF] via-white to-[#EEF8FF]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md bg-white rounded-3xl p-12 shadow-2xl border border-red-200"
        >
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">Upload Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={() => router.push('/')} 
            className="bg-gradient-to-r from-[#0B7BD6] to-[#66D1C9] hover:opacity-90 rounded-full px-8"
          >
            Try Again
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#EEF8FF] via-white to-[#EEF8FF] px-4 py-12">
      <div className="mx-auto max-w-4xl">
        
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-5xl mb-6 mx-auto shadow-xl">
              ✓
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-gray-800 mb-3"
          >
            Upload Successful!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-600"
          >
            Your medical report is ready for analysis
          </motion.p>
        </motion.div>

        {/* File Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8"
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0B7BD6] to-[#66D1C9] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
              📄
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {fileName}
              </h2>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <span>PDF Document</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💾</span>
                  <span>{(fileSize / 1024).toFixed(2)} KB</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <span className="text-green-600 font-medium">Ready for Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 mb-8 border-2 border-indigo-200"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            What Happens Next
          </h3>
          
          <div className="space-y-4">
            {[
              { icon: '🔍', text: 'AI will read and analyze your medical report', color: 'bg-blue-100 text-blue-700' },
              { icon: '📊', text: 'Generate interactive charts and visualizations', color: 'bg-purple-100 text-purple-700' },
              { icon: '💬', text: 'Explain findings in simple, easy-to-understand language', color: 'bg-green-100 text-green-700' },
              { icon: '✨', text: 'Provide personalized health insights', color: 'bg-pink-100 text-pink-700' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + (i * 0.1) }}
                className="flex items-center gap-4"
              >
                <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-xl`}>
                  {item.icon}
                </div>
                <span className="text-gray-700 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href={`/flowchart/${documentId}`} className="flex-1 sm:flex-initial">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[#0B7BD6] to-[#66D1C9] hover:opacity-90 transition-opacity rounded-full px-12 py-7 text-lg font-semibold shadow-xl shadow-[#0B7BD6]/20"
            >
              <span className="mr-3 text-2xl">🩺</span>
              Start Analysis
            </Button>
          </Link>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/')}
            className="rounded-full px-8 py-7 text-lg border-2"
          >
            <span className="mr-2">⬅️</span>
            Upload Another Report
          </Button>
        </motion.div>

        {/* Processing Time Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span className="text-lg">⏱️</span>
            Analysis typically takes 30-60 seconds
          </p>
        </motion.div>
      </div>
    </main>
  );
}
