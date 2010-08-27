
Ti.include('oauth_adapter.js');
//Authorize usage of Twitter services on App
var oAuthAdapter = new OAuthAdapter(
        'gPL74Tl4sQAVawmIW3vHn0sN8k3UyuZ5J3KHZPnaxgk',
        'UTHmtsJyjIAM6pLPvSfhw',
        'HMAC-SHA1');
 
 
// load the access token for the service (if previously saved)
oAuthAdapter.loadAccessToken('twitter');
 //*****************************Code to send below ****************************
 
//oAuthAdapter.send('https://api.twitter.com/1/statuses/update.json', [
//  ['status', 'hey @ziodave, I successfully tested the #oauth adapter with #twitter and @appcelerator #titanium!']
//], 'Twitter', 'Published.', 'Not published.');

//*******************************************************************************
 
// if the client is not authorized, ask for authorization. 
// the previous tweet will be sent automatically after authorization
if (oAuthAdapter.isAuthorized() == false) {
    // this function will be called as soon as the application is authorized
    var receivePin = function() {
        // get the access token with the provided pin/oauth_verifier
        oAuthAdapter.getAccessToken('http://api.twitter.com/oauth/access_token');
        // save the access token
        oAuthAdapter.saveAccessToken('twitter');
};
 
    // show the authorization UI and call back the receive PIN function
    oAuthAdapter.showAuthorizeUI('http://api.twitter.com/oauth/authorize?' +
        oAuthAdapter.getRequestToken('http://api.twitter.com/oauth/request_token', 'oob'),
        receivePin);
}

//else {
// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

var WindowHeight = Titanium.Platform.displayCaps.platformHeight;
var WindowWidth = Titanium.Platform.displayCaps.platformWidth;
var secretWord = "";
var secretMessage = "";

//echo(stringify(brian));



function receiveTheTweet() {
var xhr = Titanium.Network.createHTTPClient();
xhr.open("GET", "http://search.twitter.com/search.json?q="+secretWord+"&rpp=1");
xhr.onreadystatechange = function(status, response) {
   if(status >= 200 && status <= 300) {
     onSuccess(response);
   } else {
     onError(response);
  }
}

xhr.send();
xhr.onload = function() {
	var message = this.responseText;
	message = JSON.parse(message);
	var theString = message.results[0].text;
	var theArray = theString.split(' ');
	message = theArray[0];
	message = arrayze(message); //convert each character into ascii code and save result in array
    var offset = getHashtag(); //grabs offset from hastag
    var unmunged = unMunge(message, offset); //munges the array of characters based on function list and offset
    secretMessage = reString(unmunged);
	
	textArea.value = secretMessage;
	
	//textArea.value = this.responseText;
	//returnedText = JSON.parse(returnedText);
	//label2.text = JSON.parse(xhr.responseText);
};
}




//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Encoder',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Encoder',
    window:win1
});

var label1 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 1',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

var flexSpace = Titanium.UI.createButton({
	style:Titanium.UI.iPhone.SystemButtonStyle.FLEXIBLE_SPACE
});

var send = Titanium.UI.createButton({
	title:'Send Message',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE		
});

send.addEventListener('click', function()
{
	sendTheTweet();
});

var toolbar = Titanium.UI.createToolbar({
	items:[flexSpace,send],
	bottom:0,
	borderTop:true,
	borderBottom:false,
	translucent:true,
	barColor:'#999'
});



win1.add(toolbar);

//win1.add(label1);

