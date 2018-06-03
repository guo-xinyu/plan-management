import { DecoratorCanvasRenderingContext2D } from '../decorator/DecoratorCanvasRenderingContext2D.js';
import { DecoratorCompositeDataViewData } from '../decorator/DecoratorCompositeDataViewData.js';
import { BuilderNodeView } from '../builder-node-view/BuilderNodeView.js';
import { IteratorPreOrderCompositeData } from '../iterator-composite-data/IteratorPreOrderCompositeData.js';

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
  build(data) {
    if (!(data instanceof DecoratorCompositeDataViewData)) {
      throw new Error('本導向器僅可根據DecoratorCompositeDataViewData生成産品。');
    }
    let iteratorPreOrderComposite = new IteratorPreOrderCompositeData(data);
    for (let composite of iteratorPreOrderComposite) {
      this.draw(composite);
    }
  }
}

export { DirectorDraw };
