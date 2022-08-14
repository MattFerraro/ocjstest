import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    pop,
    push,
    selectHistory,
} from './historySlice';
import styles from './History.module.css';

export function History() {
    const history = useSelector(selectHistory);
    const dispatch = useDispatch();
    console.log(history)

    return (
        <div>
            {history.map((action, idx) => {
                return <div key={idx}>{action.type}</div>
            })}
            <button onClick={() => dispatch(pop())}>Pop</button>
        </div>
    );
}
