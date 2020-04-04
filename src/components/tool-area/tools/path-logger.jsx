import React, { useEffect } from 'react';
import { useDynamicContextConsumerState } from '../../../contexts/dynamic-context-utils';
import { PathElementsContext } from '../../../contexts/globalContexts';
import css from './style.module.css';


const ptToString = pt => {
    return '(' + [pt.x.toFixed(2), pt.y.toFixed(2)].join(',') + ')';
}

const logPath = item => {
    const log = item.pathLog;
    if (log.type === 'line') {
        return 'lintTo:' + ptToString(log.pt);
    } else if (log.type === 'arc') {
        const arc = log.arc;
        return 'arc ' + 'to' + ptToString(arc.to) + ' rad' + arc.arcRad.toFixed(2) + ' (' + arc.bigArc + ',' + arc.isPositiveArc + ')';

    } else {
        return 'what is this type? ' + log.type;
    }
}

export default function PathLogger(props) {
    const { pathElements } = props;

    return (<div className={css.pathLoggerWrapper}>
        <div>Path logger</div>
        {pathElements.map((i, idx) => {
            console.log({ path: i })
            return (<div key={idx} className={css.pathLogItem}>
                {logPath(i)}
            </div>);
        })}
    </div>);
}