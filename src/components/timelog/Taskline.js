import React from 'react';

import Taskform from './Taskform';

const Taskline = function(props) {

    const myTask = props.myTask;
    
    const isToday = true;
    const isRunning = false;
    const isFormVisible = false;
    
    const startRunning = () => {
        console.log('startRunning executed');        
    }

    const stopRunning = () => {
        console.log('stopRunning executed');                
    }
        
    const toggleForm = () => {
        console.log('toggleForm executed');        
    }
        
    return (
        <tr className="tlbody" key={props.taskid}>
            <td className="startstop">
                { isToday ? 
                    isRunning ? 
                        <span className="control" onClick={stopRunning}>
                            <img src="img/pause.png" alt="Stop recording this task"/>
                        </span>
                        :
                        <span className="control" onClick={startRunning}>
                            <img src="img/record.png" alt="Start recording this task"/>
                        </span>
                    : '' 
                }
            </td>
            <td className="taskmenu">
                <button className="btn btn-default menu" onClick={toggleForm}>
                    <i className="glyphicon glyphicon-option-vertical"></i>
                </button>
                { isFormVisible ? 
                    <Taskform description={myTask}/>
                : '' }
            </td>
            <td className="taskdesc">{myTask}</td>
        </tr>
    );
}

export default Taskline;