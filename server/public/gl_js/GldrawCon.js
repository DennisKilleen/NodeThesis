/**
*  Gl draws continuous balls
*  ------------------------------------------------------------------------------------------------------
*
**/
function StartGlContinuous()
{
/**
*  Instantiate the global variable
*  ------------------------------------------------------------------------------------------------------
*
**/
var container, scene, renderer,
	camera, light, ball, plane,
	planeBound,planeBoundTwo,planeBoundThree, 
	name, WIDTH, HEIGHT, VIEW_ANGLE,
	ASPECT, NEAR, FAR;
var socket = io('http://localhost:9000'); //Get reference to the socket
var clock = new THREE.Clock(); //Get the reference to the clock
Physijs.scripts.worker = '../gl_js/physijs_worker.js'; //Access the script
var ballArray =[];
var deletedBalls = [];
var i = 0;
var temp;
var object;
/**
*  Set the global variable
*  ------------------------------------------------------------------------------------------------------
*
**/
container = document.getElementById('ctx'); //Get the canvas from the html and set it equal to the container
WIDTH = 850, HEIGHT = 500; //Set the width and height
VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 1, FAR = 10000; //Set the camera variables
scene = new Physijs.Scene(); //Set the scene
scene.setGravity(new THREE.Vector3( 0, -50, 0 )); //Set gravity
scene.addEventListener('update', function() //Set the scene to update
{
  scene.simulate(undefined, 2); //Allow the scene to simulate
});
renderer = new THREE.WebGLRenderer( //Get a reference for the renderer
{
  antialias: true //Set anti-aliasing to true
});
renderer.setSize(WIDTH, HEIGHT); //Set the renderer size
renderer.shadowMapEnabled = true; //Enable shadows
renderer.shadowMapSoft = true; //Enable shadows
renderer.shadowMapType = THREE.PCFShadowMap; //Set up the shadow map
renderer.shadowMapAutoUpdate = true; //Let the shadow map update 
container.appendChild(renderer.domElement); //Append the renderer to the canvas
camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR); //Set the camera
camera.position.set(60, 40, 120); //Set the cameras position in the scene
camera.lookAt(scene.position); //Make the camera look at the scene
scene.add(camera); //Add the camera to the scene
light = new THREE.DirectionalLight(0xffffff); //Get reference to the light
light.position.set(0, 100, 60); //Set the light position
light.castShadow = true; //Allow shadows to be cast
light.shadowCameraLeft = -60; //Allows for shadow to be displayed everywhere
light.shadowCameraTop = -60; //Allows for shadow to be displayed everywhere
light.shadowCameraRight = 60; //Allows for shadow to be displayed everywhere
light.shadowCameraBottom = 60; //Allows for shadow to be displayed everywhere
light.shadowCameraNear = 1; //Allows for shadow to be displayed everywhere
light.shadowCameraFar = 1000; //Allows for shadow to be displayed everywhere
light.shadowBias = -.0001; //Allows for shadow to be displayed everywhere
light.shadowMapWidth = light.shadowMapHeight = 1024; 
light.shadowDarkness = .7; //Set the shadow darkness
scene.add(light); //Add the light to the scene

/**
*  Set the planes so the balls don't fall off
*  ------------------------------------------------------------------------------------------------------
*
**/
//Create the geometry for the first plane
plane = new Physijs.BoxMesh(
  new THREE.CubeGeometry(100, 100, 2, 10, 10),
  Physijs.createMaterial(
	new THREE.MeshLambertMaterial(
	{
	  color: 0xeeeeee
	}),.4,.8),0
);

//Create the geometry for the second plane
planeBound = new Physijs.BoxMesh(
  new THREE.CubeGeometry(110, 3, 5, 10, 10),
  Physijs.createMaterial(
	new THREE.MeshLambertMaterial(
	{
	  color: 0x0033FF
	}),.4,.8),0
);

//Create the geometry for the third plane
planeBoundTwo = new Physijs.BoxMesh(
  new THREE.CubeGeometry(110, 3, 5, 10, 10),
  Physijs.createMaterial(
	new THREE.MeshLambertMaterial(
	{
	  color: 0x0033FF
	}),.4,.8),0
);

//Create the geometry for the fourth plane
planeBoundThree = new Physijs.BoxMesh(
  new THREE.CubeGeometry(5, 1, 110, 10, 10),
  Physijs.createMaterial(
	new THREE.MeshLambertMaterial({
	  color: 0x0033FF
	}),.4,.8),0
);


