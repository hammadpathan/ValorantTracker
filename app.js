
//code for enter button if user is inside the input box
// const enterkey = document.getElementsByClassName("inputtext")[0];
// enterkey.addEventListener("keyup", function(event) {
//     if (event.key === "Enter") {
//         changelistitem();
//     }
// })
//if user clicks on textbox, clear the default text
// enterkey.addEventListener("click", function() {
//     document.getElementById("listadd").value = "";
// })

//adds item to list using value in the input box
function changelistitem() {
    var node = document.createElement("li");
    var addition = document.getElementById("listadd").value;
    var textnode = document.createTextNode(addition);
    node.appendChild(textnode);
    document.getElementById("mylist").appendChild(node);
    isEmpty();
    document.getElementById("listadd").placeholder = "Type in a task";
    //get user cursor focus off textbox
    document.getElementById("listadd").blur();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var leaderboarddata;
var lastactid;
var apikey;
var gamenamestuff;
var gametagstuff;
var start;

async function getapikey() {
    start = 0;
    apikey = document.getElementById("listadd").value;
    await checkapikey(apikey);
}

async function sendleaderboardrequest(actid,index,apikey) { 
    var request = new XMLHttpRequest();

    request.open('GET', 'https://na.api.riotgames.com/val/ranked/v1/leaderboards/by-act/'+actid+'?size=200&startIndex='+index+'&api_key='+apikey,false);
    
    request.onload = async function () {
        var data = JSON.parse(this.response);
        let playerdata = data.players;
        leaderboarddata = playerdata;
    }

    request.send();
}


var thecontainer = document.getElementById("containerforstuff");

async function replacecontainerfirst() {
    thecontainer.innerHTML = "";
    thecontainer.classList.remove("removed");

    thecontainer.append("PLEASE ENTER THE PLAYER'S NAME AND TAG");

    thecontainer.append(document.createElement("br"));

    let explayermsg = document.createElement("p");
    thecontainer.append(explayermsg);
    explayermsg.classList.add("explayer");
    explayermsg.textContent = "ex: player#NA1";

    thecontainer.append(document.createElement("br"));

    let theinputbox1 = document.createElement("input", );
    thecontainer.append(theinputbox1);
    theinputbox1.id = "gamenamething";
    theinputbox1.placeholder = "player";
    theinputbox1.type = "text";
    theinputbox1.classList.add("listadd");

    thecontainer.append(document.createElement("br"));

    let theinputbox2 = document.createElement("input");
    thecontainer.append(theinputbox2);
    theinputbox2.id = "gametagthing";
    theinputbox2.placeholder = "NA1";
    theinputbox2.type = "text";
    theinputbox2.classList.add("listadd");

    thecontainer.append(document.createElement("br"));

    let seconderrmsg = document.createElement("p");
    thecontainer.append(seconderrmsg);
    seconderrmsg.classList.add("errormsg");
    seconderrmsg.id = "seconderrormsg";

    thecontainer.append(document.createElement("br"));

    let thesubmitbutton = document.createElement("button");
    thecontainer.append(thesubmitbutton);
    thesubmitbutton.classList.add("btn1");
    thesubmitbutton.id = "thesubmitbuttonid";

    document.getElementById("thesubmitbuttonid").addEventListener("click", function() {

        document.getElementById("seconderrormsg").textContent = "";

        if (theinputbox1.value == "" || theinputbox2.value == "") {
            document.getElementById("seconderrormsg").textContent = "INVALID AGENT";
            return;
        }
        else {
            sendrequest(apikey);
        }
    });
    thesubmitbutton.textContent = "CHECK LEADERBOARD";

    // document.getElementById("containerforstuff").append(<input type="text" class="inputtext" id="gamenamething" placeholder="Enter Your Game Name"/><br>);
    // document.getElementById("containerforstuff").append('<input type="text" class="inputtext" id="gametagthing" placeholder="Enter Your Game Tag"/><br>');
    // document.getElementById("containerforstuff").append('<p id="yesorno">player is not on leaderboard yet</p>');
    // document.getElementById("containerforstuff").append('<p id="rank"></p>');
    // document.getElementById("containerforstuff").append('<p id="select"></p>');
    // document.getElementById("containerforstuff").append('<p id="immortalversion"></p>');
}


async function replacecontainersecond() {
    thecontainer.innerHTML = "";
    thecontainer.classList.remove("removed");

    //put the third page for searching and identifying the player

    thecontainer.append("LOOKING FOR: " + gamenamestuff + "#" + gametagstuff);

    thecontainer.append(document.createElement("hr"));

    //thecontainer.append(document.createElement("br"));

    let currentplayer = document.createElement("p");
    thecontainer.append(currentplayer);
    currentplayer.classList.add("currentplayer");
    currentplayer.textContent = "SEARCHING:";

    thecontainer.append(document.createElement("br"));

    let rankimage = document.createElement("img");
    thecontainer.append(rankimage);
    rankimage.classList.add("rankimage");
    rankimage.src = "Immortal1.png";
}

async function checkapikey(apikey) {
    document.getElementById("firsterrormsg").textContent = "";

    var request = new XMLHttpRequest();

    request.open('GET', 'https://na.api.riotgames.com/val/content/v1/contents?api_key='+apikey)
    request.onload = async function () {
        console.log(request.status);
        var data = JSON.parse(this.response);
        console.log(request.status);

        thecontainer.classList.add("removed");
        
        thecontainer.addEventListener('transitionend', () => {
            replacecontainerfirst();
        });
    }
  
    request.onerror = async function () {
        document.getElementById("firsterrormsg").textContent = "INVALID KEY!";
    }
    request.send();
}


async function sendrequest(apikey) {

    gamenamestuff = document.getElementById("gamenamething").value;
    gametagstuff = document.getElementById("gametagthing").value;

    var request = new XMLHttpRequest();

    request.open('GET', 'https://na.api.riotgames.com/val/content/v1/contents?api_key='+apikey)
    request.onload = async function () {

        thecontainer.classList.add("removed");
        
        thecontainer.addEventListener('transitionend', () => {
            replacecontainersecond();
        });

        var data = JSON.parse(this.response);
        lastactid = data.acts[data.acts.length - 2].id;
        await sendleaderboardrequest(lastactid,start,apikey);
        setTimeout(() => 1000);

        while (start < 24400) {
            if (await checkifplayerinarray(leaderboarddata,gamenamestuff,gametagstuff) == true) {
                document.getElementById("yesorno").textContent = "player is on leaderboard";
                return;
            }
            start+= 200;
            console.log(start);
            await sleep(1 * 1000);
            await sendleaderboardrequest(lastactid,start,apikey);
        }
        document.getElementById("yesorno").textContent = "player is not on leaderboard";
    }

    request.send();
}

async function checkifplayerinarray(thedata,playername,gametag) {
    for (var i=0; i < 200; i++) {
        document.getElementById("rank").textContent = "Leaderboard Rank: " + thedata[i].leaderboardRank;
        document.getElementById("select").textContent = thedata[i].gameName + "#" + thedata[i].tagLine;
        if (thedata[i].gameName == playername && thedata[i].tagLine == gametag) {
            return true;
        }
    }
    return false;
}