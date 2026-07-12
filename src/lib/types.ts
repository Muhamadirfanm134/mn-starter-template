export interface Option {
	id: string;
	label: string;
	value?: string;
	icon?: string;
}

export interface OnChange {
	name: string;
	value: string;
}
