"use client";

import { Camera, Image as ImageIcon, Upload } from "lucide-react";
import { useRef } from "react";
import {
	type Control,
	type FieldValues,
	type Path,
	type PathValue,
	type UseFormSetValue,
	useWatch,
} from "react-hook-form";
import { useUploader } from "@/hooks/useUploader";
import { cn } from "@/lib/utils";
import { SupabaseImage } from "../supabaseImage";

type Variant = "button" | "icon" | "drag" | "avatar";
type Mode = "single" | "multi";

interface UploaderProps<T extends FieldValues> {
	name: Path<T>;
	bucket: string;
	setValue: UseFormSetValue<T>;
	control: Control<T>;
	variant?: Variant;
	mode?: Mode;
	className?: string;
	folder?: string;
	capture?: "user" | "environment";
}

export function Uploader<T extends FieldValues>({
	name,
	bucket,
	setValue,
	control,
	variant = "button",
	mode = "single",
	className,
	folder,
}: UploaderProps<T>) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const cameraInputRef = useRef<HTMLInputElement>(null);
	const { uploadFile, removeFile, uploading } = useUploader(bucket, folder);

	const watchValue = useWatch({ control, name });
	const files: string[] = (
		Array.isArray(watchValue)
			? watchValue
			: watchValue
				? [watchValue]
				: ([] as unknown[])
	).filter((f): f is string => typeof f === "string" && f.length > 0);

	const handleFiles = async (selected: FileList | null) => {
		if (!selected) return;

		const uploadedUrls: string[] = [];

		for (const file of Array.from(selected)) {
			const url = await uploadFile(file);
			if (url) uploadedUrls.push(url);
		}

		if (uploadedUrls.length === 0) return;

		let newValue: unknown;
		if (mode === "multi") {
			newValue = [...files, ...uploadedUrls];
		} else {
			// If single mode, remove previous file from bucket if it exists
			// Skip removal for external URLs (e.g. Google avatar)
			const oldFile = files[0];
			if (
				oldFile &&
				typeof oldFile === "string" &&
				!oldFile.startsWith("http")
			) {
				await removeFile(oldFile);
			}
			newValue = uploadedUrls[0];
		}

		setValue(name, newValue as PathValue<T, typeof name>, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	const onRemove = async (path: string) => {
		const success = await removeFile(path);
		if (success) {
			const newFiles = files.filter((f: string) => f !== path);
			const newValue = mode === "multi" ? newFiles : "";
			setValue(name, newValue as PathValue<T, typeof name>, {
				shouldValidate: true,
				shouldDirty: true,
			});
		}
	};

	const onClickUpload = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			{variant === "button" && (
				<button
					type="button"
					onClick={onClickUpload}
					disabled={uploading}
					className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{uploading ? "Uploading..." : "Upload File"}
				</button>
			)}

			{variant === "icon" && (
				<button
					type="button"
					onClick={onClickUpload}
					className="rounded-full border p-2 hover:bg-gray-100"
				>
					<Upload size={20} />
				</button>
			)}

			{variant === "avatar" && (
				<div className="flex flex-col items-center gap-2">
					<button
						type="button"
						onClick={onClickUpload}
						disabled={uploading}
						className="group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-blue-400 hover:bg-gray-100 disabled:opacity-50"
					>
						{files.length > 0 ? (
							<>
								<SupabaseImage
									bucket={bucket}
									path={files[0]}
									width={200}
									height={200}
									alt="Avatar"
									className="h-full w-full object-cover"
								/>
								<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
									<Upload size={20} className="text-white" />
									<span className="mt-1 text-[10px] font-medium text-white">
										Ubah Foto
									</span>
								</div>
							</>
						) : (
							<div className="flex flex-col items-center justify-center text-gray-400">
								<Upload size={24} />
								<span className="mt-1 text-[10px] font-medium">Upload</span>
							</div>
						)}
						{uploading && (
							<div className="absolute inset-0 flex items-center justify-center bg-white/80">
								<div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
							</div>
						)}
					</button>
				</div>
			)}

			{variant === "drag" && (
				<div className="flex flex-col gap-3">
					<button
						type="button"
						onDrop={(e) => {
							e.preventDefault();
							handleFiles(e.dataTransfer.files);
						}}
						onDragOver={(e) => e.preventDefault()}
						onClick={onClickUpload}
						className="group hover:border-primary-400 flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 transition-all hover:bg-gray-100"
					>
						<div className="bg-primary-50 text-primary-500 mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
							<Upload size={32} />
						</div>
						<p className="text-sm font-bold text-gray-800">
							{uploading ? "Sedang mengunggah..." : "Klik untuk Unggah Foto"}
						</p>
						<p className="mt-1 text-xs text-gray-400">
							Mendukung JPEG, PNG hingga 5MB
						</p>
					</button>

					{/* Special Camera Button for Mobile/Android fix */}
					<div className="grid grid-cols-2 gap-3">
						<button
							type="button"
							onClick={() => onClickUpload()}
							disabled={uploading}
							className="flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white py-3 text-sm font-bold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50"
						>
							<ImageIcon size={18} className="text-gray-400" />
							Galeri
						</button>
						<button
							type="button"
							onClick={() => cameraInputRef.current?.click()}
							disabled={uploading}
							className="bg-primary-600 hover:bg-primary-700 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white shadow-md disabled:opacity-50"
						>
							<Camera size={18} />
							Ambil Foto
						</button>
					</div>
				</div>
			)}

			{/* Main input (Galeri + Multi) */}
			<input
				ref={fileInputRef}
				type="file"
				hidden
				accept="image/*"
				multiple={mode === "multi"}
				onChange={(e) => handleFiles(e.target.files)}
			/>

			{/* Dedicated Camera input (Android Fix) */}
			<input
				ref={cameraInputRef}
				type="file"
				hidden
				accept="image/*"
				capture="environment"
				onChange={(e) => handleFiles(e.target.files)}
			/>

			{files.length > 0 && variant !== "avatar" && (
				<div className="mt-2 grid grid-cols-3 gap-3">
					{files
						.filter(
							(p: unknown) => typeof p === "string" && !p.endsWith(".keep"),
						)
						.map((path: string, i: number) => (
							<div key={path} className="relative">
								<SupabaseImage
									bucket={bucket}
									path={path}
									width={150}
									height={150}
									alt={`Uploaded file ${i + 1}`}
									className="h-32 w-full rounded-lg border object-cover"
								/>

								<button
									type="button"
									onClick={() => onRemove(path)}
									className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700"
								>
									×
								</button>
							</div>
						))}
				</div>
			)}
		</div>
	);
}
