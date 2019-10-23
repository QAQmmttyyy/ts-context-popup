import React, { useEffect, CSSProperties, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { PopupPlacement, getPopupRelatedPositionValues, PopupInfo, dealPopupOnClick, getPopupArrowStyle, PopupPlacementSide, PopupPlacemenAlign } from '../utils';

import './ContextPopup.scss';

interface ContextPopupProps {
  className?: string;
  style?: CSSProperties;
  contextId: string;
  placement: PopupPlacement;
  withBorder?: boolean; 
  hide(): void;
}

const PREFIX_CLS = 'axis-popover';

const currentPopupInfoStack: PopupInfo[] = [];

// TODO: change to Getter func
const popupStyleMap = new Map<string, CSSProperties>([
  ['left', {padding: '0 10px 0 0'}],
  ['right', {padding: '0 0 0 10px'}],
  ['above', {padding: '0 0 10px 0'}],
  ['below', {padding: '10px 0 0 0'}],
] as [string, CSSProperties][])

const ContextPopup: React.FC<ContextPopupProps> = (
  {children, contextId, placement, withBorder = true, hide}
) => {
  const [popupPlacement, setPopupPlacement] = useState<PopupPlacement>(placement);
  
  const [side, align] = popupPlacement.split('-') as [PopupPlacementSide, PopupPlacemenAlign];

  const popup = document.createElement('div');

  popup.style.position = 'absolute';
  popup.style.padding = popupStyleMap.get(side)!.padding as string;

  const popupArrowUnderPartRef = useRef<HTMLSpanElement>(null);
  const popupArrowUpperPartRef = useRef<HTMLSpanElement>(null);
  // content
  // arrow
  const popupChild = (
    <div className={classNames(
      `${PREFIX_CLS}-body`, 
      `${PREFIX_CLS}-${side}`, 
      {[`${PREFIX_CLS}-withBorder`]: withBorder}
    )}>
      {withBorder && <span ref={popupArrowUnderPartRef} className={`${PREFIX_CLS}-arrow ${PREFIX_CLS}-arrow-under-part`} />}
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

    if (withBorder && !popupArrowUnderPartElem) {
      throw new Error('There is no popup arrow under part element');
    }

    if (!popupArrowUpperPartElem) {
      throw new Error('There is no popup arrow upper part element');
    }

    popupContainer.appendChild(popup);

    const popupArrow = withBorder ? popupArrowUnderPartElem! : popupArrowUpperPartElem;

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
    const {
      left,
      top,
      right,
      bottom,
    } = popup.getBoundingClientRect();

    let adjustedPlacement: PopupPlacement | undefined;

    // TODO: complete condition
    if (left < 0) {
      adjustedPlacement = `right-${align}` as PopupPlacement;
    } else if (top < 0) {
      adjustedPlacement = `below-${align}` as PopupPlacement;
    }

    if (adjustedPlacement) {
      setPopupPlacement(adjustedPlacement);
    }

    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    // arrow
    const {upperPart, underPart} = getPopupArrowStyle(popupPlacement, withBorder, arrowHorizontalOffset, arrowVerticalOffset);

    popupArrowUpperPartElem.style.cssText = upperPart;

    if (withBorder) {
      popupArrowUnderPartElem!.style.cssText = underPart;
    }

    // other
    currentPopupInfoStack.push({context, popup, hide});

    // console.log('Mounted: ');
    // console.table(currentPopupInfoStack);
    
    const clickOutsideHandler  = (event: MouseEvent) => {
      dealPopupOnClick(event, currentPopupInfoStack);
    }

    document.addEventListener('mousedown', clickOutsideHandler , true);

    return () => {
      document.removeEventListener('mousedown', clickOutsideHandler , true);
      popupContainer.removeChild(popup);
    }
  }, [popupPlacement]);

  return ReactDOM.createPortal(popupChild, popup);
}

export default ContextPopup;
