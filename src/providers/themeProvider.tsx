/* eslint-disable  @typescript-eslint/no-explicit-any */

import type React from "react";
import { createContext, useContext, useEffect } from "react";

export type Theme = {
	colors: Record<string, Record<string, string>>;
};

const ThemeContext = createContext({});

export const ThemeProvider: React.FC<{
	children: React.ReactNode;
	themeData: Theme;
}> = ({ children, themeData }) => {
	useEffect(() => {
		if (themeData.colors) {
			Object.keys(themeData.colors).forEach((color) => {
				Object.keys(themeData.colors[color]).forEach((key) => {
					document.documentElement.style.setProperty(
						`--color-${color}-${key}`,
						themeData.colors[color][key],
					);
				});
			});
		}
	}, [themeData]);

	return (
		<ThemeContext.Provider value={themeData}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	return useContext(ThemeContext);
};
