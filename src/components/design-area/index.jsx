import React, { useMemo, useState } from 'react';
import css from './style.module.css';
import { DesignAreaContext, ViewportContext, ModeContext, HistoryContext, PathElementsContext } from '../../contexts/globalContexts';
import { useDynamicContextConsumerState, useDynamicContextConsumerSetter, useDynamicContextConsumer } from '../../contexts/dynamic-context-utils'
import svgUtils from '@shjeon0730/svg-gen-utils';
import { useEffect } from 'react';
import { createMouseDownHandler, createMouseMoveHandler, createMouseUpHandler } from './mouse-handlers';
import { DrawingModes } from '../../consts';
import { drawWrapperImage } from './drawers';
// design-area/index.html

const rateToPercent = rate => rate * 100 + '%';
let keys = { ctrl: false, alt: false, shift: false };

export default function (props) {
    const designAreaVals = useDynamicContextConsumerState(DesignAreaContext);
    const viewport = useDynamicContextConsumerState(ViewportContext);
    const [modes, setModes] = useDynamicContextConsumer(ModeContext);
    const [history, setHistory] = useDynamicContextConsumer(HistoryContext);
    const [pathElements, setPathElements] = useDynamicContextConsumer(PathElementsContext);
    const [tempElement, setTempElement] = useState(null);
    const [tempSvg, setTempSvg] = useState([]);
    const [actualSvg, setActualSvg] = useState([]);
    const [tempPts, setTempPts] = useState({ pts: [] });
    const [pathBuffer, setPathBuffer] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [keyPressed, setKeyPressed] = useState({
        shift: false,
        alt: false
    })
    const [activePt, setActivePt] = useState(null);
    //const [pathElements, setPathElements] = useState([]);

    const { drawingMode } = modes;
    const designAreaStyle = useMemo(() => (
        {
            width: rateToPercent(designAreaVals.wRate),
            height: rateToPercent(designAreaVals.hRate)
        }
    ), [designAreaVals]);

    const initElement = [
        svgUtils.renderer.createElementInfo('rect', {
            x: -1,
            y: -1,
            width: viewport.width + 2,
            height: viewport.height + 2,
            style: { fill: 'transparent', stroke: 'black', strokeWidth: 1 }
        })
    ];
    const hooksContextVals = { setActivePt, activePt, pathElements, setPathElements, keyPressed, isDragging, setIsDragging, drawingMode, setHistory, setTempPts, tempPts, tempElement, initElement, setTempElement, pathBuffer, setPathBuffer }

    useEffect(() => {
        const elements = history.map(item => item.element);
        const svg = svgUtils.renderer.svgRender(React.createElement,
            viewport.left, viewport.top, viewport.width, viewport.height, { fill: 'transparent' }, elements);
        setActualSvg(svg);
    }, [history, viewport]);

    useEffect(() => {
        setTempPts({ pts: [] });//when drawing mode is changed, set tempPts to empty.
        setTempElement(null);

        if (drawingMode === DrawingModes.PATH) {
            setPathElements([]);//initialize path
        } else {
            if (pathBuffer) {
                const elements = pathElements.map(i => i.element);
                const pathLogs = pathElements.map(i => i.pathLog);
                const info = { stroke: 'black', fill: 'transparent', strokeWidth: 0.1 }
                const paths = pathBuffer.render(elements, info.stroke, info.fill, info.strokeWidth);
                setHistory(state => [...state, { drawingMode, pathLogs, info, element: paths }]);
                setPathBuffer(null);
            }
        }
    }, [drawingMode])

    useEffect(() => {
        const keyDownHandler = ({ key }) => {

            if (key === 'Shift') {
                keys = { ...keys, shift: true };
                setKeyPressed({ ...keys })
            }
            else if (key === 'Alt') {
                keys = { ...keys, alt: true };
                setKeyPressed({ ...keys })
            } else if (key === 'Meta') {
                keys = { ...keys, ctrl: true };
                setKeyPressed({ ...keys })
            }
            console.log('keydown:', key, { keys })
        };
        const keyUpHandler = ({ key }) => {
            if (key === 'Shift') {
                keys = { ...keys, shift: false };
                setKeyPressed({ ...keys })
            } else if (key === 'Alt') {
                keys = { ...keys, alt: false };
                setKeyPressed({ ...keys })
            } else if (key === 'Meta') {
                keys = { ...keys, ctrl: false };
                setKeyPressed({ ...keys })
            } else if (key === 'Escape') {
                setModes({ ...modes, drawingMode: DrawingModes.NONE });
            } else if (key === 'p') {
                setModes({ ...modes, drawingMode: DrawingModes.PATH });
            } else if (key === 'c') {
                setModes({ ...modes, drawingMode: DrawingModes.CIRCLE });
            } else if (key === 'r') {
                setModes({ ...modes, drawingMode: DrawingModes.RECT });
            }
            console.log('keyup:', key, { keys })
        };

        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount


    const mouseProps = {
        onMouseDown: createMouseDownHandler(hooksContextVals),
        onMouseMove: createMouseMoveHandler(hooksContextVals),
        onMouseUp: createMouseUpHandler(hooksContextVals)
    };

    useEffect(() => {
        if (activePt) {
            const wrapperElements = drawWrapperImage(hooksContextVals);
            const pathElementArr = pathElements.map(i => i.element);
            const tempPaths = pathBuffer && pathElements.length > 0 ? [pathBuffer.unclosedRender(pathElementArr, 'black', 'transparent', 0.1, { strokePatharray: '1,1' })] : [];
            const elementsToShow = [...wrapperElements, ...tempPaths];
            const svg = svgUtils.renderer.svgRender(React.createElement,
                viewport.left, viewport.top, viewport.width, viewport.height, { fill: 'transparent' }, elementsToShow);
            setTempSvg(svg);
        } else {
            setTempSvg(null);
        }

    }, [activePt, viewport, tempPts, keyPressed, pathElements]);


    return (
        <div className={css.designAreaWrapper} >
            <div className={css.actualArea} style={designAreaStyle} >
                {actualSvg}
            </div>
            <div className={css.designArea} style={designAreaStyle} >
                {tempSvg}
            </div>
            <div className={css.designAreaCover} style={designAreaStyle} {...mouseProps}>
                hey
            </div>
        </div>
    );
}