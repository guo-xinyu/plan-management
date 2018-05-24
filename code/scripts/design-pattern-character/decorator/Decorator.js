class Decorator {
  constructor(pro) {
    Object.assign(this, pro);
    return Reflect.setPrototypeOf(Reflect.getPrototypeOf(this), Reflect.getPrototypeOf(pro));
  }
}

export { Decorator };
