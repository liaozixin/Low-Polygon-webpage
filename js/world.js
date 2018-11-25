window.addEventListener('load',init,false);

function init(){
	createScene();
	createLights();
	
	createModel();
	createParticles();
	initControls();
	loop();
}

var camera, render, scene;
function createScene(){
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({    
    	alpha: true,   
      	antialias: true
    });
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
    
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(2, 7, 4);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {   
   HEIGHT = window.innerHeight;
   WIDTH = window.innerWidth;         
   renderer.setSize(WIDTH, HEIGHT);
   camera.aspect = WIDTH / HEIGHT;        
   camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;
function createLights(){
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 0.9);   
    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9); 
    shadowLight.position.set(10, 10, 10);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -10;
    shadowLight.shadow.camera.right = 10;
    shadowLight.shadow.camera.top = 10;
    shadowLight.shadow.camera.bottom = -10;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 10; 
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048; 
    scene.add(hemisphereLight);  
    scene.add(shadowLight);
}

function createModel(){
	var house = new THREE.ObjectLoader();
    house.load('Model/world.json',function(obj){
        obj.scale.x = obj.scale.y = obj.scale.z = 4;
        scene.add(obj);
    });
    var shuijing = new THREE.ObjectLoader();
    shuijing.load('Model/shuijing.json',function(obj){
        obj.scale.x = obj.scale.y = obj.scale.z = 4;
        scene.add(obj);
    });
    
	var AirPlane = function(){
		this.mesh = new THREE.Object3D();
	    this.mesh.name = "airPlane";
	
	    
		var geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
	    var matCockpit = new THREE.MeshPhongMaterial({color:0xf25346, shading:THREE.FlatShading});
	    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
		cockpit.castShadow = true;
	    cockpit.receiveShadow = true;
	    this.mesh.add(cockpit);
	
	  
		var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
		var matEngine = new THREE.MeshPhongMaterial({color:0xd8d0d1, shading:THREE.FlatShading});
		var engine = new THREE.Mesh(geomEngine, matEngine);
		engine.position.x = 40;
		engine.castShadow = true;
		engine.receiveShadow = true;
		this.mesh.add(engine);
	
	    var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
	    var matTailPlane = new THREE.MeshPhongMaterial({color:0xf25346, shading:THREE.FlatShading});
	    var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	    tailPlane.position.set(-35, 25, 0);
	    tailPlane.castShadow = true;
	    tailPlane.receiveShadow = true;
		this.mesh.add(tailPlane);
	
	    var geomSideWing = new THREE.BoxGeometry(40, 8, 50, 1, 1, 1);
	    var matSideWing = new THREE.MeshPhongMaterial({color:0xf25346, shading:THREE.FlatShading});
	    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	    sideWing.position.set(0, 0, 0);
	    sideWing.castShadow = true;
	    sideWing.receiveShadow = true;
		this.mesh.add(sideWing);
	
	    var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
	    var matPropeller = new THREE.MeshPhongMaterial({color:0x59332e, shading:THREE.FlatShading});
	    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
	    this.propeller.castShadow = true;
	    this.propeller.receiveShadow = true;
	
	    var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
	    var matBlade = new THREE.MeshPhongMaterial({color:0x23190f, shading:THREE.FlatShading});
	
	    var blade = new THREE.Mesh(geomBlade, matBlade);
	    blade.position.set(8, 0, 0);
	    blade.castShadow = true;
	    blade.receiveShadow = true;
		this.propeller.add(blade);
	    this.propeller.position.set(50, 0, 0);
	    this.mesh.add(this.propeller);
	};
	airplane = new AirPlane();
	airplane.mesh.scale.set(0.005, 0.005, 0.005);
	airplane.mesh.position.y = 3;
	airplane.mesh.position.z = 4;
	scene.add(airplane.mesh);
	
	Cloud = function(arc) {
        THREE.Group.apply(this, arguments)
        this.arc = arc
        var geom = new THREE.SphereGeometry(0.5, 6, 6)
        for (var i = 0; i < geom.vertices.length; i++) {
        var v = geom.vertices[i]
        if (v.y < 0) {
          v.y = 0
        }
      }
      var mat = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.8,
        metalness: 0.1,
        shading: THREE.FlatShading,
      })
      for (var j = 0; j < Math.PI;) {
        var mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.position.x = 0.7 * j * Math.cos(0.5 * j) + Math.random() * 0.8;
        mesh.position.z = 0.7 * j * Math.sin(0.5 * j) + Math.random() * 0.8;
        mesh.position.y = j * -0.1 + Math.random() * 0.8;
        j = j + Math.PI / 6;
        this.add(mesh)
      }
    }
	Cloud.prototype = Object.create(THREE.Group.prototype)
    Cloud.prototype.fly = function() {
    	this.position.z = 6 / 2 * Math.sin(this.arc);
  		this.arc += 0.005;
  	}
    cloud1 = new Cloud(0)
    cloud1.position.y = 3.9;
	cloud1.rotation.y = Math.PI / 4;
	cloud2 = new Cloud(Math.PI);
	cloud2.position.y = 4.5;
	cloud2.position.x -= 3.4;
	scene.add(cloud1, cloud2);
}

function createParticles(){
	var texture = new THREE.TextureLoader().load('Model/texture.png');
	var geom = new THREE.Geometry();
	var material = new THREE.PointsMaterial({
		size: 0.5,
	 	transparent: true,
	 	opacity: 0.6,
	 	vertexColors: true,
	 	sizeAttenuation: true,
	 	color: 0xffffff,
	 	map:texture,
	 	depthTest: false  
	});
	var range = 20;
	for (var i = 0; i < 100; i++) {
		var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
		particle.velocityY = 0.1 + Math.random() / 5;
		particle.velocityX = (Math.random() - 0.5) / 3; 
		geom.vertices.push(particle);
		var color = new THREE.Color(0xffffff);
		geom.colors.push(color);
	}
	cloud = new THREE.Points(geom, material);
	cloud.verticesNeedUpdate = true;
	scene.add(cloud);
}
	
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var controls;
function initControls() {
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	
	controls.enableDamping = true;
	controls.dampingFactor = 0.5;
	controls.enableZoom = true;
	controls.autoRotate = true;
	controls.minDistance = 3;
	controls.maxDistance = 9;
	controls.enablePan = false;
	controls.autoRotateSpeed = 0.2;
	controls.maxPolarAngle = (Math.PI/1.47);

}



function moveAirPlane(){
	airplane.propeller.rotation.x += 0.3;
}

function loop(){
	renderer.render(scene, camera); 
	controls.update();
	moveAirPlane();
	cloud1.fly()
    cloud2.fly()
  	requestAnimationFrame(loop);
}
