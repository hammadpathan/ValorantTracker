var leaderboarddata;
var gamenamestuff;
var gametagstuff;
var thecontainer = document.getElementById("containerforstuff");

function checktheleaderboard() {

    document.getElementById("seconderrormsg").textContent = "";
    let theinputbox1 = document.getElementById("gamenamething");
    let playerid = theinputbox1.value;

    if (playerid == "") {
        document.getElementById("seconderrormsg").textContent = "INVALID AGENT";
        return;
    }

    if (playerid.indexOf("#") <= -1){
        document.getElementById("seconderrormsg").textContent = "INVALID AGENT";
        return;
    }
    else {
        if ((playerid.indexOf('#') == 0) || (playerid.indexOf('#') == (playerid.length - 1))) {
            document.getElementById("seconderrormsg").textContent = "INVALID AGENT";
            return;
        }
    }
    sendrequest();
}

function replaceloadinglogo() {
    let searchcontainer = document.createElement("div");
    thecontainer.append(searchcontainer);
    searchcontainer.classList.add("searchcontainer");

    let searchtextcontainer = document.createElement("div");
    searchcontainer.append(searchtextcontainer);
    searchtextcontainer.classList.add("searchtextcontainer");

    let currentplayer = document.createElement("p");
    currentplayer.id = "select";
    searchtextcontainer.append(currentplayer);
    currentplayer.classList.add("currentplayer");

    let rankposition = document.createElement("p");
    rankposition.id = "rank";
    rankposition.classList.add("rankposition");

    searchtextcontainer.append(rankposition);

    let imgcontainer = document.createElement("div");
    imgcontainer.classList.add("imgcontainer");

    searchcontainer.append(imgcontainer);

    let rankimage = document.createElement("img");
    rankimage.id = "rankimg";
    imgcontainer.append(rankimage);
    rankimage.classList.add("rankimage");

    let rankrrcontainer = document.createElement("div");

    rankrrcontainer.classList.add("rankrrcontainer");

    imgcontainer.append(rankrrcontainer);

    let rankname = document.createElement("p");
    let rr = document.createElement("p");
    rr.id = "rrtext";

    rankname.classList.add("rankname");
    rankname.id = ("ranknametext");
    rr.classList.add("rr");    

    rankrrcontainer.append(rankname);
    rankrrcontainer.append(rr);
}


function replacecontainersecond() {
    thecontainer.innerHTML = "";
    thecontainer.classList.remove("removed");

    //put the third page for searching and identifying the player

    thecontainer.append("LOOKING FOR: " + gamenamestuff + "#" + gametagstuff);

    thecontainer.append(document.createElement("hr"));

    let searchtext = document.createElement("p");
    thecontainer.append(searchtext);
    searchtext.id = "searchtext";
    searchtext.classList.add("searchtext");
    searchtext.textContent = "SEARCHING:";

    thecontainer.append(document.createElement("br"));

    let loadercirclepadding = document.createElement("div");
    thecontainer.append(loadercirclepadding);
    loadercirclepadding.id = "loaderpadding";
    loadercirclepadding.classList.add("loaderpadding");

    let loadercircle = document.createElement("div");
    thecontainer.append(loadercircle);
    loadercircle.classList.add("loader");
    loadercircle.id = "loader";
}

function displayplayer(thedata) {

    var therank;

    document.getElementById("loader").remove();
    document.getElementById("loaderpadding").remove();
    document.getElementById("searchtext").textContent = "FOUND:"

    replaceloadinglogo();

    if (thedata.leaderboardRank <= 500) {
        document.getElementById("rankimg").src = "./img/Radiant.png";
        therank = "Radiant";
    }
    else {
        if (thedata.rankedRating >= 200) {
            document.getElementById("rankimg").src = "./img/Immortal3.png";
            therank = "Immortal 3";
        }
        else if ((thedata.rankedRating < 200) && (thedata.rankedRating >= 90)) {
            document.getElementById("rankimg").src = "./img/Immortal2.png";
            therank = "Immortal 2";
        }
        else {
            document.getElementById("rankimg").src = "./img/Immortal1.png";
            therank = "Immortal 1";
        }
    }  

    document.getElementById("ranknametext").textContent = therank;
    document.getElementById("rrtext").textContent = thedata.rankedRating + "RR";
    document.getElementById("rank").textContent = "#" + thedata.leaderboardRank;
    document.getElementById("select").textContent = thedata.gameName + "#" + thedata.tagLine;
}

function displaynoplayer() {

    document.getElementById("loader").remove();
    document.getElementById("loaderpadding").remove();
    document.getElementById("searchtext").textContent = "NOT FOUND:"

    let noplayer = document.createElement("p");
    noplayer.id = "select";
    thecontainer.append(noplayer);
    noplayer.classList.add("noplayer");
    noplayer.textContent = "player not on leaderboard yet"

}

function sendrequest() {

    gameplayerstuff = document.getElementById("gamenamething").value;
    playerdata = gameplayerstuff.split("#");
    gamenamestuff = playerdata[0];
    gametagstuff = playerdata[1];

    var request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:4000/leaderboard/' + gamenamestuff + "/" + gametagstuff);

    //front end
    thecontainer.classList.add("removed");
    thecontainer.addEventListener('transitionend', () => {
        replacecontainersecond();
    });
    //


    request.onload = function () {
        if (this.response == "not on leaderboard") {
            displaynoplayer();
        }
        else {
            displayplayer(JSON.parse(this.response));
        }
    }

    request.send();

}