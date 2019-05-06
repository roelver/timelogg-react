import React from 'react';

import Timelinebar from './Timelinebar';

const Timeline = function(props) {

    const { myDaylog, miDlogIdx, currentDate } = props;

    return (
        <td className="line">
        {
            myDaylog.logs.map((log, index) => {
                return (
                    <Timelinebar 
                        idx={index}
                        key={log._id}
                        myTlog={log}
                        miDaylogIdx={miDlogIdx}
                        updateFlag={myDaylog.updateFlag}
                        currentDate={currentDate}
                    />
                );
            })
        }
        </td> 
    );
}

export default Timeline;
