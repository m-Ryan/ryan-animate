import { Bezier } from "./Bezier";
import BezierJs from 'bezier-js';

export interface ISvgOptions {
  path: string;
  duration: number;
  reverseable?: boolean;
  infinite?: boolean;
  autoRotate?: boolean;
}
export function SvgPath(options: ISvgOptions): InstanceType<typeof Bezier> {
  const pointsGroup = (BezierJs as any).SVGtoBeziers(options.path).curves as [];
  const duration = options.duration / pointsGroup.length;
  return new Bezier({
    ...options,
    group: pointsGroup.map((item: any)=>item.points).map((item: any)=> ({
      points: item,
      duration: duration,
    })),
  })
}