plane.rotation.x = -Math.PI / 2; //Set the rotation
plane.rotation.y = Math.PI / 60; //Set the rotation
plane.receiveShadow = true; //Allow the plane to receive shadow
planeBound.position.z = 50; //Set the rotation
planeBound.rotation.x = -Math.PI / 2; //Set the rotation
planeBound.rotation.y = Math.PI / 60; //Set the rotation
planeBoundTwo.position.z = -50; //Set the rotation
planeBoundTwo.rotation.x = -Math.PI / 2; //Set the rotation
planeBoundTwo.rotation.y = Math.PI / 60; //Set the rotation
planeBoundThree.position.x = -50; //Set the rotation
planeBoundThree.position.y = 5; //Set the rotation
planeBoundThree.rotation.y = Math.PI * -60; //Set the rotation
scene.add(plane); //Add the plane to the scene
scene.add(planeBound); //Add the planeBound to the scene
scene.add(planeBoundTwo); //Add the planeBoundTwo to the scene
scene.add(planeBoundThree); //Add the planeBoundThree to the scene
/**
*  ball creation
*  ------------------------------------------------------------------------------------------------------
*
**/
function addBall()
{
	if(i >= 0) //Counter for however many balls you want
	{
		createBall(); //Calls the function addBall
		i++; //Increment i
	}
	else
	{
		clearInterval(timer); //If something goes wrong stop it
	}
}
function createBall()
{
	temp = Math.random() * (4 - 1) + 1; //Set the ball size
	ball = new Physijs.SphereMesh( 
	new THREE.SphereGeometry(temp,16,16),
	Physijs.createMaterial(new THREE.MeshLambertMaterial(
	{
		color: 0xff0000,
		reflectivity: 0.8
	}),0.4,0.6),1 ); //Sets the ball geometry and mesh material

	var r = 
	{
		x: Math.random() * (Math.PI - Math.PI / 12) + Math.PI / 12,
		y: Math.random() * (Math.PI - Math.PI / 12) + Math.PI / 12,
		z: Math.random() * (Math.PI - Math.PI / 12) + Math.PI / 12
	}; //Instantiates the rotations

	ball.rotation.set(r.x, r.y, r.z); //Sets the objects rotation
	ball.position.y = 40; //Set the balls Y position
	ball.castShadow = true; //Allow the ball to cast shadow
	ball.receiveShadow = true; //Allow the ball to recieve shadow
	ball.name = "ball"+i; //Sets the balls name

	var json = {Name: "ball"+i, X: ball.position.x, Y: ball.position.y, Z: ball.position.z, Size: temp, Ball: ball}; //Json string to send data across the sockets
	ballArray.push(json); //Add the json to the ballArray
	scene.add(ballArray[i].Ball); //Add the ball to the scene
	delete temp, json, ball;
	
}
/**
* Timer
*  ------------------------------------------------------------------------------------------------------
*
**/
var timer = setInterval(function() { addBall() }, 1000);
/**
*  Constantly running functions
*  ------------------------------------------------------------------------------------------------------
*
**/	
render(); //Render
scene.simulate() //Simulate
/**
*  Rendering and send data across the sockets
*  ------------------------------------------------------------------------------------------------------
*
**/
function render() //Render function
{
	for (var i = 0; i < ballArray.length; i++)  //Loop through the array of balls
	{
		if(deletedBalls.indexOf("ball"+i) == -1) //Sees if the ball has not been deleted
		{
			object = scene.getObjectByName( "ball"+i, true ); //Get the reference to the ball in the scene
			if(object) //if there is a ball
			{
					if("ball"+i == ballArray[i].Name) //If the ball and scene object name match
					{
						ballArray[i].Y = object.position.y; //Update the JSON data
						ballArray[i].X = object.position.x; //Update the JSON data
						ballArray[i].Z = object.position.z; //Update the JSON data
						//console.log(JSON.stringify(ballArray[i])); //Uncomment to see the data flow
					}
					socket.emit('glRunning', ballArray[i]); //Send the data across the socket
				if (object.position.y <= -50) //If the balls position has gone below -50 
				{
					scene.remove(object); //Remove the object from the scene
					deletedBalls.push("ball"+i); //When the ball is removed add it to the deleted ball array
					socket.emit('deleted', "ball"+i); //Send the deleted data across the socket
					//ballArray.splice(i,1); //Remove the object from the array
					//console.log(" ball"+i+" removed"); //Print out
				}
			}
			else //If there is not a ball in the scene
			{
				//console.log("ball gone is ball"+i);
			}
		}
		else
		{
			//console.log("ball"+i+" "+"has been skipped");
		}
		delete object; //Nullifies object
	}
	renderer.render(scene, camera); //Render
	requestAnimationFrame(render); //Move to next frame
}
}