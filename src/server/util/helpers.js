const Daylog = require('../models/daylog');

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
                                updated = true;
                            } else {
                                if (daylog.logs[i].startTime >= leader.startTime && daylog.logs[i].startTime <= leader.endTime) {
                                    daylog.logs[i].startTime = leader.endTime + 1;
                                    updated = true;
                                }
                                if (daylog.logs[i].endTime >= leader.startTime && daylog.logs[i].endTime <= leader.endTime) {
                                    daylog.logs[i].endTime = leader.startTime - 1;
                                    updated = true;
                                }
                            }     
                        }
                        if (daylog.logs[i].endTime < daylog.logs[i].startTime) {
                            daylog.logs.splice(i,1);
                            dayloglength--;
                        }
                        i++;
                    }
                    if (updated) {
                        await daylog.save();
                    }
                }
            });
        }
    }
}

module.exports = {
    adjustOverlaps: adjustOverlaps
};