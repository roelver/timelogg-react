export const secsDay = 24 * 60 * 60;

export const getBarLeftPosition = (log) => {
    return log.startTime * (1200/secsDay);

}
export const getBarWidth = (log) => {
    const endtime = log.endTime || nowSecs();
    return (endtime - log.startTime) * (1200/secsDay)
}
    
export const getComment = (log) => {
      return log.comment;  
}

export const deleteLog = () => {
            
}
            
export const onResize = () => {
                
}

export const updateTimelog = () => {
    
}

export const markDlogDirty = () => {
    
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
