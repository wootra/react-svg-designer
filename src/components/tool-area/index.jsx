import React from 'react';
import css from './style.module.css';
import { ViewportContext, DesignAreaContext, PathElementsContext } from '../../contexts/globalContexts'
import { useDynamicContextConsumer, useDynamicContextConsumerState } from '../../contexts/dynamic-context-utils';
import History from './tools/history';
import DrawingTools from './tools/drawing-tool-selector';
import PathLogger from './tools/path-logger';
// tool-area/index.html

const rateToPercent = rate => rate * 100 + '%';

export default function (props) {
    const [designArea, setDesignArea] = useDynamicContextConsumer(DesignAreaContext);
    const [viewport, setViewPort] = useDynamicContextConsumer(ViewportContext);
    const onViewportChange = e => {
        const txt = e.target.value;
        const nums = txt.split(' ').map(txt => Number.parseFloat(txt));
        if (nums && nums.length === 4 && nums.find(i => isNaN(i)) === undefined) {
            setViewPort({
                left: nums[0],
                top: nums[1],
                width: nums[2],
                height: nums[3]
            });
        }
    }

    const onDesignAreaChange = e => {
        const txt = e.target.value;
        const nums = txt.split(' ').map(txt => Number.parseFloat(txt));
        if (nums && nums.length === 2) {
            setDesignArea({
                wRate: nums[0],
                hRate: nums[1],
            });
        }
    }
    const viewPortTxt = `${viewport.left} ${viewport.top} ${viewport.width} ${viewport.height}`
    const designAreaTxt = `${designArea.wRate} ${designArea.hRate}`;
    const pathElements = useDynamicContextConsumerState(PathElementsContext);

    return (
        <div className={css.toolboxWrapper}>
            <div className={css.viewportTool}>
                <label>viewport</label>
                <input onChange={onViewportChange} value={viewPortTxt} />
            </div>
            <div className={css.designAreaTool}>
                <label>designArea</label>
                <input onChange={onDesignAreaChange} value={designAreaTxt} />
            </div>
            <div className={css.drawingTools}>
                <DrawingTools />
            </div>
            <div className={css.historyTool}>
                <History />
            </div>
            <div className={css.pathLoggerTool}>
                <PathLogger pathElements={pathElements} />
            </div>
        </div>
    );
}