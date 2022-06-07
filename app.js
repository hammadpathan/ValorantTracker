
//code for enter button if user is inside the input box
const enterkey = document.getElementsByClassName("inputtext")[0];
enterkey.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        changelistitem();
    }
})
//if user clicks on textbox, clear the default text
enterkey.addEventListener("click", function() {
    document.getElementById("listadd").value = "";
})

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

//checks if the list containing tasks is empty 
function isEmpty() {
    if ((document.getElementById("mylist").innerHTML.trim() == "") == false) {
        //number of tasks
        document.getElementById("tasks").textContent = "Number of Tasks: " + document.getElementsByTagName("li").length;
    }
    else {
        document.getElementById("tasks").textContent = "Woohoo! All tasks completed.";
    }
}

//clears all tasks
function clearitemlist() {
    document.getElementById("mylist").innerHTML = "";
    isEmpty();
}

//remove task
function removetask() {
    if ((document.getElementById("mylist").innerHTML.trim() == "") != false) {
        
        return;
    }
    document.getElementById("select").innerHTML = "Now select the task you want to remove.";
    var listss = document.getElementsByTagName("li");
    if (document.getElementById("cnclbtn") == null) {
        var cancelbutton = document.createElement("button");
    cancelbutton.innerHTML = "cancel";
    cancelbutton.id = "cnclbtn";
    cancelbutton.onclick = function(event) {
        var btn = document.getElementById("cnclbtn");
        btn.remove();
        for (var k=0; k<listss.length; k++) {
            listss[k].onclick = function(event) {}
        }
    }
    document.body.appendChild(cancelbutton);
    }
    for (var k=0; k<listss.length; k++) {
        listss[k].onclick = function(event) {
            document.getElementById("cnclbtn").remove();
            this.remove();
            for (var k=0; k<listss.length; k++) {
                listss[k].onclick = function(event) {}
            }
            document.getElementById("select").innerHTML = "";
            isEmpty();
        }
    }
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
    gamenamestuff = document.getElementById("gamenamething").value;
    gametagstuff = document.getElementById("gametagthing").value;
    await sendrequest(apikey);
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

async function sendrequest(apikey) {
    var request = new XMLHttpRequest();

    request.open('GET', 'https://na.api.riotgames.com/val/content/v1/contents?api_key='+apikey)
    request.onload = async function () {
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