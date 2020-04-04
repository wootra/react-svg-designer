import React from 'react';
import { useDynamicContextConsumerState, useDynamicContextConsumer, useDynamicContextProvider } from '../../../contexts/dynamic-context-utils';
import { HistoryContext, ModifyingItemContext } from '../../../contexts/globalContexts';
import { useEffect } from 'react';
import { useState } from 'react';
import svgUtils from '@shjeon0730/svg-gen-utils';
import css from './style.module.css';
import { isEvent, parseEvent } from '../../../utils/event-manager';
import { DrawingModes } from '../../../consts';

const propertyStringParser = element => {
    switch (element.tagName.toLowerCase()) {
        case 'circle':
            return `r: ${element.attributes.r.toFixed(2)}`
        case 'ellipse':
            return `rx,ry: ${element.attributes.rx.toFixed(2)}, ${element.attributes.ry.toFixed(2)}`
        case 'rect':
            return `w,h: ${element.attributes.width.toFixed(2)}, ${element.attributes.height.toFixed(2)}`
        default:
            return "?"
    }
}

const ItemInputGroup = (props) => {
    const { name, initValue, className, onChange } = props;
    const [value, setValue] = useState(initValue);
    const isNumber = typeof initValue === 'number';

    const onItemChange = e => {
        let value = e.target.value;
        setValue(value);
        if (isNumber) value = Number.parseFloat(value);
        onChange(value);
    }

    const valueToShow = typeof value === 'number' ? value.toFixed(3) : value;
    return (<div key={name}>
        <label>{name}</label>
        <input className={className} value={valueToShow} onChange={onItemChange} />
    </div>);
}

const RenderElementInfo = () => {
    const [historyQueue, setHistoryQueue] = useDynamicContextConsumer(HistoryContext);
    const [modifyingItem, setModifyingItem] = useDynamicContextConsumer(ModifyingItemContext);

    const { idx, item } = modifyingItem;
    const onStyleChange = key => value => {
        console.log("onStyleChange:", { key, value, modifyingItem })

        const newInfo = {
            ...modifyingItem.item.info,
            style: {
                ...modifyingItem.item.info.style,
                [key]: value
            }
        };

        let clonedHistory = Object.assign({}, historyQueue[idx]);
        clonedHistory = {
            ...clonedHistory,
            info: newInfo,
            element: {
                ...clonedHistory.element,
                attributes: {
                    ...clonedHistory.element.attributes,
                    ...newInfo
                }
            }
        }
        console.log({ clonedHistory });
        const newQ = historyQueue.map((item, idx) => idx === modifyingItem.idx ? clonedHistory : item);
        setHistoryQueue(newQ);
        setModifyingItem(state => ({ ...state, info: newInfo, item: { ...state.item, info: newInfo } }));
    }

    const onInfoChange = key => value => {
        console.log("info-change", { key, value })
        const newInfo = {
            ...modifyingItem.item.info,
            [key]: value
        }

        let clonedHistory = Object.assign({}, historyQueue[idx]);
        clonedHistory = {
            ...clonedHistory,
            info: newInfo,
            element: {
                ...clonedHistory.element,
                attributes: {
                    ...clonedHistory.element.attributes,
                    ...newInfo
                }
            }
        }
        console.log('cloned history:', { clonedHistory });
        const newQ = historyQueue.map((item, idx) => idx === modifyingItem.idx ? clonedHistory : item);
        setHistoryQueue(newQ);
        setModifyingItem(state => ({ ...state, info: newInfo, item: { ...state.item, info: newInfo } }));
    }
    if (!item) return null;
    const { drawingMode, info, pathLogs } = item;
    switch (drawingMode) {
        case DrawingModes.PATH:
            const infoArr = Object.entries(info).map(([key, value]) => {
                return <ItemInputGroup className={css.pathItemValue} name={key} key={key} initValue={value} onChange={onInfoChange(key)} />
            }) || [];
            const paths = (<div>
                {pathLogs.type}
                {/* pathLog: { type: 'arc', arc } */}
            </div>);
            return [...infoArr, paths];
        default:
            return Object.entries(info).map(([key, value]) => {
                if (key === 'style') {
                    return (<div key={key}>
                        <div className={css.stylesTitle}>Styles</div>
                        <div className={css.stylesWrapper}>
                            {
                                Object.entries(value).map(([styleKey, styleValue]) => {
                                    return <ItemInputGroup className={css.styleItemValue} key={styleKey} name={styleKey} initValue={styleValue} onChange={onStyleChange(styleKey)} />
                                })
                            }
                        </div>
                    </div>);
                } else {
                    return (<div key={key}>
                        <ItemInputGroup className={css.infoItemValue} key={key} name={key} initValue={value} onChange={onInfoChange(key)} />
                    </div>);
                }

            });
    }
}

const ItemRenderer = (props) => {
    const { item, opened, idx, onDeleteBtnClicked, onExpandClicked } = props;
    const element = item.element;
    return (<div key={"key-" + idx} className={css.historyItemWrapper}>
        <div className={css.historyItemTitleRow}>
            <div className={css.expandBtn} onClick={onExpandClicked}>{opened ? '-' : '+'}</div>
            <div className={css.historyItemName}>
                {element.tagName}({propertyStringParser(element)})
            </div>
            <div className={css.deleteHistory} onClick={onDeleteBtnClicked}>X</div>
        </div>
        {
            opened ?
                (
                    <div className={css.elementInfo}>
                        <RenderElementInfo />
                    </div>
                ) : null
        }
    </div>);
}

export default function History(props) {
    const modifyingItemValue = useDynamicContextProvider({ idx: -1, item: null });
    const [historyQueue, setHistoryQueue] = useDynamicContextConsumer(HistoryContext);

    const { state: modifyingItem, setState: setModifyingItem } = modifyingItemValue;
    const [items, setItems] = useState(<div>no data</div>);


    const onDeleteBtnClicked = (idx) => {
        const a = historyQueue.filter((item, i) => i !== idx);
        if (idx === modifyingItem.idx) {
            setModifyingItem({ idx: -1, item: null });
        }
        setHistoryQueue(a);
    }
    const onExpandClicked = (idx) => {
        if (idx >= 0 && modifyingItem.idx === idx) {
            setModifyingItem({ idx: -1, item: null });
        }
        else {
            const clonedItem = Object.assign({}, historyQueue[idx])
            setModifyingItem({ idx, item: clonedItem });
        }
    }

    useEffect(() => {
        console.log("refreshing history items")

        setItems(historyQueue.map((item, idx) => {
            let props;
            console.log("history item", { idx, item });
            if (idx === modifyingItem.idx) {
                props = { opened: true, item: modifyingItem.item, idx, onDeleteBtnClicked: () => onDeleteBtnClicked(idx), onExpandClicked: () => onExpandClicked(idx) };
            } else {
                props = { opened: false, item, idx, onDeleteBtnClicked: () => onDeleteBtnClicked(idx), onExpandClicked: () => onExpandClicked(idx) };
            }

            return <ItemRenderer key={'item-' + idx} {...props} />
        }));

    }, [historyQueue, modifyingItem.idx, modifyingItem])

    return (
        <div className={css.historyWrapper}>
            <ModifyingItemContext.Provider value={modifyingItemValue}>
                {items}
            </ModifyingItemContext.Provider>
        </div>
    )

}