import { View } from '../../../../design-pattern-character/model-view-controller/View.js';
import { ModelFlowChart } from '../model/ModelFlowChart.js';
// import { DecoratorCompositeDataViewData } from './decorator/DecoratorCompositeDataViewData.js';
// import { IteratorPreOrderCompositeData } from './iterator-composite-data/IteratorPreOrderCompositeData.js';
import { DirectorDraw } from './director-draw/DirectorDraw.js';
// import { DecoratorCanvasRenderingContext2D } from './decorator/DecoratorCanvasRenderingContext2D.js';

// const handleModelUpdate = Symbol();
// const drawDirector = Symbol();
const drawContext = Symbol();
const themeColor = '#8c8c8c';

class ViewFlowChart extends View {
  constructor(flowChartModel, ctx) {
    if (!(flowChartModel instanceof ModelFlowChart)) {
      throw new Error('ViewFlowChart僅可爲ModelFlowChart的視圖。');
    }
    super(flowChartModel, themeColor);
    super.initObserverModelUpdate(this._handleModelUpdate.bind(this));
    this._basePoint = [5, 5];
    // this[drawDirector] = new DrawDirector();
    this[drawContext] = ctx;
    // console.log(this[drawContext]);
    // this[modelClass] = flowChartModel;
  }
  _handleModelUpdate(data) {
    if (!(data instanceof Array)) {
      throw new Error('請輸入DecoratorCompositeDataViewData的數組。');
    }
    this.draw(data);
  }
  transform(origin) {
    if (!(origin instanceof Array) || origin.length !== 2) {
      throw new Error('請以一個長度爲二的數組變换原點。');
    }
  }
  draw(data) {
    const director = new DirectorDraw(this._basePoint, this[drawContext]);
    director.build(data);
    // let iteratorPreOrderCompositeData = new IteratorPreOrderCompositeData(data);
    // for (let composite of iteratorPreOrderCompositeData) {
    //   this[drawDirector](composite);
    // }
  }
}

export { ViewFlowChart };
