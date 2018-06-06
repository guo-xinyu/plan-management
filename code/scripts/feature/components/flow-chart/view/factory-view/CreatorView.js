import { ConcreteCreatorView } from './ConcreteCreatorView.js';

class CreatorView {
  constructor(ctx) {
    // this._ctx = ctx;
    this._concreteCreatorView = new ConcreteCreatorView(ctx);
  }
  createView(viewData) {
    this._concreteCreatorView.createView(viewData);
  }
  // buildStepView(composite) {
  //   this._concreteCreatorView.createChart(composite);
  // }
}

export { CreatorView };
