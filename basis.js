function populateScreen()
{
    var getRequest = "getLatestThoughts?";
    var resText = servRequest(getRequest, "fillScreen")
    
    
}

function callBack(resText, caller)
{
    resText = resText.split("\n")[0];
    var sendText = caller+'("'+resText+'");';
    eval(sendText);
}


function fillScreen(resText)
{
	var resultSplit = resText.split("?");
	
    var thoughtsString = document.createElement("div");
	
	for(var i = 0; i < (resultSplit.length - 1); i++)
	{
		var innerSplit = resultSplit[i].split("|");
		if(parseInt(innerSplit[2]) > 10)
		{
			innerSplit[2] = "10"
		}
        
        thoughtText = innerSplit[1];
        
       thoughtText = thoughtText.replace(/%20/g," ")
       thoughtText = thoughtText.replace(/%27/g,"'") 
       thoughtText = thoughtText.replace(/%40/g,"(")
       thoughtText = thoughtText.replace(/%41/g,")")
		var text = '<span id="t'+innerSplit[0] +'" class="i'+innerSplit[2] + ' thought">'+thoughtText+"</span>";
		thoughtsString.innerHTML += "" + text;
	}
	
	var body = document.getElementsByTagName("body")[0];
    body.appendChild(thoughtsString);
    
    var spans = document.getElementsByTagName("span");
    for(var i = 0; i < spans.length; i++)
    {
        if(spans[i].className.indexOf("i") != -1)
        {
            spans[i].addEventListener("click", voteOptions, false);
        }
        else if(spans[i].className == "sendButton")
        {
            spans[i].addEventListener("click", getHighestID, false);
        }
    }
    
    
}

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}


function voteOptions(event)
{
    if(document.getElementById("thoughtOps"))
       {
            destroyOptions();
       }
    
    

    
    
    var id = this.getAttribute("id");
     var options = '<a href="#" id ="'+ id + 'Up">up</a> <a href="#" id ="'+ id + 'Down">down</a>';
    var grabThought = document.getElementsByTagName("body")[0];
    var thoughtOptions = document.createElement("div");
    
    thoughtOptions.setAttribute("id", "thoughtOps");
        thoughtOptions.className = id;
    thoughtOptions.innerHTML = options;
    
    
    
    grabThought.appendChild(thoughtOptions);
    var height = (document.getElementById(id).offsetHeight);
    thoughtOptions.setAttribute("style", "top:"+(getOffset(this).top + height)+"px; left:"+(getOffset(this).left)+"px;");
    setTimeout(destroyOptions, 120000);
    
    thoughtOptions.addEventListener("click", destroyOptions, false);
    var thoughtUp = document.getElementById(id+"Up");
    thoughtUp.addEventListener("click", voteUp, false);
    
    var thoughtDown = document.getElementById(id+"Down");
    thoughtDown.addEventListener("click", voteDown, false);
}

function voteUp()
{
    var id = this.parentNode.className.split("t")[1];
    servRequest("voteUpThought?"+id, "reload");
}

function voteDown()
{
    var id = this.parentNode.className.split("t")[1];
    servRequest("voteDownThought?"+id, "reload");
}

function destroyOptions()
{
    var grabThought = document.getElementsByTagName("body")[0];
    var thoughtOptions = document.getElementById("thoughtOps");
    grabThought.removeChild(thoughtOptions);
}

function getHighestID()
{
    var highestIDReq = servRequest("highestID", "submit");
}

function submit(highestID)
{
    var newID = (parseInt(highestID) + 1)
    var textToSend = document.getElementById("thoughtBox").value;
    textToSend = textToSend.replace("(", "%40");
     textToSend = textToSend.replace(")", "%41");
    textToSend = textToSend.replace("'", "%50");
    document.getElementById("thoughtBox").value = "";
    servRequest("addThought?"+(newID)+"?"+textToSend, "reload");
    

}

function reload()
{
    window.location.reload();
}

function servRequest(toPHP, caller)
{
    var req = new XMLHttpRequest();
   	req.open('GET', 'dbConnect.php?'+toPHP, true);
  	req.onreadystatechange = function (aEvt) {
        var reqLocation;
        
        if (req.readyState == 4) {
            if(req.status == 200)
            {
                callBack(req.responseText, caller);
                return req.responseText;
            }
            else
                return "Error loading page\n";
        }
        
  	};
  	req.send(null);
}

