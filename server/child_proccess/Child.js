/**
*  Author
*  Dennis Killeen
*  30/03/2015
*
*  Packages used in the server
*  ------------------------------------------------------------------------------------------------------
*
**/
var port = 9000; //Main port being used
var sendPort = 9001; //Responder message out port
var io = require('socket.io').listen(port); // Set socket.io to listen on the port 9000
var send = require('socket.io').listen(sendPort); // Set socket.io to listen and emit on the port 9001

/**
*  Get the message sent by the parent server
*  ------------------------------------------------------------------------------------------------------
*
**/
process.on('message', function(data)
{
	name = data.Name; //Gets the name of the instance
	console.log("Child: "+name); //Prints out the instance of the child process created
});


/**
*  Sockets that listen to host and responder
*  ------------------------------------------------------------------------------------------------------
*
**/
io.on('connection', function(socket) //Listens for a connection on a port
{
	socket.on('glready', function(msg) //Listen to see if the host and responder are ready to draw
	{
		if(msg.Responder == 'ready') //If the responder is ready
		{
			socket.emit('Ready', {Status: 'draw'}); //Sends a message allowing the draw to happen as both are connected
		}
	});
	socket.on('glRunning', function(msg) //Listens for the Host sending the ball data
	{
		send.sockets.emit('Balls', msg); //Sends the data to the responder
	});
	socket.on('deleted', function(msg) //Listens for the Host sending the ball data
	{
		send.sockets.emit('deletedBalls', msg); //Sends the data to the responder
	});
});



/**
*  Logs and console prints
*  ------------------------------------------------------------------------------------------------------
*
**/
console.log('\x1b[180m', 'Child server started running' ,'\x1b[0m'); //Print out to the console



