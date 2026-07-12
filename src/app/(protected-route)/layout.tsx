import ProtectedRoute from "@/features/auth/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
	return <ProtectedRoute>{children}</ProtectedRoute>;
}
