export type PopupPosition =
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
  popup: HTMLElement
): Map<PopupPosition, { x: number; y: number }> {
  const {
    left,
    top,
    right,
    bottom,
    width,
    height
  } = context.getBoundingClientRect();

  const {
    width: popupWidth,
    height: popupHeight
  } = popup.getBoundingClientRect();

  const posEntries: [PopupPosition, { x: number; y: number }][] = [
    ["left-top", { x: left - popupWidth, y: top }],
    [
      "left-center",
      {
        x: left - popupWidth,
        y: top + Math.abs(height / 2) - popupHeight / 2
      }
    ],
    [
      "left-bottom",
      {
        x: left - popupWidth,
        y: bottom - popupHeight
      }
    ],
    ["right-top", { x: right, y: top }],
    [
      "right-center",
      {
        x: right,
        y: top + Math.abs(height / 2) - popupHeight / 2
      }
    ],
    ["right-bottom", { x: right, y: bottom - popupHeight }],
    ["above-left", { x: left, y: top - popupHeight }],
    [
      "above-center",
      {
        x: left + Math.abs(width / 2) - popupWidth / 2,
        y: top - popupHeight
      }
    ],
    [
      "above-right",
      {
        x: right - popupWidth,
        y: top - popupHeight
      }
    ],
    ["below-left", { x: left, y: bottom }],
    [
      "below-center",
      {
        x: left + Math.abs(width / 2) - popupWidth / 2,
        y: bottom
      }
    ],
    ["below-right", { x: right - popupWidth, y: bottom }]
  ];

  return new Map(posEntries);
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
