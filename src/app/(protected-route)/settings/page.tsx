"use client";

import Button from "@/components/(design-systems)/button/Button";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
	const { user, logout } = useAuth();

	return (
		<main className="flex flex-col gap-4">
			<h1 className="text-h4 font-bold text-(--color-primary-500)">Settings</h1>
			<p className="text-body2 text-gray-500">{user?.email}</p>
			<div>
				<Button variant="primary" onClick={() => logout()}>
					Logout
				</Button>
			</div>
		</main>
	);
}