var secretKeyField = Titanium.UI.createTextField({
    color:'#336699',
    hintText: 'Enter a secret key',
    height:35,
    top:10,
    left:10,
    width:Titanium.Platform.displayCaps.platformWidth-20,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

secretKeyField.addEventListener('change',function(e) 
	{
	var contentLength = e.source.value.length;
	if (contentLength > 7) e.source.value = e.source.value.substring(0, 7);
	l.text = 'Remaining characters: ' + (8-contentLength).toString();
	checkText(e.source);
	
	});

secretKeyField.addEventListener('focus',function(e){
	var contentLength = e.source.value.length;
	l.text = 'Remaining characters: ' + (8-contentLength).toString();
});

secretKeyField.addEventListener('blur',function() {
		getRequest("http://chinaalbino.com/validator.php?h="+secretKeyField.value+"&c=1");
	});


function checkText(elementID) {
	var text = elementID.value;
	var subtext = text.charAt(text.length-1);
	if (ord(subtext) < 32 || ord(subtext) > 126) {
		elementID.value = text.substring(0,text.length-1);
	}
}

var l = Ti.UI.createLabel({
		text:'Remaining characters: 130',
		color:'#fff',
		font:{fontSize:14}
});

var messageField = Titanium.UI.createTextArea({
    color:'#336699',
    value: 'Enter your message here',
    editable: true,
    verticalAlign: 'top',
    height:175,
    top:65,
    left:10,
    width:300,
    borderWidth:2,
    borderColor:'#bbb',
    borderRadius:5,
    keyboardToolbar:[flexSpace,l,flexSpace],
    keyboardToolbarColor: '#000',   
    keyboardToolbarHeight: 30,
    returnKeyType:Titanium.UI.RETURNKEY_DONE,
    font:{fontSize:16,fontFamily:'Helvetica Neue'},
});

messageField.addEventListener('focus',function(e){
	var contentLength = e.source.value.length;
	l.text = 'Remaining characters: ' + (128-contentLength).toString();
});

messageField.addEventListener('change',function(e){
	var contentLength = e.source.value.length;
	l.text = 'Remaining characters: ' + (128-contentLength).toString();
	if (contentLength > 127) {
		e.source.value = e.source.value.substring(0, 127);
	}
	checkText(e.source);
});

messageField.addEventListener('blur',encodeMessage);

function encodeMessage() {
	var message = messageField.value; //grab message text
    message = arrayze(message); //convert each character into ascii code and save result in array
    var offset = getHashtag(); //grabs offset from hastag
    var munged = munge(message, offset); //munges the array of characters based on function list and offset
    var tweetReady = reString(munged);
    secretMessage = tweetReady;
}


//Utility Functions
   
function arrayze(String){
    var theArray = String.split(""); //this splits every character
    for (var i = 0; i < theArray.length; i++) {
        theArray[i] = ord(theArray[i]);
    }
    return theArray;
}

function getHashtag(){
    var hashTag = secretKeyField.value;
    hashTag = arrayze(hashTag);
    return hashTag;
}


function munge(mungeArray, offset){
    for (var i = 0; i < mungeArray.length; i++) {
    var encryptFunction = encryptr[offset[i%offset.length]]; //% mungeArray.length];//Selecting a function from our list
    mungeArray[i] = encryptFunction(mungeArray[i]) % 96 + 32;//Perform 
                    //console.log(mungeArray[i]);
    }
    return mungeArray;
}

function getRequest(theURL){
	var thr = Titanium.Network.createHTTPClient();
	thr.open("GET", theURL);
	thr.onreadystatechange = function(status, response) {
   		if(status >= 200 && status <= 300) {
    		onSuccess(response);
  		}
  		else {
    		onError(response);
  		}
 	}
	thr.send();
	thr.onload = function() {
		secretWord = unescape(this.responseText);
		alert(secretWord);
	};
}

function unMunge(mungeArray, offset){
	for (var i = 0; i < mungeArray.length; i++) {
		mungeArray[i] -= 32; 
        var decryptFunction = decryptr[offset[i%offset.length]];//Selecting a function from our list
        if (decryptFunction(mungeArray[i]) < 32) {
			mungeArray[i] = decryptFunction(mungeArray[i]) + 96;
			if (mungeArray[i] < 32) mungeArray[i] += 96;
		}
		else mungeArray[i] = decryptFunction(mungeArray[i]);
                //console.log(mungeArray[i]);
        }
     return mungeArray;
}


            
            //Converts the first character of a string into its ascii int representation
            function ord(String){
                return String.charCodeAt(0);
            }
            
            //Converts an int into its ascii character
            function chr(asciiint){
                return String.fromCharCode(asciiint);
            }
            
            //Displays remaining characters under textarea
            function LimitText(AId, BId){
                var e1 = document.getElementById(AId);
                var e2 = document.getElementById(BId);
                var l1 = e1.value.length;
                (l1 > 130) ? e1.value = e1.value.substring(0, 130) : e2.innerHTML = 130 - l1
            }
			
			function checkText(elementID) {
				var text = document.getElementById(elementID).value;
				var subtext = text.charAt(text.length-1);
				if (ord(subtext) < 32 || ord(subtext) > 126) {
					document.getElementById(elementID).value = text.substring(0,text.length-1);
				}
			}
			
			function notEmpty() {
				var message = document.getElementById("mtext").value;
				var hashtag = document.getElementById("hashtag").value;
				if (message.length == 0 || hashtag.length == 0){
					document.getElementById("errortext").innerHTML = "Please fill in both the message and the passkey.";
				}
				else document.getElementById("errortext").innerHTML = "";
			}
            
            //Converts string into an array of individual character ascii codes
                        
            //Converts hashtag into ascii ints and adds together for a checksum-style offset
                        
            //Takes ascii int values in an array and encrypts them using a function chosen from our list
            			
			            
            function reString(theArray){
                for (var i = 0; i < theArray.length; i++) {
                    theArray[i] = chr(theArray[i]);
                }
                var finished = theArray.join("");
                return finished;
            }

function sendTheTweet() {
	alert(secretMessage + secretWord);
	oAuthAdapter.send('https://api.twitter.com/1/statuses/update.json', [
  	['status', secretMessage + " #" + secretWord]], 'Secret Message', 'Sent.', 'Not sent.');
}
	/*
var thr = Titanium.Network.createHTTPClient();
	thr.open("POST", "https://api.twitter.com/1/statuses/update.json");
	thr.onreadystatechange = function(status, response) {
   	if(status >= 200 && status <= 300) {
    onSuccess(response);
   	} else {
    onError(response);
  }
   thr.send({status:"This is our first tweet!"}); */

win1.add(messageField);
win1.add(secretKeyField);


//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Decoder',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Decoder',
    window:win2
});

