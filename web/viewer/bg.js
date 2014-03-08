var Background = function() {
	_self = this;

	this.SCREEN_WIDTH = window.innerWidth;
	this.SCREEN_HEIGHT = window.innerHeight;

	this.MAX_TEXT = 3;
	this.MAX_STAR = 3;

	this.baseTime = +new Date;
	this.textBox = [];
	this.starBox = [];
	this.moveX = 0.005;

	this.scene = null;
	this.renderer = null;
	this.scene = null;
	this.camera = null;
	this.controls = null;
	this.light = null;
	this.mesh = null;
}

Background.prototype = {
	startUp : function() {
		this.initScene();
		this.initObjects();
		this.render();
	},

	initScene : function() {
		this.renderer = new THREE.WebGLRenderer({ antialias:true });
		this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
		this.renderer.setClearColorHex(0x000000, 1);
		document.body.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(70, 500 / 500);
		this.camera.position = new THREE.Vector3(0, 0, 8);
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.scene.add(this.camera);

		this.controls = new THREE.OrbitControls(this.camera);
		this.controls.center = new THREE.Vector3(0, 0, 0);

		this.light = new THREE.DirectionalLight(0xcccccc);
		this.light.position = new THREE.Vector3(0.577, 0.577, 0.577);
		this.scene.add(this.light);
		var ambient = new THREE.AmbientLight(0x333333);
		this.scene.add(ambient);
	},

	initObjects : function() {
		// 形状データを作成
		var geometry = new THREE.Geometry();
		var numParticles = 5000;
		for(var i = 0 ; i < numParticles ; i++) {
			geometry.vertices.push(new THREE.Vector3(
				Math.random() * 2000 - 1000,
				Math.random() * 2000 - 1000,
				Math.random() * 2000 - 1000));
		}

		// マテリアルを作成
		// tm.graphics.Canvas でテクスチャを作成
		var canvas = tm.graphics.Canvas();

		canvas.resize(64, 64);
		canvas.clearColor("black");
		canvas.setTransformCenter();
		canvas.setFillStyle("yellow");
		canvas.fillStar(0, 0, 30, 5);
		var texture = new THREE.Texture(canvas.element);
		texture.needsUpdate = true;

		var material = new THREE.ParticleBasicMaterial({
			size: 10, color: 0xff8888, blending: THREE.AdditiveBlending,
			transparent: true, depthTest: false, map: texture });

		// 物体を作成
		this.mesh = new THREE.ParticleSystem(geometry, material);
		this.mesh.position = new THREE.Vector3(0, 0, -1200);
		this.mesh.sortParticles = false;
		this.scene.add(this.mesh);
	},

	render : function() {
        requestAnimationFrame( function() { _self.render() });

        // カメラの状態を更新
        this.controls.update();

        this.mesh.rotation.y = 0.3 * (+new Date - this.baseTime) / 1000;
        this.renderer.render(this.scene, this.camera);

		// 文字の移動
		// 現在の配列をコピーしておく
		var dispTextBox = [].concat(this.textBox);
		for ( var i = 0; i < dispTextBox.length; ++i ) {
			// X軸に移動
			// 150で方向転換
			if( Math.abs( dispTextBox[i].position.x ) > 150 ) this.moveX *= -1;
			dispTextBox[i].position.x += this.moveX + (0.3 * (+new Date - this.baseTime) / 10000);
			// なんとなく回転もさせておく
//			dispTextBox[i].rotation.x += 0.01;
//			dispTextBox[i].rotation.x += Math.random()/10;
//			dispTextBox[i].rotation.y += 0.01;
//			dispTextBox[i].rotation.y += (Math.random() -0.5)/100;
//			dispTextBox[i].rotation.y += 0.0005;

			// 画面を通り過ぎたら消す
			if (dispTextBox[i].position.x > 10) {
				this.scene.__removeObject(this.textBox[i]);
				this.textBox.splice(i, 1);
			}
		}

		// JAWSの移動
		var dispStarBox = [].concat(this.starBox);
		for ( var i = 0; i< dispStarBox.length; i++) {
			// Z軸に移動
			dispStarBox[i].position.z += 10 + (0.3 * (+new Date - this.baseTime) / 10000);

			// 画面を通り過ぎたら消す
			if (dispStarBox[i].position.z > 1000) {
				this.scene.__removeObject(this.starBox[i]);
				this.starBox.splice(i, 1);
			}
		}
		
	},

	addText : function(name, text) {
		if (this.textBox.length > this.MAX_TEXT) {
			return;
		}

		this.baseTime = +new Date;
		var canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 256;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.font = "55px sans-serif";
		ctx.textAlign = 'center';
		ctx.fillText(name, 256, 100);
		ctx.fillText('$'+ text +'/month', 256, 200);

		// テクスチャを作成
		var texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;
		
		// 物体を作成し、シーンに追加
		var geometry = new THREE.PlaneGeometry(4, 2);
		var material = new THREE.MeshPhongMaterial({
			color: 0xffffff, specular: 0xcccccc, shininess:50, ambient: 0xffffff,
			transparent: true, map: texture, side: THREE.DoubleSide });
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = -5;
		mesh.position.y = Math.random() * 8 - 4;
		this.scene.add(mesh);
		this.textBox.push(mesh);
	},

	addStar : function() {
		if (this.starBox.length > this.MAX_STAR) {
			return;
		}

		var geometry = new THREE.Geometry();
		var numParticles = 500;
		for(var i = 0 ; i < numParticles ; i++) {
			geometry.vertices.push(new THREE.Vector3(
				Math.random() * 2000 - 1000,
				Math.random() * 2000 - 1000,
				Math.random() * 2000 - 1000));
		}
		
		// マテリアルを作成
		var texture = THREE.ImageUtils.loadTexture('images/jaws-ug-okinawa-icon.png');

		// var canvas = tm.graphics.Canvas();
		// canvas.resize(256, 256);
		// canvas.clearColor("black");
		// canvas.setTransformCenter();
		// canvas.setFillStyle("red");
		// canvas.fillStar(0, 0, 30, 5);
		// var texture = new THREE.Texture(canvas.element);
		// texture.needsUpdate = true;

		var material = new THREE.ParticleBasicMaterial({
			size: 100, color: 0xff8888, blending: THREE.AdditiveBlending,
			transparent: true, depthTest: false, map: texture });
		
		// 物体を作成
		var mesh = new THREE.ParticleSystem(geometry, material);
		mesh.position = new THREE.Vector3(0, 0, -1200);
		mesh.sortParticles = false;
		this.scene.add(mesh);
		this.starBox.push(mesh);
	}
}
