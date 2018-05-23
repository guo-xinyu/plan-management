const model = Symbol();
const observers = Symbol();

class View {
  constructor(modelClass) {
    this[model] = model;
  }
  getObservers() {
    return this[observers];
  }
  draw(data) {
    if (!(data instanceof this[model])) {
      throw new Error('');
    }
  }
}

export { View };
