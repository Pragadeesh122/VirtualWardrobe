import type {SkPath, Canvas, Paint} from "@shopify/react-native-skia";

export interface StatsData {
  clothingTypes: Record<string, number>;
  collections: Record<string, number>;
  monthlyUsage: Record<string, number>;
}

export interface ChartPath {
  path: string;
  percentage: number;
  label: string;
}

export interface DrawCommand {
  drawPath: (path: SkPath, paint: typeof Paint) => void;
}

export interface CanvasDrawProps {
  canvas: typeof Canvas;
  drawCommand: DrawCommand;
}
