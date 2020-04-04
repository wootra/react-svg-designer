import React from 'react';
import { useDynamicContextConsumer } from '../../../contexts/dynamic-context-utils';
import { ModeContext } from '../../../contexts/globalContexts';
import svgUtils from '@shjeon0730/svg-gen-utils';
import css from './style.module.css';
import { DrawingModes } from '../../../consts';

export default function DrawingToolSelector(props) {
    const [modes, setModes] = useDynamicContextConsumer(ModeContext);
    const { drawingMode } = modes;
    const modeArr = [];
    for (const key in DrawingModes) {
        if (typeof DrawingModes[key] !== 'function') modeArr.push(DrawingModes[key]);
    }
    const btnProps = (item) => ({
        onClick: e => {
            console.log('drawing mode changed to :', item);
            setModes(state => ({ ...state, drawingMode: item }))
        }
    })

    return modeArr.map(item => {
        const icon = DrawingModes.getIcon(item);
        return (item === drawingMode) ?
            <div className={css.selectedToolBtn} {...btnProps(item)}>{icon}</div> :
            <div className={css.unselectedToolBtn} {...btnProps(item)}>{icon}</div>;
    })
}