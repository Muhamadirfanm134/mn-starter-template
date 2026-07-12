"use client";

import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export type CalendarProps = {
	selected?: Date;
	onSelect?: (date: Date) => void;
	className?: string;
};

export function Calendar({ selected, onSelect, className }: CalendarProps) {
	const [viewDate, setViewDate] = React.useState(dayjs(selected || new Date()));

	const daysInMonth = viewDate.daysInMonth();
	const firstDayOfMonth = viewDate.startOf("month").day(); // 0 (Sun) to 6 (Sat)

	// Adjusted for Monday start if needed, but keeping standard Sunday start for now
	const days = useMemo(() => {
		const arr = [];
		// Padding for empty days at the start
		for (let i = 0; i < firstDayOfMonth; i++) {
			arr.push(null);
		}
		// Days of the month
		for (let i = 1; i <= daysInMonth; i++) {
			arr.push(i);
		}
		return arr;
	}, [firstDayOfMonth, daysInMonth]);

	const prevMonth = () => setViewDate(viewDate.subtract(1, "month"));
	const nextMonth = () => setViewDate(viewDate.add(1, "month"));

	const isSelected = (day: number) => {
		if (!selected) return false;
		return dayjs(selected).isSame(viewDate.date(day), "day");
	};

	const isToday = (day: number) => {
		return dayjs().isSame(viewDate.date(day), "day");
	};

	return (
		<div className={cn("mx-auto w-full max-w-[320px] bg-white p-3", className)}>
			<div className="mb-4 flex items-center justify-between">
				<div className="text-sm font-bold text-gray-800">
					{viewDate.format("MMMM YYYY")}
				</div>
				<div className="flex gap-1">
					<button
						type="button"
						onClick={prevMonth}
						className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
					>
						<ChevronLeft size={18} />
					</button>
					<button
						type="button"
						onClick={nextMonth}
						className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
					>
						<ChevronRight size={18} />
					</button>
				</div>
			</div>

			<div className="mb-2 grid grid-cols-7 gap-1 text-center">
				{["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
					<div
						key={d}
						className="text-[10px] font-bold text-gray-400 uppercase"
					>
						{d}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-1">
				{days.map((day, i) => (
					<div
						key={day !== null ? viewDate.date(day).toISOString() : `empty-${i}`}
						className="flex aspect-square items-center justify-center"
					>
						{day !== null ? (
							<button
								type="button"
								onClick={() => onSelect?.(viewDate.date(day).toDate())}
								className={cn(
									"flex h-full w-full items-center justify-center rounded-xl text-sm font-medium transition-all",
									isSelected(day)
										? "bg-primary-600 text-white shadow-md"
										: isToday(day)
											? "bg-primary-50 text-primary-600"
											: "text-gray-700 hover:bg-gray-50",
								)}
							>
								{day}
							</button>
						) : null}
					</div>
				))}
			</div>
		</div>
	);
}
