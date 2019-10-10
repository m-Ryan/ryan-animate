import { tweenFunctions } from './tween-functions';
import { getAngle } from './utils';
import { IBaseStyle, IAnimateOptions } from './type';
import { animateQueue } from './animate-queue';

export interface ITweenOptions extends IAnimateOptions {
  type?: TweenType;
}

type TweenType = keyof typeof tweenFunctions;

type ITweenItem = {
  start: IBaseStyle,
  end: IBaseStyle,
  duration: number;
}

type CallBackFn = (style: IBaseStyle) => any

export type ITweenEventType = 'onChange' | 'onEnd';

interface IStatusChangeHandler {
  'onChange': CallBackFn[];
  'onEnd':  CallBackFn[];
}

export class Tween {
  private currentTime = 0;
  private reverseable = false;
  private infinite = false;
  private autoRotate = false;
  private paused = true;
  private perFrame = Math.round(1000 / 60);
  private bezierId: number = 0;
  private easeType: TweenType = 'easeInOutBack';
  private intervalTimer: number = 0;
  private currentTween: ITweenItem | null;
  private handler: IStatusChangeHandler = {
    onChange: [],
    onEnd: []
  };
  private tweenGroup: ITweenItem[] = [];
  private frameDataList: IBaseStyle[] = []

  constructor(options: ITweenOptions) {
    this.reverseable = !!options.reverseable;
    this.infinite = !!options.infinite;
    this.autoRotate = !!options.autoRotate;

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
          start: points[0],
          end: points[1],
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

  getFrame(t: number, currentTween: ITweenItem, type: TweenType, ): IBaseStyle {
    const start = currentTween.start;
    const end = currentTween.end;
    const duration = currentTween.duration;
    let frameData: IBaseStyle = {}

    for(let property in start) {
      if (start[property] !== undefined && end[property] !== undefined) {
        frameData[property]= tweenFunctions[type](t, start[property], end[property], duration, 0);
      }
    }

    if (this.autoRotate && (start.x !== undefined) && (end.x !== undefined) && (start.y !== undefined) && (end.y !== undefined)) {
      frameData.rotate = getAngle(start.x,start.y, end.x, end.y) || 0
    }
    return frameData;
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

      // callback data
      this.handler['onChange'].forEach(fn=>fn(data));
      
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
            this.handler['onEnd'].forEach(fn=>fn(data));;
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
        this.handler['onEnd'].forEach(fn=>fn(frameData));;
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
    this.currentTween = this.getNextTweenItem();
  }


  stop() {
    this.paused = true;
  }

  destroy() {
    animateQueue.remove(this.intervalTimer);
  }

  public on<T extends ITweenEventType>(event: T, fn: CallBackFn) {
    this.handler[event].push(fn);
  }

  public off<T extends ITweenEventType>(event: T, fn: CallBackFn) {
    this.handler[event] = this.handler[event].filter((item=> item !== fn))
  }
}
