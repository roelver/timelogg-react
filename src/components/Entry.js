import React, { useState, useEffect } from 'react';

import { useStateValue } from '../util/context';
import { updateDate, loadDaylogs } from '../state/actions';
import { increaseDate, today } from '../util/helper';

import LogForm from './timelog/LogForm';
import TimelineArea from './timelog/TimelineArea';

const Entry = function() {
    const [{ auth, allDaylogs, currentDate }, dispatch] = useStateValue();
    
    console.log('Entry', allDaylogs, currentDate);

    const [ tasks, setTasks] = useState([]);
    const [ showModal, setShowModal] = useState(false);
        
    const controlModal = (toggle) => {
        setShowModal(toggle);        
    }

    useEffect( () => {
        loadDaylogs(currentDate, auth.token)
            .then(action => dispatch(action));
    }, [currentDate, auth, dispatch]);

    useEffect( () => {
        setTasks(allDaylogs.map(log => log.task));
    }, [allDaylogs]);

    const onCopyRecent = () => {
    }
    
    const onNewTask = () => {
    }

    const doUpdateDate = (newDate) => {
        dispatch(updateDate(newDate));
    }

    const previousDay = () => {
        doUpdateDate(increaseDate(currentDate, -1));        
    }

    const setDay = (event) => {
        const newDate = event.target.value;
        console.log('Update', newDate);
        doUpdateDate(newDate);        
    }

    const nextDay = () => {
        console.log('Next date', currentDate);
        doUpdateDate(increaseDate(currentDate, 1));
    }

    return (
        <div className="Entry">
            <div className="row">
                <div className="right">
                    <img src="img/arrow-left.png" alt="Previous day" onClick={previousDay} className="changeDate" />
                    <input id="displayDate" type="date" value={currentDate || today() } onChange={setDay}/>
                    <img src="img/arrow-right.png" alt="Next day" onClick={nextDay} className="changeDate" />
                </div> 
            </div> 

            {showModal ? <LogForm taskList={tasks} controlModal={controlModal}/> : '' }

            <div className="entries">
                <TimelineArea 
                    userid={auth.email} 
                />
                <p className="controls">
                    <span className="control" onClick={onNewTask}>
                        <img src="img/add.png" alt="Add a new task"/>
                    </span>
                    <button className="btn btn-light" onClick={onCopyRecent}>Copy recent tasks</button>
                    <button className="btn btn-light" onClick={() => controlModal(true)}>Enter Manual Time</button>
                </p>
            </div>
        </div>
    );
}
export default Entry;
