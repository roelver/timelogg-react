import React from 'react';

import {getBarLeftPosition, 
    getBarWidth, 
    getComment, 
    deleteLog
} from '../../util/helper'

const Timelinebar = function(props) {

    const {myTlog, idx, miDlogIdx} = props;

    let left = '';
    let width = '';
    let comment = '';
    
    const updateProperties = () => {
        left = '' + getBarLeftPosition(myTlog) + 'px';
        width = '' + getBarWidth(myTlog) + 'px';
        comment = getComment(myTlog);
    }

    const onDelete = () => {
        deleteLog(miDlogIdx, idx);
    }

    updateProperties();

    return (
        <div className="bar"
		  style={{'left': left, 'width': width}}
		  title={comment}
	     ></div>
    );
}

export default Timelinebar;
