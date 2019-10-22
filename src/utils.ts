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

export function getPopupPosition(
  context: HTMLElement,
  popup: HTMLElement,
  popupArrow: HTMLElement | null,
  placement: PopupPlacement
) {
  const {
    left,
    top,
    right,
    bottom,
    width: contextWidth,
    height: contextHeight
  } = context.getBoundingClientRect();

  console.log(context.getBoundingClientRect());
  
  const {
    width: popupWidth,
    height: popupHeight
  } = popup.getBoundingClientRect();

  console.log(popup.getBoundingClientRect());

  let popupOffsetX = 0;
  let popupOffsetY = 0;
  let arrowPosLeft:number;
  let arrowPosRight:number;
  let arrowPosTop:number;
  let arrowPosBottom:number;

  if (popupArrow) {
    const {width: popupArrowWidth, height: popupArrowHeight} = popupArrow.getBoundingClientRect();
    const popupBorderRadiusSize = parseInt(window.getComputedStyle(popup).borderRadius || '0');
    const widthDelta = (contextWidth - popupArrowWidth) / 2;
    const heightDelta = (contextHeight - popupArrowHeight) / 2;

    if (widthDelta < popupBorderRadiusSize) {
      popupOffsetX = popupBorderRadiusSize - widthDelta;
      arrowPosLeft = arrowPosRight = popupBorderRadiusSize;
    } else {
      arrowPosLeft = arrowPosRight = widthDelta;
    }

    if (heightDelta < popupBorderRadiusSize) {
      popupOffsetY = popupBorderRadiusSize - heightDelta;
      arrowPosTop = arrowPosBottom = popupBorderRadiusSize
    } else {
      arrowPosTop = arrowPosBottom = heightDelta
    }
  }

  // TODO: popupArrow pos
  const popupArrowHorizontalPos = {

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

  const posEntries: [PopupPlacement, { x: number; y: number }][] = [
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

  console.log(posEntries);
  
  return new Map(posEntries).get(placement);
}

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

  const popupInfosToHide = currentPopupInfoStack.splice(deleteFromIndex, currentPopupInfoStack.length);

  for (const {hide} of popupInfosToHide) {
    hide();
  }

}
