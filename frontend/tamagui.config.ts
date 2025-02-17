import {createTamagui} from "tamagui";
import {createInterFont} from "@tamagui/font-inter";
import {shorthands} from "@tamagui/shorthands";
import {themes, tokens} from "@tamagui/themes";
import {createAnimations} from "@tamagui/animations-react-native";

const animations = createAnimations({
  bouncy: {
    type: "spring",
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: "spring",
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
});

const headingFont = createInterFont({
  size: {
    6: 15,
    7: 18,
    8: 22,
    9: 28,
    10: 36,
  },
  transform: {
    6: "uppercase",
    7: "none",
  },
  weight: {
    6: "400",
    7: "700",
  },
  color: {
    6: "$colorFocus",
    7: "$color",
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: -1,
    9: -2,
    10: -3,
    12: -4,
    14: -5,
    15: -6,
  },
  face: {
    700: {normal: "InterBold"},
  },
});

const bodyFont = createInterFont(
  {
    face: {
      700: {normal: "InterBold"},
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
  }
);

export const config = createTamagui({
  defaultFont: "body",
  animations: animations as any,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes,
  tokens,
  shorthands,
});
