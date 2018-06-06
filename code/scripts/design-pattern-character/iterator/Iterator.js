const data = Symbol();

class Iterator {
  constructor(oData) {
    this[data] = oData;
  }
  getData() {
    return this[data];
  }
}

export { Iterator };
