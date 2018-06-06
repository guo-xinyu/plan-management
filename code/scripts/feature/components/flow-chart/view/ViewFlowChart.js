import { View } from '../../../../design-pattern-character/model-view-controller/View.js';
import { ModelFlowChart } from '../model/ModelFlowChart.js';
import { ControllerFlowChart } from '../controller/ControllerFlowChart.js';
import { Observer } from '../../../../design-pattern-character/observer/Observer.js';
// import { DecoratorCompositeDataViewData } from './decorator/DecoratorCompositeDataViewData.js';
// import { IteratorPreOrderCompositeData } from './iterator-composite-data/IteratorPreOrderCompositeData.js';
import { DirectorDraw } from './director-draw/DirectorDraw.js';
// import { DecoratorCanvasRenderingContext2D } from './decorator/DecoratorCanvasRenderingContext2D.js';

// const handleModelUpdate = Symbol();
// const drawDirector = Symbol();
const drawContext = Symbol();
const controller = Symbol();
const themeColor = '#8c8c8c';

class ViewFlowChart extends View {
  constructor(flowChartModel, controllerClass, ctx) {
    if (!(flowChartModel instanceof ModelFlowChart)) {
      throw new Error('ViewFlowChart僅可爲ModelFlowChart的視圖。');
    }
    if (!(controllerClass instanceof ControllerFlowChart)) {
      throw new Error('ViewFlowChart僅可爲ControllerFlowChart的視圖。');
    }
    super(flowChartModel, themeColor);
    this[controller] = controllerClass;
    super.initObserverModelUpdate(this._handleModelUpdate.bind(this));
    this._basePoint = [5, 5];
    // this[drawDirector] = new DrawDirector();
    this[drawContext] = ctx;
    this._data = {};
    this._initObserverControllerCommandDrag();
    // console.log(this[drawContext]);
    // this[modelClass] = flowChartModel;
  }
  _initObserverControllerCommandDrag() {
    let obs = new Observer(this._transformBasePoint.bind(this));
    this[controller].addObserver(obs, this[controller].getObserverTypes().dragChart);
  }
  _handleModelUpdate(data) {
    if (!(data instanceof Array)) {
      throw new Error('請輸入DecoratorCompositeDataViewData的數組。');
    }
    this._data = data;
    this._draw(this._basePoint);
  }
  _transformBasePoint({ transform, state }) {
    this[drawContext].clearRect(0, 0, this[drawContext].canvas.getAttribute('width'),
      this[drawContext].canvas.getAttribute('height'));
    if (state === 'moving') {
      const newBasePoint = [
        this._basePoint[0] + transform[0],
        this._basePoint[1] + transform[1]
      ];
      // console.log(transform);
      this._draw(newBasePoint);
    } else if (state === 'finished') {
      this._basePoint = [
        this._basePoint[0] + transform[0],
        this._basePoint[1] + transform[1]
      ];
      this._draw(this._basePoint);
    }
  }
  transform(origin) {
    if (!(origin instanceof Array) || origin.length !== 2) {
      throw new Error('請以一個長度爲二的數組變换原點。');
    }
  }
  _draw(basePoint) {
    const director = new DirectorDraw(basePoint, this[drawContext]);
    this[controller].setViewData(director.build(this._data));
    // let iteratorPreOrderCompositeData = new IteratorPreOrderCompositeData(data);
    // for (let composite of iteratorPreOrderCompositeData) {
    //   this[drawDirector](composite);
    // }
  }
}

export { ViewFlowChart };
