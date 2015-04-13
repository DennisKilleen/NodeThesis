//Creates information for Mongo to send a stream
function host()
{
	var input = document.getElementsByTagName('input')[0].value; //Gets the input provided by the user
	if(input) //If there has been input
	{
		socket.emit('DB', {Status: "Create", Name: input}); //Sends the socket to the server to create
	}
	else //If there has not been input
		alert("Please enter in a valid string to the textbox"); //Error clause
}


//Gathers information from Mongo to see if a stream is available
function responder()
{
	var input = document.getElementsByTagName('input')[0].value; //Gets the input provided by the user
	if(input) //If there has been input
	{
		socket.emit('DB', {Status: "Read", Name: input}); //Sends the socket to the server to read
	}
	else //If there has not been input
		alert("Please enter in a valid string to the text box"); //Error clause
}

//If the user created a host
function created(msg)
{
	alert("Your host name has been entered into the database"); //Alert the users the name is in the database
	console.log("Created: "+msg.Name); //Print out the console
	setCookie(msg.Name); //Set the cookie
	window.location.href = "Pages/host.html"; //Redirect the page
}

//If the name has been found in Mongo
function found(msg)
{
	alert("The host name "+msg.Name+" you have entered has been found you will be redirected now"); //Alert the users the name is in the database
	setCookie(msg.Name); //Set the cookie
	window.location.href = "Pages/responsive.html"; //Redirect the page
}

//Set the cookie for the session
function setCookie(cName) 
{
	docCookies.setItem('Host', cName); //Set a cookie
}

//Delete the cookie for the session
function deleteCookie()
{
	docCookies.removeItem('Host'); //Remove a cookie
	alert("Cookies removed"); //Alert the user
}

//Get the cookie
function getCookie() 
{
	alert("cookie is: "+docCookies.getItem('Host')); //Alert the user the cookie
}

//Get the cookie for the software to work
function getCookieReturn() 
{
	return docCookies.getItem('Host'); //Get the cookie
}



