import React, { useState } from 'react';

import {createTimelog, apiError, updateDaylog } from '../../state/apiActions';
import { useStateValue } from '../../util/context';
import { toTime, getHH, getMM, today, nowSecs } from '../../util/helper';

const LogForm = function(props) {

    const {taskList, controlModal, saveFormData, formData} = props;
    const [{ auth, currentDate, allDaylogs }, dispatch] = useStateValue();
    
    const taskDesc = formData ? 
                        formData.task ? formData.task : 
                            taskList.length > 0 ? taskList[formData.dlogIdx] : 
                                taskList.length > 0 ? taskList[0] 
                                : undefined 
                     : undefined;
    const [task, setTask] = useState(taskDesc);
    const [startTimeHH, setStartTimeHH] = useState(formData ? getHH(formData.startTime) : 0);
    const [startTimeMM, setStartTimeMM] = useState(formData ? getMM(formData.startTime) : 0);
    const [endTimeHH, setEndTimeHH] = useState(formData ? getHH(formData.endTime) : 0);
    const [endTimeMM, setEndTimeMM] = useState(formData ? getMM(formData.endTime) : 0);
    const [comment, setComment] = useState(formData ? formData.comment : '');
    
    const handleTask = (evt) =>{
        setTask(evt.target.value);
    }
    const handleStartTimeHH = (evt) =>{
        setStartTimeHH(evt.target.value);
    }
    const handleStartTimeMM = (evt) =>{
        setStartTimeMM(evt.target.value);
    }

    const handleEndTimeHH = (evt) =>{
        setEndTimeHH(evt.target.value);
    }
    const handleEndTimeMM = (evt) =>{
        setEndTimeMM(evt.target.value);
    }
    const handleComment = (evt) =>{
        setComment(evt.target.value);
    }

    const submitForm = (evt) => {
        evt.preventDefault();
        const startTime = toTime(startTimeHH, startTimeMM, 0);
        const endTime = toTime(endTimeHH, endTimeMM, 0);
        if (formData && formData.dlogIdx && formData.tlogIdx) {
            let updDlog = allDaylogs[formData.dlogIdx];
            const updTlog = updDlog.logs[formData.tlogIdx];
            
            updTlog.startTime = startTime;
            updTlog.endTime = endTime;
            updTlog.comment = comment;
            if (task === updDlog.description) {
                updDlog.logs[formData.tlogIdx] = updTlog;
            } else {
                const newDlog = allDaylogs.filter(dlog => dlog.description === task );
                if (!newDlog) {
                    throw Error('The selected task could not be found');
                }
                updDlog = newDlog[0];
                updDlog.logs.push(updTlog);
            }
            updateDaylog(updDlog, currentDate, dispatch, auth.token)
                .then(action => dispatch(action))
                .catch(error => dispatch(apiError(error)));                    
        } else {
            const taskLog = {
                description: task,
                log: {
                    startTime: startTime,
                    endTime: endTime,
                    comment: comment
                }
            };
            createTimelog(currentDate, taskLog, dispatch, auth.token)
                .then(action => dispatch(action))
                .catch(error => dispatch(apiError(error)));
        }
        const data = {
            task, startTime, endTime, comment
        }
        saveFormData(data);
        controlModal(false);
    }

    const numberOptionList = (listId, high) => {
        let arr = Array.from(Array(high), (x, index) => index);
        return arr.map(item => {
            return <option key={listId+item} value={item}>{item}</option>;
        });
    }

    const formInvalid = () => {
        console.log(task, currentDate, 'Start', startTimeHH, startTimeMM, 'End', endTimeHH, endTimeMM, 'Now', today(), nowSecs());
        const invalid = !( task && 
            (parseInt(startTimeHH) < parseInt(endTimeHH) || 
                (startTimeHH === endTimeHH && parseInt(startTimeMM) < parseInt(endTimeMM) ) ) 
            && (currentDate !== today() || toTime(startTimeHH, startTimeMM, 0) < nowSecs()));    
        return invalid;
    }

    return (
        <div className="LogForm modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">Manual Time Log Entry Form</div>
                    </div>
                    <div className="modal-body">
                        <div id="manual">
                            <form id="entryform" onSubmit={submitForm}>
                                <div className="form-group">
                                    <label htmlFor="select-task">Task</label>
                                    <select className="form-control" required 
                                            name="taskDesc" 
                                            id="select-task" 
                                            value={task}
                                            onChange={handleTask}
                                    >
                                        { taskList.map(task => {
                                            return <option key={task} value={task}>{task}</option>;
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fromHH">From</label>
                                    <select id="fromHH" 
                                            name="fromHH" 
                                            required
                                            value={startTimeHH}
                                            onChange={handleStartTimeHH}
                                    >
                                    { numberOptionList('fromHH',24) }
                                    </select>
                                    <span>:</span>
                                    <select id="fromMM" 
                                        name="fromMM" 
                                        required
                                        value={startTimeMM}
                                        onChange={handleStartTimeMM}
                                    >
                                        { numberOptionList('fromMM',60) }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="toHH">Until</label>
                                    <select 
                                        id="toHH" 
                                        name="toHH" 
                                        required
                                        value={endTimeHH}
                                        onChange={handleEndTimeHH}
                                >
                                        { numberOptionList('toHH',24) }
                                    </select>
                                    <span>:</span>
                                    <select 
                                        id="toMM" 
                                        name="toMM" 
                                        required
                                        value={endTimeMM}
                                        onChange={handleEndTimeMM}
                                    >
                                        { numberOptionList('toMM',60) }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="comment">Comment</label>
                                    <input id="comment" type="text" 
                                        name="comment" 
                                        value={comment}
                                        onChange={handleComment} 
                                        placeholder="Comment" 
                                        size="20"/>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-light" onClick={() => controlModal(false)}>Close</button>
                        <button type="submit" className="btn btn-light" form="entryform" disabled={formInvalid()}>Save</button>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default LogForm;