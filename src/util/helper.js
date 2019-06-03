export const secsDay = 24 * 60 * 60;

export const getBarLeftPosition = (log) => {
    return (log.startTime / secsDay) * 2400;

}
export const getStartTimeFromLeftPosition = (left) => {
    return Math.floor((left / 2400) * secsDay);
}
export const getDurationFromWidth = (width) => {
    return Math.floor((width / 2400) * secsDay);
}
export const getBarWidth = (log) => {
    const endtime = log.endTime || nowSecs();
    const width = Math.max(((endtime - log.startTime) / secsDay) * 2400, 1);
    return width;
}

export const getComment = (log) => {
      return log.comment;  
}

export const authHeader = (token) => {
    return { headers: {'Authorization': 'Bearer '+token }};
}

export const toYYYYMMDD = (date) => {
    if (!date) return todayDB();
    if (date instanceof Date) {
        return date.getFullYear() +
            (date.getMonth() < 9 ? '0' : '')+(date.getMonth()+1) +
            (date.getDate() < 10 ? '0' : '')+date.getDate();
    } else {
        return date.substring(0,4) +
            date.substring(5,7) +
            date.substring(8,10);
    }
}
export const getHH = (time) => {
    return Math.floor(time / (60*60));
}
export const getMM = (time) => {
    const remain = time % (60*60);
    return Math.floor(remain / 60);
}

export const getTimeStr = (isToday, time) => {
    let t = time;
    if (!time) {
        if (isToday) {
            t = nowSecs();
        } else {
            t = secsDay - 1;
        }
    }
    const hh = getHH(t);
    const mm = getMM(t);
    return (hh < 10 ? '0' : '') + hh + ':' +
           (mm < 10 ? '0' : '') + mm;
}

export const toYYYY_MM_DD = (date) => {
    if (!date) return today();
    if (date instanceof Date) {
        return date.getFullYear() + '-' +
            (date.getMonth() < 9 ? '0' : '')+(date.getMonth()+1) + '-' +
            (date.getDate() < 10 ? '0' : '')+date.getDate();
    } else {
        return date.substring(0,4) + '-' +
            date.substring(4,6) + '-' +
            date.substring(6,8);
    }
}

export const increaseDate = (dt, increment) => {
    const parts = dt.split('-')
   const myDate = new Date(parts[0], Number.parseInt(parts[1])-1, Number.parseInt(parts[2])+increment);
   return toYYYY_MM_DD(myDate);
}

export const today = () => {
    return toYYYY_MM_DD(new Date());
}
export const nowSecs = () => {
    const dt = new Date();

    return (dt.getHours() * 60 * 60) +
           (dt.getMinutes() * 60) +
            dt.getSeconds();
}

export const toTime = (startHH, startMM, startSS) => {

    return (startHH * 60 * 60) +
           (startMM * 60) +
            startSS;
}

export const todayDB = () => {
    return toYYYYMMDD(new Date());
}

export const clear = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('currentDate');
} 

export const persistUser = (userdata) => {
    const user = {
        userid: userdata.user._id,
        username: userdata.user.name,
        email: userdata.user.email,
        token: userdata.token
    };
    localStorage.setItem('user', JSON.stringify(user));
}

export const reorgTlogs = (updDlog, leadtlogIdx) => {
    for (let i = 0; i < updDlog.logs.length; i++) {

        if (i !== leadtlogIdx) {
            if (updDlog.logs[leadtlogIdx].startTime <= updDlog.logs[i].startTime && 
                updDlog.logs[leadtlogIdx].endTime >= updDlog.logs[i].endTime) {
                updDlog.logs[i].startTime = -1; // delete
            } else {
                if (updDlog.logs[leadtlogIdx].startTime > updDlog.logs[i].startTime && 
                    updDlog.logs[leadtlogIdx].startTime <= updDlog.logs[i].endTime) {
                    updDlog.logs[leadtlogIdx].startTime = updDlog.logs[i].startTime; // merge start
                    updDlog.logs[i].startTime  = -1; 
                } else {
                    if (updDlog.logs[leadtlogIdx].endTime > updDlog.logs[i].startTime && 
                        updDlog.logs[leadtlogIdx].endTime <= updDlog.logs[i].endTime) {
                        updDlog.logs[leadtlogIdx].endTime = updDlog.logs[i].endTime; // merge end
                        updDlog.logs[i].startTime = -1; 
                    }
                }
            }
        }
    }
    const logs = updDlog.logs.filter(log => log.startTime > 0);
    return logs;
}