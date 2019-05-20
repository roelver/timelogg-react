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
                // let leaderEndTime = nowSecs();
                // if (!leadingDaylog.isRunning && leadingDaylog.logs[leadingDaylog.logs.length-1].endTime) {
                //     leaderEndTime = leadingDaylog.logs[leadingDaylog.logs.length-1].endTime;
                // }
                otherDaylogs.forEach(async (daylog) => {
                if (daylog.logs && daylog.logs.length > 0) {
                    let updated = false;
                    let dayloglength = daylog.logs.length;
                    let i = 0;
                    while (i < dayloglength) {
                        for ( let j = 0; j < leadingDaylog.logs.length; j++) {
                            const leader = leadingDaylog.logs[j];
                            // Split?
                            if (daylog.logs[i].startTime < leader.startTime && daylog.logs[i].endTime > leader.endTime) {
                                const clone = daylog.logs[i].toObject();
                                delete clone._id;
                                clone.startTime = leader.endTime + 1;
                                daylog.logs.splice(i+1,0,clone);  // duplicate log
                                daylog.logs[i].endTime = leader.startTime - 1;
                                dayloglength++;
                                console.log('Adjusting 1', daylog.logs[i]);
                                updated = true;
                            } else {
//                                console.log('leader', leader, 'other '+i, daylog.logs[i]);
                                if (daylog.logs[i].startTime >= leader.startTime && daylog.logs[i].startTime <= leader.endTime) {
                                    daylog.logs[i].startTime = leader.endTime + 1;
                                    console.log('Adjusting 2', daylog.logs[i]);
                                    updated = true;
                                }
                                if ((daylog.logs[i].endTime === undefined  && !daylog.isRunning) || (daylog.logs[i].endTime >= leader.startTime && daylog.logs[i].endTime <= leader.endTime)) {
                                    daylog.logs[i].endTime = leader.startTime - 1;
                                    console.log('Adjusting 3', daylog.logs[i]);
                                    updated = true;
                                }
                            }     
                            if (daylog.logs[i].startTime >= leader.startTime && daylog.logs[i].endTime <= leader.endTime) {
                                daylog.logs[i].startTime = daylog.logs[i].endTime + 1; // will be deleted below
                                console.log('Adjusting 4', daylog.logs[i]);
                                updated = true;
                            }
                        }
                        if (daylog.logs[i].endTime < daylog.logs[i].startTime) {
                            console.log('Adjusting 5', daylog.logs[i]);
                            daylog.logs.splice(i,1);
                            dayloglength--;
                            updated = true;
                        }
                        i++;
                    }
                    if (leadingDaylog.isRunning && daylog.isRunning) {
                        daylog.isRunning = false;
                        console.log('Adjusting 6', daylog.logs[i]);
                        updated = true;
                    }
                    if (updated) {
                        console.log('Saving adjusted', daylog);
                        await daylog.save();
                    }
                }
            });
        }
    }
};

module.exports.nowSecs = nowSecs;
module.exports.adjustOverlaps = adjustOverlaps;
