export enum StylePropertys {
  x = 'x',
  y = 'y',
  rotate = 'rotate',
  opacity = 'opacity',
  width = 'width',
  height = 'height',
  scale = 'scale'
}

export type IBaseStyle = {
  [key in StylePropertys]?: number
}

export type IBezierStyle = { per: number} & {
  [key in StylePropertys]?: number;
}

export type IAnimateOptions = {
  group: IAnimateOptionsItem[],
  reverseable?: boolean;
  infinite?: boolean;
  autoRotate?: boolean;
}

export type IAnimateOptionsItem = {
  points: IBaseStyle[],
  duration: number
}
