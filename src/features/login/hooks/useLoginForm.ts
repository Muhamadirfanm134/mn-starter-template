"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { type FormLoginType, loginSchema } from "../schema";

export default function useLoginForm() {
	const { login, loginWithGoogle, register, isLoading } = useAuth();

	const form = useForm<FormLoginType>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			fullname: "",
			email: "",
			password: "",
		},
	});

	const { handleSubmit } = form;

	const onSubmit = handleSubmit(async (data: FormLoginType) => {
		login({ email: data.email, password: data.password });
	});

	const onRegister = handleSubmit(async (data: FormLoginType) => {
		console.log(data);
		register({
			fullname: data.fullname ?? "",
			email: data.email,
			password: data.password,
		});
	});

	return {
		onSubmit,
		onRegister,
		onGoogleLogin: loginWithGoogle,
		form,
		loading: isLoading,
	};
}
