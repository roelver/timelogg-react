import React, {useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

import { startRunning, stopRunning, apiError, updateDaylog } from '../../state/apiActions';
import { useStateValue } from '../../util/context';
import { today, getStartTimeFromLeftPosition, getDurationFromWidth, nowSecs, reorgTlogs } from '../../util/helper';
import Taskline from './Taskline';
import Timeline from './Timeline';

const TimelineArea = function(props) {

    const [{ auth, allDaylogs, currentDate, error }, dispatch] = useStateValue();

    const {controlModal} = props;

    // Refresh every 15 seconds
    const [swap, setSwap] = useState(false);

    const refresh = () => {
        const newSwap = !swap;
        setSwap(newSwap);
   } 

    useEffect(() => {
        let timer = null;
        if (currentDate === today()) {
            timer = setTimeout(refresh, 15000);
        }
        if (timer) {
            return () => {
                clearTimeout(timer);
            }
        }
    });

    const doStartRunning = (dlog) => {
        allDaylogs.forEach(daylog => {
            if (daylog.isRunning) {
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
        let updDlog = allDaylogs[dlogIdx];
        const updTlog = updDlog.logs[tlogIdx];
        if (updTlog.startTime !== startTime) {
            updTlog.startTime = startTime;
        }
        if (updTlog.endTime !== endTime) {
            if (endTime > nowSecs()) {
                updTlog.endTime = undefined;
                updDlog.isRunning = true;
            } else {
                updTlog.endTime = endTime;
//                updDlog.isRunning = false;
            }
        }
        updDlog.logs[tlogIdx] = updTlog;
        updDlog.logs = reorgTlogs(updDlog, tlogIdx);
        updateDaylog(updDlog, currentDate, dispatch, auth.token)
            .then(action => dispatch(action))
            .catch(error => dispatch(apiError(error)));
    }

    const deleteBar = (dlogIdx, tlogIdx) => {
        const updDlog = allDaylogs[dlogIdx];
        const tlog = updDlog.logs[tlogIdx];
    
        if (updDlog.isRunning && !tlog.endTime) {
            updDlog.isRunning = false;
        }
        updDlog.logs.splice(tlogIdx,1);
        updateDaylog(updDlog, currentDate, dispatch, auth.token)
            .then(action => dispatch(action))
            .catch(error => dispatch(apiError(error)));
    }

    return (
        <div className="TimelineArea">
	        <div id="marginbox">
		        <div className="header">
			        <div className="tlbody"><div className="hidden">{swap ? '.':','}</div></div>
		        </div>
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

                <div className="footer">
                    <div className="tlbody"></div>
                </div>
	        </div>

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