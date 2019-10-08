import { tweenFunctions } from './tween-functions';

import requestAnimationFrame from 'raf';
import { getAngle } from './utils';

export interface ITweenOptions {
  group: ITweenOption[],
  reverseable?: boolean;
  infinite?: boolean;
  type?: TweenType;
}

type TweenType = keyof typeof tweenFunctions;

type ITweenOption = {
  points: {
    x: number;
    y: number;
  }[],
  duration: number
}

type ITweenItem = {
  start: {
    x: number,
    y: number
  },
  end: {
    x: number,
    y: number
  },
  duration: number;
}

type outPoint = { x: number, y: number, rotate: number }

export type ITweenEventType = 'onChange' | 'onEnd';

interface IStatusChangeHandler {
  'onChange'?: (style: outPoint) => any;
  'onEnd'?: (style: outPoint) => any;
}

export class Tween {
  private currentTime = 0;
  private reverseable = false;
  private infinite = false;
  private paused = true;
  private perFrame = Math.round(1000 / 60);
  private bezierId: number = 0;
  private easeType: TweenType = 'easeInOutBack';
  private intervalTimer: number = 0;
  private currentTween: ITweenItem | null;
  private handler: IStatusChangeHandler = {};
  private tweenGroup: ITweenItem[] = [];
  private frameDataList: outPoint[] = []

  constructor(options: ITweenOptions) {
    this.reverseable = !!options.reverseable;
    this.infinite = !!options.infinite;

    if (options.type) {
      this.easeType = options.type;
    }

    options.group.forEach((item=> {
      const duration = item.duration / (item.points.length - 1) * 1000;
      if (item.points.length < 2) {
        throw new Error('tween.points 至少要2个')
      }

      let length = item.points.length;
      let index = 0
      while(index <= length -2) {
        let points = item.points.slice(index, index+2);
        this.tweenGroup.push({
          start: {
            x: points[0].x,
            y: points[0].y,
          },
          end: {
            x: points[1].x,
            y: points[1].y,
          },
          duration
        });
        index++;
      }
    }))
    this.currentTween = this.getNextTweenItem();
  }

  public run() {
    this.paused = false;
    this.play();
  }

  getNextTweenItem() {
    this.currentTime = 0;
    this.bezierId += 1;
    if (this.bezierId <= this.tweenGroup.length) {
      return this.tweenGroup[this.bezierId - 1]
    }
    return null;
  }

  getFrame(t: number, currentTween: ITweenItem, type: TweenType, ): outPoint {
    return {
      x: tweenFunctions[type](t, currentTween.start.x, currentTween.end.x, currentTween.duration, 0),
      y: tweenFunctions[type](t, currentTween.start.y, currentTween.end.y, currentTween.duration, 0),
      rotate: getAngle(currentTween.start.x,currentTween.start.y, currentTween.end.x, currentTween.end.y) || 0
    }
  }

  play() {
    const handler = () => {
      if (this.paused) {
        return;
      }

      if (!this.currentTween) {
        return;
      }

      const temp = (this.currentTime / this.currentTween.duration);
      this.currentTime += this.perFrame;
      const data = this.getFrame(this.currentTime, this.currentTween, this.easeType);
      this.frameDataList.push(data);
      const onChangeHandle = this.handler['onChange'];
      onChangeHandle && onChangeHandle(data);
      this.intervalTimer = requestAnimationFrame(handler);
      if (temp > 1) {
        this.currentTween = this.getNextTweenItem();
        if (!this.currentTween) {
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
    this.currentTween = this.getNextTweenItem();
  }


  stop() {
    this.paused = true;
  }

  destroy() {
    requestAnimationFrame.cancel(this.intervalTimer);
  }

  public on<T extends ITweenEventType>(event: T, fn: IStatusChangeHandler[ITweenEventType]) {
    this.handler[event] = fn;
  }

  public off<T extends ITweenEventType>(event: T) {
    delete this.handler[event];
  }

}
