import { Observer } from '../observer/Observer.js';

const observers = Symbol();

class Controller {
  constructor() {
    this[observers] = [];
  }
  addObservers(toAddObservers) {
    const err = new Error('Model的觀察者僅可爲Observer的原型。');
    if (toAddObservers instanceof Array) {
      for (let toAddObserver of toAddObservers) {
        if (!(toAddObserver instanceof Observer)) {
          throw err;
        }
        this[observers].push(toAddObserver);
      }
      // } else if (toAddObservers instanceof Observer) {
      //   this[observers].push(toAddObservers);
      // } else {
      //   throw err;
    }
  }
}

export { Controller };
