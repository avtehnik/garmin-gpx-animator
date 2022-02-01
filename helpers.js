
/**
 * initBloom
 * */
maptalks.ThreeLayer.prototype.initBloom = function() {
    const params = {
        exposure: 1,
        bloomStrength: 5.4,
        bloomThreshold: 0,
        bloomRadius: 0,
        debug: false
    };
    const renderer = this.getThreeRenderer();
    const size = this.getMap().getSize();
    this.composer = new THREE.EffectComposer(renderer);
    this.composer.setSize(size.width, size.height);

    const scene = this.getScene(), camera = this.getCamera();
    this.renderPass = new THREE.RenderPass(scene, camera);

    this.composer.addPass(this.renderPass);

    const bloomPass = this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(size.width, size.height));
    bloomPass.renderToScreen = true;
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    // composer.setSize(size.width, size.height);
    // composer.addPass(renderPass);
    this.composer.addPass(bloomPass);
    this.bloomEnable = true;
}

/*
   @override  renderer.renderScene

*/

maptalks.ThreeLayer.prototype.setRendererRenderScene = function() {
    this.getRenderer().renderScene = function() {
        const layer = this.layer;
        layer._callbackBaseObjectAnimation();
        this._syncCamera();

        const renderer = this.context, camera = this.camera, scene = this.scene;
        if (layer.bloomEnable && layer.composer && layer.composer.passes.length > 1) {
            if (renderer.autoClear) {
                renderer.autoClear = false;
            }
            if (layer.bloomPass) {
                camera.layers.set(1);
            }
            if (layer && layer.composer) {
                layer.composer.render(0);
            }
            renderer.clearDepth();
            camera.layers.set(0);
            renderer.render(scene, camera);
        } else {
            if (!renderer.autoClear) {
                renderer.autoClear = true;
            }
            renderer.render(scene, camera);
        }

        this.completeRender();
    }
}

maptalks.ThreeLayer.prototype.setRendererRenderScene = function() {
    this.getRenderer().renderScene = function() {
        const layer = this.layer;
        layer._callbackBaseObjectAnimation();
        this._syncCamera();

        const renderer = this.context, camera = this.camera, scene = this.scene;
        if (layer.bloomEnable && layer.composer && layer.composer.passes.length > 1) {
            if (renderer.autoClear) {
                renderer.autoClear = false;
            }
            if (layer.bloomPass) {
                camera.layers.set(1);
            }
            if (layer && layer.composer) {
                layer.composer.render(0);
            }
            renderer.clearDepth();
            camera.layers.set(0);
            renderer.render(scene, camera);
        } else {
            if (!renderer.autoClear) {
                renderer.autoClear = true;
            }
            renderer.render(scene, camera);
        }

        this.completeRender();
    }
}

class LineTrail extends maptalks.BaseObject {
    constructor(lineString, options, material, layer) {
        options = maptalks.Util.extend({}, {
            trail: 5,
            chunkLength: 50,
            speed: 1,
            altitude: 0,
            interactive: false
        }, options, {layer, lineString});
        super();
        //Initialize internal configuration
        // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L135
        this._initOptions(options);

        const {altitude, chunkLength, speed, trail} = options;
        const chunkLines = lineSlice(lineString, chunkLength);

        const positions = _getChunkLinesPosition([chunkLines[0]], layer).positions;
        const geometry = new THREE.BufferGeometry();
        const MAX_POINTS = 1000;
        const ps = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
        geometry.addAttribute('position', new THREE.BufferAttribute(ps, 3).setDynamic(true));
        setLineGeometryAttribute(geometry, positions);
        this._createLine(geometry, material);

        //set object3d position
        const z = layer.distanceToVector3(altitude, altitude).x;
        this.getObject3d().position.z = z;

        this._params = {
            trail: Math.max(1, trail),
            index: 0,
            len: chunkLines.length,
            chunkLines,
            layer,
            speed: Math.min(0.1, speed),
            idx: 0,
            positions: []
        };
        // this._init();
    }


    _init() {
        const {len, chunkLines, layer, trail} = this._params;
        for (let i = 0; i < len; i++) {
            const result = chunkLines.slice(i, i + trail);
            const ps = _getChunkLinesPosition(result, layer).positions;
            this._params.positions[i] = ps;
        }
    }


    _animation() {
        const {index, positions, idx, speed, len, chunkLines, layer, trail} = this._params;
        const i = Math.round(index);
        if (i > idx) {
            this._params.idx++;
            let ps = positions[i];
            if (!ps) {
                const result = chunkLines.slice(i, i + trail);
                ps = _getChunkLinesPosition(result, layer).positions;
                this._params.positions[i] = ps;
            }
            setLineGeometryAttribute(this.getObject3d().geometry, ps);
            this.getObject3d().geometry.attributes.position.needsUpdate = true;
        }
        if (index >= len) {
            this._params.index = -1;
            this._params.idx = -1;
        }
        this._params.index += speed;
    }
}

class Line extends maptalks.BaseObject {
    constructor(lineString, options, material, layer) {
        options = maptalks.Util.extend({}, {
            altitude: 0,
            colors: null
        }, options, {layer, lineString});
        super();
        this._initOptions(options);
        const positions = _getLinePosition(lineString, layer).positions;
        const geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));


        this._createLine(geometry, material);

        const {altitude} = options;

        const z = layer.distanceToVector3(altitude, altitude).x;
        this.getObject3d().position.z = z;
    }
}