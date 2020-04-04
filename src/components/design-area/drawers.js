import svgUtils from '@shjeon0730/svg-gen-utils';
import { pathUtils } from '@shjeon0730/svg-gen-utils/src/pathUtils/pathUtils';
import { DrawingModes } from '../../consts';

export const dist = (pt1, pt2) => Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2))

export const createCircle1 = (pt1, pt2, style = {}) => {
    const info = {
        cx: pt1.x,
        cy: pt1.y,
        r: dist(pt1, pt2),
        style
    };

    return { info, element: svgUtils.renderer.createElementInfo('circle', info) };
}

export const createCircle2 = (pt1, pt2, style = {}) => {
    const info = {
        cx: (pt1.x < pt2.x ? pt1.x : pt2.x) + Math.abs(pt2.x - pt1.x) / 2,
        cy: (pt1.y < pt2.y ? pt1.y : pt2.y) + Math.abs(pt2.y - pt1.y) / 2,
        r: dist(pt1, pt2) / 2,
        style
    };

    return { info, element: svgUtils.renderer.createElementInfo('circle', info) };
}


export const createEllipse1 = (pt1, pt2, style = {}) => {
    const info = {
        cx: pt1.x,
        cy: pt1.y,
        rx: Math.abs(pt2.x - pt1.x),
        ry: Math.abs(pt2.y - pt1.y),
        style
    };

    return { info, element: svgUtils.renderer.createElementInfo('ellipse', info) };
}

export const createEllipse2 = (pt1, pt2, style = {}) => {
    const info = {
        cx: (pt1.x < pt2.x ? pt1.x : pt2.x) + Math.abs(pt2.x - pt1.x) / 2,
        cy: (pt1.y < pt2.y ? pt1.y : pt2.y) + Math.abs(pt2.y - pt1.y) / 2,
        rx: Math.abs(pt2.x - pt1.x) / 2,
        ry: Math.abs(pt2.y - pt1.y) / 2,
        style
    };
    return { info, element: svgUtils.renderer.createElementInfo('ellipse', info) };
}


export const createRect = (pt1, pt2, style = {}) => {
    const info = {
        x: pt1.x < pt2.x ? pt1.x : pt2.x,
        y: pt1.y < pt2.y ? pt1.y : pt2.y,
        width: Math.abs(pt2.x - pt1.x),
        height: Math.abs(pt2.y - pt1.y),
        style
    };

    return { info, element: svgUtils.renderer.createElementInfo('rect', info) };
}


export const createRectFromCenter = (pt1, pt2, style = {}) => {
    const info = {
        x: pt1.x - Math.abs(pt2.x - pt1.x),
        y: pt1.y - Math.abs(pt2.y - pt1.y),
        width: Math.abs(pt2.x - pt1.x) * 2,
        height: Math.abs(pt2.y - pt1.y) * 2,
        style
    };
    return { info, element: svgUtils.renderer.createElementInfo('rect', info) };
}


export const createArcElement = (keyPressed, pt1, pt2, pt3) => {

    const midPt = { x: (pt1.x + pt2.x) / 2, y: (pt1.y + pt2.y) / 2 };

    const baseLen = dist(pt1, pt2);
    const addSize = (dist(midPt, pt3) < 3.0) ? 0 : (dist(midPt, pt3) - 3.0) * (baseLen / 4.0);
    const arcRad = baseLen / 2.0 + addSize;

    const isPositiveArc = () => {
        const a = (pt2.y - pt1.y) / (pt2.x - pt1.x);
        const b = pt1.y - (pt1.x * a);
        const y1 = a * pt3.x + b;
        const xDirection = pt2.x - pt1.x;

        if (y1 >= pt3.y) {
            return xDirection > 0 ? 1 : 0;
        } else {
            return xDirection > 0 ? 0 : 1;
        }
    }
    return {
        to: pt2,
        arcRad,
        bigArc: keyPressed.shift ? 1 : 0,
        isPositiveArc: isPositiveArc()
    };

}

