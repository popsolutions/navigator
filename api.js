const { Bot } = require("./bot/bot");
const bot = new Bot();
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiPort = process.env.API_PORT || 3000;

async function updateConfig() {
    try {
        fs.writeFileSync("config.json", JSON.stringify(bot.config, null, 2));
    } catch (e) {
        console.error('Error while updating config:', e);
    }
}

app.post("/blacklist/add", checkAdmin, async (req, res) => {
    try {
        await bot.addGroupBlackList(req.body.id);
        await updateConfig();
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post("/blacklist/remove", checkAdmin, async (req, res) => {
    try {
        await bot.removeGroupBlackList(req.body.id);
        await updateConfig();
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.listen(apiPort, () => {
    console.log(`app listening on port ${apiPort}`);
})

