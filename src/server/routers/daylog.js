const express = require('express');

const adjustOverlaps = require('../util/helpers').adjustOverlaps;
const Daylog = require('../models/daylog');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/daylogs', auth, async (req, res) => {
    if (!req.body._id) {
        // if the 
        const existing = await Daylog.findDaylogsByDateDescription(req.user._id, req.body.logdate, req.body.description);
        if (existing) {
            return res.status(406).send('Daylog exists for '+req.body.logdate);
        }
    }
    const daylog = new Daylog({
        ...req.body,
        owner: req.user._id
    });
    try {
        await daylog.save()

        if (daylog.logs && daylog.logs.length > 0) {
            await adjustOverlaps(daylog);            
        }

        res.status(201).send(daylog);        
    } catch (e) {
        res.status(400).send(e);
    };
});

router.get('/daylogs/:id', auth, async (req, res) => {
    try {
        const daylog = await Daylog.findOne ({_id: req.params.id});
        if (daylog) {
            res.status(200).send(daylog);                
        } else {
            res.status(404).send();
        }
    } catch(e) {
        res.status(500).send(e);
    };
});

router.get('/daylogs', auth, async (req, res) => {
    try {
        console.log('Date', req.query.logdate, req.query.taskDesc, req.user._id);
        let daylogs = [];
        if (req.query.taskDesc) {
            daylogs = await Daylog.findDaylogsByDateDescription(req.user._id, req.query.logdate, req.query.taskDesc); 
        } else {
            daylogs = await Daylog.findDaylogsByDate(req.user._id, req.query.logdate);
            daylogs.sort((t1, t2) => t1.description > t2.description ? 1 : -1);            
        }
        console.log('Found', daylogs);
        res.status(200).send(daylogs);                
    } catch(error) {
        console.log('Error', error);
        res.status(500).send(error);
    };
});

// Add log to existing table
router.put('/daylogs/:id', auth, async (req, res) => {
    const daylogUpdated = req.body;
    console.log(daylogUpdated);
    const updates = Object.keys(daylogUpdated);
    const allowedUpdates = ['logs', 'isRunning'];
    const isAllowed = updates.every(key => allowedUpdates.includes(key));
    if (!isAllowed) {
        return res.status(400).send({ error: 'Properties are not allowed'});
    }

     try {
        const daylog = await Daylog.findOne({_id: req.params.id});
        if (!daylog) {
            return res.status(404).send();
        }

        if (daylogUpdated.hasOwnProperty('isRunning')) {
            daylog.isRunning = daylogUpdated.isRunning;            
        } 
        daylog.logs = [...daylog.logs, ...daylogUpdated.logs];
        daylog.logs = daylog.logs.sort((a,b) => a.startTime < b.startTime ? -1 : 1);
        // on overlap adjust startTime to endforce new logs
        let daylogslength = daylog.logs.length;
        let i = 1;
        while (i < daylogslength) {
            if (daylog.logs[i].startTime > daylog.logs[i-1].startTime && daylog.logs[i].endTime < daylog.logs[i-1].endTime) {
                const clone = daylog.logs[i-1].toObject();
                delete clone._id;
                clone.startTime = daylog.logs[i].endTime + 1;
                daylog.logs.splice(i+1,0,clone);  // duplicate log
                daylog.logs[i-1].endTime = daylog.logs[i].startTime - 1;
                daylogslength++;
                i++;
            } else { 
                if (daylog.logs[i].startTime < daylog.logs[i-1].endTime) {
                    daylog.logs[i-1].endTime = daylog.logs[i].startTime - 1;
                }
            }
            i++;
        }
    
        await daylog.save();
        await adjustOverlaps(daylog);            

        res.send(daylog);

     } catch (e) {
         res.status(400).send(e);        
     }
});

router.patch('/daylogs/:id', auth, async (req, res) => {
    const daylogUpdated = req.body;
    console.log(daylogUpdated);
    const updates = Object.keys(daylogUpdated);
    const allowedUpdates = ['description', 'logs', 'isRunning'];
    const isAllowed = updates.every(key => allowedUpdates.includes(key));
    if (!isAllowed) {
        return res.status(400).send({ error: 'Properties are not allowed'});
    }
    try {
        const daylog = await Daylog.findOne({_id: req.params.id});
        if (!daylog) {
            return res.status(404).send();
        }

        updates.forEach(update => daylog[update] = daylogUpdated[update]);
        
        await daylog.save();

        if (daylog.logs && daylog.logs.length > 0) {
            await adjustOverlaps(daylog);            
        }

        res.send(daylog);

    } catch (e) {
        res.status(400).send(e);        
    }
});

router.delete('/daylogs/:id', auth, async (req, res) => {
    try {
        const daylog = await Daylog.findOneAndDelete({_id: req.params.id});
        if (!daylog) {
            res.status(404).send();
        }
        res.send(daylog);                

    } catch (e) {
        res.status(400).send(e);        
    }
});


module.exports = router;