import React from 'react';

import { useStateValue } from '../../util/context';
import Taskline from './Taskline';
import Timeline from './Timeline';

const TimelineArea = function(props) {

    const [{ auth, allDaylogs, currentDate }] = useStateValue();

    console.log('TimelineArea', allDaylogs);

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
                                myTask={dlog.description} 
                                idx={index} 
                                key={dlog._id}
                                taskid={dlog._id}
                                currentDate={currentDate} 
                                userEmail={auth.email} 
                                isRunning={dlog.isRunning} />
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
                    {
                        allDaylogs.map((dlog, index) => {
                            return (
                                <tr className="tlbody" key={dlog._id}>
                                    <Timeline
                                        idx={index}
                                        currentDate={currentDate}
                                        myDaylog={dlog}
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
            </div>
        </div>
    );
}

export default TimelineArea;