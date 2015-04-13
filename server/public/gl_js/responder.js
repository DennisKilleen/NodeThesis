/**
*  Responder that accepts connections to the host
*  ------------------------------------------------------------------------------------------------------
*
**/
function respond()
{	
/**
*  Instantiate the global variable
*  ------------------------------------------------------------------------------------------------------
*
**/
var container, scene, renderer, camera, light, ball, plane, planeBound,planeBoundTwo,planeBoundThree, name;
var WIDTH, HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR, num, geometry, material;
var socket = io('http://localhost:9001');
var clock = new THREE.Clock();
Physijs.scripts.worker = '../gl_js/physijs_worker.js';
var deletedBalls = [];
var ballArray = [];
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
function createBall(tempSize, temp, num)
{
	geometry = new THREE.SphereGeometry(tempSize,16,16), //Create the geometry associated with the ball
	new THREE.MeshLambertMaterial({color: 0xff0000,reflectivity: 0.0}); //Create the mesh data
	ball = new THREE.Mesh( geometry, material ); //Set the variables for the ball
	ballArray[num] = {Name: temp, Data: ball}; //Add the ball data to the ball array
}

socket.on('Balls', function(msg) //Listen to the function 'Balls for data'
{
	if(deletedBalls.indexOf(msg.Name)==-1) //If the ball is not in the deleted balls array
	{
		if(msg.Name.length == 5) //If the name length has 5 characters
		{
			num = parseInt(msg.Name.slice(-1)); //Get the number by slicing it 
		}
		else if(msg.Name.length == 6) //If the name length has 6 characters
		{
			num = parseInt(msg.Name.slice(-2)); //Get the number by slicing it 
		}
		else if(msg.Name.length == 7) //If the name length has 7 characters
		{
			num = parseInt(msg.Name.slice(-3)); //Get the number by slicing it 
		}
		
		if(ballArray.length == 0) //If the balls array has no elements
		{
			//console.log("New ball");
			createBall(msg.Size, msg.Name, num); //Create the ball
			scene.add(ballArray[num].Data); //Add the ball to the scene
			
		}
		if(ballArray.length > 0) //If the balls array has elements
		{
			if(num >= ballArray.length) //If the ball is not in the ball array
			{
				//console.log("In else");
				createBall(msg.Size, msg.Name, num); //Create the ball
				scene.add(ballArray[num].Data); //Add the ball to the scene
			}
			if(num < ballArray.length) //If the ball is in the ball array
			{ 
				//console.log("Num is <=: "+num)
				if(ballArray[num].Name == msg.Name) //Make sure the ball is correct using equality of name properties
				{
					ballArray[num].Data.position.x = msg.X; //Update the x position of the current ball
					ballArray[num].Data.position.y = msg.Y; //Update the y position of the current ball
					ballArray[num].Data.position.z = msg.Z; //Update the z position of the current ball
				}
			}
		}
	}
	delete num; //Clear the num variable
});	

socket.on('deletedBalls', function(msg)
{
	//console.log("deleted msg: "+msg);
	deletedBalls.push(msg); //Adds the deleted ball to the deletedBalls array
	scene.remove(msg.Name); //Remove the item from scene
});
	
render(); //Render
scene.simulate() //Simulate
/**
*  Rendering and send data across the sockets
*  ------------------------------------------------------------------------------------------------------
*
**/
function render() //Render function
{
	renderer.render(scene, camera); //Render
	requestAnimationFrame(render); //Move to next frame
}
}