export type PopupPlacement =
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom"
  | "above-left"
  | "above-center"
  | "above-right"
  | "below-left"
  | "below-center"
  | "below-right";

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

  if (contextHeight> popupHeight) {
    arrowVerticalOffset = popupBorderRadiusSize;
  }

  // left & right side
  const xOfLeftSide = left - popupWidth;
  const xOfRightSide = right;

  const yOfAlignTop = top - popupOffsetY;
  const yOfVerticalAlignCenter = top + Math.abs(contextHeight / 2) - popupHeight / 2;
  const yOfAlignBottom = bottom - popupHeight + popupOffsetY;

  // above & below side
  const yOfAboveSide = top - popupHeight;
  const yOfBelowSide = bottom;

  const xOfAlignLeft = left - popupOffsetX;
  const xOfHorizontalAlignCenter = left + Math.abs(contextWidth / 2) - popupWidth / 2;
  const xOfAlignRight = right - popupWidth + popupOffsetX;

  const posEntries: [PopupPlacement, { x: number; y: number; }][] = [
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
    ["above-left", { x: xOfAlignLeft, y: yOfAboveSide }],
    [
      "above-center",
      {
        x: xOfHorizontalAlignCenter,
        y: yOfAboveSide
      }
    ],
    [
      "above-right",
      {
        x: xOfAlignRight,
        y: yOfAboveSide
      }
    ],
    ["below-left", { x: xOfAlignLeft, y: yOfBelowSide }],
    [
      "below-center",
      {
        x: xOfHorizontalAlignCenter,
        y: yOfBelowSide
      }
    ],
    ["below-right", { x: xOfAlignRight, y: yOfBelowSide }]
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
  withBorder: boolean,
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

  if (withBorder) {
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

  const upperPartStyleHorizontalCenter = `right: 50%; transform: translateX(50%);`;
  const underPartStyleHorizontalCenter = `right: 50%; transform: translateX(50%);`;

  const upperPartStyleVerticalCenter = `bottom: 50%; transform: translateY(50%);`;
  const underPartStyleVerticalCenter = `bottom: 50%; transform: translateY(50%);`;

  const arrowPosStyleEntries: [PopupPlacement, {upperPart: string; underPart: string}][] = [
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
    ["above-left", {
      upperPart: upperPartStyleLeft,
      underPart: underPartStyleLeft
    }],
    ["above-center", {
      upperPart: upperPartStyleHorizontalCenter,
      underPart: underPartStyleHorizontalCenter
    }],
    ["above-right", {
      upperPart: upperPartStyleRight,
      underPart: underPartStyleRight
    }],
    ["below-left", {
      upperPart: upperPartStyleLeft,
      underPart: underPartStyleLeft
    }],
    ["below-center", {
      upperPart: upperPartStyleHorizontalCenter,
      underPart: underPartStyleHorizontalCenter
    }],
    ["below-right", {
      upperPart: upperPartStyleRight,
      underPart: underPartStyleRight
    }],
  ];

  return new Map(arrowPosStyleEntries).get(placement)!;
}


/**
 * Doc click
 */
export type HideOption = 'clickOutside' | 'clickOutsideAndContext';

export interface PopupInfo {
  context: HTMLElement;
  popup: HTMLElement;
  hide(): void;
}

// TODO: handler getter

export function dealPopupOnClick(
  event: MouseEvent, 
  currentPopupInfoStack: PopupInfo[], 
  // option: HideOption
): void {
  if (currentPopupInfoStack.length === 0) {
    return;
  }

  const target = event.target;
  const [clickedPopup] = currentPopupInfoStack.filter(({popup}) => popup.contains(target as HTMLElement));

  let deleteFromIndex: number;

  if (clickedPopup) {
    deleteFromIndex = currentPopupInfoStack.indexOf(clickedPopup) + 1;
    // const clickedPopupIndex = currentPopupInfoStack.indexOf(clickedPopup);

  } else {
    deleteFromIndex = 0;
  }

  const popupInfosToHide = currentPopupInfoStack.splice(deleteFromIndex, currentPopupInfoStack.length).reverse();

  for (const {hide} of popupInfosToHide) {
    hide();
  }

  console.log('Doc: ');
  console.table(currentPopupInfoStack)
}
