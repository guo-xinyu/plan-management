import { View } from '../../../../design-pattern-character/model-view-controller/View.js';
import { ModelFlowChart } from '../model/ModelFlowChart.js';
import { CompositeDataViewDataDecorator } from './decorator/CompositeDataViewDataDecorator.js';
// import { IteratorPreOrderCompositeData } from './iterator-composite-data/IteratorPreOrderCompositeData.js';
import { DirectorDraw } from './director/DirectorDraw.js';
import { CanvasRenderingContext2DDecorator } from './decorator/CanvasRenderingContext2DDecorator.js';

// const handleModelUpdate = Symbol();
// const drawDirector = Symbol();
const drawContext = Symbol();

class ViewFlowChart extends View {
  constructor(flowChartModel, ctx) {
    if (!(flowChartModel instanceof ModelFlowChart)) {
      throw new Error('ViewFlowChart僅可爲ModelFlowChart的視圖。');
    }
    super(flowChartModel);
    super.initObserverModelUpdate(this._handleModelUpdate.bind(this));
    // this[drawDirector] = new DrawDirector();
    this[drawContext] = new CanvasRenderingContext2DDecorator(ctx);
    // this[modelClass] = flowChartModel;
  }
  _handleModelUpdate(data) {
    if (!(data instanceof CompositeDataViewDataDecorator)) {
      throw new Error('請輸入CompositeDataViewDataDecorator的實例。');
    }
    this.draw(data);
  }
  draw(data) {
    const director = new DirectorDraw(this[drawContext]);
    director.build(data);
    // let iteratorPreOrderCompositeData = new IteratorPreOrderCompositeData(data);
    // for (let composite of iteratorPreOrderCompositeData) {
    //   this[drawDirector](composite);
    // }
  }
}

export { ViewFlowChart };
