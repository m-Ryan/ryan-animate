import BezierJs from 'bezier-js';
import { StylePropertys, IBaseStyle, IAnimateOptions } from './type';
import { animateQueue } from './animate-queue';
// import { getAngle } from './utils';

type IBezierItem = {
  bezier: {
    [key in StylePropertys]?: BezierJs
  },
  duration: number
}

type CallBackFn = (style: IBaseStyle) => any


interface IStatusChangeHandler {
  'onChange': CallBackFn[];
  'onEnd':  CallBackFn[];
}

export type IBezierEventType = 'onChange' | 'onEnd';

export class Bezier {
  private currentTime = 0;
  private reverseable = false;
  private infinite = false;
  private autoRotate = false;
  private paused = true;
  private perFrame = Math.round(1000 / 60);
  private bezierId: number = 0;
  private intervalTimer: number = 0;
  private currentBezier: IBezierItem | null;
  private handler: IStatusChangeHandler = {
    onChange: [],
    onEnd: []
  };
  private bezierGroup: IBezierItem[];
  private frameDataList: IBaseStyle[] = []

  constructor(options: IAnimateOptions) {
    this.reverseable = !!options.reverseable;
    this.infinite = !!options.infinite;
    this.autoRotate = !!options.autoRotate;
    this.bezierGroup = options.group.map(bezierItem => {
      if (bezierItem.points.length < 3) {
        throw new Error('bezier.points 至少要三个')
      }

      let bezier: IBezierItem['bezier'] = {}
      for(let property in bezierItem.points[0]) {
        bezier[property] = new BezierJs(bezierItem.points.map(item=> ({
          x: 0,
          y: item[property]
        })))
      }

      if (this.autoRotate) {
        bezier['rotate'] = new BezierJs(bezierItem.points.map(item=> {
          if (item.x === undefined || item.y === undefined) {
            throw new Error('autoRotate下，每个point都要提供x，y');
          }
          return {
            x: item.x,
            y: item.y
          }
        }))
      }

      return {
        bezier: bezier,
        duration: bezierItem.duration * 1000
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

  getFrame(bezier: IBezierItem['bezier'], t: number): IBaseStyle {
    const frameData: IBaseStyle = {};
    for(let property in bezier) {
      frameData[property] = bezier[property].get(t).y;
    }
    return frameData;
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
      // callback data
      this.handler['onChange'].forEach(fn=>fn(data));
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

            this.handler['onEnd'].forEach(fn=>fn(data));
          }
          
        }
      }
    }
    this.intervalTimer = animateQueue.add(handler);
  }

  reserve() {
    const handler = () => {
    const frameData = this.frameDataList.pop();
    if (frameData) {
      this.handler['onChange'].forEach(fn=>fn(frameData));
    }
     if (!this.frameDataList.length) {
      this.destroy();

      if (this.infinite) {
        this.replay();
        return;
      }

      if (frameData) {
        this.handler['onEnd'].forEach(fn=>fn(frameData));
      }
     }
    }
    this.intervalTimer = animateQueue.add(handler);
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
    animateQueue.remove(this.intervalTimer);
  }

  public on<T extends IBezierEventType>(event: T, fn: CallBackFn) {
    this.handler[event].push(fn);
  }

  public off<T extends IBezierEventType>(event: T, fn: CallBackFn) {
    this.handler[event] = this.handler[event].filter((item=> item !== fn))
  }

}
