import BezierJs from 'bezier-js';
import requestAnimationFrame from 'raf';
const _RAD2DEG = 180 / Math.PI;
export interface IBezierOptions {
  group: IOptionItem[],
  reverseable?: boolean;
  infinite?: boolean;
}

type IOptionItem = {
  points: {
    x: number;
    y: number;
  }[],
  duration: number
}

type IBezierItem = {
  bezier: BezierJs,
  duration: number
}

type outPoint = { x: number, y: number, rotate: number }

export type IBezierEventType = 'onChange' | 'onEnd';

interface IStatusChangeHandler {
  'onChange'?: (style: outPoint) => any;
  'onEnd'?: (style: outPoint) => any;
}

export class Bezier {
  private currentTime = 0;
  private reverseable = false;
  private infinite = false;
  private paused = true;
  private perFrame = Math.round(1000 / 60);
  private bezierId: number = 0;
  private intervalTimer: number = 0;
  private currentBezier: IBezierItem | null;
  private handler: IStatusChangeHandler = {};
  private bezierGroup: IBezierItem[];
  private frameDataList: outPoint[] = []

  constructor(options: IBezierOptions) {
    this.reverseable = !!options.reverseable;
    this.infinite = !!options.infinite;
    this.bezierGroup = options.group.map(bezier => {
      if (bezier.points.length < 3) {
        throw new Error('bezier.points 至少要三个')
      }

      return {
        bezier: new BezierJs(
          bezier.points.map(item => {
            return {
              x: item.x,
              y: item.y
            }
          })
        ),
        duration: bezier.duration * 1000
      }
    });

    this.currentBezier = this.getNextBezierItem();
  }

  public run() {
    this.paused = false;
    this.play();
  }

  getNextBezierItem() {
    this.currentTime = 0;
    this.bezierId += 1;
    if (this.bezierId <= this.bezierGroup.length) {
      return this.bezierGroup[this.bezierId - 1]
    }
    return null;
  }

  getFrame(bezier: BezierJs, t: number): outPoint {
    const step = bezier.get(t);
    const step2 = bezier.derivative(t);
    return {
      x: step.x,
      y: step.y,
      rotate: getAngle(0, 0, step2.x, step2.y) || 0
    }
  }

  play() {
    const handler = () => {
      if (this.paused) {
        return;
      }

      if (!this.currentBezier) {
        return;
      }

      const temp = (this.currentTime / this.currentBezier.duration);
      const t = temp > 1 ? 1 : temp;
      this.currentTime += this.perFrame;
      const data = this.getFrame(this.currentBezier.bezier, t);
      this.frameDataList.push(data);
      const onChangeHandle = this.handler['onChange'];
      onChangeHandle && onChangeHandle(data);
      this.intervalTimer = requestAnimationFrame(handler);
      if (temp > 1) {
        this.currentBezier = this.getNextBezierItem();
        if (!this.currentBezier) {
          this.destroy();

          if (this.reverseable) {
            this.reserve();
          } else {
            if (this.infinite) {
              this.replay();
              return;
            }
            const onEndHandle = this.handler['onEnd'];
            onEndHandle && onEndHandle(data);
          }
          
        }
      }
    }
    handler()
  }

  reserve() {
    const handler = () => {
    const frameData = this.frameDataList.pop();
    const onChangeHandle = this.handler['onChange'];
    onChangeHandle && onChangeHandle(frameData!);
    this.intervalTimer = requestAnimationFrame(handler);
     if (!this.frameDataList.length) {
      this.destroy();

      if (this.infinite) {
        this.replay();
        return;
      }

      const onEndHandle = this.handler['onEnd'];
      onEndHandle && onEndHandle(frameData!);
     }
    }
    handler()
  }
  
  replay() {
    this.reset();
    this.run();
  }

  reset() {
    this.stop();
    this.destroy();
    this.currentTime = 0;
    this.bezierId = 0;
    this.currentBezier = this.getNextBezierItem();
  }


  stop() {
    this.paused = true;
  }

  destroy() {
    requestAnimationFrame.cancel(this.intervalTimer);
  }

  public on<T extends IBezierEventType>(event: T, fn: IStatusChangeHandler[IBezierEventType]) {
    this.handler[event] = fn;
  }

  public off<T extends IBezierEventType>(event: T) {
    delete this.handler[event];
  }

}

function getAngle(x1: number, y1: number, x2: number, y2: number) {

  return Math.atan2(y2 - y1, x2 - x1) * _RAD2DEG;

}

