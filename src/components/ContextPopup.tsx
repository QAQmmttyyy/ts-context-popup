import React, { useEffect, CSSProperties, createRef } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { PopupPlacement, getPopupPosition, PopupInfo, dealPopupOnClick } from '../utils';

import './ContextPopup.scss';

interface ContextPopupProps {
  // className?: string;
  contextId: string;
  placement: PopupPlacement;
  withBorder?: boolean; 
  hide(): void;
}

const currentPopupInfoStack: PopupInfo[] = [];

const onDocClick = (event: MouseEvent) => {
  dealPopupOnClick(event, currentPopupInfoStack);
}

const popupStyleMap = new Map<string, CSSProperties>([
  ['left', {padding: '0 10px 0 0'}],
  ['right', {padding: '0 0 0 10px'}],
  ['above', {padding: '0 0 10px 0'}],
  ['below', {padding: '10px 0 0 0'}],
] as [string, CSSProperties][])

const ContextPopup: React.FC<ContextPopupProps> = (
  {children, contextId, placement, withBorder = true, hide}
) => {
  const popup = document.createElement('div');
  popup.style.position = 'absolute';
  popup.style.padding = popupStyleMap.get(placement.split('-')[0])!.padding as string;

  const popupArrowUnderPartRef = createRef<HTMLSpanElement>()
  const popupArrowUpperPartRef = createRef<HTMLSpanElement>()
  // content
  // arrow
  const popupChild = (
    <div className={classNames('popup-child', placement.split('-'))} style={{border: '1px solid #c4c4c4'}}>
      <span ref={popupArrowUnderPartRef} className="popup-arrow under-part" />
      <span ref={popupArrowUpperPartRef} className="popup-arrow upper-part" />
      <section className="popup-content">
        {children}
      </section>
    </div>
  )
  
  // Did mount
  useEffect(() => {
    const popupContainer = document.getElementById('popup-container');
    const context = document.getElementById(contextId);

    if (!popupContainer) {
      throw new Error('There is no popupContainer element');
    }

    if (!context) {
      throw new Error('There is no related context element');
    }

    currentPopupInfoStack.push({context, popup, hide});

    document.addEventListener('click', onDocClick, true);

    console.log(popup.clientHeight);

    popupContainer.appendChild(popup);

    const popupArrow = popupArrowUnderPartRef.current || popupArrowUpperPartRef.current;

    const {x, y} = getPopupPosition(context, popup, popupArrow, placement) || { x: 0,y: 0 };

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    return () => {
      document.removeEventListener('click', onDocClick, true);
      popupContainer.removeChild(popup);
    }
  }, []);

  return ReactDOM.createPortal(popupChild, popup);
}

export default ContextPopup;
