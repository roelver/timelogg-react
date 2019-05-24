const express = require('express');

const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/signin', async (req, res) =>  {
    const user = new User(req.body);
    try {
        await user.save()
        const token = await user.generateAccessToken();
        return res.status(201).send({user, token});
    } catch(e) {
        res.status(400).send(e);
    };
});


router.post('/login', async (req, res) =>  {
    const {email, password} = req.body;
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAccessToken();
        return res.status(200).send({user, token});
    }
    catch (e) {
    }
    res.status(401).send({error: 'Login failed'});
});


router.get('/users/me', auth, (req, res) => {
    res.status(200).send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
    const userUpdated = req.body;
    const updates = Object.keys(userUpdated);
    const allowedUpdates = ['name', 'email', 'password'];
    const isAllowed = updates.every(key => allowedUpdates.includes(key));
    if (!isAllowed) {
        return res.status(400).send({ error: 'Properties are not allowed'});
    }
    try {
        updates.forEach(update => {
            req.user[update] = userUpdated[update];
        });

        await req.user.save();

        if (req.user) {
            res.status(200).send(req.user);                
        } else {
            res.status(404).send();
        }
    } catch (e) {
        res.status(400).send(e);        
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);        
    }
});


module.exports = router;