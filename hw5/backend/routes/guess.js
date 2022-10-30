import express from 'express'
import {getNumber, genNumber} from '../core/getNumer'
const router = express.Router()

router.post('/start', (_, res) => {
    genNumber();
    res.json({ msg: 'The game has started.' })
})

router.get('/guess', (req, res) => {
    let ans = getNumber();
    const num = Number(req.query.number);

    if (Number.isInteger(num) && num >= 0 && num <= 100) {
        if (num == ans)
           res.json({ msg: 'Equal' });
        else if (num < ans)
           res.json({ msg: 'Bigger' });        
        else 
           res.json({ msg: 'Smaller'});
    }

    else 
        res.status(406).send({ msg: 'Not a legal number.' });
})

router.post('/restart', (_, res) => {
    genNumber();
    res.json({ msg: 'The game has restarted.' })
})

export default router
