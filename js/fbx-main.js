/*global THREE, TWEEN, $ */
var container = document.getElementById( 'container' );
document.body.appendChild( container );
var scene, 
    camera, 
    renderer, 
    controls, 
    raycaster, 
    intersects, 
    last_known_intersect_color, 
    INTERSECTED,
    obj_color, 
    ambientLight, 
    hemiLight, 
    light, 
    obj,
    texture,
    shoulder,
    shoulder_start_point,
    shoulder_end_point;

var WIDTH  = container.offsetWidth;
var HEIGHT = container.offsetHeight;
var mesh = null;
var windowHalfX = container.offsetWidth / 2;
var windowHalfY = container.offsetHeight / 2;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var objects = [],
    uuids   = [], 
    names   = [];
var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseXOnMouseDown = 0;
var goTween;


function init() {
    
    var textureCube = new THREE.CubeTextureLoader()
    	.setPath( 'kolam_renang/')
    	.load( [ 'star3-moon-right.jpg', 'star3.jpg', 'star3.jpg', 'star3.jpg', 'star3-moon-left.jpg', 'star3.jpg' ] );
    scene = new THREE.Scene();
    scene.background = textureCube;
    
    initGround();
    initMesh();
    initCamera();
    initLights();
    initRenderer();
    myControl();
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
    
}


function initCamera() {
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 10000 );
	camera.position.set( -13.838005559917075, 5.667989280940997, -0.23169057925521686 );
    camera.lookAt(scene.position);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(WIDTH, HEIGHT);
}


function next(){
    $('#go-out').removeClass('hide').addClass('unhide');
    $('#go-pool').removeClass('hide').addClass('unhide');
    $('#go-in').removeClass('unhide').addClass('hide');
    goTween = new TWEEN.Tween(camera.position).to({x: -3.022315582050887, y: 1.7405812840969732, z: 4.07189423013202}, 1200);
    goTween.easing(TWEEN.Easing.Quartic.InOut);
    goTween.start();
}
function prev(){
    $('#go-in').removeClass('hide').addClass('unhide');
    $('#go-out').removeClass('unhide').addClass('hide');
    $('#go-pool').removeClass('unhide').addClass('hide');
    goTween = new TWEEN.Tween(camera.position).to({x: -13.838005559917075, y: 5.667989280940997, z: -0.23169057925521686}, 1200);
    goTween.easing(TWEEN.Easing.Quartic.InOut);
    goTween.start();
}

function pool(){
    $('#go-in').removeClass('unhide').addClass('hide');
    $('#go-pool').removeClass('unhide').addClass('hide');
    $('#go-back').removeClass('hide').addClass('unhide');
    goTween = new TWEEN.Tween(camera.position).to({x: 2.430495168157131, y: 1.609189235336547, z: 2.702321194923004}, 1200);
    goTween.easing(TWEEN.Easing.Quartic.InOut);
    goTween.start();
}

function back(){
    $('#go-back').removeClass('unhide').addClass('hide');
    goTween = new TWEEN.Tween(camera.position).to({x: 2.183027787337743, y: 1.8884030455324827, z: -3.3807839497220824}, 1200);
    goTween.easing(TWEEN.Easing.Quartic.InOut);
    goTween.start();
}



function initLights() {
    
    var d = 50;
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.7 );
        hemiLight.position.set( 0, 500, 0 );
        scene.add( hemiLight );
    
    var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.position.set( -1, 1.75, 1 );
        dirLight.position.multiplyScalar( 50 );
        dirLight.castShadow = true;
        dirLight.shadowMapWidth = 2048;
        dirLight.shadowMapHeight = 2048;
        dirLight.shadowCameraLeft = -d;
        dirLight.shadowCameraRight = d;
        dirLight.shadowCameraTop = d;
        dirLight.shadowCameraBottom = -d;
        dirLight.shadowCameraFar = 3500;
        dirLight.shadowBias = -0.0001;
        scene.add( dirLight );
}

function initGround(){
    var groundTexture = THREE.ImageUtils.loadTexture( 'me/r.jpg' );
		groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
		groundTexture.repeat.set( 100, 100 );
		groundTexture.anisotropy = 1;
	var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
		groundMaterial.receiveShadow = true;
	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 51, 51 ), groundMaterial );
		mesh.position.x = -4.2;
		mesh.position.y = 0.007;
		mesh.position.z = -5.5;
		mesh.rotation.x = - Math.PI / 2;
	    mesh.receiveShadow = true;
		scene.add( mesh );	
}

function initMesh() {
    // var loader = new THREE.ObjectLoader();
    
    // loader.load("fbx/obj.fbx",function ( obj ) {
    //     obj.scale.x = obj.scale.y = obj.scale.z = 0.25;
    //     scene.add( obj );
    //     objects.push(obj);
    //     for( var i = 0; i < objects[0].children.length; i++ ) {
    //         objects[0].castShadow = true;
    //         objects[0].children[i].castShadow = true;
    //         objects[0].receiveShadow = true;
    //         objects[0].children[i].receiveShadow = true;
    //     }
    // });
    // console.log(objects);
    
    var loader = new THREE.FBXLoader();
    loader.load( 'fbx/obj.fbx', function ( object ) {
    	object.mixer = new THREE.AnimationMixer( object );
    	mixers.push( object.mixer );
    	var action = object.mixer.clipAction( object.animations[ 0 ] );
    	action.play();
    	object.traverse( function ( child ) {
    		if ( child.isMesh ) {
    			child.castShadow = true;
    			child.receiveShadow = true;
    		}
    	} );
    	scene.add( object );
        console.log(object);
    } );
}

function onWindowResize() {
	windowHalfX = container.offsetWidth / 2;
	windowHalfY = container.offsetHeight / 2;
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( container.offsetWidth, container.offsetHeight );
}

function myControl(){
	controls = new THREE.OrbitControls( camera, container );
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI * 0.45;
}
var mouseX = 0;
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function onDocumentMouseMove(event) {
	mouseX = ( event.clientX - windowHalfX ) / 1;
}


function render() {
    
    camera.position.x += ( mouseX + camera.position.x ) * 0.000002;
    
    
    requestAnimationFrame(render);
    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
}



init();
render();