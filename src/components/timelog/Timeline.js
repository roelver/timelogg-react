import React from 'react';

import { today } from '../../util/helper';
import Timelinebar from './Timelinebar';

const Timeline = function(props) {

    const { myDaylog, dlogIdx, currentDate, doResize, doDelete, controlModal } = props;

    return (
        <td className="line">
        {
            myDaylog.logs.map((log, index) => {
                return (
                    <Timelinebar 
                        tlogIdx={index}
                        key={log._id}
                        myTlog={log}
                        dlogIdx={dlogIdx}
                        isToday={currentDate === today()}
                        doResize={doResize}
                        doDelete={doDelete}
                        controlModal={controlModal}
                        />
                );
            })
        }
        </td> 
    );
}

export default Timeline;
