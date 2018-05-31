import { TeamPath } from './TeamPath.js';
import { TeamStructure } from './TeamStructure.js';
import { DecoratorCanvasRenderingContext2D } from '../../decorator/DecoratorCanvasRenderingContext2D.js';

const teamPath = Symbol();
const teamStructure = Symbol();
const decoratorCanvasRenderingContext2D = Symbol();
const designType = Symbol();
const colors = Symbol();

class TeamDesign {
  constructor() {
    this[teamPath] = new TeamPath();
    this[teamStructure] = new TeamStructure();
    this[decoratorCanvasRenderingContext2D] = new DecoratorCanvasRenderingContext2D(new CanvasRenderingContext2D());
    this[colors] = [
      '#8dc434',
      '#f5ba05',
      '#c05fd5',
      '#35cbd5',
      '#f2811c',
      '#ee68a9',
      '#2496f5',
      '#f1e12b',
      '#7c81e6',
      '#57dca5'
    ];
    this[designType] = {
      node: {
        text: Symbol(),
        decorationLine: Symbol(),
        railLine: Symbol()
      },
      step: {
        text: Symbol(),
        symbol: Symbol()
      },
      outputNode: {
        text: Symbol(),
        railLine: Symbol(),
        decorationLine: Symbol()
      }
    };
  }
  _cutString(oText, state) {
    switch (state) {
      case this[designType].outputNode.text:
        return this[decoratorCanvasRenderingContext2D].cutString(oText, this[teamStructure].stepInterval -
          this[teamStructure].this.nodeNameDecorateLineWidth - this[teamStructure].nodeNameTextLineBlank);
      case this[designType].node.text:
        return oText;
      case this[designType].step.text:
        return this[decoratorCanvasRenderingContext2D].splitString2SomeLines(oText,
          this[teamStructure].stepInterval - this[teamStructure].bwfStepNameBlank);
      default:
        break;
    }
  }
  _compositeTextDesign(oText, oBasePoint, state) {
    let foulLineDirection = '';
    let text = this._cutString(oText, state);
    let basePoint = [];

    switch (state) {
      case this[designType].outputNode.text:
      case this[designType].node.text:
        foulLineDirection += 'left';
        basePoint.push(oBasePoint[0] + this[teamStructure].this.nodeNameDecorateLineWidth +
          this[teamStructure].nodeNameTextLineBlank);
        basePoint.push(oBasePoint[1] + (this[teamStructure].nodeNameSize / 2));
        break;
      case this[designType].step.text:
        foulLineDirection += 'bottom';
        basePoint.push(oBasePoint[0]);
        basePoint.push(oBasePoint[1] + this[teamStructure].bwfStepNameBlank);
        break;
      default:
        break;
    }

    return {
      text,
      basePoint,
      foulLineDirection,
      fontSize: this[teamStructure].nodeNameSize,
      fontFamily: this[teamStructure].fontFamily
    };
  }
  _compositePatternDesign(paths, strokeColor, state) {
    let patternDesign = [];
    for (let path of paths) {
      patternDesign.push({
        border: {
          path: path
          // style: style,
          // width: width
        },
        color: {
          // fill: fillColor,
          stroke: strokeColor
        }
      });
    }
    return patternDesign;
  }
  _getTextRectanglePath(singleTextDesign) {
    const nameTextMeasureArea = this[decoratorCanvasRenderingContext2D].measureTextArea(singleTextDesign.text,
      singleTextDesign.fontSize, singleTextDesign.fontFamily);
    let nodeContentBasePoint = [];

    switch (singleTextDesign.foulLineDirection) {
      case 'left':
        nodeContentBasePoint.push(singleTextDesign.basePoint[0]);
        nodeContentBasePoint.push(singleTextDesign.basePoint[1] + (nameTextMeasureArea.height / 2));
        break;
      case 'bottom':
        nodeContentBasePoint.push(singleTextDesign.basePoint[0] - (nameTextMeasureArea.width / 2));
        nodeContentBasePoint.push(singleTextDesign.basePoint[1] - nameTextMeasureArea.height);
        break;
      default:
        break;
    }
    return this[teamPath].fabricateRectanglePath(nodeContentBasePoint, nameTextMeasureArea);
  }
  // 生産節點名字處的“綫稿”
  fabricateNodeDesign(nodeBasePoint, index, childNum, name) {
    const nodeContentBasePoint = [
      nodeBasePoint[0] + this[teamStructure].nodeLeftPadding,
      nodeBasePoint[1] + this[teamStructure].nodeTopPadding
    ];

    // const nodeNameSize = this[teamStructure].nodeNameSize;
    // const fontFamily = this[teamStructure].fontFamily;

    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    const singleTextDesign = this._compositeTextDesign(nodeContentBasePoint, nodeContentBasePoint,
      this[designType].node.text);
    textDesign.push(singleTextDesign);

    patternDesign.push(this._compositePatternDesign([this._getTextRectanglePath(singleTextDesign)]));

    // 豎綫裝飾的“綫稿”
    // patternDesign.push(compositePatternDesign(this[teamPath].fabricateStraightLinePath()));
    // 步驟軌道的“綫稿”
    // patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
  // 生産步驟處的“綫稿”
  fabricateStepDesign() {
    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    // patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    // textDesign.push(compositeTextDesign());
    // 圓圈標志的“綫稿”
    // patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
  // 生産輸出節點處的“綫稿”
  fabricateOutputNodeDesign() {
    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    // patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    // textDesign.push(compositeTextDesign());
    // 分叉軌道實綫部分的“綫稿”
    // patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    // 分叉軌道虚綫部分的“綫稿”
    // patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
}

export { TeamDesign };
