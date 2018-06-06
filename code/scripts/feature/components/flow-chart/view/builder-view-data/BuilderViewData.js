import { TeamDesign } from './workshop-design/TeamDesign.js';
import { CompositeData } from '../../model/composite-data/CompositeData.js';

// const colors = Symbol();
// const teamDesign = Symbol();

class BuilderViewData {
  constructor(basePoint, ctx) {
    this._ctx = ctx;
    this._teamDesign = new TeamDesign(basePoint, this._ctx);
    this._colors = [
      '#ee68a9',
      '#f5ba05',
      '#35cbd5',
      '#c05fd5',
      '#8dc434',
      '#f1e12b',
      '#7c81e6',
      '#2496f5',
      '#57dca5',
      '#f2811c'
    ];
  }
  buildViewData(composite, referComposite) {
    if (!(composite instanceof CompositeData)) {
      throw new Error('buildViewData的原料僅可爲CompositeData。');
    }
    if (referComposite && !(referComposite instanceof CompositeData)) {
      throw new Error('buildViewData的原料僅可爲CompositeData。');
    }
    switch (composite.getGrade()) {
      case 1:
        return {
          self: this._teamDesign.fabricateNodeDesign(composite.getNodeRank(),
            this._colors[composite.getNodeRank() % this._colors.length],
            composite.getAdjacentVertices().length, composite.getName()),
          refer: []
        };
      case 2:
        return {
          self: this._teamDesign.fabricateStepDesign(composite.getNodeRank(),
            this._colors[composite.getNodeRank() % this._colors.length], composite.getRank(), composite.getName(),
            referComposite ? this._teamDesign.stateStep.transfer : this._teamDesign.stateStep.usual
          ),
          refer: referComposite ? [
            this._teamDesign.fabricateOutputNodeDesign(composite.getNodeRank(),
              this._colors[referComposite.getNodeRank() % this._colors.length],
              composite.getRank(), referComposite.getName())
          ] : []
        };
      default:
        break;
    }
  }
}

export { BuilderViewData };
