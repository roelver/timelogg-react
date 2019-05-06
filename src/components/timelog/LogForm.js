import React, { useState } from 'react';

const LogForm = function(props) {

    const {taskList, controlModal} = props;
    
    const [task, setTask] = useState();
    const [startTimeHH, setStartTimeHH] = useState();
    const [startTimeMM, setStartTimeMM] = useState();
    const [endTimeHH, setEndTimeHH] = useState();
    const [endTimeMM, setEndTimeMM] = useState();
    const [comment, setComment] = useState('');
    
    const submitForm = () => {

    }
    const numberOptionList = (high) => {
        let arr = Array.from(Array(high), (x, index) => index);
        return arr.map(item => {
            return <option key={item} value={item}>{item}</option>;
        });
    }

    return (
        <div className="LogForm">
            <div className="app-modal-header">
                Manual Time Log Entry Form
            </div>
            <div className="app-modal-body">
                <div id="manual">
                    <form id="entryform" onSubmit={submitForm}>
                        <div className="form-group">
                            <label htmlFor="select-task">Task</label>
                            <select className="form-control" required 
                                    name="taskDesc" 
                                    id="select-task" 
                                    value={task}
                                    onChange={setTask}
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
                                    onChange={setStartTimeHH}
                            >
                               { numberOptionList(24) }
                            </select>
                            <span>:</span>
                            <select id="fromMM" 
                                name="fromMM" 
                                required
                                value={startTimeMM}
                                onChange={setStartTimeMM}
                            >
                                { numberOptionList(60) }
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="toHH">Until</label>
                            <select 
                                id="toHH" 
                                name="toHH" 
                                required
                                value={endTimeHH}
                                onChange={setEndTimeHH}
                        >
                                { numberOptionList(24) }
                            </select>
                            <span>:</span>
                            <select 
                                id="toMM" 
                                name="toMM" 
                                required
                                value={endTimeMM}
                                onChange={setEndTimeMM}
                            >
                                { numberOptionList(60) }
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="comment">Comment</label>
                            <input id="comment" type="text" 
                                name="comment" 
                                value={comment}
                                onChange={setComment} 
                                placeholder="Comment" 
                                size="20"/>
                        </div>
                    </form>
                </div>
            </div>
            <div className="app-modal-footer">
                <button className="btn btn-light" onClick={() => controlModal(false)}>Close</button>
                <button type="submit" className="btn btn-light" form="entryform">Save</button>
            </div>
        </div>
  );
}

export default LogForm;