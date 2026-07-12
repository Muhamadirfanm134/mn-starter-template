import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<nav className="mt-6 flex items-center justify-center space-x-2">
			<button
				type="button"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="cursor-pointer text-(--color-primary-500) disabled:opacity-20"
			>
				<ChevronLeftIcon className="h-6 w-6" />
			</button>

			{pages.map((page) => (
				<button
					type="button"
					key={page}
					onClick={() => onPageChange(page)}
					className={`cursor-pointer rounded-full px-3 py-1 ${
						page === currentPage
							? "bg-(--color-primary-500) text-white"
							: "text-(--color-grey-500) hover:bg-(--color-primary-100)"
					}`}
				>
					{page}
				</button>
			))}

			<button
				type="button"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="cursor-pointer text-(--color-primary-500) disabled:opacity-20"
			>
				<ChevronRightIcon className="h-6 w-6" />
			</button>
		</nav>
	);
}
