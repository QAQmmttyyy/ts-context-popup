import _ from "lodash";

export type PopupPlacement =
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom"
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type PopupPlacementSide =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom';

export type PopupPlacemenAlign =
  | 'top'
  | 'center'
  | 'bottom'
  | 'left'
  | 'right';

export type HideOption = 'clickOutsidePopup' | 'clickOutsidePopupAndContext';

export interface PopupInfo {
  context: HTMLElement;
  popup: HTMLElement;
  hide(): void;
  hideOption: HideOption;
}

export interface PopupCoordinate {
  x: number;
  y: number;
}

export interface ArrowPartStyleObject {
  upperPart: string;
  underPart: string;
}

/**
 * Get popup x y and arrow h/v offset 
 * @param context 
 * @param popup 
 * @param popupArrow 
 * @param placement 
 */
export function getPopupRelatedPositionValues(
  context: HTMLElement,
  popup: HTMLElement,
  popupArrow: HTMLElement,
  placement: PopupPlacement,
) {
  const {
    left,
    top,
    right,
    bottom,
    width: contextWidth,
    height: contextHeight
  } = context.getBoundingClientRect();

  // console.log(context.getBoundingClientRect());

  const {
    width: popupWidth,
    height: popupHeight
  } = popup.getBoundingClientRect();

  // console.log(popup.getBoundingClientRect());

  const {
    width: popupArrowWidth,
    height: popupArrowHeight
  } = popupArrow.getBoundingClientRect();

  let popupOffsetX = 0;
  let popupOffsetY = 0;
  let arrowHorizontalOffset: number;
  let arrowVerticalOffset: number;

  const popupBorderRadiusSize = parseInt(window.getComputedStyle(popup).borderRadius || '0');

  const widthDelta = (contextWidth - popupArrowWidth) / 2;
  const heightDelta = (contextHeight - popupArrowHeight) / 2;

  if (widthDelta < popupBorderRadiusSize) {
    popupOffsetX = popupBorderRadiusSize - widthDelta;
    arrowHorizontalOffset = popupBorderRadiusSize;
  } else {
    arrowHorizontalOffset = widthDelta;
  }

  if (heightDelta < popupBorderRadiusSize) {
    popupOffsetY = popupBorderRadiusSize - heightDelta;
    arrowVerticalOffset = popupBorderRadiusSize;
  } else {
    arrowVerticalOffset = heightDelta;
  }

  if (contextWidth > popupWidth) {
    arrowHorizontalOffset = popupBorderRadiusSize;
  }

  if (contextHeight > popupHeight) {
    arrowVerticalOffset = popupBorderRadiusSize;
  }

  // left & right side
  const xOfLeftSide = left - popupWidth;
  const xOfRightSide = right;

  const yOfAlignTop = top - popupOffsetY;
  const yOfVerticalAlignCenter = top + Math.abs(contextHeight / 2) - popupHeight / 2;
  const yOfAlignBottom = bottom - popupHeight + popupOffsetY;

  // top & bottom side
  const yOfTopSide = top - popupHeight;
  const yOfBottomSide = bottom;

  const xOfAlignLeft = left - popupOffsetX;
  const xOfHorizontalAlignCenter = left + Math.abs(contextWidth / 2) - popupWidth / 2;
  const xOfAlignRight = right - popupWidth + popupOffsetX;

  const posEntries: [PopupPlacement, PopupCoordinate][] = [
    ["left-top", { x: xOfLeftSide, y: yOfAlignTop }],
    [
      "left-center",
      {
        x: xOfLeftSide,
        y: yOfVerticalAlignCenter
      }
    ],
    [
      "left-bottom",
      {
        x: xOfLeftSide,
        y: yOfAlignBottom
      }
    ],
    ["right-top", { x: xOfRightSide, y: yOfAlignTop }],
    [
      "right-center",
      {
        x: xOfRightSide,
        y: yOfVerticalAlignCenter
      }
    ],
    ["right-bottom", { x: xOfRightSide, y: yOfAlignBottom }],
    ["top-left", { x: xOfAlignLeft, y: yOfTopSide }],
    [
      "top-center",
      {
        x: xOfHorizontalAlignCenter,
        y: yOfTopSide
      }
    ],
    [
      "top-right",
      {
        x: xOfAlignRight,
        y: yOfTopSide
      }
    ],
    ["bottom-left", { x: xOfAlignLeft, y: yOfBottomSide }],
    [
      "bottom-center",
      {
        x: xOfHorizontalAlignCenter,
        y: yOfBottomSide
      }
    ],
    ["bottom-right", { x: xOfAlignRight, y: yOfBottomSide }]
  ];

  // console.log(posEntries);

  const posValueObject = {
    ...new Map(posEntries).get(placement)!,
    arrowHorizontalOffset,
    arrowVerticalOffset,
  }

  return posValueObject;
}

/**
 * popup arrow
 */
