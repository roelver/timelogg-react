const express = require('express');

const auth = require('../middleware/auth');
const Daylog = require('../models/daylog');

const router = new express.Router();

const toYYYYMMDD = (age) => {
    const date = new Date();
    date.setDate(date.getDate() - age);
    return date.getFullYear() +
        (date.getMonth() < 9 ? '0' : '')+(date.getMonth()+1) +
        (date.getDate() < 10 ? '0' : '')+date.getDate();
}

router.get('/api/tasklist/:ageInDays', auth, async (req, res) => {
    if (!req.params.ageInDays) {
        return res.status(401).send('No age date was given');
    }
    try {
        const age = parseInt(req.params.ageInDays);
        const startDate = toYYYYMMDD(age);
        console.log(req.user);
        const daylogs = await Daylog.find({logdate: {$gte: startDate}, owner: req.user._id});
        if (daylogs && daylogs.length > 0) {
            const tasks = [ ...new Set(daylogs.map(dlog => dlog.description))]
                .sort((task1, task2) => task1 > task2 ? 1 : -1);

            res.status(200).send(tasks);                
        } else {
            res.status(200).send([]);
        }
    } catch(e) {
        res.status(500).send(e);
    };
});

module.exports = router;