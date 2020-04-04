import svgUtils from '@shjeon0730/svg-gen-utils';
import { DrawingModes } from '../../consts';
import { dist, createCircle, createEllipse1, createRectFromCenter, createEllipse2, createRect, createArcElement } from './drawers';

const getPtFromEvent = (e) => {
    const ratio = 100.0 / e.target.clientWidth;
    return svgUtils.pt(
        (window.scrollX + e.clientX) * ratio,
        (window.scrollY + e.clientY) * ratio)
}

export const createMouseDownHandler = ({ setActivePt, pathBuffer, setPathBuffer, setIsDragging, drawingMode, setTempPts }) => e => {
    const pt = getPtFromEvent(e);
    setTempPts(state => ({ ...state, pts: [...state.pts, pt] }));
    if (drawingMode === DrawingModes.PATH) {

        if (!pathBuffer) {
            setPathBuffer(svgUtils.path.pathUtils(pt));
        }
    }
    setIsDragging(true);
    setActivePt(pt);
}


export const createMouseMoveHandler = ({ setActivePt }) => e => {
    setActivePt(getPtFromEvent(e));
}


export const createMouseUpHandler = ({ setActivePt, pathBuffer, setPathBuffer, setPathElements, keyPressed, pathElements, setIsDragging, drawingMode, setHistory, tempPts, setTempPts, tempElement, initElement, setTempElement }) => e => {

    const pt = getPtFromEvent(e);
    const prevPts = tempPts.pts;
    if (tempPts.length === 0) {
        setTempElement(null);
        return;
    }

    switch (drawingMode) {
        case DrawingModes.CIRCLE:
        case DrawingModes.ELLIPSE:
        case DrawingModes.ELLIPSE_BY_WH:
        case DrawingModes.RECT:
            if (dist(prevPts[prevPts.length - 1], pt) > 1.0) {
                if (tempElement) {
                    setHistory(state => [...state, { drawingMode, info: tempElement.info, element: tempElement.element }]);
                }
            }
            setTempPts(state => ({ ...state, pts: [] }));
            setTempElement(null);
            break;
        case DrawingModes.PATH:
            if (prevPts.length >= 2) {

                if (dist(prevPts[prevPts.length - 1], pt) <= 1.0) { //line
                    if (dist(prevPts[prevPts.length - 2], pt) >= 1.0) {
                        //prevPts[prevPts.length - 1] is the same spot with pt
                        const element = pathBuffer.element.line(pt)
                        setPathElements(state => [...state, { pathLog: { type: 'line', pt }, element }]);
                        setTempPts(state => ({ ...state, pts: [pt] })); //leave the last pt
                    } else {
                        setTempPts(state => ({ ...state, pts: [pt] })); //leave the last pt
                    }

                } else { //arc

                    const pt1 = prevPts[prevPts.length - 2];
                    const pt2 = prevPts[prevPts.length - 1];
                    const arc = createArcElement(keyPressed, pt1, pt2, pt);
                    const element = pathBuffer.element.arc(arc.to, arc.arcRad, arc.bigArc, arc.isPositiveArc)
                    setPathElements(state => [...state, { pathLog: { type: 'arc', arc }, element }]);
                    setTempPts(state => ({ ...state, pts: [pt2] })); //leave the last pt
                }

            } else {
                setTempPts(state => ({ ...state, pts: [...state.pts, pt] }));
            }

            break;
        default:
            break;
    }

    setIsDragging(false);
    //setActivePt(null);
}
