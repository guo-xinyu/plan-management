import { CompositeData } from '../../model/composite-data/CompositeData.js';
import { Decorator } from '../../../../../design-pattern-character/decorator/Decorator.js';
import { FactoryViewData } from '../factory-view-data/FactoryViewData.js';

const viewData = Symbol();
const factoryViewData = Symbol();

class DecoratorCompositeDataViewData extends Decorator {
  constructor(compositeData) {
    if (!(compositeData instanceof CompositeData)) {
      throw new Error('CompositeDataViewDataDecorator僅可裝飾CompositeData');
    }
    super(compositeData);
    this[factoryViewData] = new FactoryViewData();
    this[viewData] = this[factoryViewData].produceViewData(this.getName(), new Path2D());
  }
  // addPath(toAddPath) {
  //   if (!(toAddPath instanceof Path2D)) {
  //     throw new Error('CompositeData的path僅接受Path2D類對象。');
  //   }
  //   this.getPath().addPath(toAddPath);
  // }
  // getPath() {
  //   return this[viewData].path;
  // }
}

export { DecoratorCompositeDataViewData };
