import React, {useState } from 'react';

import { useStateValue } from '../../util/context';
import { today } from '../../util/helper';
import { stopRunning, apiError } from '../../state/apiActions';

import Taskform from './Taskform';

const Taskline = function({ dlog, currentDate, starter }) {

    const myTask = dlog.description;
    const taskid = dlog._id;
    const isToday = currentDate === today();
 
    const [{ auth }, dispatch] = useStateValue();
    
    const [isFormVisible, setIsFormVisible] = useState(false);
    
    const doToggleForm = () => {
        setIsFormVisible(!isFormVisible);
    }

    const doStartRunning = () => {
        starter(dlog);
    }

    const doStopRunning = () => {
        stopRunning(dlog, auth.token)
            .then(action => dispatch(action))
            .catch(error => dispatch(apiError(error)));
    }

    return (
        <tr className="tlbody" key={taskid}>
            <td className="startstop">
                { isToday ? 
                    dlog.isRunning ? 
                        <span className="control" onClick={doStopRunning}>
                            <img src="img/pause.png" alt="Stop recording this task"/>
                        </span>
                        :
                        <span className="control" onClick={doStartRunning}>
                            <img src="img/record.png" alt="Start recording this task"/>
                        </span>
                    : '' 
                }
            </td>
            <td className="taskmenu">
                <button className="btn btn-light menu" onClick={doToggleForm}>
                    <i className="fa fa-cog"></i>
                </button>
                { isFormVisible ? 
                    <Taskform dlog={dlog} close={doToggleForm}/>
                : '' }
            </td>
            <td className="taskdesc">{myTask}</td>
        </tr>
    );
}

export default Taskline;