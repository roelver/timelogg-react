import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import {getBarLeftPosition, 
    getBarWidth, 
    secsDay,
    nowSecs,
    getTimeStr
} from '../../util/helper'


const Timelinebar = function(props) {

    const {myTlog, isToday, doResize, doDelete, dlogIdx, tlogIdx, controlModal } = props;

    const initWidth = getBarWidth(myTlog);
    const initLeft = getBarLeftPosition(myTlog);

    const [width, setWidth ] = useState(initWidth);
    const [left, setLeft ] = useState(initLeft);
    
    if (initWidth !== width) {
        setWidth(initWidth);
        setLeft(initLeft);
    }

    if (!isToday && !myTlog.endTime) {
        myTlog.endTime = secsDay-1;
    }
  
    useEffect(() => {
        if (isToday && !myTlog.endTime) {
            const tmpTlog = {...myTlog};
            tmpTlog.endTime = nowSecs();
            setWidth(getBarWidth(tmpTlog));
        }
    },[isToday, myTlog]);

    const resizeStop = (e, direction, ref, delta, position) => {
        setWidth(ref.offsetWidth);
        setLeft(position.x);
        doResize(dlogIdx, tlogIdx, position.x, ref.offsetWidth);
    }

    const onResize = (e, direction, ref, delta, position) => {
        if (direction === 'left') {
            setLeft(position.x);
        }
    }

    const handleDelete = (e, data) => {
        doDelete(dlogIdx, tlogIdx);
    }

    const handleEdit = (e) => {
        const formData = {
            ...myTlog,
            dlogIdx,
            tlogIdx
        };
        controlModal(true, formData);
    }
    const title = getTimeStr(isToday, myTlog.startTime) + '-' + getTimeStr(isToday, myTlog.endTime) + ': ' + myTlog.comment;

    const menuid = 'menu_'+dlogIdx+'_'+tlogIdx;
    return (
        <div>
            <ContextMenuTrigger className='contextmenu' id={menuid}>
                <Rnd
                    className='bar'
                    size={{ width: width + 'px'}}
                    position={{ x: left, y: 10 }}
                    onResize={onResize}
                    onResizeStop={resizeStop}
                    minHeight='12px'
                    title={title}
                    disableDragging={true}
                    enableResizing={{ top: false, right:true, bottom:false, left:true, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false}}
                ></Rnd>
            </ContextMenuTrigger>

            <ContextMenu id={menuid}>
                <MenuItem data={{foo: 'bar'}} onClick={handleDelete}>
                    Delete
                </MenuItem>
                <MenuItem onClick={handleEdit}>
                    Edit
                </MenuItem>
            </ContextMenu>
        </div>
    );
}


export default Timelinebar;
