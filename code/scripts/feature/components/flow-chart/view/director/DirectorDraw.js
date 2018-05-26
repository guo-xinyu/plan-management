import { DecoratorCanvasRenderingContext2D } from '../decorator/DecoratorCanvasRenderingContext2D.js';
import { DecoratorCompositeDataViewData } from '../decorator/DecoratorCompositeDataViewData.js';

const drawContext = Symbol();
// const compositeData = Symbol();

class DirectorDraw {
  constructor(ctx) {
    if (!(ctx instanceof DecoratorCanvasRenderingContext2D)) {
      throw new Error('應以DecoratorCanvasRenderingContext2D的實例配置DirectorDraw。');
    }
    this[drawContext] = ctx;
  }
  build(data) {
    if (!(data instanceof DecoratorCompositeDataViewData)) {
      throw new Error('本導向器僅可根據DecoratorCompositeDataViewData生成産品。');
    }
  }
}

export { DirectorDraw };