export function getPopupArrowStyle(
  placement: PopupPlacement,
  showBorder: boolean,
  arrowHorizontalOffset: number,
  arrowVerticalOffset: number
) {
  let upperPartStyleLeft: string;
  let upperPartStyleRight: string;
  let upperPartStyleTop: string;
  let upperPartStyleBottom: string;

  let underPartStyleLeft: string;
  let underPartStyleRight: string;
  let underPartStyleTop: string;
  let underPartStyleBottom: string;

  if (showBorder) {
    upperPartStyleLeft = `left: ${arrowHorizontalOffset + 1}px;`;
    upperPartStyleRight = `right: ${arrowHorizontalOffset + 1}px;`;
    upperPartStyleTop = `top: ${arrowVerticalOffset + 1}px;`;
    upperPartStyleBottom = `bottom: ${arrowVerticalOffset + 1}px;`;

    underPartStyleLeft = `left: ${arrowHorizontalOffset}px;`;
    underPartStyleRight = `right: ${arrowHorizontalOffset}px;`;
    underPartStyleTop = `top: ${arrowVerticalOffset}px;`;
    underPartStyleBottom = `bottom: ${arrowVerticalOffset}px;`;
  } else {
    upperPartStyleLeft = `left: ${arrowHorizontalOffset}px;`;
    upperPartStyleRight = `right: ${arrowHorizontalOffset}px;`;
    upperPartStyleTop = `top: ${arrowVerticalOffset}px;`;
    upperPartStyleBottom = `bottom: ${arrowVerticalOffset}px;`;

    underPartStyleLeft =
      underPartStyleRight =
      underPartStyleTop =
      underPartStyleBottom = ''
  }

  const upperPartStyleHorizontalCenter = `right: 50%; transform: translateX(50%) scale(0.94);`;
  const underPartStyleHorizontalCenter = `right: 50%; transform: translateX(50%) scale(0.94);`;

  const upperPartStyleVerticalCenter = `bottom: 50%; transform: translateY(50%) scale(0.94);`;
  const underPartStyleVerticalCenter = `bottom: 50%; transform: translateY(50%) scale(0.94);`;

  const arrowPosStyleEntries: [PopupPlacement, ArrowPartStyleObject][] = [
    ["left-top", {
      upperPart: upperPartStyleTop,
      underPart: underPartStyleTop
    }],
    ["left-center", {
      upperPart: upperPartStyleVerticalCenter,
      underPart: underPartStyleVerticalCenter
    }],
    ["left-bottom", {
      upperPart: upperPartStyleBottom,
      underPart: underPartStyleBottom
    }],
    ["right-top", {
      upperPart: upperPartStyleTop,
      underPart: underPartStyleTop
    }],
    ["right-center", {
      upperPart: upperPartStyleVerticalCenter,
      underPart: underPartStyleVerticalCenter
    }],
    ["right-bottom", {
      upperPart: upperPartStyleBottom,
      underPart: underPartStyleBottom
    }],
    ["top-left", {
      upperPart: upperPartStyleLeft,
      underPart: underPartStyleLeft
    }],
    ["top-center", {
      upperPart: upperPartStyleHorizontalCenter,
      underPart: underPartStyleHorizontalCenter
    }],
    ["top-right", {
      upperPart: upperPartStyleRight,
      underPart: underPartStyleRight
    }],
    ["bottom-left", {
      upperPart: upperPartStyleLeft,
      underPart: underPartStyleLeft
    }],
    ["bottom-center", {
      upperPart: upperPartStyleHorizontalCenter,
      underPart: underPartStyleHorizontalCenter
    }],
    ["bottom-right", {
      upperPart: upperPartStyleRight,
      underPart: underPartStyleRight
    }],
  ];

  return new Map(arrowPosStyleEntries).get(placement)!;
}

