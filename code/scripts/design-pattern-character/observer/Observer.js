const handler = Symbol();
const id = Symbol();

class Observer {
  constructor(oHandler) {
    this[id] = Symbol();
    this[handler] = oHandler;
  }
  getId() {
    return this[id];
  }
  update(data) {
    this[handler](data);
  }
}

export { Observer };
