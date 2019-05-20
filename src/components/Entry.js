import React, { useState, useEffect } from 'react';

import { useStateValue } from '../util/context';
import { updateDate } from '../state/clientActions';
import { loadDaylogs, createDaylog, loadError, apiError, copyRecentTasks } from '../state/apiActions';
import { increaseDate, today } from '../util/helper';

import LogForm from './timelog/LogForm';
import TimelineArea from './timelog/TimelineArea';

const Entry = function() {

    const [{ auth, allDaylogs, currentDate }, dispatch] = useStateValue();
    
    const [ tasks, setTasks] = useState([]);
    const [ showModal, setShowModal] = useState(false);
    const [ formData, setFormData] = useState();
    
    const controlModal = (toggle, data) => {
        setFormData(data);
        setShowModal(toggle);        
    }

    useEffect( () => {
        loadDaylogs(currentDate, auth.token)
            .then(action => dispatch(action))
            .catch(error => dispatch(loadError(error)));
    }, [currentDate, auth, dispatch]);

    useEffect( () => {
        console.log('make taskList from', allDaylogs);
        setTasks(allDaylogs.map(log => log.description));
    }, [allDaylogs]);

    const onCopyRecent = () => {
        copyRecentTasks(currentDate, dispatch, auth.token);
    }
    
    const onNewTask = () => {
        createDaylog(currentDate, auth.token)
            .then(action => dispatch(action))
            .catch(error => dispatch(apiError(error)));
    }

    const doUpdateDate = (newDate) => {
        dispatch(updateDate(newDate));
    }

    const previousDay = () => {
        doUpdateDate(increaseDate(currentDate, -1));        
    }

    const setDay = (event) => {
        const newDate = event.target.value;
        doUpdateDate(newDate);        
    }

    const nextDay = () => {
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

            {showModal ? <LogForm taskList={tasks} formData={formData} controlModal={controlModal}/> : '' }

            <div className="entries">
                <TimelineArea 
                    controlModal={controlModal}
                />
                <p className="controls">
                    <span className="control" onClick={onNewTask}>
                        <img src="img/add.png" alt="Add a new task"/>
                    </span>
                    <button className="btn btn-light" onClick={onCopyRecent}>Copy recent tasks</button>
                    <button className="btn btn-light" disabled={showModal} onClick={() => controlModal(true, undefined)}>Enter Manual Time</button>
                </p>
            </div>
        </div>
    );
}
export default Entry;