export const drawWrapperImage = ({ activePt, pathElements, isDragging, keyPressed, tempPts, drawingMode, setTempPts, setTempElement, setWrapperElements, initElement, pathBuffer, setPathBuffer }) => {
    let tempElement1 = null;
    let tempElement2 = null;

    const pt = activePt;
    const prevPts = tempPts.pts;
    if (prevPts.length === 0) return [];
    const prevPt = prevPts[prevPts.length - 1];
    switch (drawingMode) {

        case DrawingModes.CIRCLE:
            if (keyPressed.alt) {
                if (keyPressed.shift) {
                    tempElement1 = createCircle2(prevPt, pt, {
                        fill: 'transparent',
                        stroke: 'black',
                        strokeWidth: 0.1
                    });
                    tempElement2 = createRect(prevPt, pt, {
                        fill: 'transparent',
                        stroke: 'black',
                        strokeWidth: 0.1,
                        strokeDasharray: '1,1'
                    });
                } else {
                    tempElement1 = createCircle1(prevPt, pt, {
                        fill: 'transparent',
                        stroke: 'black',
                        strokeWidth: 0.1
                    });
                    const len = dist(prevPt, pt);
                    const pt1 = svgUtils.pt(prevPt.x - len, prevPt.y - len);
                    const pt2 = svgUtils.pt(prevPt.x + len, prevPt.y + len);

                    tempElement2 = createRect(pt1, pt2, {
                        fill: 'transparent',
                        stroke: 'black',
                        strokeWidth: 0.1,
                        strokeDasharray: "1,1"
                    });
                }

            } else if (keyPressed.shift) {
                tempElement1 = createEllipse2(prevPt, pt, {
                    fill: 'transparent',
                    stroke: 'black',
                    strokeWidth: 0.1,
                    strokeDasharray: '1,0'
                });
                tempElement2 = createRect(prevPt, pt, {
                    fill: 'transparent',
                    stroke: 'black',
                    strokeWidth: 0.1,
                    strokeDasharray: '1,1'
                });
            } else {
                tempElement1 = createEllipse1(prevPt, pt, {
                    fill: 'transparent',
                    stroke: 'black',
                    strokeWidth: 0.1,

                });
                tempElement2 = createRectFromCenter(prevPt, pt, {
                    fill: 'transparent',
                    stroke: 'black',
                    strokeWidth: 0.1,
                    strokeDasharray: "1,1"
                });
            }
            break;
        case DrawingModes.RECT:
            if (keyPressed.alt) {//square
                const xLen = Math.abs(prevPt.x - pt.x);
                const yLen = Math.abs(prevPt.y - pt.y);
                const len = xLen > yLen ? xLen : yLen;

                if (keyPressed.shift) {//side start

                    const pmX = pt.x - prevPt.x > 0 ? 1 : -1;
                    const pmY = pt.y - prevPt.y > 0 ? 1 : -1;

                    const pt2 = svgUtils.pt(prevPt.x + len * pmX, prevPt.y + len * pmY);

                    tempElement1 = createRect(prevPt, pt2, {
                        fill: 'transparent',
                        stroke: 'black',
                        strokeWidth: 0.1
                    });
                } else {//center start
                    const pt1 = svgUtils.pt(prevPt.x - len, prevPt.y - len);
                    const pt2 = svgUtils.pt(prevPt.x + len, prevPt.y + len);
                    tempElement1 = createRect(pt1, pt2, {
                        fill: 'transparent',
                        stroke: 'black',
                        strokeWidth: 0.1,
                    });
                }
            } else {
                if (keyPressed.shift) {
                    tempElement1 = createRect(prevPt, pt, {
                        fill: 'transparent',
                        stroke: 'black',
                        strokeWidth: 0.1
                    });
                } else {
                    tempElement1 = createRectFromCenter(prevPt, pt, {
                        fill: 'transparent',
                        stroke: 'black',
                        strokeWidth: 0.1,
                    });
                }
            }

            break;
        case DrawingModes.PATH:
            if (isDragging) {
                if (prevPts.length >= 2) {
                    const pt1 = prevPts[prevPts.length - 2];
                    const pt2 = prevPts[prevPts.length - 1];
                    console.log('arc:', { pt1, pt2, pt })

                    const arc = createArcElement(keyPressed, pt1, pt2, pt);
                    const element = pathBuffer.element.arc(arc.to, arc.arcRad, arc.bigArc, arc.isPositiveArc, true)

                    console.log({ arc })
                    const currElements = pathElements.map(i => i.element);
                    tempElement1 = { info: arc, element: pathBuffer.unclosedRender([...currElements, element], 'black', 'transparent', 0.1, { strokeDasharray: "1,1" }) };
                }

            } else {
                const element = pathBuffer.element.line(pt, true)
                console.log('line:', { element })
                const currElements = pathElements.map(i => i.element);
                tempElement1 = { info: { pt }, element: pathBuffer.unclosedRender([...currElements, element], 'black', 'transparent', 0.1, { strokeDasharray: "1,1" }) };
            }

            break;
        default:
            break;
    }

    let wrapperElements = [];
    let baseElement;
    if (keyPressed.ctrl) {//to show grid.

        baseElement = [...initElement];
    } else {
        baseElement = [...initElement];
    }
    if (tempElement1) {
        setTempElement(tempElement1);
        if (tempElement2) {
            wrapperElements = ([...baseElement, tempElement1.element, tempElement2.element]);
        } else {
            wrapperElements = ([...baseElement, tempElement1.element]);
        }
    }
    return wrapperElements;
}