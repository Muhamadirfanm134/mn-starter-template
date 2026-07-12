"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

export function useUploader(bucket: string, folder?: string) {
	const [progress, setProgress] = useState<number>(0);

	const mutation = useMutation({
		mutationFn: async (file: File) => {
			// Use the provided folder or default to root. Remove leading/trailing slashes for cleanliness.
			const cleanFolder = folder ? folder.replace(/^\/+|\/+$/g, "") : "";
			const fileName = `${Date.now()}-${file.name}`;
			const filePath = cleanFolder ? `${cleanFolder}/${fileName}` : fileName;

			const { data, error } = await supabase.storage
				.from(bucket)
				.upload(filePath, file, {
					cacheControl: "3600",
					upsert: false,
					// @ts-expect-error - Some versions might not have it in types yet
					onUploadProgress: (e: ProgressEvent) => {
						if (e.loaded && e.total) {
							const percent = Math.round((e.loaded / e.total) * 100);
							setProgress(percent);
						}
					},
				});

			if (error) throw error;
			return data?.path || "";
		},
	});

	const uploadFile = async (file: File): Promise<string | null> => {
		try {
			setProgress(0);
			const path = await mutation.mutateAsync(file);
			return path;
		} catch (err) {
			console.error("Upload failed details:", err);
			return null;
		}
	};

	const removeFile = async (path: string): Promise<boolean> => {
		if (path.startsWith("http")) return true; // External URLs don't exist in Supabase storage

		try {
			const { error } = await supabase.storage.from(bucket).remove([path]);

			if (error) {
				console.error("Supabase delete error:", error);
				throw error;
			}

			return true;
		} catch (err) {
			console.error("Failed to remove file:", err);
			return false;
		}
	};

	return {
		uploadFile,
		removeFile,
		uploading: mutation.isPending,
		progress,
	};
}
