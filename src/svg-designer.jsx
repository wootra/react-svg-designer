import React, { useState } from 'react';
import DesignArea from './components/design-area';
import ToolArea from './components/tool-area';
import Dock from 'react-dock';

import css from './svg-designer.module.css';
import { DesignAreaContext, ViewportContext, ModeContext, HistoryContext, PathElementsContext } from './contexts/globalContexts';
import { useDynamicContextProvider } from './contexts/dynamic-context-utils'
import { DrawingModes } from './consts';

const defaultDesignArea = {
  width: '80%',
  height: '100%'
}

const defaultToolArea = {
  position: 'right',
  size: 0.2,
  isVisible: true,
  fluid: true
}

const initDesignArea = Object.freeze({
  wRate: 1,
  hRate: 1,
});

const initViewport = {
  left: 0,
  top: 0,
  width: 100,
  height: 100
};

const initMode = {
  drawingMode: DrawingModes.NONE
}

const initHistoryQueue = []

function SvgDesigner() {
  const [designArea, setDesignArea] = useState(defaultDesignArea);
  const [toolArea, setToolArea] = useState(defaultToolArea);

  const onToolSizeChanged = size => {
    setDesignArea(state => ({ ...state, width: ((1.0 - size) * 100.0) + '%' }))
    setToolArea(state => ({ ...state, size }))
  }

  const designAreaProviderValue = useDynamicContextProvider(initDesignArea);
  const viewportProviderValue = useDynamicContextProvider(initViewport);
  const drawingModeProviderValue = useDynamicContextProvider(initMode);
  const historyProviderValue = useDynamicContextProvider(initHistoryQueue);
  const pathElementsValue = useDynamicContextProvider([]);
  return (
    <div className={css.mainWindow}>
      <DesignAreaContext.Provider value={designAreaProviderValue}>
        <ViewportContext.Provider value={viewportProviderValue}>
          <ModeContext.Provider value={drawingModeProviderValue}>
            <HistoryContext.Provider value={historyProviderValue}>
              <PathElementsContext.Provider value={pathElementsValue}>
                <Dock {...toolArea} onSizeChange={onToolSizeChanged} >
                  <ToolArea />
                </Dock>
                <div style={designArea}>
                  <DesignArea />
                </div>
              </PathElementsContext.Provider>
            </HistoryContext.Provider>
          </ModeContext.Provider>
        </ViewportContext.Provider>
      </DesignAreaContext.Provider>
    </div>
  );
}

export default SvgDesigner;
