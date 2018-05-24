import { CompositeData } from '../../model/composite-data/CompositeData.js';

class CompositeDataViewDataDecorator extends CompositeData {
  constructor(compositeData) {
    if (!(compositeData instanceof CompositeData)) {
      throw new Error('CompositeDataViewDataDecorator僅可裝飾CompositeData');
    }
    super(compositeData);
  }
}

export { CompositeDataViewDataDecorator };