var secretKeyField2 = Titanium.UI.createTextField({
    color:'#336699',
    hintText: 'Enter the secret key',
    height:35,
    top:10,
    left:10,
    width:Titanium.Platform.displayCaps.platformWidth-20,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

secretKeyField2.addEventListener('change',function(e) 
	{
	var contentLength = e.source.value.length;
	if (contentLength > 7) e.source.value = e.source.value.substring(0, 7);
	l.text = 'Remaining characters: ' + (8-contentLength).toString();
	checkText(e.source);
	
	});

secretKeyField2.addEventListener('focus',function(e){
	var contentLength = e.source.value.length;
	l.text = 'Remaining characters: ' + (8-contentLength).toString();
});

secretKeyField2.addEventListener('blur',function() {
		getRequest("http://chinaalbino.com/validator.php?h=#"+secretKeyField.value+"&c=1");
	});

var scrollView = Titanium.UI.createScrollView({
	height: 'auto',
	width: 'auto',
});

win2.add(scrollView);

var textArea = Titanium.UI.createTextArea({
	value: "I am a webview",
	height: 300,
	width: 280,
	font:{fontSize:20,fontFamily:'Helvetica Neue'}	
});

var receive = Titanium.UI.createButton({
	title:'Receive Message',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE		
});

receive.addEventListener('click', function()
{
	receiveTheTweet();
});


var toolbar2 = Titanium.UI.createToolbar({
	items:[flexSpace,receive],
	bottom:0,
	borderTop:true,
	borderBottom:false,
	translucent:true,
	barColor:'#999'
});


win2.add(secretKeyField);
win1.add(toolbar);
win2.add(toolbar2);



/*
var label2 = Titanium.UI.createLabel({
	color:'#999',
	text: "hello",
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});
*/

scrollView.add(textArea);



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();

var encryptr =[function(arg){ var cc = arg + 60; return cc;},
               function(arg){ var cc = arg + 49; return cc;},
               function(arg){ var cc = arg + 8; return cc;},
               function(arg){ var cc = arg + 2; return cc;},
               function(arg){ var cc = arg + 33; return cc;},
               function(arg){ var cc = arg + 24; return cc;},
               function(arg){ var cc = arg + 6; return cc;},
               function(arg){ var cc = arg + 8; return cc;},
               function(arg){ var cc = arg + 69; return cc;},
               function(arg){ var cc = arg + 21; return cc;},
               function(arg){ var cc = arg + 53; return cc;},
               function(arg){ var cc = arg + 92; return cc;},
               function(arg){ var cc = arg + 9; return cc;},
               function(arg){ var cc = arg + 47; return cc;},
               function(arg){ var cc = arg + 13; return cc;},
               function(arg){ var cc = arg + 43; return cc;},
               function(arg){ var cc = arg + 82; return cc;},
               function(arg){ var cc = arg + 75; return cc;},
               function(arg){ var cc = arg + 58; return cc;},
               function(arg){ var cc = arg + 36; return cc;},
               function(arg){ var cc = arg + 18; return cc;},
               function(arg){ var cc = arg + 46; return cc;},
               function(arg){ var cc = arg + 88; return cc;},
               function(arg){ var cc = arg + 91; return cc;},
               function(arg){ var cc = arg + 73; return cc;},
               function(arg){ var cc = arg + 64; return cc;},
               function(arg){ var cc = arg + 76; return cc;},
               function(arg){ var cc = arg + 49; return cc;},
               function(arg){ var cc = arg + 35; return cc;},
               function(arg){ var cc = arg + 57; return cc;},
               function(arg){ var cc = arg + 30; return cc;},
               function(arg){ var cc = arg + 23; return cc;},
               function(arg){ var cc = arg + 93; return cc;},
               function(arg){ var cc = arg + 43; return cc;},
               function(arg){ var cc = arg + 5; return cc;},
               function(arg){ var cc = arg + 23; return cc;},
               function(arg){ var cc = arg + 63; return cc;},
               function(arg){ var cc = arg + 57; return cc;},
               function(arg){ var cc = arg + 33; return cc;},
               function(arg){ var cc = arg + 3; return cc;},
               function(arg){ var cc = arg + 2; return cc;},
               function(arg){ var cc = arg + 13; return cc;},
               function(arg){ var cc = arg + 92; return cc;},
               function(arg){ var cc = arg + 76; return cc;},
               function(arg){ var cc = arg + 10; return cc;},
               function(arg){ var cc = arg + 13; return cc;},
               function(arg){ var cc = arg + 81; return cc;},
               function(arg){ var cc = arg + 84; return cc;},
               function(arg){ var cc = arg + 38; return cc;},
               function(arg){ var cc = arg + 86; return cc;},
               function(arg){ var cc = arg + 62; return cc;},
               function(arg){ var cc = arg + 84; return cc;},
               function(arg){ var cc = arg + 51; return cc;},
               function(arg){ var cc = arg + 27; return cc;},
               function(arg){ var cc = arg + 76; return cc;},
               function(arg){ var cc = arg + 91; return cc;},
               function(arg){ var cc = arg + 56; return cc;},
               function(arg){ var cc = arg + 82; return cc;},
               function(arg){ var cc = arg + 53; return cc;},
               function(arg){ var cc = arg + 5; return cc;},
               function(arg){ var cc = arg + 51; return cc;},
               function(arg){ var cc = arg + 19; return cc;},
               function(arg){ var cc = arg + 18; return cc;},
               function(arg){ var cc = arg + 35; return cc;},
               function(arg){ var cc = arg + 21; return cc;},
               function(arg){ var cc = arg + 58; return cc;},
               function(arg){ var cc = arg + 90; return cc;},
               function(arg){ var cc = arg + 83; return cc;},
               function(arg){ var cc = arg + 18; return cc;},
               function(arg){ var cc = arg + 49; return cc;},
               function(arg){ var cc = arg + 74; return cc;},
               function(arg){ var cc = arg + 73; return cc;},
               function(arg){ var cc = arg + 67; return cc;},
               function(arg){ var cc = arg + 91; return cc;},
               function(arg){ var cc = arg + 68; return cc;},
               function(arg){ var cc = arg + 12; return cc;},
               function(arg){ var cc = arg + 54; return cc;},
               function(arg){ var cc = arg + 33; return cc;},
               function(arg){ var cc = arg + 5; return cc;},
               function(arg){ var cc = arg + 37; return cc;},
               function(arg){ var cc = arg + 43; return cc;},
               function(arg){ var cc = arg + 22; return cc;},
               function(arg){ var cc = arg + 19; return cc;},
               function(arg){ var cc = arg + 65; return cc;},
               function(arg){ var cc = arg + 71; return cc;},
               function(arg){ var cc = arg + 3; return cc;},
               function(arg){ var cc = arg + 67; return cc;},
               function(arg){ var cc = arg + 63; return cc;},
               function(arg){ var cc = arg + 95; return cc;},
               function(arg){ var cc = arg + 72; return cc;},
               function(arg){ var cc = arg + 66; return cc;},
               function(arg){ var cc = arg + 22; return cc;},
               function(arg){ var cc = arg + 2; return cc;},
               function(arg){ var cc = arg + 7; return cc;},
               function(arg){ var cc = arg + 38; return cc;},
               function(arg){ var cc = arg + 91; return cc;},
               function(arg){ var cc = arg + 90; return cc;},
               function(arg){ var cc = arg + 51; return cc;},
               function(arg){ var cc = arg + 30; return cc;},
               function(arg){ var cc = arg + 54; return cc;},
               function(arg){ var cc = arg + 86; return cc;},
               function(arg){ var cc = arg + 23; return cc;},
               function(arg){ var cc = arg + 16; return cc;},
               function(arg){ var cc = arg + 25; return cc;},
               function(arg){ var cc = arg + 42; return cc;},
               function(arg){ var cc = arg + 94; return cc;},
               function(arg){ var cc = arg + 24; return cc;},
               function(arg){ var cc = arg + 54; return cc;},
               function(arg){ var cc = arg + 60; return cc;},
               function(arg){ var cc = arg + 8; return cc;},
               function(arg){ var cc = arg + 40; return cc;},
               function(arg){ var cc = arg + 10; return cc;},
               function(arg){ var cc = arg + 46; return cc;},
               function(arg){ var cc = arg + 65; return cc;},
               function(arg){ var cc = arg + 35; return cc;},
               function(arg){ var cc = arg + 2; return cc;},
               function(arg){ var cc = arg + 44; return cc;},
               function(arg){ var cc = arg + 66; return cc;},
               function(arg){ var cc = arg + 84; return cc;},
               function(arg){ var cc = arg + 66; return cc;},
               function(arg){ var cc = arg + 78; return cc;},
               function(arg){ var cc = arg + 22; return cc;},
               function(arg){ var cc = arg + 80; return cc;},
               function(arg){ var cc = arg + 28; return cc;},
               function(arg){ var cc = arg + 24; return cc;},
               function(arg){ var cc = arg + 75; return cc;},
               function(arg){ var cc = arg + 88; return cc;},
               function(arg){ var cc = arg + 94; return cc;},
               function(arg){ var cc = arg + 95; return cc;},
               function(arg){ var cc = arg + 38; return cc;},
               function(arg){ var cc = arg + 31; return cc;},
               function(arg){ var cc = arg + 51; return cc;},
               function(arg){ var cc = arg + 52; return cc;},
               function(arg){ var cc = arg + 10; return cc;},
               function(arg){ var cc = arg + 27; return cc;},
               function(arg){ var cc = arg + 15; return cc;},
               function(arg){ var cc = arg + 66; return cc;},
               function(arg){ var cc = arg + 65; return cc;},
               function(arg){ var cc = arg + 35; return cc;},
               function(arg){ var cc = arg + 64; return cc;},
               function(arg){ var cc = arg + 27; return cc;},
               function(arg){ var cc = arg + 10; return cc;},
               function(arg){ var cc = arg + 95; return cc;},
               function(arg){ var cc = arg + 8; return cc;},
               function(arg){ var cc = arg + 81; return cc;},
               function(arg){ var cc = arg + 16; return cc;},
               function(arg){ var cc = arg + 40; return cc;},
               function(arg){ var cc = arg + 29; return cc;},
               function(arg){ var cc = arg + 5; return cc;},
               function(arg){ var cc = arg + 2; return cc;},
               function(arg){ var cc = arg + 35; return cc;},
               function(arg){ var cc = arg + 4; return cc;},
               function(arg){ var cc = arg + 81; return cc;},
               function(arg){ var cc = arg + 91; return cc;},
               function(arg){ var cc = arg + 11; return cc;},
               function(arg){ var cc = arg + 20; return cc;},
               function(arg){ var cc = arg + 3; return cc;},
               function(arg){ var cc = arg + 63; return cc;},
               function(arg){ var cc = arg + 13; return cc;},
               function(arg){ var cc = arg + 72; return cc;},
               function(arg){ var cc = arg + 64; return cc;},
               function(arg){ var cc = arg + 44; return cc;},
               function(arg){ var cc = arg + 90; return cc;},
               function(arg){ var cc = arg + 15; return cc;},
               function(arg){ var cc = arg + 86; return cc;},
               function(arg){ var cc = arg + 2; return cc;},
               function(arg){ var cc = arg + 23; return cc;},
               function(arg){ var cc = arg + 53; return cc;},
               function(arg){ var cc = arg + 11; return cc;},
               function(arg){ var cc = arg + 57; return cc;},
               function(arg){ var cc = arg + 85; return cc;},
               function(arg){ var cc = arg + 17; return cc;},
               function(arg){ var cc = arg + 53; return cc;},
               function(arg){ var cc = arg + 53; return cc;},
               function(arg){ var cc = arg + 79; return cc;},
               function(arg){ var cc = arg + 21; return cc;},
               function(arg){ var cc = arg + 14; return cc;},
               function(arg){ var cc = arg + 52; return cc;},
               function(arg){ var cc = arg + 83; return cc;},
               function(arg){ var cc = arg + 91; return cc;},
               function(arg){ var cc = arg + 92; return cc;},
               function(arg){ var cc = arg + 35; return cc;},
               function(arg){ var cc = arg + 46; return cc;},
               function(arg){ var cc = arg + 25; return cc;},
               function(arg){ var cc = arg + 67; return cc;},
               function(arg){ var cc = arg + 67; return cc;},
               function(arg){ var cc = arg + 42; return cc;},
               function(arg){ var cc = arg + 76; return cc;},
               function(arg){ var cc = arg + 22; return cc;},
               function(arg){ var cc = arg + 68; return cc;},
               function(arg){ var cc = arg + 36; return cc;},
               function(arg){ var cc = arg + 56; return cc;},
               function(arg){ var cc = arg + 78; return cc;},
               function(arg){ var cc = arg + 50; return cc;},
               function(arg){ var cc = arg + 32; return cc;},
               function(arg){ var cc = arg + 7; return cc;},
               function(arg){ var cc = arg + 81; return cc;},
               function(arg){ var cc = arg + 55; return cc;},
               function(arg){ var cc = arg + 41; return cc;},
               function(arg){ var cc = arg + 53; return cc;},
               function(arg){ var cc = arg + 52; return cc;},
               function(arg){ var cc = arg + 31; return cc;},
               function(arg){ var cc = arg + 12; return cc;},
               function(arg){ var cc = arg + 0; return cc;},
               function(arg){ var cc = arg + 11; return cc;},
               function(arg){ var cc = arg + 22; return cc;},
               function(arg){ var cc = arg + 78; return cc;},
               function(arg){ var cc = arg + 80; return cc;},
               function(arg){ var cc = arg + 66; return cc;},
               function(arg){ var cc = arg + 59; return cc;},
               function(arg){ var cc = arg + 86; return cc;},
               function(arg){ var cc = arg + 88; return cc;},
               function(arg){ var cc = arg + 94; return cc;},
               function(arg){ var cc = arg + 7; return cc;},
               function(arg){ var cc = arg + 79; return cc;},
               function(arg){ var cc = arg + 35; return cc;},
               function(arg){ var cc = arg + 46; return cc;},
               function(arg){ var cc = arg + 9; return cc;},
               function(arg){ var cc = arg + 77; return cc;},
               function(arg){ var cc = arg + 62; return cc;},
               function(arg){ var cc = arg + 84; return cc;},
               function(arg){ var cc = arg + 34; return cc;},
               function(arg){ var cc = arg + 64; return cc;},
               function(arg){ var cc = arg + 47; return cc;},
               function(arg){ var cc = arg + 32; return cc;},
               function(arg){ var cc = arg + 69; return cc;},
               function(arg){ var cc = arg + 11; return cc;},
               function(arg){ var cc = arg + 35; return cc;},
               function(arg){ var cc = arg + 51; return cc;},
               function(arg){ var cc = arg + 5; return cc;},
               function(arg){ var cc = arg + 43; return cc;},
               function(arg){ var cc = arg + 88; return cc;},
               function(arg){ var cc = arg + 92; return cc;},
               function(arg){ var cc = arg + 93; return cc;},
               function(arg){ var cc = arg + 75; return cc;},
               function(arg){ var cc = arg + 36; return cc;},
               function(arg){ var cc = arg + 66; return cc;},
               function(arg){ var cc = arg + 91; return cc;},
               function(arg){ var cc = arg + 19; return cc;},
               function(arg){ var cc = arg + 58; return cc;},
               function(arg){ var cc = arg + 63; return cc;},
               function(arg){ var cc = arg + 83; return cc;},
               function(arg){ var cc = arg + 84; return cc;},
               function(arg){ var cc = arg + 64; return cc;},
               function(arg){ var cc = arg + 10; return cc;},
               function(arg){ var cc = arg + 20; return cc;},
               function(arg){ var cc = arg + 74; return cc;},
               function(arg){ var cc = arg + 32; return cc;},
               function(arg){ var cc = arg + 75; return cc;},
               function(arg){ var cc = arg + 95; return cc;},
               function(arg){ var cc = arg + 28; return cc;},
               function(arg){ var cc = arg + 62; return cc;},
               function(arg){ var cc = arg + 53; return cc;},
               function(arg){ var cc = arg + 50; return cc;},
               function(arg){ var cc = arg + 45; return cc;},
               function(arg){ var cc = arg + 33; return cc;},
               ];


var decryptr =[function(arg){ var cc = arg - 60; return cc;},
               function(arg){ var cc = arg - 49; return cc;},
               function(arg){ var cc = arg - 8; return cc;},
               function(arg){ var cc = arg - 2; return cc;},
               function(arg){ var cc = arg - 33; return cc;},
               function(arg){ var cc = arg - 24; return cc;},
               function(arg){ var cc = arg - 6; return cc;},
               function(arg){ var cc = arg - 8; return cc;},
               function(arg){ var cc = arg - 69; return cc;},
               function(arg){ var cc = arg - 21; return cc;},
               function(arg){ var cc = arg - 53; return cc;},
               function(arg){ var cc = arg - 92; return cc;},
               function(arg){ var cc = arg - 9; return cc;},
               function(arg){ var cc = arg - 47; return cc;},
               function(arg){ var cc = arg - 13; return cc;},
               function(arg){ var cc = arg - 43; return cc;},
               function(arg){ var cc = arg - 82; return cc;},
               function(arg){ var cc = arg - 75; return cc;},
               function(arg){ var cc = arg - 58; return cc;},
               function(arg){ var cc = arg - 36; return cc;},
               function(arg){ var cc = arg - 18; return cc;},
               function(arg){ var cc = arg - 46; return cc;},
               function(arg){ var cc = arg - 88; return cc;},
               function(arg){ var cc = arg - 91; return cc;},
               function(arg){ var cc = arg - 73; return cc;},
               function(arg){ var cc = arg - 64; return cc;},
               function(arg){ var cc = arg - 76; return cc;},
               function(arg){ var cc = arg - 49; return cc;},
               function(arg){ var cc = arg - 35; return cc;},
               function(arg){ var cc = arg - 57; return cc;},
               function(arg){ var cc = arg - 30; return cc;},
               function(arg){ var cc = arg - 23; return cc;},
               function(arg){ var cc = arg - 93; return cc;},
               function(arg){ var cc = arg - 43; return cc;},
               function(arg){ var cc = arg - 5; return cc;},
               function(arg){ var cc = arg - 23; return cc;},
               function(arg){ var cc = arg - 63; return cc;},
               function(arg){ var cc = arg - 57; return cc;},
               function(arg){ var cc = arg - 33; return cc;},
               function(arg){ var cc = arg - 3; return cc;},
               function(arg){ var cc = arg - 2; return cc;},
               function(arg){ var cc = arg - 13; return cc;},
               function(arg){ var cc = arg - 92; return cc;},
               function(arg){ var cc = arg - 76; return cc;},
               function(arg){ var cc = arg - 10; return cc;},
               function(arg){ var cc = arg - 13; return cc;},
               function(arg){ var cc = arg - 81; return cc;},
               function(arg){ var cc = arg - 84; return cc;},
               function(arg){ var cc = arg - 38; return cc;},
               function(arg){ var cc = arg - 86; return cc;},
               function(arg){ var cc = arg - 62; return cc;},
               function(arg){ var cc = arg - 84; return cc;},
               function(arg){ var cc = arg - 51; return cc;},
               function(arg){ var cc = arg - 27; return cc;},
               function(arg){ var cc = arg - 76; return cc;},
               function(arg){ var cc = arg - 91; return cc;},
               function(arg){ var cc = arg - 56; return cc;},
               function(arg){ var cc = arg - 82; return cc;},
               function(arg){ var cc = arg - 53; return cc;},
               function(arg){ var cc = arg - 5; return cc;},
               function(arg){ var cc = arg - 51; return cc;},
               function(arg){ var cc = arg - 19; return cc;},
               function(arg){ var cc = arg - 18; return cc;},
               function(arg){ var cc = arg - 35; return cc;},
               function(arg){ var cc = arg - 21; return cc;},
               function(arg){ var cc = arg - 58; return cc;},
               function(arg){ var cc = arg - 90; return cc;},
               function(arg){ var cc = arg - 83; return cc;},
               function(arg){ var cc = arg - 18; return cc;},
               function(arg){ var cc = arg - 49; return cc;},
               function(arg){ var cc = arg - 74; return cc;},
               function(arg){ var cc = arg - 73; return cc;},
               function(arg){ var cc = arg - 67; return cc;},
               function(arg){ var cc = arg - 91; return cc;},
               function(arg){ var cc = arg - 68; return cc;},
               function(arg){ var cc = arg - 12; return cc;},
               function(arg){ var cc = arg - 54; return cc;},
               function(arg){ var cc = arg - 33; return cc;},
               function(arg){ var cc = arg - 5; return cc;},
               function(arg){ var cc = arg - 37; return cc;},
               function(arg){ var cc = arg - 43; return cc;},
               function(arg){ var cc = arg - 22; return cc;},
               function(arg){ var cc = arg - 19; return cc;},
               function(arg){ var cc = arg - 65; return cc;},
               function(arg){ var cc = arg - 71; return cc;},
               function(arg){ var cc = arg - 3; return cc;},
               function(arg){ var cc = arg - 67; return cc;},
               function(arg){ var cc = arg - 63; return cc;},
               function(arg){ var cc = arg - 95; return cc;},
               function(arg){ var cc = arg - 72; return cc;},
               function(arg){ var cc = arg - 66; return cc;},
               function(arg){ var cc = arg - 22; return cc;},
               function(arg){ var cc = arg - 2; return cc;},
               function(arg){ var cc = arg - 7; return cc;},
               function(arg){ var cc = arg - 38; return cc;},
               function(arg){ var cc = arg - 91; return cc;},
               function(arg){ var cc = arg - 90; return cc;},
               function(arg){ var cc = arg - 51; return cc;},
               function(arg){ var cc = arg - 30; return cc;},
               function(arg){ var cc = arg - 54; return cc;},
               function(arg){ var cc = arg - 86; return cc;},
               function(arg){ var cc = arg - 23; return cc;},
               function(arg){ var cc = arg - 16; return cc;},
               function(arg){ var cc = arg - 25; return cc;},
               function(arg){ var cc = arg - 42; return cc;},
               function(arg){ var cc = arg - 94; return cc;},
               function(arg){ var cc = arg - 24; return cc;},
               function(arg){ var cc = arg - 54; return cc;},
               function(arg){ var cc = arg - 60; return cc;},
               function(arg){ var cc = arg - 8; return cc;},
               function(arg){ var cc = arg - 40; return cc;},
               function(arg){ var cc = arg - 10; return cc;},
               function(arg){ var cc = arg - 46; return cc;},
               function(arg){ var cc = arg - 65; return cc;},
               function(arg){ var cc = arg - 35; return cc;},
               function(arg){ var cc = arg - 2; return cc;},
               function(arg){ var cc = arg - 44; return cc;},
               function(arg){ var cc = arg - 66; return cc;},
               function(arg){ var cc = arg - 84; return cc;},
               function(arg){ var cc = arg - 66; return cc;},
               function(arg){ var cc = arg - 78; return cc;},
               function(arg){ var cc = arg - 22; return cc;},
               function(arg){ var cc = arg - 80; return cc;},
               function(arg){ var cc = arg - 28; return cc;},
               function(arg){ var cc = arg - 24; return cc;},
               function(arg){ var cc = arg - 75; return cc;},
               function(arg){ var cc = arg - 88; return cc;},
               function(arg){ var cc = arg - 94; return cc;},
               function(arg){ var cc = arg - 95; return cc;},
               function(arg){ var cc = arg - 38; return cc;},
               function(arg){ var cc = arg - 31; return cc;},
               function(arg){ var cc = arg - 51; return cc;},
               function(arg){ var cc = arg - 52; return cc;},
               function(arg){ var cc = arg - 10; return cc;},
               function(arg){ var cc = arg - 27; return cc;},
               function(arg){ var cc = arg - 15; return cc;},
               function(arg){ var cc = arg - 66; return cc;},
               function(arg){ var cc = arg - 65; return cc;},
               function(arg){ var cc = arg - 35; return cc;},
               function(arg){ var cc = arg - 64; return cc;},
               function(arg){ var cc = arg - 27; return cc;},
               function(arg){ var cc = arg - 10; return cc;},
               function(arg){ var cc = arg - 95; return cc;},
               function(arg){ var cc = arg - 8; return cc;},
               function(arg){ var cc = arg - 81; return cc;},
               function(arg){ var cc = arg - 16; return cc;},
               function(arg){ var cc = arg - 40; return cc;},
               function(arg){ var cc = arg - 29; return cc;},
               function(arg){ var cc = arg - 5; return cc;},
               function(arg){ var cc = arg - 2; return cc;},
               function(arg){ var cc = arg - 35; return cc;},
               function(arg){ var cc = arg - 4; return cc;},
               function(arg){ var cc = arg - 81; return cc;},
               function(arg){ var cc = arg - 91; return cc;},
               function(arg){ var cc = arg - 11; return cc;},
               function(arg){ var cc = arg - 20; return cc;},
               function(arg){ var cc = arg - 3; return cc;},
               function(arg){ var cc = arg - 63; return cc;},
               function(arg){ var cc = arg - 13; return cc;},
               function(arg){ var cc = arg - 72; return cc;},
               function(arg){ var cc = arg - 64; return cc;},
               function(arg){ var cc = arg - 44; return cc;},
               function(arg){ var cc = arg - 90; return cc;},
               function(arg){ var cc = arg - 15; return cc;},
               function(arg){ var cc = arg - 86; return cc;},
               function(arg){ var cc = arg - 2; return cc;},
               function(arg){ var cc = arg - 23; return cc;},
               function(arg){ var cc = arg - 53; return cc;},
               function(arg){ var cc = arg - 11; return cc;},
               function(arg){ var cc = arg - 57; return cc;},
               function(arg){ var cc = arg - 85; return cc;},
               function(arg){ var cc = arg - 17; return cc;},
               function(arg){ var cc = arg - 53; return cc;},
               function(arg){ var cc = arg - 53; return cc;},
               function(arg){ var cc = arg - 79; return cc;},
               function(arg){ var cc = arg - 21; return cc;},
               function(arg){ var cc = arg - 14; return cc;},
               function(arg){ var cc = arg - 52; return cc;},
               function(arg){ var cc = arg - 83; return cc;},
               function(arg){ var cc = arg - 91; return cc;},
               function(arg){ var cc = arg - 92; return cc;},
               function(arg){ var cc = arg - 35; return cc;},
               function(arg){ var cc = arg - 46; return cc;},
               function(arg){ var cc = arg - 25; return cc;},
               function(arg){ var cc = arg - 67; return cc;},
               function(arg){ var cc = arg - 67; return cc;},
               function(arg){ var cc = arg - 42; return cc;},
               function(arg){ var cc = arg - 76; return cc;},
               function(arg){ var cc = arg - 22; return cc;},
               function(arg){ var cc = arg - 68; return cc;},
               function(arg){ var cc = arg - 36; return cc;},
               function(arg){ var cc = arg - 56; return cc;},
               function(arg){ var cc = arg - 78; return cc;},
               function(arg){ var cc = arg - 50; return cc;},
               function(arg){ var cc = arg - 32; return cc;},
               function(arg){ var cc = arg - 7; return cc;},
               function(arg){ var cc = arg - 81; return cc;},
               function(arg){ var cc = arg - 55; return cc;},
               function(arg){ var cc = arg - 41; return cc;},
               function(arg){ var cc = arg - 53; return cc;},
               function(arg){ var cc = arg - 52; return cc;},
               function(arg){ var cc = arg - 31; return cc;},
               function(arg){ var cc = arg - 12; return cc;},
               function(arg){ var cc = arg - 0; return cc;},
               function(arg){ var cc = arg - 11; return cc;},
               function(arg){ var cc = arg - 22; return cc;},
               function(arg){ var cc = arg - 78; return cc;},
               function(arg){ var cc = arg - 80; return cc;},
               function(arg){ var cc = arg - 66; return cc;},
               function(arg){ var cc = arg - 59; return cc;},
               function(arg){ var cc = arg - 86; return cc;},
               function(arg){ var cc = arg - 88; return cc;},
               function(arg){ var cc = arg - 94; return cc;},
               function(arg){ var cc = arg - 7; return cc;},
               function(arg){ var cc = arg - 79; return cc;},
               function(arg){ var cc = arg - 35; return cc;},
               function(arg){ var cc = arg - 46; return cc;},
               function(arg){ var cc = arg - 9; return cc;},
               function(arg){ var cc = arg - 77; return cc;},
               function(arg){ var cc = arg - 62; return cc;},
               function(arg){ var cc = arg - 84; return cc;},
               function(arg){ var cc = arg - 34; return cc;},
               function(arg){ var cc = arg - 64; return cc;},
               function(arg){ var cc = arg - 47; return cc;},
               function(arg){ var cc = arg - 32; return cc;},
               function(arg){ var cc = arg - 69; return cc;},
               function(arg){ var cc = arg - 11; return cc;},
               function(arg){ var cc = arg - 35; return cc;},
               function(arg){ var cc = arg - 51; return cc;},
               function(arg){ var cc = arg - 5; return cc;},
               function(arg){ var cc = arg - 43; return cc;},
               function(arg){ var cc = arg - 88; return cc;},
               function(arg){ var cc = arg - 92; return cc;},
               function(arg){ var cc = arg - 93; return cc;},
               function(arg){ var cc = arg - 75; return cc;},
               function(arg){ var cc = arg - 36; return cc;},
               function(arg){ var cc = arg - 66; return cc;},
               function(arg){ var cc = arg - 91; return cc;},
               function(arg){ var cc = arg - 19; return cc;},
               function(arg){ var cc = arg - 58; return cc;},
               function(arg){ var cc = arg - 63; return cc;},
               function(arg){ var cc = arg - 83; return cc;},
               function(arg){ var cc = arg - 84; return cc;},
               function(arg){ var cc = arg - 64; return cc;},
               function(arg){ var cc = arg - 10; return cc;},
               function(arg){ var cc = arg - 20; return cc;},
               function(arg){ var cc = arg - 74; return cc;},
               function(arg){ var cc = arg - 32; return cc;},
               function(arg){ var cc = arg - 75; return cc;},
               function(arg){ var cc = arg - 95; return cc;},
               function(arg){ var cc = arg - 28; return cc;},
               function(arg){ var cc = arg - 62; return cc;},
               function(arg){ var cc = arg - 53; return cc;},
               function(arg){ var cc = arg - 50; return cc;},
               function(arg){ var cc = arg - 45; return cc;},
               function(arg){ var cc = arg - 33; return cc;},
               ];
              // }