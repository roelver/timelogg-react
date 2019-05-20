import React, {useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

import { startRunning, stopRunning, apiError, updateDaylog } from '../../state/apiActions';
import { useStateValue } from '../../util/context';
import { today, getStartTimeFromLeftPosition, getDurationFromWidth } from '../../util/helper';
import Taskline from './Taskline';
import Timeline from './Timeline';

const TimelineArea = function(props) {

    const [{ auth, allDaylogs, currentDate, error }, dispatch] = useStateValue();

    const {controlModal} = props;

    // Refresh every 15 seconds
    const [swap, setSwap] = useState(false);

    const refresh = () => {
        setSwap(!swap);
   } 

    useEffect(() => {
        if (currentDate === today()) {
            setTimeout(refresh, 15000);
        }
    });

    console.log('TimelineArea', allDaylogs, error);

    const doStartRunning = (dlog) => {
        allDaylogs.forEach(daylog => {
            if (daylog.isRunning) {
                console.log('Stop task', daylog.description);
                stopRunning(daylog, auth.token)
                    .then(action => dispatch(action))
                    .catch(error => dispatch(apiError(error)));
            }
        });
        startRunning(dlog._id, auth.token)
           .then(action => dispatch(action))
           .catch(error => dispatch(apiError(error)));
    }

    const resizeBar = (dlogIdx, tlogIdx, left, width) => {
        const startTime = getStartTimeFromLeftPosition(left);
        const endTime = startTime + getDurationFromWidth(width);
        console.log('Area resize', dlogIdx, tlogIdx, left, width, '=>', startTime, endTime);
        const updDlog = allDaylogs[dlogIdx];
        const updTlog = updDlog.logs[tlogIdx];
        if (updTlog.startTime !== startTime) {
            updTlog.startTime = startTime;
        }
        if (updTlog.endTime && updTlog.endTime !== endTime) {
            updTlog.endTime = endTime;
        }
        updDlog.logs[tlogIdx] = updTlog;
        updateDaylog(updDlog, currentDate, dispatch, auth.token)
            .then(action => dispatch(action))
            .catch(error => dispatch(apiError(error)));
    }

    const deleteBar = (dlogIdx, tlogIdx) => {
        console.log('Delete bar', dlogIdx, tlogIdx);
        const updDlog = allDaylogs[dlogIdx];
        updDlog.logs.splice(tlogIdx,1);
        updateDaylog(updDlog, currentDate, dispatch, auth.token)
            .then(action => dispatch(action))
            .catch(error => dispatch(apiError(error)));
    }

    return (
        <div className="TimelineArea">
	        <table id="marginbox" cellSpacing="0">
                <tbody>
		        <tr className="header">
			        <td colSpan="3" className="tlbody"></td>
		        </tr>
                { allDaylogs.map((dlog, index) => {
                       return (
                            <Taskline 
                                idx={index} 
                                key={dlog._id}
                                dlog={dlog}
                                currentDate={currentDate} 
                                userEmail={auth.email}
                                starter={doStartRunning} />
                        );
                    })
                }

                <tr className="footer">
                    <td colSpan="3" className="tlbody"></td>
                </tr>
                </tbody>
	        </table>

            <div id="scrollview">
                <table id="scrollbox" cellSpacing="0">
                    <tbody>
                    <tr className="header">
                        <td className="tlscale"><img  src="img/bgscale.png" alt="Time scale" /></td>
                    </tr>
                    { allDaylogs.map((dlog, index) => {
                            return (
                                <tr className="tlbody" key={dlog._id}>
                                    <Timeline
                                        dlogIdx={index}
                                        currentDate={currentDate}
                                        myDaylog={dlog}
                                        doResize={resizeBar}
                                        doDelete={deleteBar}
                                        controlModal={controlModal}
                                        />
                                </tr>
                            );
                        })
                    }
                    <tr className="header">
                        <td className="tlscale"><img  src="img/bgscale.png" alt="Time scale" /></td>
                    </tr>
                    </tbody>
                </table>
                { error ? <Alert className='error'>{error}</Alert> : '' }
            </div>
        </div>
    );
}

export default TimelineArea;