import { Inter, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-family",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  variable: "--font-grotesk-family",
});

export const tanker = localFont({
  src: "../fonts/tanker/Tanker-Regular.otf",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-tanker-family",
});

export const bespoke = localFont({
  src: [
    {
      path: "../fonts/bespokeSerif/BespokeSerif-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/bespokeSerif/BespokeSerif-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/bespokeSerif/BespokeSerif-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/bespokeSerif/BespokeSerif-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/bespokeSerif/BespokeSerif-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/bespokeSerif/BespokeSerif-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/bespokeSerif/BespokeSerif-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/bespokeSerif/BespokeSerif-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/bespokeSerif/BespokeSerif-Extrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/bespokeSerif/BespokeSerif-ExtraboldItalic.otf",
      weight: "800",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-bespoke-family",
  adjustFontFallback: "Times New Roman",
  preload: false,
});
