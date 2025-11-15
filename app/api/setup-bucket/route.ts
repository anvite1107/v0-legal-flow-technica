import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === "contracts");

    if (bucketExists) {
      return NextResponse.json({
        success: true,
        message: "Bucket already exists",
      });
    }

    // Create the bucket if it doesn't exist
    const { data, error } = await supabase.storage.createBucket("contracts", {
      public: true,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bucket created successfully",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
