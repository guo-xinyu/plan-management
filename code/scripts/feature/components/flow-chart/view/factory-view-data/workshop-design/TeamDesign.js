import { TeamPath } from './TeamPath.js';
import { TeamStructure } from './TeamStructure.js';
import { DecoratorCanvasRenderingContext2D } from '../../decorator/DecoratorCanvasRenderingContext2D.js';

function compositePatternDesign(path, width, style, fillColor, strokeColor) {
  return {
    border: {
      path: path,
      style: style,
      width: width
    },
    color: {
      fill: fillColor,
      stroke: strokeColor
    }
  };
}

function compositeTextDesign(text, fontSize, fontFamily, foulInterval) {
  return {
    text,
    foulInterval: [
      foulInterval[0],
      foulInterval[1],
      foulInterval[2],
      foulInterval[3]
    ],
    fontSize,
    fontFamily
  };
}

const teamPath = Symbol();
const teamStructure = Symbol();
const decoratorCanvasRenderingContext2D = Symbol();

class TeamDesign {
  constructor() {
    this[teamPath] = new TeamPath();
    this[teamStructure] = new TeamStructure();
    this[decoratorCanvasRenderingContext2D] = new DecoratorCanvasRenderingContext2D(new CanvasRenderingContext2D());
  }
  // 生産節點名字處的“綫稿”
  fabricateNodeDesign(nodeBasePoint, index, childNum, name) {
    const nodeContentBasePoint = [
      nodeBasePoint[0] + this[teamStructure].nodeLeftPadding,
      nodeBasePoint[1] + this[teamStructure].nodeTopPadding
    ];

    const nodeNameSize = this[teamStructure].nodeNameSize;
    const fontFamily = this[teamStructure].fontFamily;

    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    const nameTextMeasureArea = this[decoratorCanvasRenderingContext2D].measureTextArea(name, nodeNameSize, fontFamily);
    patternDesign.push(compositePatternDesign(
      this[teamPath].fabricateRectanglePath(nodeContentBasePoint, nameTextMeasureArea)));

    const nodeNameFoulInterval = [
      nodeContentBasePoint, [],
      [],
      [
        nodeContentBasePoint[0],
        nodeContentBasePoint[1] + nodeNameSize
      ]
    ];
    textDesign.push(compositeTextDesign(nodeBasePoint, nodeNameSize, fontFamily, nodeNameFoulInterval));
    // 豎綫裝飾的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    // 步驟軌道的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
  // 生産步驟處的“綫稿”
  fabricateStepDesign() {
    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    textDesign.push(compositeTextDesign());
    // 圓圈標志的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
  // 生産輸出節點處的“綫稿”
  fabricateOutputNodeDesign() {
    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    textDesign.push(compositeTextDesign());
    // 分叉軌道實綫部分的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    // 分叉軌道虚綫部分的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
}

export { TeamDesign };
