class TeamClosedPath {
  constructor() {
    this.fabricateStepSymbolPathState = {
      usual: Symbol(),
      transfer: Symbol()
    };
  }
  // fabricateStepUsualSymbolPath(position, radius) {
  //   var path = new Path2D();
  //   path.arc(position[0], position[1], radius, 0, Math.PI * 2);
  //   return path;
  // }

  get fabricateStepSymbolPathState() {
    return this.fabricateStepSymbolPathState;
  }

  fabricateRectanglePath(position, size) {
    if (typeof position[0] !== 'number' || Number.isNaN(position[0]) ||
      typeof position[1] !== 'number' || Number.isNaN(position[0])) {
      throw new Error('fabricateRectanglePath方法的第一個參數須爲一個長度爲二的數字數組。');
    }
    if (typeof size.width !== 'number' || Number.isNaN(size.width) ||
      typeof size.height !== 'number' || Number.isNaN(size.height)) {
      throw new Error('fabricateRectanglePath方法的第二個參數須有width和height兩種屬性，且兩種屬性的值須爲數字。');
    }
    let path = new Path2D();
    path.rect(position[0], position[1], size.width, size.height);
    return path;
  }

  fabricateStepSymbolPath(position, radius, state, rotatingDegree) {
    let path = new Path2D();
    if (state === this.fabricateStepSymbolPathState.usual) {
      path.arc(position[0], position[1], radius, 0, Math.PI * 2);
      return path;
    } else if (state === this.fabricateStepSymbolPathState.transfer) {
      const lineXOffset = radius * Math.sin(rotatingDegree);
      const lineYOffset = radius * Math.cos(rotatingDegree);
      const pathPoint1 = [
        position[0] - lineXOffset,
        position[1] + lineYOffset
      ];
      const pathPoint2 = [
        pathPoint1[0] + (2 * lineXOffset),
        pathPoint1[1] - (2 * lineYOffset)
      ];
      const pathPoint3 = [
        pathPoint2[0] + (2 * lineYOffset),
        pathPoint2[1] + (2 * lineXOffset)
      ];
      const pathPoint4 = [
        pathPoint3[0] - (2 * lineXOffset),
        pathPoint3[1] + (2 * lineYOffset)
      ];
      const controlPoint1 = [
        pathPoint1[0] - lineYOffset,
        pathPoint1[1] - lineXOffset
      ];
      const controlPoint2 = [
        controlPoint1[0] + lineXOffset,
        controlPoint1[1] - lineYOffset
      ];
      path.moveTo(pathPoint1[0], pathPoint1[1]);
      path.arcTo(controlPoint1[0], controlPoint1[1], controlPoint2[0], controlPoint2[1], radius);
      const controlPoint3 = [
        controlPoint2[0] + lineXOffset,
        controlPoint2[1] - lineYOffset
      ];
      path.arcTo(controlPoint3[0], controlPoint3[1], pathPoint2[0], pathPoint2[1], radius);
      path.lineTo(pathPoint3[0], pathPoint3[1]);
      const controlPoint4 = [
        pathPoint3[0] + lineYOffset,
        pathPoint3[1] + lineXOffset
      ];
      const controlPoint5 = [
        controlPoint4[0] - lineXOffset,
        controlPoint4[1] + lineYOffset
      ];
      path.arcTo(controlPoint4[0], controlPoint4[1], controlPoint5[0], controlPoint5[1], radius);
      const controlPoint6 = [
        controlPoint5[0] - lineXOffset,
        controlPoint5[1] + lineYOffset
      ];
      path.arcTo(controlPoint6[0], controlPoint6[1], pathPoint4[0], pathPoint4[1], radius);
      path.closePath();
      return path;
    }
    throw new Error('fabricateStepSymbolPath方法僅有“普通（usual）”、“中轉（transfer）”兩種狀態。');
  }

  // fabricateStepHasOutputSymbolPath(position, radius, rotatingDegree) {
  //   var path = new Path2D();
  //   const lineXOffset = radius * Math.sin(rotatingDegree);
  //   const lineYOffset = radius * Math.cos(rotatingDegree);
  //   const pathPoint1 = [
  //     position[0] - lineXOffset,
  //     position[1] + lineYOffset
  //   ];
  //   const pathPoint2 = [
  //     pathPoint1[0] + (2 * lineXOffset),
  //     pathPoint1[1] - (2 * lineYOffset)
  //   ];
  //   const pathPoint3 = [
  //     pathPoint2[0] + (2 * lineYOffset),
  //     pathPoint2[1] + (2 * lineXOffset)
  //   ];
  //   const pathPoint4 = [
  //     pathPoint3[0] - (2 * lineXOffset),
  //     pathPoint3[1] + (2 * lineYOffset)
  //   ];
  //   const controlPoint1 = [
  //     pathPoint1[0] - lineYOffset,
  //     pathPoint1[1] - lineXOffset
  //   ];
  //   const controlPoint2 = [
  //     controlPoint1[0] + lineXOffset,
  //     controlPoint1[1] - lineYOffset
  //   ];
  //   path.moveTo(pathPoint1[0], pathPoint1[1]);
  //   path.arcTo(controlPoint1[0], controlPoint1[1], controlPoint2[0], controlPoint2[1], radius);
  //   const controlPoint3 = [
  //     controlPoint2[0] + lineXOffset,
  //     controlPoint2[1] - lineYOffset
  //   ];
  //   path.arcTo(controlPoint3[0], controlPoint3[1], pathPoint2[0], pathPoint2[1], radius);
  //   path.lineTo(pathPoint3[0], pathPoint3[1]);
  //   const controlPoint4 = [
  //     pathPoint3[0] + lineYOffset,
  //     pathPoint3[1] + lineXOffset
  //   ];
  //   const controlPoint5 = [
  //     controlPoint4[0] - lineXOffset,
  //     controlPoint4[1] + lineYOffset
  //   ];
  //   path.arcTo(controlPoint4[0], controlPoint4[1], controlPoint5[0], controlPoint5[1], radius);
  //   const controlPoint6 = [
  //     controlPoint5[0] - lineXOffset,
  //     controlPoint5[1] + lineYOffset
  //   ];
  //   path.arcTo(controlPoint6[0], controlPoint6[1], pathPoint4[0], pathPoint4[1], radius);
  //   path.closePath();
  //   return path;
  // }
}

export { TeamClosedPath };
