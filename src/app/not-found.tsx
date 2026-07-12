import Button from "@/components/(design-systems)/button/Button";

export default function NotFound() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center">
			{/* 404 Message */}
			<h1 className="mb-4 text-8xl font-bold text-(--color-primary-500)">
				404
			</h1>
			<p className="text-md mb-6 px-6 text-center text-gray-500">
				Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.
			</p>

			<Button variant="primary" href="/">
				Kembali ke Beranda
			</Button>
		</main>
	);
}
