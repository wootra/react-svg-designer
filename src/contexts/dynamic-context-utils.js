import { useState, createContext, useContext } from "react";

export const useDynamicContextProvider = init => {
    const [state, setState] = useState(init);

    return {
        state,
        setState
    }
}

export const useDynamicContextConsumer = context => {
    const { state, setState } = useContext(context);
    return [state, setState];
}

export const useDynamicContextConsumerState = context => {
    const { state } = useContext(context);
    return state;
}

export const useDynamicContextConsumerSetter = context => {
    const { setState } = useContext(context);
    return setState;
}


const defaultDynamicContextData = {
    state: {},
    setState: state => { }
};

export const createDynamicContext = () => createContext(defaultDynamicContextData);