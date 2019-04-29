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
                if (value && value < this.startTime) {
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
        // avoid overlap in record's logs
        for (let i = 0; i < daylog.logs.length-1; i++) {
            if (daylog.logs[i].endTime >= daylog.logs[i+1].startTime) {
                daylog.logs[i].endTime = daylog.logs[i+1].startTime -1 ;
            }
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