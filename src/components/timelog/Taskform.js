import React, { useState } from 'react';

import { useStateValue } from '../../util/context';
import { updateDaylog, deleteDaylog, apiError } from '../../state/apiActions';

const Taskform = function(props) {

    const [{ auth }, dispatch] = useStateValue();

    const [description, setDescription] = useState(props.dlog.description);
    const myDaylog = props.dlog;
    const close = props.close;

    const onChangeDescription = (event) => {
        setDescription(event.target.value);
    } 
    const saveTask = () => {
        myDaylog.description = description;
        updateDaylog(myDaylog, auth.token)
            .then(action => dispatch(action))
            .catch(error => dispatch(apiError(error)));
        close();
    }

    const deleteTask = () => {
        deleteDaylog(myDaylog, auth.token)
            .then(action => dispatch(action))
            .catch(error => dispatch(apiError(error)));
        close();
    }
        
    return (
        <div>
            <input className="edit-taskname" 
                type="text" 
                value={description} 
                onChange={onChangeDescription} 
            />
            <button className="btn btn-light" onClick={saveTask}>
                <i className="fa fa-floppy-o"></i>
            </button>
            <button className="btn btn-danger" onClick={deleteTask}>Delete</button>
        </div>
    );
}

export default Taskform;