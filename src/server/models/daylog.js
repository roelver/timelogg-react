const mongoose = require('mongoose');
const moment = require('moment');

const daylogSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    logdate: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 8,
        validate(value) {
            // test format yyyymmdd
            if (! moment(value, 'YYYYMMDD').isValid()) {
                throw new Error('Invalid date format, use YYYYMMDD');
            }
        }
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isRunning: {
        type: Boolean,
        default: false
    },
    logs: [{
        startTime: {
            type: Number,
            required: true
        },
        endTime: {
            type: Number,
            validate(value) {
                // test endTime >= startTime
                if (value && value.length > 0 && value < this.startTime) {
                    throw new Error('Invalid endTime for', value);
                }
            }
        },
        comment: {
            type: String
        }
    }]
});

const nowSecs = () => {
    const dt = new Date();

    return (dt.getHours() * 60 * 60) +
           (dt.getMinutes() * 60) +
            dt.getSeconds();
};
const today = () => {
    const date = new Date();
    return date.getFullYear() +
            (date.getMonth() < 9 ? '0' : '')+(date.getMonth()+1) +
            (date.getDate() < 10 ? '0' : '')+date.getDate();
};

// Sort logs on save
daylogSchema.pre('save', async function(next) {
    const daylog = this;
    if (daylog.logs && daylog.logs.length > 0) {
        daylog.logs.sort((a, b) => {
            return a.startTime < b.startTime ? -1 : 1
        });
        const logLen = daylog.logs.length;
        // avoid overlap in record's logs
        for (let i = 0; i < logLen-1; i++) {
            if (daylog.logs[i].endTime >= daylog.logs[i+1].startTime || daylog.logs[i].endTime === undefined) {
                daylog.logs[i].endTime = daylog.logs[i+1].startTime -1 ;
            }
        }
        if (!daylog.isRunning && daylog.logs[logLen-1].endTime === undefined) {
            daylog.logs[logLen-1].endTime = nowSecs();
        }
    }
    
    next();
});

daylogSchema.post('init', function(doc) {
    // Adjust running task not today
    if (doc.isRunning && doc.logdate !== today()) {
        doc.isRunning = false;
        const logcount = doc.logs.length;
        if (logcount > 0 && !doc.logs[logcount-1].endTime) {
            doc.logs[logcount-1].endTime = (24*60*60) -1;
        }
    }
    return doc;
});

daylogSchema.statics.findDaylogsByDate = async (ownerId, dt) => {
    let dtStr = dt;
    if (dt instanceof Date) {
        dtStr = moment(dt).format('YYYYMMDD');
    }
    return await Daylog.find({owner: ownerId, logdate: dtStr});
}

daylogSchema.statics.findDaylogsByDateDescription = async (ownerId, dt, desc) => {
    let dtStr = dt;
    if (dt instanceof Date) {
        dtStr = moment(dt).format('YYYYMMDD');
    }
    return await Daylog.findOne({owner: ownerId, logdate: dtStr, description: desc});
}

const Daylog = mongoose.model('Daylog', daylogSchema);

module.exports = Daylog;