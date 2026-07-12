"use client";

import { Camera, Flashlight, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../button/Button";
import ResponsiveModal from "../responsiveModal";
import { useBarcodeScanner } from "./useBarcodeScanner";

interface BarcodeScannerProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onScanSuccess: (decodedText: string) => void;
	onScanError?: (errorMessage: string) => void;
}

export default function BarcodeScanner({
	isOpen,
	onOpenChange,
	onScanSuccess,
	onScanError,
}: BarcodeScannerProps) {
	const [actuallyOpen, setActuallyOpen] = useState(isOpen);

	useEffect(() => {
		setActuallyOpen(isOpen);
	}, [isOpen]);

	const handleClose = () => {
		setActuallyOpen(false);
		onOpenChange(false);
	};

	const handleOpenChangeInternal = (open: boolean) => {
		if (!open) {
			handleClose();
		} else {
			setActuallyOpen(true);
			onOpenChange(true);
		}
	};

	const {
		videoRef,
		isCameraReady,
		zoomLevel,
		maxZoom,
		hasTorch,
		torchOn,
		focusPulse,
		handleZoom,
		toggleTorch,
		kickFocus,
	} = useBarcodeScanner({
		isOpen: actuallyOpen,
		onScanSuccess,
		onScanError,
		onClose: handleClose,
	});

	return (
		<ResponsiveModal
			isOpen={actuallyOpen}
			onOpenChange={handleOpenChangeInternal}
			title="Scan Barcode Produk"
			withCloseButton
		>
			<div className="flex flex-col items-center">
				<button
					type="button"
					className="relative aspect-square w-full max-w-[350px] cursor-crosshair overflow-hidden rounded-2xl bg-black shadow-inner"
					onClick={kickFocus}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							kickFocus();
						}
					}}
					aria-label="Fokuskan kamera"
				>
					<video
						ref={videoRef}
						className="h-full w-full object-cover"
						playsInline
						muted
					/>

					{focusPulse && (
						<div
							className="pointer-events-none absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 border-white/50"
							style={{ left: focusPulse.x, top: focusPulse.y }}
						/>
					)}

					{!isCameraReady && (
						<div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 text-white">
							<Camera className="mb-2 h-10 w-10 animate-pulse opacity-50" />
							<span className="text-xs opacity-50">Menyiapkan kamera...</span>
						</div>
					)}

					{/* Scanning Overlay Visual */}
					{isCameraReady && (
						<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
							<div className="border-primary-500 relative h-[120px] w-[220px] rounded-lg border-2 shadow-[0_0_0_999px_rgba(0,0,0,0.5)]">
								{/* Laser Line Animation */}
								<div className="bg-primary-400 absolute top-0 right-0 left-0 h-0.5 animate-[scan_2s_infinite] shadow-[0_0_15px_rgba(var(--color-primary-400),0.8)]" />

								{/* Corners */}
								<div className="border-primary-400 absolute top-0 left-0 h-4 w-4 rounded-tl-md border-t-2 border-l-2" />
								<div className="border-primary-400 absolute top-0 right-0 h-4 w-4 rounded-tr-md border-t-2 border-r-2" />
								<div className="border-primary-400 absolute bottom-0 left-0 h-4 w-4 rounded-bl-md border-b-2 border-l-2" />
								<div className="border-primary-400 absolute right-0 bottom-0 h-4 w-4 rounded-br-md border-r-2 border-b-2" />
							</div>
						</div>
					)}

					{/* Camera Controls (Zoom + Torch) */}
					{isCameraReady && (
						<div className="absolute right-2 bottom-2 z-20 flex items-center gap-1">
							{maxZoom > 1 && (
								<>
									<button
										type="button"
										onClick={() => handleZoom("out")}
										className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
										aria-label="Zoom out"
									>
										<ZoomOut className="h-4 w-4" />
									</button>
									<span className="min-w-[2rem] text-center text-xs font-medium text-white drop-shadow">
										{zoomLevel.toFixed(1)}x
									</span>
									<button
										type="button"
										onClick={() => handleZoom("in")}
										className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
										aria-label="Zoom in"
									>
										<ZoomIn className="h-4 w-4" />
									</button>
								</>
							)}
							{hasTorch && (
								<button
									type="button"
									onClick={toggleTorch}
									className={`ml-1 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${
										torchOn
											? "bg-yellow-400/80 text-black"
											: "bg-black/50 text-white hover:bg-black/70"
									}`}
									aria-label="Toggle flashlight"
								>
									<Flashlight className="h-4 w-4" />
								</button>
							)}
						</div>
					)}
				</button>

				<p className="mt-4 px-4 text-center text-xs text-gray-500">
					💡 Dekatkan barcode perlahan, kamera akan fokus otomatis.
					<br />
					<b>Tap area kamera</b> jika gambar terlihat blur untuk memfokuskan
					kembali.
				</p>

				<p className="mt-1 px-4 text-center text-sm font-medium text-gray-600">
					Arahkan barcode produk ke dalam kotak penanda untuk memproses secara
					otomatis
				</p>

				<div className="mt-6 flex w-full flex-col gap-3">
					<Button
						variant="text"
						onClick={() => handleOpenChangeInternal(false)}
						className="w-full rounded-2xl!"
					>
						Batal
					</Button>
				</div>
			</div>

			<style jsx global>{`
        @keyframes scan {
          0%,
          100% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
        }
      `}</style>
		</ResponsiveModal>
	);
}
