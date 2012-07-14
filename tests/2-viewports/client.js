var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		// Load our textures
		var self = this,
			gameTexture = [],
			tempObj,
			RotatorBehaviour,
			RotatorBehaviourAC,
			ScalerBehaviour,
			vp = [];

		this.obj = [];

		gameTexture[0] = new IgeTexture('../assets/textures/sprites/fairy.png');

		// Wait for our textures to load before continuing
		ige.on('texturesLoaded', function () {
			ige.createFrontBuffer(true);

			ige.start(function (success) {
				// Check if the engine started successfully
				if (success) {
					RotatorBehaviour = function (ctx, gameObject) {
						gameObject.rotateBy(0, 0, (0.1 * ige.tickDelta) * Math.PI / 180);
					};

					RotatorBehaviourAC = function (ctx, gameObject) {
						gameObject.rotateBy(0, 0, (-0.1 * ige.tickDelta) * Math.PI / 180);
					};

					ScalerBehaviour = function (ctx, gameObject) {
						gameObject.data.scalerMode = gameObject.data.scalerMode || 1;

						if (gameObject.data.scalerMode === 1) {
							gameObject.scaleBy((0.001 * ige.tickDelta), (0.001 * ige.tickDelta), (0.001 * ige.tickDelta));

							if (gameObject._scale.x >= 4) {
								gameObject.data.scalerMode = 2;
								gameObject._scale.x = 4;
								gameObject._scale.y = 4;
								gameObject._scale.z = 4;
							}

							return;
						}

						if (gameObject.data.scalerMode === 2) {
							gameObject.scaleBy(-(0.001 * ige.tickDelta), -(0.001 * ige.tickDelta), -(0.001 * ige.tickDelta));

							if (gameObject._scale.x <= 1) {
								gameObject.data.scalerMode = 1;
								gameObject._scale.x = 1;
								gameObject._scale.y = 1;
								gameObject._scale.z = 1;
							}

							return;
						}
					};

					ige.viewportDepth(true);

					self.scene1 = new IgeScene2d();

					// Create the main viewport
					self.vp1 = new IgeViewport()
						.autoSize(true)
						.scene(self.scene1)
						.mount(ige);

					var tt = 0,
						vpCount = 3,
						timeInc = 1200;

					for (var i = 0; i < vpCount; i++) {
						vp[i] = new IgeViewport()
							.center(-300)
							.middle(0)
							.width(150)
							.height(75)
							.autoSize(false)
							.borderColor('#ffffff')
							.originTo(0, 0, 0)
							.camera.scaleTo(0.5, 0.5, 0.5)._entity
							.depth((18 - i))
							.scene(self.scene1);

						setTimeout(function () { var vr = vp[i]; return function () { vr.addBehavior('rotator', RotatorBehaviour); }}(), tt);
						tt += timeInc;
						vp[i].mount(ige);
					}

					tt = 0;
					for (var i = 0; i < vpCount; i++) {
						vp[i] = new IgeViewport()
							.center(300)
							.middle(0)
							.width(150)
							.height(75)
							.autoSize(false)
							.borderColor('#ffffff')
							.originTo(1, 1, 0)
							.camera.scaleTo(0.5, 0.5, 0.5)._entity
							.depth((18 - i))
							.scene(self.scene1);

						setTimeout(function () { var vr = vp[i]; return function () { vr.addBehavior('rotator', RotatorBehaviourAC); }}(), tt);
						tt += timeInc;
						vp[i].mount(ige);
					}

					// Corner viewports
					new IgeViewport()
						.left(0)
						.top(0)
						.width(150)
						.height(75)
						.autoSize(false)
						.borderColor('#ffffff')
						.camera.scaleTo(0.5, 0.5, 0.5)._entity
						.depth(1)
						.scene(self.scene1)
						.mount(ige);

					new IgeViewport()
						.right(0)
						.top(0)
						.width(150)
						.height(75)
						.autoSize(false)
						.borderColor('#ffffff')
						.camera.scaleTo(0.5, 0.5, 0.5)._entity
						.depth(1)
						.scene(self.scene1)
						.mount(ige);

					new IgeViewport()
						.right(0)
						.bottom(0)
						.width(150)
						.height(75)
						.autoSize(false)
						.borderColor('#ffffff')
						.camera.scaleTo(0.5, 0.5, 0.5)._entity
						.depth(1)
						.scene(self.scene1)
						.mount(ige);

					new IgeViewport()
						.left(0)
						.bottom(0)
						.width(150)
						.height(75)
						.autoSize(false)
						.borderColor('#ffffff')
						.camera.scaleTo(0.5, 0.5, 0.5)._entity
						.depth(1)
						.scene(self.scene1)
						.mount(ige);

					new IgeViewport()
						.center(0)
						.top(0)
						.width(150)
						.height(75)
						.autoSize(false)
						.borderColor('#ffffff')
						.camera.scaleTo(0.5, 0.5, 0.5)._entity
						.depth(1)
						.scene(self.scene1)
						.mount(ige);

					new IgeViewport()
						.center(0)
						.bottom(0)
						.width(150)
						.height(75)
						.autoSize(false)
						.borderColor('#ffffff')
						.camera.scaleTo(0.5, 0.5, 0.5)._entity
						.depth(1)
						.scene(self.scene1)
						.mount(ige);

					new IgeViewport()
						.left(0)
						.middle(0)
						.width(150)
						.height(75)
						.autoSize(false)
						.borderColor('#ffffff')
						.camera.scaleTo(0.5, 0.5, 0.5)._entity
						.depth(1)
						.scene(self.scene1)
						.mount(ige);

					new IgeViewport()
						.right(0)
						.middle(0)
						.width(150)
						.height(75)
						.autoSize(false)
						.borderColor('#ffffff')
						.camera.scaleTo(0.5, 0.5, 0.5)._entity
						.depth(1)
						.scene(self.scene1)
						.mount(ige);

					self.obj[0] = new IgeEntity()
						.addBehavior('rotator', RotatorBehaviour)
						.depth(1)
						.width(100)
						.height(100)
						.texture(gameTexture[0])
						.mount(self.scene1);

					self.obj[1] = tempObj = new IgeEntity()
						.addBehavior('scaler', ScalerBehaviour)
						.addBehavior('rotator', RotatorBehaviourAC)
						.depth(0)
						.width(100)
						.height(100)
						.texture(gameTexture[0])
						.mount(self.scene1);
				}
			});
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }