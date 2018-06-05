import { DecoratorCanvasRenderingContext2D } from '../decorator/DecoratorCanvasRenderingContext2D.js';
import { DecoratorCompositeDataViewData } from '../decorator/DecoratorCompositeDataViewData.js';
import { BuilderNodeView } from '../builder-node-view/BuilderNodeView.js';
import { IteratorBfsCompositeData } from '../iterator-composite-data/IteratorBfsCompositeData.js';
import { FactoryViewData } from '../factory-view-data/FactoryViewData.js';
import { CompositeData } from '../../model/composite-data/CompositeData.js';

const drawContext = Symbol();
const builderNodeView = Symbol();
const teamConcept = Symbol();
// const iteratorPreOrderComposite = Symbol();
// const compositeData = Symbol();

class DirectorDraw {
  constructor(ctx) {
    if (!(ctx instanceof DecoratorCanvasRenderingContext2D)) {
      throw new Error('應以DecoratorCanvasRenderingContext2D的實例配置DirectorDraw。');
    }
    this[builderNodeView] = new BuilderNodeView();
    this[drawContext] = ctx;
    this._factoryViewData = new FactoryViewData();
  }
  draw(bwfWorkflowGroupNode, ctx, animationState = {}, basePoint = this._basePoint) {
    this._basePoint = basePoint;
    ctx.clearRect(0, 0, ctx.canvas.getAttribute('width'), ctx.canvas.getAttribute('height'));
    this._animationState.id = animationState.id;
    this._animationState.animationMode = animationState.animationMode;
    this._animationState.offsetX = animationState.offsetX;
    this._animationState.offsetY = animationState.offsetY;

    var bwfNodeGroupNodeArray = [];
    for (let child of bwfWorkflowGroupNode.children) {
      if (child.type === this[teamConcept].bwfNodeGroup) {
        bwfNodeGroupNodeArray.push(child);
      }
    }

    for (let [index, bwfNodeGroupNode] of bwfNodeGroupNodeArray.entries()) {
      const nodeBasePosition = [
        basePoint[0],
        basePoint[1] + (index * this._nodeGroupHeight)
      ];
      bwfNodeGroupNode = this.drawGroupOfNode(bwfNodeGroupNode, nodeBasePosition, index, ctx,
        bwfWorkflowGroupNode.userData.bwfNodeList);
    }
    // return addChildrenPath(bwfWorkflowGroupNode, bwfWorkflowGroupNode.children);
  }
  _draw(composite, referNode) {
    if (!(composite instanceof CompositeData)) {
      throw new Error('本導向器僅可根據CompositeData生成産品。');
    }
    const viewData = this._factoryViewData.produceViewData(composite, referNode);
    return viewData;
  }
  build(data) {
    if (!(data instanceof Array)) {
      throw new Error('本導向器僅可根據CompositeData的數組生成産品。');
    }
    let decoratorCompositeDataViewDatas = [];
    let iteratorBfsComposite = new IteratorBfsCompositeData(data);
    for (let composite of iteratorBfsComposite) {
      if (composite.getGrade() === 0) {
        decoratorCompositeDataViewDatas.push(new DecoratorCompositeDataViewData(composite));
        continue;
      }
      let referNode = data.find(value => composite.getAdjacentVertices().includes(value.getId()) && value.getVisited());
      if (referNode) {
        decoratorCompositeDataViewDatas.push(
          new DecoratorCompositeDataViewData(composite, this._draw(composite, referNode)));
      } else {
        decoratorCompositeDataViewDatas.push(new DecoratorCompositeDataViewData(composite, this._draw(composite)));
      }
    }
    return decoratorCompositeDataViewDatas;
  }
}

export { DirectorDraw };
