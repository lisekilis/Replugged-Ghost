import { settings } from "replugged";

interface Settings {
  silence?: boolean;
}

const defaultSettings = {
  silence: false,
} satisfies Partial<Settings>;

export const cfg = await settings.init<Settings, keyof typeof defaultSettings>(
  "dev.lisekilis.RepluggedGhost",
  defaultSettings,
);
