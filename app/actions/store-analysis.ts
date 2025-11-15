'use server';

import { createClient } from '@supabase/supabase-js';

export async function storeAnalysisResults(
  documentId: string,
  fileName: string,
  fileUrl: string,
  summary: {
    summary_text: string;
    key_points: string[];
  },
  clauses: Array<{
    clause_id: string;
    clause_type: string;
    risk_level: string;
    extracted_text: string;
    plain_english: string;
  }>
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    console.log('[v0] Storing analysis for documentId:', documentId);

    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        document_id: documentId,
        file_name: fileName,
        file_url: fileUrl,
      })
      .select()
      .single();

    if (docError) {
      console.error('[v0] Document insert error:', docError);
      throw new Error(`Document insert failed: ${docError.message}`);
    }

    console.log('[v0] Document stored with id:', docData.id);

    const docUuid = docData.id;

    const { error: summaryError } = await supabase
      .from('summaries')
      .insert({
        document_id: docUuid,
        summary_text: summary.summary_text,
        key_points: summary.key_points,
      });

    if (summaryError) {
      console.error('[v0] Summary insert error:', summaryError);
      throw new Error(`Summary insert failed: ${summaryError.message}`);
    }

    console.log('[v0] Summary stored');

    const clauseRecords = clauses.map((clause) => ({
      document_id: docUuid,
      clause_id: clause.clause_id,
      clause_type: clause.clause_type,
      risk_level: clause.risk_level,
      extracted_text: clause.extracted_text,
      plain_english: clause.plain_english,
    }));

    const { error: clausesError } = await supabase
      .from('clauses')
      .insert(clauseRecords);

    if (clausesError) {
      console.error('[v0] Clauses insert error:', clausesError);
      throw new Error(`Clauses insert failed: ${clausesError.message}`);
    }

    console.log('[v0] Clauses stored');

    return { success: true, documentId };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to store analysis';
    console.error('[v0] Storage error:', message);
    throw error;
  }
}
