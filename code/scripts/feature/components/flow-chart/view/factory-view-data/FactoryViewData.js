class FactoryViewData {
  produceViewData(name, path) {
    if (typeof name !== 'string') {
      throw new Error('FactoryViewData的name原料僅可爲字符串。');
    }
    if (!(path instanceof Path2D)) {
      throw new Error('FactoryViewData的path原料僅可爲Path2D。');
    }
    let color = '';
    return { name, path, color };
  }
}

export { FactoryViewData };
