import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

const supabase = createClient(
	// biome-ignore lint/style/noNonNullAssertion: Env var must exist
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	// biome-ignore lint/style/noNonNullAssertion: Env var must exist
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);

	const bucket = searchParams.get("bucket");
	const rawPath = searchParams.get("path");

	if (!bucket || !rawPath) {
		return NextResponse.json(
			{ error: "Missing bucket or path" },
			{ status: 400 },
		);
	}

	const path = decodeURIComponent(rawPath);

	console.log("Fetching signed URL for:", { bucket, path });

	const { data, error } = await supabase.storage
		.from(bucket)
		.createSignedUrl(path, 60);

	if (error) {
		console.error("Supabase signed URL error:", error);
		return NextResponse.json(
			{ error: `Supabase Error: ${error.message}` },
			{ status: 500 },
		);
	}

	return NextResponse.json({ url: data.signedUrl });
}
