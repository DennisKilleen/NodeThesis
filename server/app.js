/**
*  Author
*  Dennis Killeen
*  30/03/2015
*
*  Packages used in the server
*  ------------------------------------------------------------------------------------------------------
*
**/
var express = require('express'); //Get the handler for express
var path = require('path'); //Get the handler for path
var favicon = require('serve-favicon'); //Get the handler for serve-favicon
var logger = require('morgan'); //Get the handler for morgan
var cookieParser = require('cookie-parser'); //Get the handler for cookie-parser
var bodyParser = require('body-parser'); //Get the handler for body-parser
var MongoClient = require('mongodb').MongoClient; //Creates the handler to the Mongo database
var assert = require('assert'); //Creates the handler to the assert package for Mongo
var routes = require('./routes/index'); //Gets the route to the index.html
var users = require('./routes/users'); //Gets the route to the users
var port = 8080; //Sets the port for the server to work on
var app = express(); //Creates the server
var server = app.listen(port); //Makes the server listen on a port(8080)
var io = require('socket.io').listen(server); //Get the handler on the sockets and set them to listen on a port(8080)
var child = require('child_process'); //Get the handler for child_process

/**
*  Global variables for use throughout
*  ------------------------------------------------------------------------------------------------------
*
**/
var url = 'mongodb://localhost:27017/Thesis'; //Used as the url for MongoBD
var nameHost; //Used to find out if both host has connected
var nameResponder; //Used to find out if both responder has connected

/**
*  view engine setup
*  ------------------------------------------------------------------------------------------------------
*
**/
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);

/**
*  Error handler
*  ------------------------------------------------------------------------------------------------------
*
**/
// catch 404 and forward to error handler
app.use(function(req, res, next) 
{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') 
{
    app.use(function(err, req, res, next) 
	{
        res.status(err.status || 500);
        res.render('error', 
		{
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) 
{
    res.status(err.status || 500);
    res.render('error', 
	{
        message: err.message,
        error: {}
    });
});


io.on('connection', function(socket) //States the connection has been made with the html sockets
{
	/**
	*  MongoDB for the host peer connections
	*  ------------------------------------------------------------------------------------------------------
	*
	**/
	socket.on('DB', function(msg) //The message sent from the html
	{
		if(msg.Status == "Read") //If the data sent has the key pair value of "Status : Read"
		{
			MongoClient.connect(url, function(err, db)  //Connect to mongo
			{
				if(err) throw err; //If there's an err throw up an error
				var collection = db.collection('Clients');  //Get reference to the collection
				collection.findOne({Name : msg.Name}, function(err, document) 
				{
					if(err) //If there's an err print out
					{
						console.log("Theres been an error in Mongo."); //Print out if there's an error while attempting to search the collection
					}
					if(document) //If there is a document
					{
						if(document.Name == msg.Name) //Make sure the document 'Name' is in the collection 
						{
							console.log(document); //Print out the document
							socket.emit('DBfind', {Status: 'found', Name : msg.Name}); //Sends a message back to the html page to say the document does exist
						}
						else //If there is not a document
						{
							console.log("The document you are searching for does not exist"); // Print out the document was not found
						}
					}
					if(!document) //If there is not a document
					{
						console.log("The document you are searching for does not exist"); // Print out the document was not found
					}
					db.close();	//Close the connection to Mongo
				});
			});
		}
		else if(msg.Status == "Create") //If the data sent has the key pair value of "Status : Create"
		{
			
			MongoClient.connect(url, function(err, db) //Connect to Mongo
			{
				if (err) throw err; //If there's an err throw up an error
				var collection = db.collection('Clients'); //Get reference to the collection
				collection.insert({Name : msg.Name}, function(err, result) //Insert the document into the collection
				{
					console.log("In Mongo"); //Print out the that the document has been saved
					socket.emit('DBenter', {Status: 'created', Name: msg.Name}); //Sends a message back to the html page to say document has been created
				});
				db.close(); //Close the connection to Mongo
			});
			
		}
	});
	/**
	*  Check there is a connection from host and responder
	*  ------------------------------------------------------------------------------------------------------
	*
	**/
	socket.on('hostResponderStatus', function(msg)
	{
		if(msg.Status == 'Connecting') //If the host/responder is trying to connect
		{
			if(msg.Entity == 'Host') //If its the host sending the socket
			{
				nameHost = msg.Name; //Grab the Name associated with the host
				socket.emit('StartingGL', {Status: 'Starting', Name: nameHost}); //Send back a socket stating gl is starting 
			}
			if(msg.Entity == 'Responder') //If its the responder sending the socket
			{
				nameResponder = msg.Name; //Grab the Name associated with the responder
				socket.emit('StartingGL', {Status: 'Starting', Name: nameResponder}); //Send back a socket stating gl is starting 
			}
			if(msg.Name == nameHost && msg.Name == nameResponder) //If the names are the same start the child service
			{
				io.sockets.emit('StartingGL', {Status: 'BothReady'}); //Sends out to the host and responder that both are ready
				var child_info = child.fork(__dirname + '/child_proccess/Child'); //Gets the handler for the child process
				child_info.send({Name: nameHost}); //Send the child the name of the instancs
			}
		}
	});
});



/**
*  Logs and console prints
*  ------------------------------------------------------------------------------------------------------
*
**/
MongoClient.connect(url, function(err, db) //Connect to Mongo
{
  assert.equal(null, err); //Checks if something is in the db
  console.log('\x1b[36m', 'Mongo is connecting correctly to the server' ,'\x1b[0m'); //Print out to the console
  db.close(); //Close the connection to Mongo
});
console.log('\x1b[90m', 'Server started running on: ' ,'\x1b[0m'+port); //Print out to the console



