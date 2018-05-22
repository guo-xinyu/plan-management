const handler = Symbol();

class Observer {
  constructor(handler) {
    this[handler] = handler;
  }
  update(data) {
    this[handler](data);
  }
}

export { Observer };
