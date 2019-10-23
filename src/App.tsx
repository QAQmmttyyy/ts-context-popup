import React, { useState } from 'react';

import ContextPopup from './components/ContextPopup';

import './App.css';

const App: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="App" style={{paddingTop: '300px'}}>
      <button id="menu" onClick={() => setShow(!show)}>a</button>
      {show && 
        <ContextPopup contextId="menu" placement="left-top" withBorder={true} hide={() => setShow(false)}>
          <ul>
            <li>1</li>
            <Submenu/>
            <li>3</li>
          </ul>
        </ContextPopup>
      }
    </div>
  );
}

const Submenu: React.FC = () => {
  const [showSub, setShowSub] = useState(false);

  return (
    <>
    
    <li id="submenu" onClick={() => setShowSub(true)}>submenu</li>
    {showSub && 
    
      <ContextPopup contextId="submenu" placement="right-top" hide={() => setShowSub(false)}>
        <ul>
          <li>1</li>
          <li>1</li>
          <li>1</li>
        </ul>
      </ContextPopup>
    }
    </>
  )
}

export default App;