export function getAdjustedPlacement(
  context: HTMLElement,
  popup: HTMLElement,
  initialSide: PopupPlacementSide,
  initialAlign: PopupPlacemenAlign
): PopupPlacement | undefined {
  const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  const {
    left: contextLeft,
    top: contextTop,
    right: contextRight,
    bottom: contextBottom,
    width: contextWidth,
    height: contextHeight
  } = context.getBoundingClientRect();

  const {
    left: popupLeft,
    top: popupTop,
    right: popupRight,
    bottom: popupBottom,
    width: popupWidth,
    height: popupHeight
  } = popup.getBoundingClientRect();

  const contextOffsetRight = viewportWidth - contextRight;
  const contextOffsetBottom = viewportHeight - contextBottom;

  if (
    (contextLeft < 20 || viewportWidth - contextRight < 20) &&
    (contextTop < 20 || viewportHeight - contextBottom < 20)
  ) {
    return;
  }

  if (
    !(
      ((contextLeft > popupWidth || contextOffsetRight > popupWidth) && viewportHeight > popupHeight * 2 - contextHeight) ||
      ((contextTop > popupHeight || contextOffsetBottom > popupHeight) && viewportWidth > popupWidth * 2 - contextWidth)
    )
  ) {
    return;
  }


  let adjustedPlacement: PopupPlacement | undefined;
  /**
   * Plan 1
   */
  switch (initialSide) {
    case 'left':
      if (contextLeft > popupWidth) {
        if (popupTop < 0) {
          adjustedPlacement = 'left-top';
        } else if (popupBottom > viewportHeight) {
          adjustedPlacement = 'left-bottom';
        }
      } else if (contextOffsetRight > popupWidth) {
        if (popupTop < 0) {
          adjustedPlacement = 'right-top';
        } else if (popupBottom > viewportHeight) {
          adjustedPlacement = 'right-bottom';
        } else {
          adjustedPlacement = `right-${initialAlign}` as PopupPlacement;
        }
      } else if (contextTop > popupHeight) {
        adjustedPlacement = 'top-center';
      } else {
        adjustedPlacement = 'bottom-center';
      }

      break;
    case 'top':
      if (contextTop > popupHeight) {
        if (popupLeft < 0) {
          adjustedPlacement = 'top-left';
        } else if (popupRight > viewportWidth) {
          adjustedPlacement = 'top-right';
        }
      } else if (contextOffsetBottom > popupHeight) {
        if (popupLeft < 0) {
          adjustedPlacement = 'bottom-left';
        } else if (popupRight > viewportWidth) {
          adjustedPlacement = 'bottom-right';
        } else {
          adjustedPlacement = `bottom-${initialAlign}` as PopupPlacement;
        }
      } else if (contextLeft > popupWidth) {
        adjustedPlacement = 'left-center';
      } else {
        adjustedPlacement = 'right-center';
      }

      break;
    case 'right':
      if (contextOffsetRight > popupWidth) {
        if (popupTop < 0) {
          adjustedPlacement = 'right-top';
        } else if (popupBottom > viewportHeight) {
          adjustedPlacement = 'right-bottom';
        }
      } else if (contextLeft > popupWidth) {
        if (popupTop < 0) {
          adjustedPlacement = 'left-top';
        } else if (popupBottom > viewportHeight) {
          adjustedPlacement = 'left-bottom';
        } else {
          adjustedPlacement = `left-${initialAlign}` as PopupPlacement;
        }
      } else if (contextTop > popupHeight) {
        adjustedPlacement = 'top-center';
      } else {
        adjustedPlacement = 'bottom-center';
      }

      break;
    case 'bottom':
      if (contextOffsetBottom > popupHeight) {
        if (popupLeft < 0) {
          adjustedPlacement = 'bottom-left';
        } else if (popupRight > viewportWidth) {
          adjustedPlacement = 'bottom-right';
        }
      } else if (contextTop > popupHeight) {
        if (popupLeft < 0) {
          adjustedPlacement = 'top-left';
        } else if (popupRight > viewportWidth) {
          adjustedPlacement = 'top-right';
        } else {
          adjustedPlacement = `top-${initialAlign}` as PopupPlacement;
        }
      } else if (contextLeft > popupWidth) {
        adjustedPlacement = 'left-center';
      } else {
        adjustedPlacement = 'right-center';
      }

      break;

    default:
      break;
  }

  return adjustedPlacement;
}


/**
 * Doc click
 */

// TODO: handler getter

export function dealPopupOnClick(
  event: MouseEvent | TouchEvent,
  currentPopupInfoStack: PopupInfo[],
  // option: HideOption
): void {
  if (currentPopupInfoStack.length === 0) {
    return;
  }

  const target = event.target as Node;

  const [clickedContext] = currentPopupInfoStack.filter(({ context }) => context.contains(target));
  const [clickedPopup] = currentPopupInfoStack.filter(({ popup }) => popup.contains(target));

  // TODO: refactor 
  // const indexOfInfoClickOnContext = _.findIndex(currentPopupInfoStack, ({ context }) => context.contains(target))
  // const indexOfInfoClickOnPopup = _.findIndex(currentPopupInfoStack, ({ popup }) => popup.contains(target))

  // let popupInfosToHandle: PopupInfo[];

  if (!clickedContext && !clickedPopup) {
    // popupInfosToHandle = currentPopupInfoStack;
    event.stopImmediatePropagation();
  } else if (clickedContext) {
    // popupInfosToHandle = _.takeRight(currentPopupInfoStack, currentPopupInfoStack.length - indexOfInfoClickOnContext);
    event.stopImmediatePropagation();
  } else {
    // popupInfosToHandle = _.takeRight(currentPopupInfoStack, currentPopupInfoStack.length - indexOfInfoClickOnContext - 1);
  }

  const clonedData = _.cloneDeep(currentPopupInfoStack);

  for (const popupInfo of clonedData.reverse()) {
    const { context, popup, hide, hideOption } = popupInfo;
    const isContextClicked = context.contains(target);
    const isPopupClicked = popup.contains(target);

    if (isContextClicked) {
      if (hideOption === 'clickOutsidePopup') {
        hide();
      }
      break;
    } else if (isPopupClicked) {
      break;
    } else {
      hide();
    }
  }

  // _.pullAll(currentPopupInfoStack, popupInfosToHandle);

  console.log('Doc: ');
  console.table(currentPopupInfoStack)

  return;
}
