const model = Symbol();

class View {
  constructor(modelClass) {
    this[model] = model;
  }
  draw(data) {
    if (!(data instanceof this[model])) {
      throw new Error('');
    }
  }
}

export { View };
