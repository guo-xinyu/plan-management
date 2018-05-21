import { ObserverUtil } from '../../../utils/ObserveUtil.js';

const observers = Symbol();

class FlowChartModel {
  constructor() {
    this[observers] = [];
  }
  addObserver(observer) {
    if (!(observer instanceof ObserverUtil)) {
      throw new Error('請向FlowChartModel的觀察者成員中添加ObserveUtil的實例。');
    }
    this[observers].push(observer);
  }
  publish() {

  }
}

export { FlowChartModel };
