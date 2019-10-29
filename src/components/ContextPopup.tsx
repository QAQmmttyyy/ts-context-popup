import React, { useEffect, CSSProperties, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { PopupPlacement, getPopupRelatedPositionValues, PopupInfo, dealPopupOnClick, getPopupArrowStyle, PopupPlacementSide, PopupPlacemenAlign, getAdjustedPlacement, HideOption } from '../utils';

import './ContextPopup.scss';
import _ from 'lodash';

interface ContextPopupProps {
  contextId: string;
  placement: PopupPlacement;
  hideOption: HideOption;
  className?: string;
  style?: CSSProperties;
  showBorder?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  hide(): void;
}

const PREFIX_CLS = 'axis-popover';

let currentPopupInfoStack: PopupInfo[] = [];

// TODO: change to Getter func
const popupStyleMap = new Map<string, CSSProperties>([
  ['left', { padding: '0 10px 0 0' }],
  ['right', { padding: '0 0 0 10px' }],
  ['top', { padding: '0 0 10px 0' }],
  ['bottom', { padding: '10px 0 0 0' }],
] as [string, CSSProperties][])

const ContextPopup: React.FC<ContextPopupProps> = (
  { children, contextId, placement, hideOption, style, showBorder = true, borderColor, backgroundColor, hide }
) => {
  const [popupPlacement, setPopupPlacement] = useState<PopupPlacement>(placement);

  const [side, align] = popupPlacement.split('-') as [PopupPlacementSide, PopupPlacemenAlign];

  const popup = document.createElement('div');

  popup.className = `${PREFIX_CLS}`;

  popup.style.position = 'fixed';
  popup.style.padding = popupStyleMap.get(side)!.padding as string;

  const popupArrowUnderPartRef = useRef<HTMLSpanElement>(null);
  const popupArrowUpperPartRef = useRef<HTMLSpanElement>(null);

  // content
  // arrow
  const popupBodyStyle = {
    ...style,
    borderColor,
    backgroundColor,
  };

  const popupBody = (
    <div style={popupBodyStyle} className={classNames(
      `${PREFIX_CLS}-body`,
      `${PREFIX_CLS}-${side}`,
      { [`${PREFIX_CLS}-showBorder`]: showBorder }
    )}>
      {showBorder && <span ref={popupArrowUnderPartRef} className={`${PREFIX_CLS}-arrow ${PREFIX_CLS}-arrow-under-part`} />}
      <span ref={popupArrowUpperPartRef} className={`${PREFIX_CLS}-arrow ${PREFIX_CLS}-arrow-upper-part`} />
      <section className={`${PREFIX_CLS}-content`}>
        {children}
      </section>
    </div>
  )

  // Did mount
  useEffect(() => {
    const popupContainer = document.getElementById('popup-container');
    const context = document.getElementById(contextId);
    const popupArrowUnderPartElem = popupArrowUnderPartRef.current;
    const popupArrowUpperPartElem = popupArrowUpperPartRef.current;

    if (!popupContainer) {
      throw new Error('There is no popupContainer element');
    }

    if (!context) {
      throw new Error('There is no related context element');
    }

    if (showBorder && !popupArrowUnderPartElem) {
      throw new Error('There is no popup arrow under part element');
    }

    if (!popupArrowUpperPartElem) {
      throw new Error('There is no popup arrow upper part element');
    }

    popupContainer.appendChild(popup);

    const popupArrow = showBorder ? popupArrowUnderPartElem! : popupArrowUpperPartElem;

    // popup
    const {
      x,
      y,
      arrowHorizontalOffset,
      arrowVerticalOffset
    } = getPopupRelatedPositionValues(context, popup, popupArrow, popupPlacement);

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    // Auto adjust placement
    const adjustedPlacement = getAdjustedPlacement(context, popup, side, align);

    console.log(adjustedPlacement);

    if (adjustedPlacement) {
      setPopupPlacement(adjustedPlacement);
    }

    // arrow
    const { upperPart, underPart } = getPopupArrowStyle(popupPlacement, showBorder, arrowHorizontalOffset, arrowVerticalOffset);

    popupArrowUpperPartElem.style.cssText = backgroundColor ? upperPart + `border-${side}-Color: ${backgroundColor};` : upperPart;

    if (showBorder) {
      popupArrowUnderPartElem!.style.cssText = borderColor ? underPart + `border-${side}-Color: ${borderColor};` : underPart;
    }

    // other
    currentPopupInfoStack.push({ context, popup, hide, hideOption });

    const clickOutsideHandler = (event: MouseEvent | TouchEvent) => {
      dealPopupOnClick(event, currentPopupInfoStack);
    }

    document.addEventListener('click', clickOutsideHandler, true);
    // document.addEventListener('mousedown', clickOutsideHandler, true);
    // document.addEventListener('touchstart', clickOutsideHandler, true);

    // call this func when re-render
    // the old comp will un-mount before update
    return () => {
      console.log('un mount');

      document.removeEventListener('click', clickOutsideHandler, true);
      // document.removeEventListener('mousedown', clickOutsideHandler, true);
      // document.removeEventListener('touchstart', clickOutsideHandler, true);

      _.remove(currentPopupInfoStack, (popupInfo) => popup === popupInfo.popup);

      popupContainer.removeChild(popup);
    }
  }, [popupPlacement]);

  return ReactDOM.createPortal(popupBody, popup);
}

export default ContextPopup;
