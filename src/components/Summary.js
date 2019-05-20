import React, {useEffect, useState} from 'react';
import { Alert } from 'react-bootstrap';
import moment from 'moment';

import { useStateValue } from '../util/context';
import { updateDate } from '../state/clientActions';
import { loadDaylogs, updateDaylog, loadError, apiError} from '../state/apiActions';
import { increaseDate, today, nowSecs } from '../util/helper';

const Summary = function() {

    const [{ auth, allDaylogs, currentDate, error }, dispatch] = useStateValue();

    const [swap, setSwap] = useState(false);
    
    const refresh = () => {
        setSwap(!swap);
   } 

    useEffect(() => {
        if (currentDate === today()) {
            setTimeout(refresh, 15000);
        }
    });

    useEffect( () => {
        loadDaylogs(currentDate, auth.token)
            .then(action => dispatch(action))
            .catch(error => dispatch(loadError(error)));
    }, [currentDate, auth, dispatch]);

    const doUpdateDate = (newDate) => {
        dispatch(updateDate(newDate));
    }

    const previousDay = () => {
        doUpdateDate(increaseDate(currentDate, -1));        
    }

    const setDay = (event) => {
        const newDate = event.target.value;
        doUpdateDate(newDate);        
    }

    const nextDay = () => {
        doUpdateDate(increaseDate(currentDate, 1));
    }
    const deleteBar = (dlogIdx, tlogIdx) => {
        console.log('Delete bar', dlogIdx, tlogIdx);
        const updDlog = allDaylogs[dlogIdx];
        updDlog.logs.splice(tlogIdx,1);
        updateDaylog(updDlog, currentDate, dispatch, auth.token)
            .then(action => dispatch(action))
            .catch(error => dispatch(apiError(error)));
    }

    const getParticlesStr = (sec) => {
        return moment(sec * 1000).utc().format('HH:mm:ss');
    }
    const getDuration = (tlog) => {
        let endT = tlog.endTime;
        if (!endT || endT < 0) {
            endT = nowSecs();
        }
        return endT - tlog.startTime;
    }

    const totalDuration = () => {
        let sum = 0;
        for (let j = 0; j < allDaylogs.length; j++) {
            for (let i = 0; i < allDaylogs[j].logs.length; i++) {
                sum += getDuration(allDaylogs[j].logs[i]);
            }
        }
        return getParticlesStr(sum);
    }

    const taskDuration = (idx) => {
        let sum = 0;
        for (let i = 0; i < allDaylogs[idx].logs.length; i++) {
            sum += getDuration(allDaylogs[idx].logs[i]);
        }
        return getParticlesStr(sum);
    }

    const getStartStr = (tlog) => {
        return getParticlesStr(tlog.startTime);
    }

    const getEndStr = (tlog) => {
        if (!tlog.endTime || tlog.endTime < 0) {
            return 'now';
        }
        return getParticlesStr(tlog.endTime);
    }

    const getDurationStr = (tlog) => {
        let endT = tlog.endTime;
        if (!endT || endT < 0) {
            endT = nowSecs();
        }
        const diff = endT - tlog.startTime;
        return getParticlesStr(diff);
    }

    const getDurationStrOut = (tlog) => {
        // To prevent and exception
        if (tlog.endTime <= 0) {
            return 'Running';
        } else {
            return getDurationStr(tlog);
        }
    }


    return (
        <div className="Summary">
            <div className="row">
                <div className="right">
                    <img src="img/arrow-left.png" alt="Previous day" onClick={previousDay} className="changeDate" />
                    <input id="displayDate" type="date" value={currentDate || today() } onChange={setDay}/>
                    <img src="img/arrow-right.png" alt="Next day" onClick={nextDay} className="changeDate" />
                </div> 
            </div> 
            <h1>Summary page</h1>
            <table className="summary table-bordered">
                <thead>
                    <tr>
                        <th className="taskname">Task</th>
                        <th className="details">Details</th>
                        <th className="duration">Total Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        allDaylogs.map((dlog,i) => 
                            dlog.logs.map((tlog, j) => {
                                return (
                                    <tr key={`${dlog._id}_${j}`}>
                                        { j === 0 ?
                                        <td key={`${i}_0_${dlog.description}`} className="taskname" rowSpan={dlog.logs && dlog.logs.length > 0 ? dlog.logs.length : 1}>
                                            { dlog.description }
                                        </td> : null
                                        }
                                        <td key={tlog._id} className="details">
                                            <span className="pull-right del-button" onClick={() => deleteBar(i,j)}>&times;</span>
                                            <span>{getStartStr(tlog)} - {getEndStr(tlog)} ({getDurationStrOut(tlog)}): {tlog.comment}</span>
                                        </td>
                                        { j === 0 ?
                                        <td key={`${i}_1_${dlog.description}`} className="duration" rowSpan={dlog.logs && dlog.logs.length > 0 ? dlog.logs.length : 1}>
                                            { taskDuration(i) }
                                        </td> : null
                                        }
                                    </tr>
                                );
                            })
                        )
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="2" className="footer">Total time</td>
                        <td colSpan="2" className="footer">{ totalDuration() }</td>
                    </tr>
                </tfoot>
            </table>
            { error ? <Alert>{error}</Alert> : ''}
        </div>
    );
}
export default Summary;
