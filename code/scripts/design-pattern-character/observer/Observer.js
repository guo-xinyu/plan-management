const handler = Symbol();
const id = Symbol();

class Observer {
  constructor(handler) {
    this[id] = Symbol();
    this[handler] = handler;
  }
  getId() {
    return this[id];
  }
  update(data) {
    this[handler](data);
  }
}

export { Observer };
