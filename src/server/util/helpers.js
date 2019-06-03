const Daylog = require('../models/daylog');

const secsDay = 24 * 60 * 60;

const adjustOverlaps = async (leadingDaylog) => {
    console.log('Adjust 1', leadingDaylog);
    const allDaylogs = await Daylog.findDaylogsByDate(leadingDaylog.owner, leadingDaylog.logdate);
    if (allDaylogs && allDaylogs.length > 0) {
        const otherDaylogs = allDaylogs.filter(dl => dl._id.toString() !== leadingDaylog._id.toString());
        if (otherDaylogs && otherDaylogs.length > 0) {
            for (const daylog of otherDaylogs) {
                console.log('Adjust 2', daylog);
                for ( let j = 0; j < leadingDaylog.logs.length; j++) {
                    const leader = Object.assign(leadingDaylog.logs[j]);
                    if (!leader.endTime) {
                        leader.endTime = secsDay;
                    }
                    console.log('Adjust 3 leader', leader.startTime, leader.endTime);
                    if (daylog.logs && daylog.logs.length > 0) {
                        let updated = false;
                        let dayloglength = daylog.logs.length;
                        let i = 0;
                        while (i < dayloglength) {
                            console.log('Adjust 4', i, daylog.logs[i].startTime, daylog.logs[i].endTime);
                            // 1 leader-log covers full daylog-log: delete daylog-log
                            if ( leader.startTime <= daylog.logs[i].startTime && leader.endTime >= daylog.logs[i].endTime) {
                                console.log('Adjust 6a', i, dayloglength);
                                daylog.logs.splice(i,1);
                                dayloglength--;
                                i--;
                                updated = true;    
                            } else 
                            {
                                // 2 leader-log covers start of daylog-log: adjust daylog-log startTime
                                if ( leader.startTime <= daylog.logs[i].startTime && 
                                    (leader.endTime < daylog.logs[i].endTime || !daylog.logs[i].endTime ) &&
                                    leader.endTime >= daylog.logs[i].startTime) {
                                    console.log('Adjust 6b', i);
                                    daylog.logs[i].startTime = leader.endTime + 1;
                                    updated = true;    
                                }
                                // 3 leader-log covers end of daylog-log: adjust daylog-log endTime
                                if ( leader.endTime >= daylog.logs[i].endTime && 
                                    leader.startTime > daylog.logs[i].startTime &&
                                    leader.startTime <= daylog.logs[i].endTime) {
                                    console.log('Adjust 6c', i);
                                    daylog.logs[i].endTime = leader.startTime - 1;
                                    updated = true;    
                                } 
                                // 4 Leader-log in between daylog-log: split daylog 
                                if (daylog.logs[i].startTime < leader.startTime && 
                                    (daylog.logs[i].endTime > leader.endTime || !daylog.logs[i].endTime) ) {
                                    console.log('Adjust 6d', i, dayloglength);
                                    const clone = daylog.logs[i].toObject();
                                    delete clone._id;
                                    clone.startTime = leader.endTime + 1;
                                    daylog.logs.splice(i+1,0,clone);  // duplicate log
                                    daylog.logs[i].endTime = leader.startTime - 1;
                                    updated = true;
                                }
                            }
                        i++;
                    }
                    if (leadingDaylog.isRunning && daylog.isRunning) {
                        daylog.isRunning = false;
                        updated = true;
                    }
                    if (updated) {
                        console.log('Adjust 7, save',daylog);                
                        await daylog.save();
                    }
                }
            }
        }
    }}
};

module.exports.adjustOverlaps = adjustOverlaps;
