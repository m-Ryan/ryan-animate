import { tweenFunctions } from './tween-functions';
import Bezier from 'bezier-js';
import requestAnimationFrame from 'raf';
const getTime = Date.now || (() => new Date().getTime());
// tweenFunction.tweenName(currentTime, beginValue, endValue, totalDuration)
export interface ITweenOptions {
  styles: ITweenStyle[],
  duration: number;
  type?: TweenType;
}

type ITweenStyle = {
  x?: number;
  y?: number;
  opacity?: number;
  rotate?: number;
  width?: number;
  height?: number;
  per: number; // 0-1
}

export type TweenType = 'bezier' | keyof typeof tweenFunctions;

export type ITweenEventType = 'onChange' | 'onUpdate';

interface IStatusChangeHandler {
  'onChange'?: (style: Omit<ITweenStyle, 'per'>) => any;
  'onUpdate'?: (style: Omit<ITweenStyle, 'per'>) => any;
  'onEnd'?: (style: Omit<ITweenStyle, 'per'>) => any;
}

const defaultStyle = {
  x: 0,
  y: 0,
  opacity: 1,
  per: 0,
  rotate: 0
}

export class Tween {
  totalTime = 0; // 总时间
  styleCurrentTime = 0; // 每一个style的当前时间 
  toNextTime = 0; // nextStyle - prevStyle 的时间
  nextStyleId = -1; // nextStyle - prevStyle 的时间
  currentTime = 0;
  startTime = 0;
  perFrame = Math.round(1000 / 60);
  styles: ITweenStyle[] = [];
  prevStyle: ITweenStyle = defaultStyle;
  nextStyle: ITweenStyle = defaultStyle;
  intervalTimer: number = 0;
  easeType: TweenType = 'easeInBounce';
  Bezier: Bezier;
  private handler: IStatusChangeHandler = {};

  constructor(options: ITweenOptions) {

    options.type && (this.easeType = options.type);
    this.styles = options.styles;
    this.totalTime = options.duration * 1000;

    if (options.styles.length === 0) {
      throw new Error('styles不能为空');
    }

    if (options.type === 'bezier') {
      if (this.styles.length <= 1) {
        throw new Error('bezier 至少需要两个参数');
      }
    }

    this.Bezier = new Bezier(
      options.styles.map((item=> ({
        x: item.x!,
        y: item.y! 
      })))
    )

    this.goNextStyle();
  }

  public run() {
    this.startTime = getTime();
    this.raf();
  }

  getFrame(): Omit<ITweenStyle, 'per'> {
    const t = (this.currentTime / this.totalTime);
    const frameTime = t > 1 ? 1 : t;
    let x = this.getComputedKeyStyle('x');
    let y = this.getComputedKeyStyle('y');
    let rotate = 0;
    if (this.easeType === 'bezier') {
      const step = this.Bezier.get(frameTime);
      // console.log(step)
      x = step.x;
      y = step.y;
      rotate = getAngle(0, 0, x, y);
      console.log(rotate)
      if (!rotate) {
        rotate = 0;
      }
    }
    

    let opacity = this.getComputedKeyStyle('opacity');
    let width = this.getComputedKeyStyle('width');
    let height = this.getComputedKeyStyle('height');
    return {
      x,
      y,
      opacity,
      width,
      rotate,
      height
    }
  }

  getComputedKeyStyle(key: keyof Partial<ITweenStyle>) {
    const preKey = this.prevStyle[key];
    const nextKey = this.nextStyle[key];
    return tweenFunctions.easeInQuad(this.styleCurrentTime, preKey || 0, nextKey|| 0, this.toNextTime);
  }

  goNextStyle() {
    this.styleCurrentTime = 0;
    this.nextStyleId +=1;
    this.prevStyle = this.styles[this.nextStyleId - 1] || this.prevStyle;
    this.nextStyle = this.styles[this.nextStyleId];
    this.toNextTime = this.totalTime * (this.nextStyle.per - this.prevStyle.per);
  }

  raf() {
    const handler = () => {
      this.currentTime = getTime() - this.startTime;
      if (this.styleCurrentTime > this.toNextTime) {
        if (this.nextStyleId === this.styles.length - 1) {
          this.destroy();
          const onEndHandle = this.handler['onEnd'];
          onEndHandle && onEndHandle(this.getFrame());
          return;
        } else {
          this.goNextStyle();
        }
      }
      this.styleCurrentTime += this.perFrame;
      const onChangeHandle = this.handler['onChange'];
      onChangeHandle && onChangeHandle(this.getFrame());
      this.intervalTimer = requestAnimationFrame(handler);
    }
    handler()
  }


  // raf() {
  //   const rafTimer = new Raf(() => {
  //     this.currentTime += this.perFrame;
  //     this.styleCurrentTime += this.perFrame;
  //     if (this.styleCurrentTime >= this.toNextTime) {
  //       if (this.nextStyleId === this.styles.length - 1) {
  //         rafTimer.cancel();
  //         const onEndHandle = this.handler['onEnd'];
  //         onEndHandle && onEndHandle(this.getFrame());
  //         return;
  //       } else {
  //         this.goNextStyle();
  //       }
  //     }

  //     const onChangeHandle = this.handler['onChange'];
  //     onChangeHandle && onChangeHandle(this.getFrame());

  //   }, this.perFrame);
  // }


  destroy() {
    this.intervalTimer && clearInterval(this.intervalTimer);
  }

  public on<T extends ITweenEventType>(event: T, fn: IStatusChangeHandler[ITweenEventType]) {
    this.handler[event] = fn;
  }

  public off<T extends ITweenEventType>(event: T) {
    delete this.handler[event];
  }

}

function getAngle(cx: number,cy: number,x2: number,y2: number){//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
  var x = Math.abs(cx - x2);
  var y = Math.abs(cy - y2);
  var tan = x / y;
  var radina = Math.atan(tan);//用反三角函数求弧度
  var angle = Math.floor(180 / (Math.PI / radina)) || 0;//将弧度转换成角度
  if (x2 > cx && y2 > cy) {// point在第四象限
      angle = (-1) * angle;
  }
  if (x2 === cx && y2 > cy) {// point在y轴负方向上
      angle = 0;
  }
  if (x2 < cx && y2 > cy) {//point在第三象限
      
  }
  if (x2 < cx && y2 === cy) {//point在x轴负方向
      angle = 90;
  }
  if (x2 < cx && y2 < cy) {// point在第二象限

      angle = 180 - angle;
  }
  if (x2 === cx && y2 < cy) {//point在y轴正方向上
      angle = 180;
  }
  if (x2 > cx && y2 < cy) {//point在第一象限               
      angle = 180 + angle;
  }

  if (x2 > cx && y2 === cy) {//point在x轴正方向上
      angle = -90;
  }

  return angle;
}