
function createEventType(typeName) {
    return Object.freeze({
        objectType: 'event-type',
        typeName
    });
}
export const MouseEventTypes = Object.freeze({
    CLICK: createEventType("Click"),
    DRAG: createEventType("Drag")
});

const eventObjectTypeName = Object.freeze({
    name: 'svg-designer-event'
});

export function createAEvent(eventType, pt1, pt2) {
    console.log('create an event:', eventType, pt1, pt2);
    return {
        objectType: eventObjectTypeName,
        eventType,
        updated: Date.now(),
        clickedPt: eventType === MouseEventTypes.CLICK ? pt1 : null,
        dragStartPt: eventType === MouseEventTypes.DRAG ? pt1 : null,
        dragEndPt: eventType === MouseEventTypes.DRAG ? pt2 : null
    }
}

export function isEvent(item) {
    if (item.objectType === eventObjectTypeName) return true;
    else return false;
}

const ptToString = pt => (`(${pt.x.toFixed(2)},${pt.y.toFixed(2)})`);

const eventToString = (item) => {
    console.log('eventToString:', item);
    return item.eventType === MouseEventTypes.CLICK ?
        'Click on ' + ptToString(item.clickedPt) :
        'Drag from ' + ptToString(item.dragStartPt) + ' to ' + ptToString(item.dragEndPt);
}

export function parseEvent(item) {
    return Object.freeze({
        eventType: item.eventType,
        clickedPt: item.clickedPt,
        dragStartPt: item.dragStartPt,
        dragEndPt: item.dragStartPt,
        toString: () => eventToString(item)
    })
}