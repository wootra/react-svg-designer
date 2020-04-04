export const DrawingModes = Object.freeze({
    NONE: ['none', 'N'],
    PATH: ['path', 'Pa'],
    RECT: ['rect', 'Rt'],
    CIRCLE: ['circle', 'Cr'],
    getName: drawingMode => drawingMode[0],
    getIcon: drawingMode => drawingMode[1],
})