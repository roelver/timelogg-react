const mongoose = require('mongoose');
const moment = require('moment');

const nowSecs = require('../util/helpers').nowSecs;

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
                    console.log('Val. endTime"'+value+'"' );
                    throw new Error('Invalid endTime for', value);
                }
            }
        },
        comment: {
            type: String
        }
    }]
});

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
                console.log('Pre-save,adjust endTime for log',i, daylog.logs[i].endTime, daylog.logs[i+1].startTime);
                daylog.logs[i].endTime = daylog.logs[i+1].startTime -1 ;
            }
        }
        if (!daylog.isRunning && daylog.logs[logLen-1].endTime === undefined) {
            console.log('Pre-save,adjust endTime for last log',logLen-1)
            daylog.logs[logLen-1].endTime = nowSecs();
        }
    }
    
    next();
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