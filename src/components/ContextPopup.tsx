import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { PopupPosition, getPopupPosition, PopupInfo, dealPopupOnClick } from '../utils';

import './ContextPopup.css';

interface ContextPopupProps {
  // className?: string;
  contextId: string;
  position: PopupPosition;
  hide(): void;
}

const currentPopupInfoStack: PopupInfo[] = [];

const onDocClick = (event: MouseEvent) => {
  dealPopupOnClick(event, currentPopupInfoStack);
}

const ContextPopup: React.FC<ContextPopupProps> = ({children, contextId, position, hide}) => {
  const popup = document.createElement('div');
  popup.style.position = 'absolute';

  // content
  // arrow
  const popupChild = (
    <div style={{}}>
      <span className="popup-arrow"></span>
      <div className="popup-content">
        {children}
      </div>
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

    const {x, y} = getPopupPosition(context, popup).get(position) || { x: 0,y: 0 };

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    return () => {
      document.removeEventListener('click', onDocClick, true);
      popupContainer.removeChild(popup);
    }
  }, []);

  return ReactDOM.createPortal(children, popup);
}

export default ContextPopup;
