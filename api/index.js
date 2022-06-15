const router = require('express').Router();
const { models: { Friend, Watch, Sale } } = require('../db');

router.get('/friends', async(req, res, next) => {
    try{
        res.send(await Friend.findAll());
    }
    catch(ex) {
        next(ex);
    }
});

router.get('/watches', async(req, res, next) => {
    try{
        res.send(await Watch.findAll());
    }
    catch(ex) {
        next(ex);
    }
});

router.get('/friends/:id/sales', async(req, res, next) => {
    try{
        res.send(await Sale.findAll({
            where: {
                friendId: req.params.id
            },
            include: [
                Watch
            ]
        }));
    }
    catch(ex) {
        next(ex);
    }
});

router.post('/friends/:id/sales', async(req, res, next) => {
    try{
        let sale = await Sale.create({...req.body, friendId: req.params.id});
        sale = await Sale.findByPk(sale.id, {
            include: [Watch]
        })
        res.send(sale);
    }
    catch(ex) {
        next(ex);
    }
});


module.exports = router;