import { getNow } from "./utils";

const perFrameTime = 1000 / 60;
let queueId = 0;
type QueueItem = {
  fn: Function;
  id: number
}

class AnimateQueue {
  private preTime: number = 0;
  private queue: QueueItem[] = [];
  private queueTimer: any;

  constructor() {
    this.run();
  }

  add(fn: Function) {
    const qId = queueId++;
    this.queue.push({
      id: qId,
      fn: ()=>fn()
    });
    return qId;
  }

  remove(id: number) {
    this.queue = this.queue.filter((item=>item.id !== id));
  }

  destory() {
    this.queueTimer && clearTimeout(this.queueTimer);
  }

  run() {
    this.preTime = getNow();

    const handle = ()=> {
      
      // 执行队列
      this.queue.map(queueItem=> {
        queueItem.fn();
      });

      // 计算下次执行的时间
      const now = getNow();
      const nextTime = now - this.preTime > perFrameTime ? 0: now - this.preTime;
      this.preTime = now;
      this.queueTimer = setTimeout(() => {
        handle()
      }, nextTime);

    }

    handle();
  }
}

export const animateQueue = new AnimateQueue()