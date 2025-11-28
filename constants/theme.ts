import { Platform } from "react-native";

const tintColorLight = "#6366F1";
const tintColorDark = "#818CF8";

export const Colors = {
  light: {
    text: "#0F172A",
    textSecondary: "#64748B",
    background: "#F8FAFC",
    cardBackground: "#FFFFFF",
    tint: tintColorLight,
    icon: "#94A3B8",
    border: "#E2E8F0",
    primary: "#6366F1",
    primaryLight: "#EEF2FF",
    primaryDark: "#4F46E5",
    secondary: "#8B5CF6",
    danger: "#EF4444",
    success: "#10B981",
    successLight: "#D1FAE5",
    warning: "#F59E0B",
    accent: "#EC4899",
  },
  dark: {
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    background: "#0F172A",
    cardBackground: "#1E293B",
    tint: tintColorDark,
    icon: "#94A3B8",
    border: "#334155",
    primary: "#818CF8",
    primaryLight: "#312E81",
    primaryDark: "#6366F1",
    secondary: "#A78BFA",
    danger: "#F87171",
    success: "#34D399",
    successLight: "#064E3B",
    warning: "#FBBF24",
    accent: "#F472B6",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
