import { View } from '../../../../design-pattern-character/model-view-controller/View.js';
import { ModelFlowChart } from '../model/ModelFlowChart.js';
import { ControllerFlowChart } from '../controller/ControllerFlowChart.js';
import { Observer } from '../../../../design-pattern-character/observer/Observer.js';
import { DirectorDraw } from './director-draw/DirectorDraw.js';
import { TeamStructure } from './builder-view-data/workshop-design/TeamStructure.js';
import { StateNormalDirectorDraw } from './state-director-draw/StateNormalDirectorDraw.js';

// const handleModelUpdate = Symbol();
// const drawDirector = Symbol();
const drawContext = Symbol();
const controller = Symbol();
const themeColor = '#8c8c8c';
const originBasePoint = [25, 25];

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
    this._basePoint = originBasePoint;
    // this[drawDirector] = new DrawDirector();
    this[drawContext] = ctx;
    this._data = {};
    this._normalDrawState = new StateNormalDirectorDraw();
    this._drawDirector = new DirectorDraw(this._basePoint, this[drawContext]);
    this._drawDirector.setState(this._normalDrawState);
    this._initObserverControllerCommandDrag();
    this._initObserverControllerCommandJumpToNode();
    // console.log(this[drawContext]);
    // this[modelClass] = flowChartModel;
  }
  _initObserverControllerCommandDrag() {
    let obs = new Observer(this._transformBasePoint.bind(this));
    this[controller].addObserver(obs, this[controller].getObserverTypes().dragChart);
  }
  _initObserverControllerCommandJumpToNode() {
    let obs = new Observer(this._jumpToTheNode.bind(this));
    this[controller].addObserver(obs, this[controller].getObserverTypes().jumpToRefer);
  }
  _handleModelUpdate(data) {
    if (!(data instanceof Array)) {
      throw new Error('請輸入DecoratorCompositeDataViewData的數組。');
    }
    this._data = data;
    this._draw(this._basePoint);
  }
  _jumpToTheNode(id) {
    const structure = new TeamStructure();
    for (let value of this._data) {
      if (value.getId() === id) {
        // console.log(id);
        // this._basePoint[0] = 0;
        // this._basePoint[1] = structure.nodeGroupHeight * value.getNodeRank();
        const transform = [
          originBasePoint[0] - this._basePoint[0],
          originBasePoint[1] - (structure.nodeGroupHeight * value.getNodeRank()) - this._basePoint[1]
        ];
        this._transformBasePoint({ transform, state: 'finished' });
        break;
      }
    }
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
    this._drawDirector.setBasePoint(basePoint);
    // const director = new DirectorDraw(basePoint, this[drawContext]);
    this[controller].setViewData(this._drawDirector.build(this._data));
    // let iteratorPreOrderCompositeData = new IteratorPreOrderCompositeData(data);
    // for (let composite of iteratorPreOrderCompositeData) {
    //   this[drawDirector](composite);
    // }
  }
}

export { ViewFlowChart };
