export enum StylePropertys {
  x = 'x',
  y = 'y',
  rotate = 'rotate',
  per = 'per',
}

export type IStyle = {
  [key in StylePropertys]?: number
}

export type IAnimateOptions = {
  group: IAnimateOptionsItem[],
  reverseable?: boolean;
  infinite?: boolean;
  autoRotate?: boolean;
}

export type IAnimateOptionsItem = {
  points: IStyle[],
  duration: number
}