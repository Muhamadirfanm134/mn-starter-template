"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

async function fetchSignedUrl(bucket: string, path: string) {
	const res = await fetch(
		`/api/supabase-image?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(path)}`,
	);
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Failed to fetch signed URL");
	return data.url;
}

interface SupabaseImageProps {
	bucket: string;
	path: string;
	width?: number;
	height?: number;
	alt?: string;
	className?: string;
}

export function SupabaseImage({
	bucket,
	path,
	width = 100,
	height = 100,
	alt = "image",
	className,
}: SupabaseImageProps) {
	const isExternal = path?.startsWith?.("http") || false;

	const {
		data: url,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["signedUrl", bucket, path],
		queryFn: () =>
			isExternal ? Promise.resolve(path) : fetchSignedUrl(bucket, path),
		enabled: !!path && typeof path === "string",
		refetchInterval: isExternal ? undefined : 50 * 1000,
	});

	if (!path || typeof path !== "string") return null;

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Failed to load image</div>;
	if (!url) return null;

	return (
		<Image
			src={url}
			width={width}
			height={height}
			alt={alt}
			className={className}
			unoptimized={isExternal}
		/>
	);
}
