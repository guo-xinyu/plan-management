import { ConcreteBuilderView } from './ConcreteBuilderView.js';

class BuilderView {
  constructor(ctx) {
    // this._ctx = ctx;
    this._concreteBuilderView = new ConcreteBuilderView(ctx);
  }
  buildView(viewData) {
    if (!viewData) {
      return;
    }
    this._concreteBuilderView.buildView(viewData);
  }
  // buildStepView(composite) {
  //   this._concreteCreatorView.createChart(composite);
  // }
}

export { BuilderView };
