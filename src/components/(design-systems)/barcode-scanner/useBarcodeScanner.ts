import {
	BrowserMultiFormatReader,
	type IScannerControls,
} from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { useCallback, useEffect, useRef, useState } from "react";

// Minimum consecutive reads with same code to accept as valid
const MIN_CONFIDENCE_READS = 2;

interface UseBarcodeScannerProps {
	isOpen: boolean;
	onScanSuccess: (decodedText: string) => void;
	onScanError?: (errorMessage: string) => void;
	onClose: () => void;
}

export function useBarcodeScanner({
	isOpen,
	onScanSuccess,
	onScanError,
	onClose,
}: UseBarcodeScannerProps) {
	const [isCameraReady, setIsCameraReady] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(1);
	const [maxZoom, setMaxZoom] = useState(1);
	const [hasTorch, setHasTorch] = useState(false);
	const [torchOn, setTorchOn] = useState(false);
	const [focusPulse, setFocusPulse] = useState<{ x: number; y: number } | null>(
		null,
	);

	const videoRef = useRef<HTMLVideoElement>(null);
	const trackRef = useRef<MediaStreamTrack | null>(null);
	const controlsRef = useRef<IScannerControls | null>(null);
	const isProcessingRef = useRef(false);
	const autoZoomAppliedRef = useRef(false);

	const scanBufferRef = useRef<{ code: string; count: number }>({
		code: "",
		count: 0,
	});

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

	const [_useNativeScanner, setUseNativeScanner] = useState(false);
	// biome-ignore lint/suspicious/noExplicitAny: BarcodeDetector is not in standard types
	const nativeDetectorRef = useRef<any>(null);
	const nativeRafRef = useRef<number | null>(null);
	const focusIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const streamRef = useRef<MediaStream | null>(null);

	// Restart buffer on open
	useEffect(() => {
		if (isOpen) {
			isProcessingRef.current = false;
			autoZoomAppliedRef.current = false;
			scanBufferRef.current = { code: "", count: 0 };
		}
	}, [isOpen]);

	const applyAdvancedCameraConstraints = useCallback(
		async (track: MediaStreamTrack, force = false) => {
			try {
				const capabilities =
					// biome-ignore lint/suspicious/noExplicitAny: MediaTrackCapabilities is not fully typed
					track.getCapabilities?.() as any;
				if (!capabilities) return;

				// biome-ignore lint/suspicious/noExplicitAny: Advanced constraints are loosely typed
				const advancedConstraints: any = {};

				if (capabilities.focusMode?.includes("continuous")) {
					if (force) {
						const tempMode = capabilities.focusMode.includes("manual")
							? "manual"
							: capabilities.focusMode.includes("single-shot")
								? "single-shot"
								: null;

						if (tempMode) {
							await track.applyConstraints({
								advanced: [{ focusMode: tempMode }],
								// biome-ignore lint/suspicious/noExplicitAny: Advanced constraints are loosely typed
							} as any);
							await new Promise((r) => setTimeout(r, 100));
						}
					}
					advancedConstraints.focusMode = "continuous";
				}

				if (capabilities.zoom) {
					setMaxZoom(Math.min(capabilities.zoom.max, 5));
					if (!force) {
						const initialZoom = 1;
						advancedConstraints.zoom = initialZoom;
						setZoomLevel(initialZoom);
					}
				}

				if (capabilities.torch) {
					setHasTorch(true);
				}

				if (Object.keys(advancedConstraints).length > 0) {
					await track.applyConstraints({
						advanced: [advancedConstraints],
						// biome-ignore lint/suspicious/noExplicitAny: Advanced constraints are loosely typed
					} as any);
				}
			} catch (err) {
				console.warn("Could not apply advanced camera constraints:", err);
			}
		},
		[],
	);

	const kickFocus = useCallback(
		async (e?: React.MouseEvent) => {
			if (!trackRef.current || !isCameraReady) return;

			if (e) {
				const rect = e.currentTarget.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				setFocusPulse({ x, y });
				setTimeout(() => setFocusPulse(null), 800);

				const capabilities =
					// biome-ignore lint/suspicious/noExplicitAny: MediaTrackCapabilities is not fully typed
					trackRef.current.getCapabilities?.() as any;
				if (capabilities?.pointsOfInterest) {
					try {
						await trackRef.current.applyConstraints({
							advanced: [
								{
									pointsOfInterest: [{ x: x / rect.width, y: y / rect.height }],
								},
							],
							// biome-ignore lint/suspicious/noExplicitAny: Advanced constraints are loosely typed
						} as any);
					} catch (_err) {}
				}
			}

			try {
				await applyAdvancedCameraConstraints(trackRef.current, true);
			} catch (_err) {}
		},
		[isCameraReady, applyAdvancedCameraConstraints],
	);

	const handleZoom = async (direction: "in" | "out") => {
		const track = trackRef.current;
		if (!track) return;
		try {
			const capabilities =
				// biome-ignore lint/suspicious/noExplicitAny: MediaTrackCapabilities is not fully typed
				track.getCapabilities?.() as any;
			if (!capabilities?.zoom) return;

			const step = 0.5;
			let newZoom = direction === "in" ? zoomLevel + step : zoomLevel - step;
			newZoom = Math.max(capabilities.zoom.min, Math.min(newZoom, maxZoom));

			// biome-ignore lint/suspicious/noExplicitAny: Advanced constraints are loosely typed
			await track.applyConstraints({ advanced: [{ zoom: newZoom }] } as any);
			setZoomLevel(newZoom);
		} catch (_err) {}
	};

	const toggleTorch = async () => {
		const track = trackRef.current;
		if (!track) return;
		try {
			const newTorchState = !torchOn;
			await track.applyConstraints({
				advanced: [{ torch: newTorchState }],
				// biome-ignore lint/suspicious/noExplicitAny: Advanced constraints are loosely typed
			} as any);
			setTorchOn(newTorchState);
		} catch (_err) {}
	};

	const playBeep = useCallback(() => {
		try {
			const audioCtx = new (
				window.AudioContext ||
				// biome-ignore lint/suspicious/noExplicitAny: webkitAudioContext is legacy
				(window as any).webkitAudioContext
			)();
			const oscillator = audioCtx.createOscillator();
			const gainNode = audioCtx.createGain();
			oscillator.connect(gainNode);
			gainNode.connect(audioCtx.destination);
			oscillator.type = "sine";
			oscillator.frequency.value = 800;
			gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
			oscillator.start();
			oscillator.stop(audioCtx.currentTime + 0.1);
		} catch (_e) {}
	}, []);

	const startNativeScanLoop = useCallback(() => {
		if (
			!nativeDetectorRef.current ||
			!videoRef.current ||
			isProcessingRef.current
		)
			return;

		const detect = async () => {
			try {
				const video = videoRef.current;
				if (!video || video.readyState < 2) {
					nativeRafRef.current = requestAnimationFrame(detect);
					return;
				}

				let scanTarget: HTMLVideoElement | HTMLCanvasElement = video;

				if (video.videoWidth > 0 && video.videoHeight > 0) {
					if (!canvasRef.current) {
						canvasRef.current = document.createElement("canvas");
						ctxRef.current = canvasRef.current.getContext("2d", {
							willReadFrequently: true,
						});
					}
					if (canvasRef.current && ctxRef.current) {
						if (canvasRef.current.width !== video.videoWidth) {
							canvasRef.current.width = video.videoWidth;
							canvasRef.current.height = video.videoHeight;
						}
						const ctx = ctxRef.current;
						ctx.filter = "grayscale(100%) contrast(180%) brightness(130%)";
						ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
						scanTarget = canvasRef.current;
					}
				}

				const barcodes = await nativeDetectorRef.current.detect(scanTarget);

				if (barcodes.length > 0 && !isProcessingRef.current) {
					const code = barcodes[0].rawValue;
					if (code.length >= 5) {
						const buffer = scanBufferRef.current;
						if (buffer.code === code) {
							buffer.count += 1;
						} else {
							buffer.code = code;
							buffer.count = 1;
						}

						if (buffer.count >= MIN_CONFIDENCE_READS) {
							isProcessingRef.current = true;
							playBeep();
							onScanSuccess(code);
							onClose();
							return;
						}
					}
				}

				setTimeout(() => {
					if (!isProcessingRef.current && isOpen) {
						nativeRafRef.current = requestAnimationFrame(detect);
					}
				}, 100);
			} catch (err) {
				console.error("Native detect error:", err);
			}
		};

		nativeRafRef.current = requestAnimationFrame(detect);
	}, [isOpen, onScanSuccess, onClose, playBeep]);

	const startScanner = useCallback(async () => {
		if (!isOpen || !videoRef.current) return;

		try {
			let stream: MediaStream;
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: { exact: "environment" },
						width: { ideal: 1280 },
						height: { ideal: 720 },
					},
				});
			} catch {
				stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: "environment",
						width: { ideal: 1280 },
						height: { ideal: 720 },
					},
				});
			}

			streamRef.current = stream;
			const video = videoRef.current;
			video.srcObject = stream;
			video.setAttribute("playsinline", "true");
			await new Promise<void>((resolve, reject) => {
				video.onloadedmetadata = () => {
					video.play().then(resolve).catch(reject);
				};
				setTimeout(reject, 10000);
			});

			const track = stream.getVideoTracks()[0];
			if (track) {
				trackRef.current = track;
				await new Promise((r) => setTimeout(r, 600));
				await applyAdvancedCameraConstraints(track);

				if (focusIntervalRef.current) clearInterval(focusIntervalRef.current);
				focusIntervalRef.current = setInterval(() => {
					if (trackRef.current)
						applyAdvancedCameraConstraints(trackRef.current, true);
				}, 7000);
			}

			const formats = [
				"ean_13",
				"ean_8",
				"upc_a",
				"upc_e",
				"code_128",
				"code_39",
			];

			if ("BarcodeDetector" in window) {
				try {
					const supportedFormats =
						await // biome-ignore lint/suspicious/noExplicitAny: BarcodeDetector is not in standard types
						(window as any).BarcodeDetector.getSupportedFormats();
					const targetFormats = formats.filter((f) =>
						supportedFormats.includes(f),
					);

					// biome-ignore lint/suspicious/noExplicitAny: BarcodeDetector is not in standard types
					nativeDetectorRef.current = new (window as any).BarcodeDetector({
						formats: targetFormats,
					});
					setUseNativeScanner(true);
					startNativeScanLoop();
					setIsCameraReady(true);
					return;
				} catch (err) {
					console.warn(
						"Failed to init native scanner, falling back to ZXing:",
						err,
					);
				}
			}

			// biome-ignore lint/suspicious/noExplicitAny: ZXing hints use any
			const hints = new Map<DecodeHintType, any>();
			hints.set(DecodeHintType.TRY_HARDER, true);
			hints.set(DecodeHintType.POSSIBLE_FORMATS, [
				BarcodeFormat.EAN_13,
				BarcodeFormat.EAN_8,
				BarcodeFormat.UPC_A,
				BarcodeFormat.UPC_E,
				BarcodeFormat.CODE_128,
				BarcodeFormat.CODE_39,
			]);

			const codeReader = new BrowserMultiFormatReader(hints, {
				delayBetweenScanAttempts: 300,
			});

			const controls = await codeReader.decodeFromStream(
				stream,
				video,
				(result, _error) => {
					if (result && !isProcessingRef.current) {
						const code = result.getText();
						if (code.length < 5) return;

						const points = result.getResultPoints();
						if (
							points.length >= 2 &&
							trackRef.current &&
							!autoZoomAppliedRef.current
						) {
							if (video) {
								const xs = points.map((p) => p.getX());
								const barcodeWidth = Math.max(...xs) - Math.min(...xs);
								const frameWidth = video.videoWidth || 1280;
								const ratio = barcodeWidth / frameWidth;

								if (ratio < 0.3) {
									const capabilities =
										// biome-ignore lint/suspicious/noExplicitAny: MediaTrackCapabilities is not fully typed
										trackRef.current.getCapabilities?.() as any;
									if (capabilities?.zoom) {
										const desiredZoom = Math.min(
											0.3 / Math.max(ratio, 0.05),
											Math.min(capabilities.zoom.max, 4),
										);
										trackRef.current
											.applyConstraints({
												advanced: [{ zoom: desiredZoom }],
												// biome-ignore lint/suspicious/noExplicitAny: Advanced constraints are loosely typed
											} as any)
											.then(() => setZoomLevel(desiredZoom))
											.catch(() => {});
										autoZoomAppliedRef.current = true;
										scanBufferRef.current = { code: "", count: 0 };
										return;
									}
								}
							}
						}

						const buffer = scanBufferRef.current;
						if (buffer.code === code) {
							buffer.count += 1;
						} else {
							buffer.code = code;
							buffer.count = 1;
						}

						if (buffer.count >= MIN_CONFIDENCE_READS) {
							isProcessingRef.current = true;
							scanBufferRef.current = { code: "", count: 0 };
							playBeep();
							onScanSuccess(code);
							onClose();
						}
					}
				},
			);

			controlsRef.current = controls;
			setIsCameraReady(true);
			// biome-ignore lint/suspicious/noExplicitAny: Error object can be anything
		} catch (err: any) {
			console.warn("Scanner init issue:", err);
			if (onScanError) onScanError(err.message || "Error starting scanner");
			setIsCameraReady(false);
		}
	}, [
		isOpen,
		applyAdvancedCameraConstraints,
		startNativeScanLoop,
		onScanSuccess,
		onClose,
		playBeep,
		onScanError,
	]);

	const stopScanner = useCallback(async () => {
		try {
			if (torchOn && trackRef.current) {
				await trackRef.current
					// biome-ignore lint/suspicious/noExplicitAny: Advanced constraints are loosely typed
					.applyConstraints({ advanced: [{ torch: false }] } as any)
					.catch(() => {});
			}
			if (focusIntervalRef.current) {
				clearInterval(focusIntervalRef.current);
				focusIntervalRef.current = null;
			}
			if (nativeRafRef.current) {
				cancelAnimationFrame(nativeRafRef.current);
				nativeRafRef.current = null;
			}
			if (controlsRef.current) {
				controlsRef.current.stop();
				controlsRef.current = null;
			}
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((t) => {
					t.stop();
				});
				streamRef.current = null;
			}
			if (videoRef.current) {
				videoRef.current.srcObject = null;
			}
			trackRef.current = null;
			nativeDetectorRef.current = null;
			setUseNativeScanner(false);
			setTorchOn(false);
			setZoomLevel(1);
			setMaxZoom(1);
			setHasTorch(false);
		} catch (_err) {
		} finally {
			setIsCameraReady(false);
		}
	}, [torchOn]);

	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => startScanner(), 300);
			return () => {
				clearTimeout(timer);
				stopScanner();
			};
		}
	}, [isOpen, stopScanner, startScanner]);

	useEffect(() => {
		return () => {
			stopScanner();
		};
	}, [stopScanner]);

	return {
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
	};
}
