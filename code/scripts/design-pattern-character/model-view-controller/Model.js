import { Observer } from '../observer/Observer.js';

const observers = Symbol();
const data = Symbol();
// const publish = Symbol();

class Model {
  constructor(oData) {
    this[data] = oData;
    this[observers] = [];
  }
  addObserver(toAddObserver) {
    // if (!(toAddObservers instanceof Array)) {
    //   throw new Error('Model.addObservers僅可接受Observer的數組。');
    // }

    const err = new Error('Model的觀察者僅可爲Observer的原型。');
    // for (let toAddObserver of toAddObservers) {
    if (!(toAddObserver instanceof Observer)) {
      throw err;
    }
    this[observers].push(toAddObserver);
    // }
    // } else if (toAddObservers instanceof Observer) {
    //   this[observers].push(toAddObservers);
    // } else {
    //   throw err;
  }
  removeObserver() {

  }
  updateData(uData) {
    this[data] = uData;
    this.publish(this[data]);
  }
  publish() {
    for (let observser of this[observers]) {
      observser.update(this[data]);
    }
  }
}

export { Model };
