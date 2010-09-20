
Ti.include('oauth_adapter.js');
Ti.include('functions.js');

	// this sets the background color of the master UIView (when there are no
	// windows/tab groups on it)
	Titanium.UI.setBackgroundColor('#000');
	
	// create tab group
	var tabGroup = Titanium.UI.createTabGroup();
	
	// open tab group
	tabGroup.open();
	
	
	var WindowHeight = Titanium.Platform.displayCaps.platformHeight; //the height of the screen, device agnostic
	var WindowWidth = Titanium.Platform.displayCaps.platformWidth;	//the width of the screen, device agnostic
	
	var secretWord = ""; //global hashtag holder
	var secretMessage = ""; //global message holder
	
	var originalMessage = "";
	var inited = false;
	
	// often used button elements
	var flexSpace = Titanium.UI.createButton({
		style:Titanium.UI.iPhone.SystemButtonStyle.FLEXIBLE_SPACE
	});
	
	var label = Ti.UI.createLabel({
		text:'Remaining characters: 130',
		color:'#fff',
		font:{fontSize:14}
	});
	
	// echo(stringify(brian));
	
	
	
	// create base UI tab and root window
	
	// ---------------- WINDOW 1 ------------------------
	
	var win1 = Titanium.UI.createWindow({  
	    title:'Encoder',
	    backgroundColor:'#fff',
	    zIndex:-10
	});
	
	var tab1 = Titanium.UI.createTab({  
	    icon:'KS_nav_views.png',
	    title:'Encoder',
	    window:win1
	});
	
	tabGroup.addTab(tab1);
	
	
	// ---------------- TOOLBAR in WINDOW 1 ------------------------
	
	// Authorize usage of Twitter services on App
	var oAuthAdapter = new OAuthAdapter(
	        'k7Ii6V1iHKeBShTEBfQ6sHRPRk4PPWSXEcaUEZarsts',
	        'Qg0OPV00LpcO2hrAZTA',
	        'HMAC-SHA1');
	 
	 
	// load the access token for the service (if previously saved)
	oAuthAdapter.loadAccessToken('twitter');
	 // *****************************Code to send below
		// ****************************
	 
	//oAuthAdapter.send('https://api.twitter.com/1/statuses/update.json', [['status', 'I am now using Twiptography, can you decode my tweets?']], 'Twitter', 'Published.', 'Not published.');
	
	// *******************************************************************************
	 
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
	
	// ---------------- SECRET KEY FIELD ------------------------
	
	var secretKeyField = Titanium.UI.createTextField({
	    color:'#336699',
	    hintText: 'Enter a secret key',
	    height:35,
	    top:10,
	    left:10,
	    width:Titanium.Platform.displayCaps.platformWidth-20,
	    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	win1.add(secretKeyField);
	
	secretKeyField.addEventListener('change',function(e) 
		{
		var contentLength = e.source.value.length;
		if (contentLength > 7) e.source.value = e.source.value.substring(0, 7);
		l.text = 'Remaining characters: ' + (8-contentLength).toString();
		checkText(e.source);	
		});
	
	secretKeyField.addEventListener('focus',function(e){
		var contentLength = e.source.value.length;
		label.text = 'Remaining characters: ' + (8-contentLength).toString();
	});
	
	secretKeyField.addEventListener('blur',function() {
			getRequest("http://chinaalbino.com/validator.php?h="+secretKeyField.value+"&c=1");
	});
	
	
	// ---------------- MESSAGE FIELD ------------------------
	
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
	    keyboardToolbar:[flexSpace,label,flexSpace],
	    keyboardToolbarColor: '#000',   
	    keyboardToolbarHeight: 30,
	    returnKeyType:Titanium.UI.RETURNKEY_DONE,
	    font:{fontSize:16,fontFamily:'Helvetica Neue'},
	});
	
	win1.add(messageField);
	
	messageField.addEventListener('focus',function(e){
		var contentLength = e.source.value.length;
		label.text = 'Remaining characters: ' + (128-contentLength).toString();
	});
	
	messageField.addEventListener('change',function(e){
		var contentLength = e.source.value.length;
		label.text = 'Remaining characters: ' + (128-contentLength).toString();
		if (contentLength > 127) {
			e.source.value = e.source.value.substring(0, 127);
		}
		checkText(e.source);
	});	
	
		// ---------------- ENCODE SWITCH ------------------------
	
	var encodeSwitch = Titanium.UI.createSwitch({
		value:false,
		top:9,
		right:35
	});
	
	encodeSwitch.addEventListener('change',function(e) 
		{			
			if (encodeSwitch.value) {
				
				/*
var message = arrayze(originalMessage);
				var newMessage = arrayze(secretMessage);
*/
				encodeMessage();
				var counter = 0;
				
				var timer = setInterval(function(){
					if (counter < originalMessage.length+1) {
						messageField.value = secretMessage.substr(0,counter)+originalMessage.substr(counter+1);
						counter ++;
					}
					else {
						inited = true;
						timer.clearInterval();
					}
				},25);
			/*
	//Encryption animation
				for (var i = 0; i < message.length; i++) {
					if (message[i] < newMessage[i]) {
						for (var j = message[i]; j < newMessage[i]; j++) {
							messageField.value = originalMessage.replace(originalMessage.charAt(i), chr(j));
							//alert(chr(j));
						}	
					}
					else {
						for (var j = message[i]; j > newMessage[i]; j--) {
							messageField.value = originalMessage.replace(originalMessage.charAt(i), chr(j));
							//alert(chr(j));
						}	
					}	
				}*/				
			}

			else if (!encodeSwitch.value && inited) {
				//decodeMessage();
				var counter = originalMessage.length+1;
				
				var timer = setInterval(function(){
					if (counter >= 0) {
						messageField.value = secretMessage.substr(0,counter)+originalMessage.substr(counter);
						counter --;
					}
					else {
						timer.clearInterval();
					}
				},25);
			}
		});
		
	toolbar.add(encodeSwitch);
		
	
	// ---------------- ADD EVERYTHING TO THE DISPLAY LIST ------------------------
	
	
	
	
	
	
	// ---------------- WINDOW 2 ------------------------
	
	var win2 = Titanium.UI.createWindow({  
	    title:'Decoder',
	    backgroundColor:'#fff',
	    zIndex:-10
	});
	
	var tab2 = Titanium.UI.createTab({  
	    icon:'KS_nav_ui.png',
	    title:'Decoder',
	    window:win2
	});
	
	tabGroup.addTab(tab2);  
	
	var scrollView = Titanium.UI.createScrollView({
		height: 'auto',
		width: 'auto',
	});
	
	win2.add(scrollView);
	
	// ---------------- TOOLBAR 2 ------------------------
	
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
	
	win2.add(toolbar2);
	
	
	// ---------------- SECRET KEY FIELD 2 ------------------------
	
	
	var secretKeyField2 = Titanium.UI.createTextField({
	    color:'#336699',
	    hintText: 'Enter the secret key',
	    height:35,
	    top:10,
	    left:10,
	    width:Titanium.Platform.displayCaps.platformWidth-20,
	    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	win2.add(secretKeyField);
	
	secretKeyField2.addEventListener('change',function(e) 
		{
		var contentLength = e.source.value.length;
		if (contentLength > 7) e.source.value = e.source.value.substring(0, 7);
		label.text = 'Remaining characters: ' + (8-contentLength).toString();
		checkText(e.source);
	});
	
	secretKeyField2.addEventListener('focus',function(e){
		var contentLength = e.source.value.length;
		label.text = 'Remaining characters: ' + (8-contentLength).toString();
	});
	
	secretKeyField2.addEventListener('blur',function() {
			getRequest("http://chinaalbino.com/validator.php?h=#"+secretKeyField.value+"&c=1");
		});
	
	
	// ---------------- MESSAGE TEXT AREA ------------------------
	
	var textArea = Titanium.UI.createTextArea({
		value: "I am a webview",
		height: 300,
		width: 280,
		font:{fontSize:20,fontFamily:'Helvetica Neue'}	
	});
	
	scrollView.add(textArea);
	
	// ---------------- ADD EVERYTHING TO THE DISPLAY LIST ------------------------
	
	
	
	
	
	
	
	
	
	// ---------------- UTILITY ------------------------
	// ---------------- FUNCTIONS ----------------------
	
	
	// Turns inputed string into an array of ascii character codes   
	function arrayze(String){
	    var theArray = String.split(""); // this splits every character
	    for (var i = 0; i < theArray.length; i++) {
	        theArray[i] = ord(theArray[i]);
	    }
	    return theArray;
	}
	
	// Turns hashtag into array of ascii character codes
	function getHashtag(){
	    var hashTag = secretKeyField.value;
	    hashTag = arrayze(hashTag);
	    return hashTag;
	}
	
	// Makes sure that text in a text field contains no illegal characters
	function checkText(elementID) {
		var text = elementID.value;
		var subtext = text.charAt(text.length-1);
		if (ord(subtext) < 32 || ord(subtext) > 126) {
			elementID.value = text.substring(0,text.length-1);
		}
	}
	
	// Encodes a message
	function encodeMessage() {
		var message = messageField.value; // grab message text
		originalMessage = message;
	    message = arrayze(message); // convert each character into ascii code and save result in array
	    var offset = getHashtag(); // grabs offset from hastag
	    var munged = munge(message, offset); // munges the array of characters based on function list and offset
	    var tweetReady = reString(munged);
	    secretMessage = tweetReady;
	}
	
	// Decodes a message
	function decodeMessage() {
		var message = messageField.value; // grab message text
		secretMessage = message;
	    message = arrayze(message); // convert each character into ascii code and save result in array
	    var offset = getHashtag(); // grabs offset from hastag
	    var unmunged = unMunge(message, offset); // munges the array of characters based on function list and offset
	    var displayReady = reString(unmunged);
	    secretMessage = displayReady;
	}

	
	// Applies text transforms selected from functions.js to an array of ascii char codes
	function munge(mungeArray, offset){
	    for (var i = 0; i < mungeArray.length; i++) {
	    	var encryptFunction = encryptr[offset[i%offset.length]]; //Selecting a function from our list
	    	mungeArray[i] = encryptFunction(mungeArray[i]) % 96 + 32; //Calls the selected function on the selected array element
	    }
	    return mungeArray;
	}
	 
	// Sends inputted URL off to the server for encoding (used to hash the hashtag)
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
			secretKeyField.value = secretWord;
		};
	}
	
	// Decodes an array of ascii character codes encoded using a specific hash
	function unMunge(mungeArray, offset){
		for (var i = 0; i < mungeArray.length; i++) {
			mungeArray[i] -= 32; 
	        var decryptFunction = decryptr[offset[i%offset.length]];
	        if (decryptFunction(mungeArray[i]) < 32) {
				mungeArray[i] = decryptFunction(mungeArray[i]) + 96;
				if (mungeArray[i] < 32) mungeArray[i] += 96;
			}
			else mungeArray[i] = decryptFunction(mungeArray[i]);
	        }
	     return mungeArray;
	}
	           
	// Converts the first character of a string into its ascii int representation
	function ord(String){
		return String.charCodeAt(0);
	}
	            
	// Converts an int into its ascii character
	function chr(asciiint){
		return String.fromCharCode(asciiint);
	}
	            			
	// Converts an array of individual character ascii codes back into an alphanumeric string		            
	function reString(theArray){
		for (var i = 0; i < theArray.length; i++) {
			theArray[i] = chr(theArray[i]);
		}
		var finished = theArray.join("");
		return finished;
	}
	
	// Formats and sends the Tweet to Twitter
	function sendTheTweet() {
		postToTheDatabase(secretMessage,secretWord);
		/*
		alert(secretMessage + secretWord);
		oAuthAdapter.send('https://api.twitter.com/1/statuses/update.json', [
	  	['status', secretMessage + " #" + secretWord]], 'Secret Message', 'Sent.', 'Not sent.');
*/
	}
	
	function postToTheDatabase(messageText,hashTag) {
		var xhr = Titanium.Network.createHTTPClient();
		var theHashy = hashTag.substring(1,hashTag.length-1);
		theHashy = encodeURIComponent(theHashy);
		var theMessage = encodeURIComponent(messageText);
		alert(theMessage);
		xhr.open("GET", "http://chinaalbino.com/databaser.php?m="+theMessage+"&h="+theHashy);
		xhr.onreadystatechange = function(status, response) {
	   		if(status >= 200 && status <= 300) {
	    		onSuccess(response);
	  		}
	  		else {
	    		onError(response);
	  		}
	 	}
		xhr.send();
		xhr.onload = function() {
		};
	}
	
	// This function looks for tweets encoded with the hashtag
	function receiveTheTweet() {
		var xhr = Titanium.Network.createHTTPClient();
		var theHashy = secretWord.substring(1,secretWord.length-1);
		theHashy = encodeURIComponent(theHashy);
		xhr.open("GET", "http://chinaalbino.com/databaser.php?q="+theHashy);
		//xhr.open("GET", "http://search.twitter.com/search.json?q="+secretWord+"&rpp=1");
		xhr.onreadystatechange = function(status, response) {
	   		if(status >= 200 && status <= 300) {
	    		onSuccess(response);
	   		}
	   		else {
	     		onError(response);
	  		}
		}
		xhr.send();
		xhr.onload = function () {
			var message = this.responseText;
			message = decodeURIComponent(message);
			/*message = JSON.parse(message);
			var theString = message.results[0].text;
			var theArray = theString.split(' #');
			message = theArray[0];
			alert(message);
			message = message.replace(/&quot;/g,'"');
			message = message.replace(/&amp;/g,'&');
			message = message.replace(/&gt;/g,'>');
			message = message.replace(/&lt;/g,'<');*/
			message = arrayze(message); // convert each character into ascii code and save result in array
			var offset = getHashtag(); // grabs offset from hastag
	    	var unmunged = unMunge(message, offset); // munges the array of characters based on function list and offset
	    	secretMessage = reString(unmunged);
		
			textArea.value = secretMessage;
		};
	}