import {
	HomeIcon as HomeOutline,
	Cog6ToothIcon as SettingsOutline,
} from "@heroicons/react/24/outline";

import {
	HomeIcon as HomeSolid,
	Cog6ToothIcon as SettingsSolid,
} from "@heroicons/react/24/solid";

import type { ComponentType, SVGProps } from "react";

type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

type NavItem = {
	label: string;
	href: string;
	icon: {
		outline: HeroIcon;
		solid: HeroIcon;
	};
	isMain?: boolean;
};

export const navItems: NavItem[] = [
	{
		label: "Home",
		href: "/home",
		icon: { outline: HomeOutline, solid: HomeSolid },
	},
	{
		label: "Settings",
		href: "/settings",
		icon: { outline: SettingsOutline, solid: SettingsSolid },
	},
];
