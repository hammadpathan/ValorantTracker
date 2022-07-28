var leaderboarddata;
var gamenamestuff;
var gametagstuff;
var thecontainer = document.getElementById("containerforstuff");

function checktheleaderboard() {

    document.getElementById("seconderrormsg").textContent = "";
    let theinputbox1 = document.getElementById("gamenamething");
    let theinputbox2 = document.getElementById("gametagthing");

    if (theinputbox1.value == "" || theinputbox2.value == "") {
        document.getElementById("seconderrormsg").textContent = "INVALID AGENT";
        return;
    }
    else {
        sendrequest();
    }
}


function replacecontainersecond() {
    thecontainer.innerHTML = "";
    thecontainer.classList.remove("removed");

    //put the third page for searching and identifying the player

    thecontainer.append("LOOKING FOR: " + gamenamestuff + "#" + gametagstuff);

    thecontainer.append(document.createElement("hr"));

    let searchtext = document.createElement("p");
    thecontainer.append(searchtext);
    searchtext.classList.add("searchtext");
    searchtext.textContent = "SEARCHING:";

    thecontainer.append(document.createElement("br"));

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
    rr.classList.add("rr");    

    rankrrcontainer.append(rankname);
    rankrrcontainer.append(rr);
}

function displayplayer(thedata) {
    if (thedata.leaderboardRank <= 500) {
        document.getElementById("rankimg").src = "Radiant.png";
    }
    else {
        if (thedata.rankedRating >= 200) {
            document.getElementById("rankimg").src = "Immortal3.png";
        }
        else if ((thedata.rankedRating < 200) && (thedata.rankedRating >= 90)) {
            document.getElementById("rankimg").src = "Immortal2.png";
        }
        else {
            document.getElementById("rankimg").src = "Immortal1.png";
        }
    }  

    document.getElementById("rrtext").textContent = thedata.rankedRating + "RR";
    document.getElementById("rank").textContent = "#" + thedata.leaderboardRank;
    document.getElementById("select").textContent = thedata.gameName + "#" + thedata.tagLine;
}

function sendrequest() {

    gamenamestuff = document.getElementById("gamenamething").value;
    gametagstuff = document.getElementById("gametagthing").value;

    var request = new XMLHttpRequest();

    request.open('GET', 'http://localhost:4000/leaderboard/' + gamenamestuff + "/" + gametagstuff);

    //front end
    thecontainer.classList.add("removed");
    thecontainer.addEventListener('transitionend', () => {
        replacecontainersecond();
    });
    //


    request.onload = function () {
        displayplayer(JSON.parse(this.response));
    }

    request.send();

}