class TeamStructure {
  constructor() {
    this.outputRotatingDegree = Math.PI / 4;
    this.stepInterval = 120;
    this.nodeGroupHeight = 250;
    this.stepGoLineYOffset = 95;

    this.nameSymbolBlank = 6;
    this.basePoint = [5, 0];
    this.stepNameSize = 15;
    this.nodeNameSize = 16;
    this.stepNameEdgeSize = 2;
    this.nodeNameEdigeSize = 0;
    this.stepGoLineWidth = 3;
    this.nodeNameDecorateLineWidth = this.stepGoLineWidth;
    this.nodeNameTextLineBlank = this.nodeNameDecorateLineWidth;

    this.stepSymbolBorderWidth = 1;

    this.bwfStepNameBlank = 10;
    this.nodeLeftPadding = 0;
    this.nodeTopPadding = 0;
    this.fontFamily = 'sans-serif';

    this.themeColor = '#8c8c8c';
  }
  // get outputRotatingDegree() {
  //   return this.outputRotatingDegree;
  // }
  // get stepInterval() {
  //   return this.stepInterval;
  // }
  // get nodeGroupHeight() {
  //   return this.nodeGroupHeight;
  // }
  // get stepGoLineYOffset() {
  //   return this.stepGoLineYOffset;
  // }
  // get nameSymbolBlank() {
  //   return this.nameSymbolBlank;
  // }
  // get basePoint() {
  //   return this.basePoint;
  // }
}

export { TeamStructure };
