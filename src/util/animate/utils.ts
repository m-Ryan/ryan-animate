const _RAD2DEG = 180 / Math.PI;

export function getAngle(x1: number, y1: number, x2: number, y2: number) {
  return Math.atan2(y2 - y1, x2 - x1) * _RAD2DEG;

}

export function getNow () {
  return new Date().getTime();
}