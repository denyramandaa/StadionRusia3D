/*global THREE, TWEEN, $ */
var container = document.getElementById( 'container' );
document.body.appendChild( container );
var scene, 
    camera, 
    renderer, 
    controls, 
    INTERSECTED,
    WIDTH  = container.offsetWidth,
    HEIGHT = container.offsetHeight,
    windowHalfX = container.offsetWidth / 2,
    objects = [],
    goTween,
    mouseX = 0;


var targetRotation = 0,
    targetRotationOnMouseDown = 0,
    mouseXOnMouseDown = 0,
    uuids   = [], 
    names   = [],
    windowHalfY = container.offsetHeight / 2,
    raycaster = new THREE.Raycaster(),
    mouse = new THREE.Vector2(),
    mesh = null,
    raycaster, 
    intersects, 
    last_known_intersect_color, 
    obj_color, 
    ambientLight, 
    hemiLight, 
    light, 
    obj,
    texture,
    shoulder,
    shoulder_start_point,
    shoulder_end_point;


function init() {
    initWorld();
    initGround();
    initMesh();
    initCamera();
    initLights();
    initRenderer();
    myControl();
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
}

function initWorld(){
    var textureCube = new THREE.CubeTextureLoader()
    	.setPath( 'kolam_renang/')
    	.load( [ 'star3-moon-right.jpg', 'star3.jpg', 'star3.jpg', 'star3.jpg', 'star3-moon-left.jpg', 'star3.jpg' ] );
    scene = new THREE.Scene();
    scene.background = textureCube;
    scene.fog = new THREE.Fog( '#f8f8ff', 1, 50000 );
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
        
        //like it has no effect
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
    var loader = new THREE.ObjectLoader();
    loader.load("kolam_renang/renang.dae.json",function ( obj ) {
        obj.scale.x = obj.scale.y = obj.scale.z = 0.25;
        scene.add( obj );
        objects.push(obj);
        for( var i = 0; i < objects[0].children.length; i++ ) {
            objects[0].castShadow = true;
            objects[0].children[i].castShadow = true;
            objects[0].receiveShadow = true;
            objects[0].children[i].receiveShadow = true;
        }
    });
    console.log(objects);
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
new Vue({
  el:'#v-map',
  data() {
    return {
      cached: null,
      cached_len: 0,
    };
  },
  template: `
    <div class="fill-height pr">
      <div class="container-event-start-intro" v-if="is_firsttime">
        <div class="container-event-start-intro--inner">
          <div class="container-intro-box">
            <h2>Gempa di Sulawesi</h2>
            <p>Ini adalah visualisasi gempa yang terjadi di Pulau Sulawesi dan sekitarnya selama 25 tahun terakhir. Data ini diambil dari USGS (United States Geological Survey) menampilkan gempa yang terjadi dengan magnitudo di atas 4,5. Semakin besar lingkaran, menunjukkan skalanya semakin besar.</p>
            <button @click="introStart">MULAI</button>
          </div>
        </div>
      </div>
    </div>
      
  `,
  mounted() {
        
        this.$nextTick(() => {
            let _self = this;
            
        });
  },
  methods: {

    play() {
      if(introJs()['introjs-instance'] == 1) introJs().exit();
      this.is_playing = true;
      this.run();
    },
  }

})