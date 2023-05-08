const { Bot } = require("./bot/bot");
const bot = new Bot();
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiPort = process.env.API_PORT;

function updateConfig() {
    fs.writeFileSync("config.json", JSON.stringify(bot.config, null, 2));
}

function checkAdmin(req, res, next) {
    const token = req.body.token;
    const adminToken = bot.config.adminToken;

    if (adminToken === token) {
        next(); // pass the request to the next middleware
    } else {
        res.status(403).send("Error: Access denied"); // send a 403 Forbidden error response
    }
}

app.post("/blacklist/add", checkAdmin, (req, res) => {
    try {
        bot.addGroupBlackList(req.body.id);
        updateConfig();
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e);
    }

});

app.post("/blacklist/remove", checkAdmin, (req, res) => {
    bot.removeGroupBlackList(req.body.id);
    updateConfig();
    res.sendStatus(200);
});

app.listen(apiPort, () => {
    console.log(`app listening on port ${apiPort}`);
})

