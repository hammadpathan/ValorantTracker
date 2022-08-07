var express = require('express');
var cors = require('cors');
const axios = require('axios');
const { response } = require('express');

var app = express();

app.use(cors());

const API_KEY = "RGAPI-2b1faece-43d5-4fe5-b72a-ba765d7eb2bd";

function getActID() {
    return axios.get("https://na.api.riotgames.com" + "/val/content/v1/contents" + "?api_key=" + API_KEY)
        .then(response => {
            for (var h = 0; h < response.data.acts.length; h++) {
                if (response.data.acts[h].isActive == true) {
                    //console.log(response.data.acts[h].id);
                    return response.data.acts[h].id
                }
            } 
        }).catch(err => err);
}


function get200Leaderboard(actId, startIndex) {
    return axios.get("https://na.api.riotgames.com" + "/val/ranked/v1/leaderboards/by-act/" + actId + "?size=200&startIndex=" + startIndex + "&api_key=" + API_KEY)
        .then(response => {
            return response.data
        }).catch(err => {
                return 404;
            });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// GET leaderboard
// GET localhost:4000/leaderboard
app.get('/leaderboard/:gameName/:tagLine', async (req, res) => {

    const actId = await getActID();
    const gameName = req.params.gameName;
    const tagLine = req.params.tagLine;

    const leaderboardinfo = await get200Leaderboard(actId, 0);
    const totalplayers = leaderboardinfo.totalPlayers;

    var index = 0;

    while (index < totalplayers) {

        await sleep(1 * 800);

        const info = await get200Leaderboard(actId, index);

        if (info == 404) {
            continue;
        }

        for (var j = 0; j < info.players.length; j++) {

            if (info.players[j].gameName == undefined) {
                continue;
            }

            if (((info.players[j].gameName).toLowerCase() == gameName.toLowerCase()) && ((info.players[j].tagLine).toLowerCase() == (tagLine).toLowerCase())) {
                res.status(200).send(info.players[j]);
                return;
            }
        }

        index += 200;
    }
    res.status(200).send("not on leaderboard");
    return;
});


app.listen(4000, function () {
    console.log("Server started on port 4000");
});