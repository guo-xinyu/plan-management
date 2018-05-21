const handler = Symbol();

class ObserverUtil {
  constructor(handler) {
    this[handler] = handler;
  }
  update(data) {
    this[handler](data);
  }
}

export { ObserverUtil };
