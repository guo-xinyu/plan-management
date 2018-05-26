import { Model } from './Model.js';
import { Observer } from '../observer/Observer.js';

const model = Symbol();
const observerIn = Symbol();
// const handleModelUpdate = Symbol();

class View {
  constructor(modelClass) {
    if (!(modelClass instanceof Model)) {
      throw new Error('View僅可關聯Model。');
    }
    this[model] = modelClass;
    this[observerIn] = [];
    // this[model].addObserver(this[handleModelUpdate].bind(this));
  }
  initObserverModelUpdate(handleModelUpdate) {
    let observerModelUpdate = new Observer(handleModelUpdate);
    this[observerIn].push(observerModelUpdate);
    this[model].addObserver(observerModelUpdate);
  }
  // [handleModelUpdate](data) {
  //   this.draw(data);
  // }
  // draw(data) {
  //   if (!(data instanceof this[model])) {
  //     throw new Error('');
  //   }
  // }
}

export { View };
