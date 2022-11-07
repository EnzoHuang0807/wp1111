import { Router } from "express";
import ScoreCard from "../models/ScoreCard";
import db from "../db"
const router = Router();


const saveScoreCard = async (name, subject, score) => {
    const existing = await ScoreCard.findOne({ name : name, subject: subject });

    if (existing){
        try{
            await ScoreCard.updateOne({ name : name, subject: subject }, 
                {$set: {score : score}});
            console.log("Updated ScoreCard");
            return `Updating (${name}, ${subject}, ${score})`;
        } catch (e) {return "ScoreCard update error" + e}
    }
    else{
        try{
            const newCard = new ScoreCard({ name, subject, score });
            console.log("Created new ScoreCard", newCard);
            newCard.save();
            return `Adding (${name}, ${subject}, ${score})`;
        } catch (e) {return "ScoreCard creation error" + e}
    }
};

const deleteDB = async () => {
    try{
        await ScoreCard.deleteMany({});
        console.log("Database deleted");
    } catch (e) {throw new Error("Database deletion failed");}
};

const queryDB = async (type, string) => {
    try{
        i = 0/0;
        if (type == "name")
            return await ScoreCard.find({ name : string});
        else
            return await ScoreCard.find({ subject : string});
    } catch (e) {return "ScoreCard query error" + e}
};

db.connect();

router.delete("/cards", async (_, res) => {
    await deleteDB();
    res.json({message: "Database cleared"})
});

router.post("/card", async (req, res) => {
    let msg = await saveScoreCard(req.body.name, req.body.subject, req.body.score);
    if (msg[0] == "S")
        res.json({message: msg, card: false});
    else
        res.json({message: msg, card: true});
});

router.get("/cards", async (req, res) => {
    let ret = await queryDB(req.query.type, req.query.queryString);
    let msg = [];
    if (typeof ret === 'string'){
        res.json({messages: undefined, message: ret});
        return;
    }

    if (ret.length == 0){
        let tmp = `${req.query.type} (${req.query.queryString}) not found!`;
        msg.push(tmp[0].toUpperCase() + tmp.slice(1));
    }
    ret.map((e) => 
    {msg.push(`Found card with ${req.query.type}: (${e.name}, ${e.subject}, ${e.score})`)})
    res.json({messages: msg, message: ""});
});


export default router;