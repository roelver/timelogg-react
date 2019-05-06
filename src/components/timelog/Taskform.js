import React, { useState } from 'react';

const Taskform = function(props) {

    const [description, setDescription] = useState(props.description);

    const onChangeDescription = (event) => {
        setDescription(event.target.value);
    } 
    const saveTask = () => {
        console.log('saveTask executed');
    }

    const deleteTask = () => {
        console.log('deleteTask executed');
    }
        
    return (
        <div>
            <input className="edit-taskname" 
                type="text" 
                value={description} 
                onChange={onChangeDescription} 
                onLoad="this.select();"
            />
            <button className="btn btn-default" onClick={saveTask}>
                <i className="glyphicon glyphicon-floppy-save"></i>
            </button>
            <button className="btn btn-danger" onClick={deleteTask}>Delete</button>
        </div>
    );
}

export default Taskform;