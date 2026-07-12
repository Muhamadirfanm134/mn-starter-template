"use client";

import { m } from "framer-motion";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { FormProvider } from "react-hook-form";
import Button from "@/components/(design-systems)/button/Button";
import { FormInput } from "@/components/(design-systems)/input/FormInput";
import { APP_VERSION_LABEL } from "@/lib/constants";
import useLoginForm from "./hooks/useLoginForm";

function GoogleIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			width="20"
			height="20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Google Icon</title>
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
				fill="#4285F4"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				fill="#FBBC05"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
			/>
		</svg>
	);
}

export default function LoginPage() {
	const [isRegister, setIsRegister] = useState(false);
	const { form, onSubmit, onRegister, onGoogleLogin, loading } = useLoginForm();
	const [googleLoading, setGoogleLoading] = useState(false);

	const handleGoogleLogin = async () => {
		setGoogleLoading(true);
		try {
			await onGoogleLogin();
		} finally {
			// Keep loading state while redirecting to Google
			setTimeout(() => setGoogleLoading(false), 5000);
		}
	};

	return (
		<div className="flex h-dvh flex-col items-center justify-center overflow-y-auto px-4">
			<div className="flex w-full flex-1 flex-col items-center justify-center">
				<m.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="w-full max-w-sm"
				>
					{/* Logo */}
					<m.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="mb-8 flex flex-col items-center"
					>
						<h1 className="text-3xl font-bold text-(--color-primary-500)">
							App Starter
						</h1>
					</m.div>

					{/* Title */}
					<m.h2
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.4 }}
						className="mb-2 text-sm text-gray-500"
					>
						{isRegister ? "Buat akun" : "Silahkan masuk dengan akunmu"}
					</m.h2>

					{/* Form */}
					<FormProvider {...form}>
						<m.form
							onSubmit={isRegister ? onRegister : onSubmit}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.5 }}
							className="space-y-3"
						>
							{isRegister && (
								<FormInput
									name="fullname"
									iconLeft={<User size={18} />}
									required
									placeholder="Nama Lengkap"
								/>
							)}
							<FormInput
								name="email"
								type="email"
								iconLeft={<Mail size={18} />}
								required
								placeholder="Email"
							/>

							<FormInput
								name="password"
								type="password"
								iconLeft={<Lock size={18} />}
								required
								placeholder="Password"
							/>

							<m.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
								<Button
									variant="primary"
									type="submit"
									className="w-full"
									size="lg"
									isLoading={loading}
								>
									{isRegister ? "Daftar" : "Masuk"}
								</Button>
							</m.div>
						</m.form>
					</FormProvider>

					{/* Divider */}
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.4 }}
						className="my-5 flex items-center gap-3"
					>
						<div className="h-px flex-1 bg-gray-200" />
						<span className="text-xs text-gray-400">atau</span>
						<div className="h-px flex-1 bg-gray-200" />
					</m.div>

					{/* Google Login Button */}
					<m.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.55, duration: 0.4 }}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<button
							type="button"
							onClick={handleGoogleLogin}
							disabled={googleLoading}
							className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
						>
							{googleLoading ? (
								<div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
							) : (
								<GoogleIcon />
							)}
							<span>
								{googleLoading
									? "Mengarahkan ke Google..."
									: isRegister
										? "Daftar dengan Google"
										: "Masuk dengan Google"}
							</span>
						</button>
					</m.div>

					{/* Footer */}
					<m.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6 }}
						className="mt-6 cursor-pointer text-center text-sm text-gray-500"
					>
						{isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
						<button
							type="button"
							onClick={() => setIsRegister((prev) => !prev)}
							className="text-primary-600 font-semibold hover:underline"
						>
							{isRegister ? "Masuk disini" : "Daftar sekarang"}
						</button>
					</m.p>
				</m.div>
			</div>

			<div className="pb-6 text-center text-xs text-gray-400 md:hidden">
				<p>© 2026 App Starter</p>
				<p className="mt-1">{APP_VERSION_LABEL}</p>
			</div>
		</div>
	);
}
