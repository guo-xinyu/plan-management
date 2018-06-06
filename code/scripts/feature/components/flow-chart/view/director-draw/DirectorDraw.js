// import { DecoratorCompositeDataViewData } from '../decorator/DecoratorCompositeDataViewData.js';
// import { IteratorBfsCompositeData } from '../iterator-composite-data/IteratorBfsCompositeData.js';
import { BuilderViewData } from '../builder-view-data/BuilderViewData.js';
import { CompositeData } from '../../model/composite-data/CompositeData.js';
import { BuilderView } from '../builder-view/BuilderView.js';
import { VisitorModelComposite } from '../visitor-model-composite/VisitorModelComposite.js';

const drawContext = Symbol();

class DirectorDraw {
  constructor(basePoint, ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D)) {
      throw new Error('應以CanvasRenderingContext2D的實例配置DirectorDraw。');
    }
    this[drawContext] = ctx;
    this._factoryView = new BuilderView(ctx);
    this._factoryViewData = new BuilderViewData(basePoint, this[drawContext]);
    this._state = {};
  }
  _draw(composite, referNode) {
    if (!(composite instanceof CompositeData)) {
      throw new Error('本導向器僅可根據CompositeData生成産品。');
    }
    let visitorModelComposite =
      new VisitorModelComposite(this._factoryViewData.buildViewData.bind(this._factoryViewData), referNode);
    const viewData = composite.accept(visitorModelComposite);
    this._factoryView.buildView(viewData);
    return viewData;
  }
  setBasePoint(basePoint) {
    this._factoryViewData.setBasePoint(basePoint);
  }
  setState(state) {
    this._state = state;
  }
  build(data) {
    if (!(data instanceof Array)) {
      throw new Error('本導向器僅可根據CompositeData的數組生成産品。');
    }
    return this._state.build(data, this._draw.bind(this));
  }
}

export { DirectorDraw };
