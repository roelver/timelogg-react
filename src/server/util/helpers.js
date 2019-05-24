const Daylog = require('../models/daylog');

const nowSecs = () => {
    const dt = new Date();

    return (dt.getHours() * 60 * 60) +
           (dt.getMinutes() * 60) +
            dt.getSeconds();
};

const adjustOverlaps = async (leadingDaylog) => {
    const allDaylogs = await Daylog.findDaylogsByDate(leadingDaylog.owner, leadingDaylog.logdate);
    if (allDaylogs && allDaylogs.length > 0) {
        const otherDaylogs = allDaylogs.filter(dl => dl._id.toString() !== leadingDaylog._id.toString());
        if (otherDaylogs && otherDaylogs.length > 0) {
            otherDaylogs.forEach(async (daylog) => {
                if (daylog.logs && daylog.logs.length > 0) {
                    let updated = false;
                    let dayloglength = daylog.logs.length;
                    let i = 0;
                    while (i < dayloglength) {
                        console.log('Daylog', i, daylog.logs[i]);
                        for ( let j = 0; j < leadingDaylog.logs.length; j++) {
                            const leader = Object.assign(leadingDaylog.logs[j]);
                            if (!leader.endTime) {
                                leader.endTime = nowSecs();
                               if (!daylog.logs[i].endTime) {
                                    daylog.logs[i].endTime = leader.endTime -1;
                                    daylog.isRunning = false;
                                    updated = true;
                               }
                            }
                            console.log('Lead', j, leader);
                            // 1 leader-log covers full daylog-log: delete daylog-log
                            if ( leader.startTime <= daylog.logs[i].startTime && leader.endTime >= daylog.logs[i].endTime) {
                                console.log('1. fully covered, delete ', daylog.logs[i]);
                                daylog.logs.splice(i,1);
                                dayloglength--;
                                updated = true;    
                            } else {
                            // 2 leader-log covers start of daylog-log: adjust daylog-log startTime
                            if ( leader.startTime <= daylog.logs[i].startTime && 
                                 (leader.endTime < daylog.logs[i].endTime || !daylog.logs[i].endTime ) &&
                                  leader.endTime >= daylog.logs[i].startTime) {
                                console.log('2. Cover start, adjust start ', daylog.logs[i]);
                                daylog.logs[i].startTime = leader.endTime + 1;
                                updated = true;    
                            } else {
                            // 3 leader-log covers end of daylog-log: adjust daylog-log endTime
                            if ( leader.endTime >= daylog.logs[i].endTime && 
                                leader.startTime > daylog.logs[i].startTime &&
                                leader.startTime <= daylog.logs[i].endTime) {
                               console.log('3. Cover end, adjust end ', daylog.logs[i]);
                               daylog.logs[i].endTime = leader.startTime - 1;
                               updated = true;    
                            } else {
                            // 4 Leader-log in between daylog-log: split daylog 
                            if (daylog.logs[i].startTime < leader.startTime && 
                                (daylog.logs[i].endTime > leader.endTime || !daylog.logs[i].endTime) ) {
                                const clone = daylog.logs[i].toObject();
                                delete clone._id;
                                clone.startTime = leader.endTime + 1;
                                daylog.logs.splice(i+1,0,clone);  // duplicate log
                                daylog.logs[i].endTime = leader.startTime - 1;
                                dayloglength++;
                                console.log('4. Cover part, split ', daylog.logs[i], clone);
                                updated = true;
                            }
                        }}}
                    }
                    i++;
                }
                if (leadingDaylog.isRunning && daylog.isRunning) {
                    daylog.isRunning = false;
                    updated = true;
                }
                if (updated) {
                    console.log('Saving adjusted', daylog);
                    await daylog.save();
                }
            }});
        }
    }
};

module.exports.nowSecs = nowSecs;
module.exports.adjustOverlaps = adjustOverlaps;
