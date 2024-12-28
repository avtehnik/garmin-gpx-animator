/*!
 * maptalks.three v0.39.0
 * LICENSE : MIT
 * (c) 2016-2024 maptalks.org
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks'), require('three')) :
    typeof define === 'function' && define.amd ? define(['exports', 'maptalks', 'three'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.maptalks = global.maptalks || {}, global.maptalks, global.THREE));
})(this, (function (exports, maptalks, THREE) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    function _mergeNamespaces(n, m) {
        m.forEach(function (e) {
            e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
                if (k !== 'default' && !(k in n)) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        });
        return Object.freeze(n);
    }

    var maptalks__namespace = /*#__PURE__*/_interopNamespace(maptalks);
    var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);

    /**
     * three api adapt
     */
    const REVISION = parseInt(THREE__namespace.REVISION.replace('dev', ''));
    //Three does not print version information now. Output the version of three to find compatibility problems
    console.log(`maptalks.three log: current three.js version is %c${REVISION}`, 'color:red;font-size: 16px;font-weight: bold;');
    /**
     *
     * @param {THREE.BufferGeometry} bufferGeomertry
     * @param {String} key
     * @param {*} value
     */
    function addAttribute(bufferGeomertry, key, value) {
        if (REVISION > 109) {
            bufferGeomertry.setAttribute(key, value);
        }
        else {
            bufferGeomertry.addAttribute(key, value);
        }
        return bufferGeomertry;
    }
    function setRaycasterLinePrecision(raycaster, linePrecision) {
        if (REVISION > 113) {
            raycaster.params.Line.threshold = linePrecision;
        }
        else {
            raycaster.linePrecision = linePrecision;
        }
    }
    function getThreeNameSpace() {
        const three = THREE__namespace;
        return three;
    }
    function _getThreeVertexColors(threeNameSpace) {
        if (threeNameSpace['VertexColors']) {
            return threeNameSpace['VertexColors'];
        }
        return 2;
    }
    function getVertexColors() {
        // const vertexColors = THREE?.['VertexColors'] ?? false
        // if (vertexColors) {
        //     return vertexColors;
        // }
        // return true;
        return _getThreeVertexColors(getThreeNameSpace());
    }
    function getBoxGeometry(width, height, depth) {
        const three = getThreeNameSpace();
        if (three.BoxBufferGeometry) {
            return new three.BoxBufferGeometry(width, height, depth);
        }
        else if (three.BoxGeometry) {
            return new three.BoxGeometry(width, height, depth);
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     */
    class LineSegmentsGeometry extends THREE__namespace.InstancedBufferGeometry {
        constructor() {
            super();
            this.isLineSegmentsGeometry = true;
            this.type = 'LineSegmentsGeometry';
            var positions = [-1, 2, 0, 1, 2, 0, -1, 1, 0, 1, 1, 0, -1, 0, 0, 1, 0, 0, -1, -1, 0, 1, -1, 0];
            var uvs = [-1, 2, 1, 2, -1, 1, 1, 1, -1, -1, 1, -1, -1, -2, 1, -2];
            var index = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5];
            this.setIndex(index);
            addAttribute(this, 'position', new THREE__namespace.Float32BufferAttribute(positions, 3));
            addAttribute(this, 'uv', new THREE__namespace.Float32BufferAttribute(uvs, 2));
        }
        // THREE.InstancedBufferGeometry.call(this);
        // var plane = new THREE.BufferGeometry();
        // this.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // this.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        applyMatrix(matrix) {
            var start = this.attributes.instanceStart;
            var end = this.attributes.instanceEnd;
            if (start !== undefined) {
                matrix.applyToBufferAttribute(start);
                matrix.applyToBufferAttribute(end);
                start.data.needsUpdate = true;
            }
            if (this.boundingBox !== null) {
                this.computeBoundingBox();
            }
            if (this.boundingSphere !== null) {
                this.computeBoundingSphere();
            }
            return this;
        }
        setPositions(array) {
            var lineSegments;
            if (array instanceof Float32Array) {
                lineSegments = array;
            }
            else if (Array.isArray(array)) {
                lineSegments = new Float32Array(array);
            }
            var instanceBuffer = new THREE__namespace.InstancedInterleavedBuffer(lineSegments, 6, 1); // xyz, xyz
            addAttribute(this, 'instanceStart', new THREE__namespace.InterleavedBufferAttribute(instanceBuffer, 3, 0));
            addAttribute(this, 'instanceEnd', new THREE__namespace.InterleavedBufferAttribute(instanceBuffer, 3, 3));
            // this.addAttribute('instanceStart', new THREE.InterleavedBufferAttribute(instanceBuffer, 3, 0)); // xyz
            // this.addAttribute('instanceEnd', new THREE.InterleavedBufferAttribute(instanceBuffer, 3, 3)); // xyz
            //
            this.computeBoundingBox();
            this.computeBoundingSphere();
            return this;
        }
        setColors(array) {
            var colors;
            if (array instanceof Float32Array) {
                colors = array;
            }
            else if (Array.isArray(array)) {
                colors = new Float32Array(array);
            }
            var instanceColorBuffer = new THREE__namespace.InstancedInterleavedBuffer(colors, 6, 1); // rgb, rgb
            addAttribute(this, 'instanceColorStart', new THREE__namespace.InterleavedBufferAttribute(instanceColorBuffer, 3, 0));
            addAttribute(this, 'instanceColorEnd', new THREE__namespace.InterleavedBufferAttribute(instanceColorBuffer, 3, 3));
            // this.addAttribute('instanceColorStart', new THREE.InterleavedBufferAttribute(instanceColorBuffer, 3, 0)); // rgb
            // this.addAttribute('instanceColorEnd', new THREE.InterleavedBufferAttribute(instanceColorBuffer, 3, 3)); // rgb
            return this;
        }
        fromWireframeGeometry(geometry) {
            this.setPositions(geometry.attributes.position.array);
            return this;
        }
        fromEdgesGeometry(geometry) {
            this.setPositions(geometry.attributes.position.array);
            return this;
        }
        fromMesh(mesh) {
            this.fromWireframeGeometry(new THREE__namespace.WireframeGeometry(mesh.geometry));
            // set colors, maybe
            return this;
        }
        fromLineSegements(lineSegments) {
            var geometry = lineSegments.geometry;
            if (geometry.isGeometry) {
                this.setPositions(geometry.vertices);
            }
            else if (geometry.isBufferGeometry) {
                this.setPositions(geometry.position.array); // assumes non-indexed
            }
            // set colors, maybe
            return this;
        }
        computeBoundingBox() {
            var box = new THREE__namespace.Box3();
            if (this.boundingBox === null) {
                this.boundingBox = new THREE__namespace.Box3();
            }
            var start = this.attributes.instanceStart;
            var end = this.attributes.instanceEnd;
            if (start !== undefined && end !== undefined) {
                this.boundingBox.setFromBufferAttribute(start);
                box.setFromBufferAttribute(end);
                this.boundingBox.union(box);
            }
        }
        computeBoundingSphere() {
            var vector = new THREE__namespace.Vector3();
            if (this.boundingSphere === null) {
                this.boundingSphere = new THREE__namespace.Sphere();
            }
            if (this.boundingBox === null) {
                this.computeBoundingBox();
            }
            var start = this.attributes.instanceStart;
            var end = this.attributes.instanceEnd;
            if (start !== undefined && end !== undefined) {
                var center = this.boundingSphere.center;
                this.boundingBox.getCenter(center);
                var maxRadiusSq = 0;
                for (var i = 0, il = start.count; i < il; i++) {
                    vector.fromBufferAttribute(start, i);
                    maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));
                    vector.fromBufferAttribute(end, i);
                    maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));
                }
                this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
                if (isNaN(this.boundingSphere.radius)) {
                    console.error('THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.', this);
                }
            }
        }
        toJSON() {
            // todo
        }
        // clone: function () {
        //     // todo
        // },
        // eslint-disable-next-line no-unused-vars
        copy(source) {
            // todo
            return this;
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     * parameters = {
     *  color: <hex>,
     *  linewidth: <float>,
     *  dashed: <boolean>,
     *  dashScale: <float>,
     *  dashSize: <float>,
     *  gapSize: <float>,
     *  resolution: <Vector2>, // to be set by renderer
     * }
     */
    const UniformsLib = {}, ShaderLib = {};
    UniformsLib.line = {
        linewidth: { value: 1 },
        resolution: { value: new THREE__namespace.Vector2(1, 1) },
        dashScale: { value: 1 },
        dashSize: { value: 1 },
        gapSize: { value: 1 } // todo FIX - maybe change to totalSize
    };
    ShaderLib['line'] = {
        uniforms: THREE__namespace.UniformsUtils.merge([
            THREE__namespace.UniformsLib.common,
            THREE__namespace.UniformsLib.fog,
            UniformsLib.line
        ]),
        vertexShader: `
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		varying vec2 vUv;

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			vUv = uv;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec2 ndcStart = clipStart.xy / clipStart.w;
			vec2 ndcEnd = clipEnd.xy / clipEnd.w;

			// direction
			vec2 dir = ndcEnd - ndcStart;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			// perpendicular to dir
			vec2 offset = vec2( dir.y, - dir.x );

			// undo aspect ratio adjustment
			dir.x /= aspect;
			offset.x /= aspect;

			// sign flip
			if ( position.x < 0.0 ) offset *= - 1.0;

			// endcaps
			if ( position.y < 0.0 ) {

				offset += - dir;

			} else if ( position.y > 1.0 ) {

				offset += dir;

			}

			// adjust for linewidth
			offset *= linewidth;

			// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
			offset /= resolution.y;

			// select end
			vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

			// back to clip space
			offset *= clip.w;

			clip.xy += offset;

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,
        fragmentShader: `
		uniform vec3 diffuse;
		uniform float opacity;

		#ifdef USE_DASH

			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		varying vec2 vUv;

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			if ( abs( vUv.y ) > 1.0 ) {

				float a = vUv.x;
				float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
				float len2 = a * a + b * b;

				if ( len2 > 1.0 ) discard;

			}

			vec4 diffuseColor = vec4( diffuse, opacity );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, diffuseColor.a );

			#include <premultiplied_alpha_fragment>
			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>

		}
		`
    };
    class LineMaterial extends THREE__namespace.ShaderMaterial {
        constructor(parameters) {
            super({
                uniforms: THREE__namespace.UniformsUtils.clone(ShaderLib['line'].uniforms),
                vertexShader: ShaderLib['line'].vertexShader,
                fragmentShader: ShaderLib['line'].fragmentShader
            });
            this.dashed = true;
            this.isLineMaterial = true;
            this.type = 'LineMaterial';
            Object.defineProperties(this, {
                color: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.diffuse.value;
                    },
                    set: function (value) {
                        this.uniforms.diffuse.value = value;
                    }
                },
                linewidth: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.linewidth.value;
                    },
                    set: function (value) {
                        this.uniforms.linewidth.value = value;
                    }
                },
                dashScale: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.dashScale.value;
                    },
                    set: function (value) {
                        this.uniforms.dashScale.value = value;
                    }
                },
                dashSize: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.dashSize.value;
                    },
                    set: function (value) {
                        this.uniforms.dashSize.value = value;
                    }
                },
                gapSize: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.gapSize.value;
                    },
                    set: function (value) {
                        this.uniforms.gapSize.value = value;
                    }
                },
                resolution: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.resolution.value;
                    },
                    set: function (value) {
                        this.uniforms.resolution.value.copy(value);
                    }
                }
            });
            this.setValues(parameters);
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     */
    class LineSegments2 extends THREE__namespace.Mesh {
        constructor(geometry, material) {
            super(geometry, material);
            this.isLineSegments2 = true;
            this.type = 'LineSegments2';
            this.geometry = geometry !== undefined ? geometry : new LineSegmentsGeometry();
            this.material = material !== undefined ? material : new LineMaterial({ color: Math.random() * 0xffffff });
        }
        computeLineDistances() {
            var start = new THREE__namespace.Vector3();
            var end = new THREE__namespace.Vector3();
            var geometry = this.geometry;
            var instanceStart = geometry.attributes.instanceStart;
            var instanceEnd = geometry.attributes.instanceEnd;
            if (!instanceStart || !instanceEnd) {
                return this;
            }
            var lineDistances = new Float32Array(2 * instanceStart.data.count);
            for (var i = 0, j = 0, l = instanceStart.data.count; i < l; i++, j += 2) {
                start.fromBufferAttribute(instanceStart, i);
                end.fromBufferAttribute(instanceEnd, i);
                lineDistances[j] = (j === 0) ? 0 : lineDistances[j - 1];
                lineDistances[j + 1] = lineDistances[j] + start.distanceTo(end);
            }
            var instanceDistanceBuffer = new THREE__namespace.InstancedInterleavedBuffer(lineDistances, 2, 1); // d0, d1
            addAttribute(geometry, 'instanceDistanceStart', new THREE__namespace.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0));
            addAttribute(geometry, 'instanceDistanceEnd', new THREE__namespace.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1));
            // geometry.addAttribute('instanceDistanceStart', new THREE.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0)); // d0
            // geometry.addAttribute('instanceDistanceEnd', new THREE.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1)); // d1
            return this;
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     */
    class LineGeometry extends LineSegmentsGeometry {
        constructor() {
            super();
            this.isLineGeometry = true;
            this.type = 'LineGeometry';
        }
        fromLine(line) {
            var geometry = line.geometry;
            if (geometry.isGeometry) {
                this.setPositions(geometry.vertices);
            }
            else if (geometry.isBufferGeometry) {
                this.setPositions(geometry.position.array); // assumes non-indexed
            }
            return this;
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     */
    class Line2 extends LineSegments2 {
        constructor(geometry, material) {
            super(geometry, material);
            this.isLine2 = true;
            this.type = 'Line2';
            this.geometry = geometry !== undefined ? geometry : new LineGeometry();
            this.material = material !== undefined ? material : new LineMaterial({ color: Math.random() * 0xffffff });
        }
        copy(source) {
            return this;
        }
    }

    const OPTIONS$l = {
        interactive: true,
        altitude: 0,
        minZoom: 0,
        maxZoom: 30,
        asynchronous: false,
        bloom: false,
        pickWeight: -1
    };
    /**
     * a Class for Eventable
     */
    function Base() {
    }
    // class Base {
    //     constructor() {
    //     }
    // }
    /**
     * EVENTS=[
     *  'add',
     *  'remove',
        'mousemove',
        'click',
        'mousedown',
        'mouseup',
        'dblclick',
        'contextmenu',
        'touchstart',
        'touchmove',
        'touchend',
        'mouseover',
        'mouseout',
        'idchange',
        'propertieschange',
        'show',
        'hide',
        'symbolchange'
         empty
    ];
     * This is the base class for all 3D objects
     *
     *
     * Its function and maptalks.geometry are as similar as possible
     *
     * maptalks.Eventable(Base) return a Class  https://github.com/maptalks/maptalks.js/blob/master/src/core/Eventable.js
     *
     */
    class BaseObject extends maptalks__namespace.Eventable(Base) {
        constructor(id) {
            super();
            this.isAdd = false;
            this._mouseover = false;
            this._visible = true;
            this._zoomVisible = true;
            this.picked = false;
            this.isBaseObject = true;
            if (id === undefined) {
                id = maptalks__namespace.Util.GUID();
            }
            this.id = id;
        }
        addTo(layer) {
            if (layer && layer.type === 'ThreeLayer') {
                layer.addMesh([this]);
            }
            else {
                console.error('layer only support maptalks.ThreeLayer');
            }
            return this;
        }
        remove() {
            const layer = this.getLayer();
            if (layer) {
                layer.removeMesh([this]);
            }
            return this;
        }
        getObject3d() {
            return this.object3d;
        }
        getId() {
            return this.id;
        }
        setId(id) {
            const oldId = this.getId();
            this.id = id;
            this._fire('idchange', {
                'old': oldId,
                'new': id,
                'target': this
            });
            return this;
        }
        getType() {
            return this.type;
        }
        getOptions() {
            return this.options;
        }
        getProperties() {
            return (this.options || {}).properties;
        }
        setProperties(property) {
            const old = Object.assign({}, this.getProperties());
            this.options.properties = property;
            this._fire('propertieschange', {
                'old': old,
                'new': property,
                'target': this
            });
            return this;
        }
        getLayer() {
            return this.options.layer;
        }
        // eslint-disable-next-line consistent-return
        getMap() {
            const layer = this.getLayer();
            if (layer) {
                return layer.getMap();
            }
        }
        // eslint-disable-next-line consistent-return
        getCenter() {
            const options = this.getOptions();
            const { coordinate, lineString, polygon } = options;
            if (coordinate) {
                return coordinate instanceof maptalks__namespace.Coordinate ? coordinate : new maptalks__namespace.Coordinate(coordinate);
            }
            else {
                const geometry = polygon || lineString;
                if (geometry && geometry.getCenter) {
                    return geometry.getCenter();
                }
            }
        }
        getAltitude() {
            return this.getOptions().altitude;
        }
        /**
         * Different objects need to implement their own methods
         * @param {*} altitude
         */
        setAltitude(altitude) {
            if (maptalks__namespace.Util.isNumber(altitude)) {
                const z = this.getLayer().altitudeToVector3(altitude, altitude).x;
                this.getObject3d().position.z = z;
                this.options.altitude = altitude;
                if (this.pickObject3d) {
                    this.pickObject3d.position.z = z;
                }
                //fix merged mesh
                if (this._baseObjects && Array.isArray(this._baseObjects)) {
                    for (let i = 0, len = this._baseObjects.length; i < len; i++) {
                        if (this._baseObjects[i]) {
                            this._baseObjects[i].getObject3d().position.z = z;
                        }
                    }
                }
            }
            return this;
        }
        supportHeight() {
            return this.getOptions().heightEnable;
        }
        getHeight() {
            const { height } = this.getOptions();
            return maptalks__namespace.Util.isNumber(height) ? height : 0;
        }
        setHeight(height) {
            if (!maptalks__namespace.Util.isNumber(height) || this._baseObjects || !this.supportHeight()) {
                return this;
            }
            const layer = this.getLayer();
            if (!layer) {
                return this;
            }
            const { geometry } = this.getObject3d();
            if (geometry instanceof THREE__namespace.BufferGeometry) {
                const { position } = geometry.attributes || {};
                if (!position) {
                    return this;
                }
                const array = position.array;
                let min = Infinity, max = -Infinity;
                for (let i = 0, len = array.length; i < len; i += 3) {
                    const z = array[i + 2];
                    min = Math.min(z, min);
                    max = Math.max(z, max);
                }
                const middle = (min + max) / 2;
                let z = layer.altitudeToVector3(height, height).x;
                // z>0
                z = Math.max(z, 0.000001);
                for (let i = 0, len = array.length; i < len; i += 3) {
                    if (array[i + 2] > middle) {
                        array[i + 2] = z;
                    }
                }
                geometry.attributes.position.needsUpdate = true;
                geometry.computeBoundingBox();
                geometry.computeBoundingSphere();
                this.getOptions().height = height;
            }
            return this;
        }
        show() {
            //  in zoom range
            if (this._zoomVisible) {
                this.getObject3d().visible = true;
                this._fire('show');
            }
            this._visible = true;
            return this;
        }
        hide() {
            this.getObject3d().visible = false;
            this._fire('hide');
            this._visible = false;
            this._hideUI();
            return this;
        }
        isVisible() {
            return (!!this.getObject3d().visible);
        }
        /**
         *  Different objects need to implement their own methods
         */
        getSymbol() {
            return this.getObject3d().material;
        }
        /**
         *  Different objects need to implement their own methods
         * @param {*} material
         */
        setSymbol(material) {
            if (material && material instanceof THREE__namespace.Material) {
                material.needsUpdate = true;
                material.vertexColors = this.getObject3d().material.vertexColors;
                const old = this.getObject3d().material.clone();
                this.getObject3d().material = material;
                this._fire('symbolchange', {
                    'old': old,
                    'new': material,
                    'target': this
                });
            }
            return this;
        }
        setInfoWindow(options) {
            this.removeInfoWindow();
            this.infoWindow = new maptalks__namespace.ui.InfoWindow(options);
            this.infoWindow.addTo(this);
            return this;
        }
        getInfoWindow() {
            return this.infoWindow;
        }
        openInfoWindow(coordinate) {
            coordinate = coordinate || this.getCenter();
            if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                coordinate = new maptalks__namespace.Coordinate(coordinate);
            }
            // eslint-disable-next-line no-unused-expressions
            (coordinate && this.infoWindow && this.infoWindow.show(coordinate));
            return this;
        }
        closeInfoWindow() {
            // eslint-disable-next-line no-unused-expressions
            (this.infoWindow && this.infoWindow.hide());
            return this;
        }
        removeInfoWindow() {
            // eslint-disable-next-line no-unused-expressions
            if (this.infoWindow) {
                this.infoWindow.remove();
                delete this.infoWindow;
            }
            return this;
        }
        setToolTip(content, options) {
            this.removeToolTip();
            this.toolTip = new maptalks__namespace.ui.ToolTip(content, options);
            this.toolTip.addTo(this);
            return this;
        }
        getToolTip() {
            return this.toolTip;
        }
        openToolTip(coordinate) {
            // coordinate = coordinate || this.getCenter();
            // if (!(coordinate instanceof maptalks.Coordinate)) {
            //     coordinate = new maptalks.Coordinate(coordinate);
            // }
            // eslint-disable-next-line no-unused-expressions
            // (coordinate && this.toolTip && this.toolTip.show(coordinate));
            return this;
        }
        closeToolTip() {
            // eslint-disable-next-line no-unused-expressions
            (this.toolTip && this.toolTip.hide());
            return this;
        }
        removeToolTip() {
            // eslint-disable-next-line no-unused-expressions
            if (this.toolTip) {
                this.toolTip.remove();
                delete this.toolTip;
            }
            return this;
        }
        _hideUI() {
            this.closeInfoWindow();
            this.closeToolTip();
            return this;
        }
        /**
         * different components should implement their own animation methods
         * @param {*} options
         * @param {*} cb
         */
        // eslint-disable-next-line no-unused-vars
        animateShow(options = {}, cb) {
            if (this._showPlayer) {
                this._showPlayer.cancel();
            }
            if (maptalks__namespace.Util.isFunction(options)) {
                options = {};
                cb = options;
            }
            const duration = options['duration'] || 1000, easing = options['easing'] || 'out';
            const player = this._showPlayer = maptalks__namespace.animation.Animation.animate({
                'scale': 1
            }, {
                'duration': duration,
                'easing': easing
            }, frame => {
                const scale = frame.styles.scale;
                if (scale > 0) {
                    this.getObject3d().scale.z = scale;
                }
                if (cb) {
                    cb(frame, scale);
                }
            });
            player.play();
            return player;
        }
        getMinZoom() {
            return this.getOptions().minZoom;
        }
        getMaxZoom() {
            return this.getOptions().maxZoom;
        }
        isAsynchronous() {
            return this.getOptions().asynchronous;
        }
        get bloom() {
            return this.getOptions().bloom;
        }
        fire(eventType, param) {
            this._fire(eventType, param);
            if (this._vt && this._vt.onSelectMesh) {
                this._vt.onSelectMesh(eventType, param);
            }
            return this;
        }
        config() {
            return this;
        }
        setPickObject3d(object3d) {
            this.pickObject3d = object3d;
            this.pickObject3d['__parent'] = this;
            return this;
        }
        getPickObject3d() {
            return this.pickObject3d;
        }
        /**
         * more method support
         * @param {*} options
         */
        /**
         *
         * @param {*} options
         */
        _initOptions(options) {
            this.options = maptalks__namespace.Util.extend({}, OPTIONS$l, options);
            return this;
        }
        _createMesh(geometry, material) {
            this.object3d = new THREE__namespace.Mesh(geometry, material);
            this.object3d['__parent'] = this;
            return this;
        }
        _createInstancedMesh(geometry, material, count) {
            this.object3d = new THREE__namespace.InstancedMesh(geometry, material, count);
            this.object3d['__parent'] = this;
            return this;
        }
        _createGroup() {
            this.object3d = new THREE__namespace.Group();
            this.object3d['__parent'] = this;
            return this;
        }
        _createLine(geometry, material) {
            this.object3d = new THREE__namespace.Line(geometry, material);
            // (this.object3d as THREE.Line).computeLineDistances();
            this._computeLineDistances(geometry);
            this.object3d['__parent'] = this;
            return this;
        }
        _createLine2(geometry, material) {
            this.object3d = new Line2(geometry, material);
            this.object3d.computeLineDistances();
            this.object3d['__parent'] = this;
            return this;
        }
        // eslint-disable-next-line no-unused-vars
        _createPoints(geometry, material) {
            //Serving for particles
            this.object3d = new THREE__namespace.Points(geometry, material);
            this.object3d['__parent'] = this;
            return this;
        }
        _createLineSegments(geometry, material) {
            this.object3d = new THREE__namespace.LineSegments(geometry, material);
            // (this.object3d as THREE.LineSegments).computeLineDistances();
            this._computeLineDistances(geometry);
            this.object3d['__parent'] = this;
            return this;
        }
        /**
         * rewrite three.js computeLineDistances ,1.7 speed
         * @param geometry
         */
        _computeLineDistances(geometry) {
            const position = geometry.attributes.position.array;
            const count = geometry.attributes.position.count;
            const lineDistances = new Float32Array(count);
            lineDistances[0] = 0;
            const start = new THREE__namespace.Vector3(0, 0, 0), end = new THREE__namespace.Vector3(0, 0, 0);
            for (let i = 1; i < count; i++) {
                const idx = (i - 1) * 3;
                start.x = position[idx];
                start.y = position[idx + 1];
                start.z = position[idx + 2];
                const idx1 = i * 3;
                end.x = position[idx1];
                end.y = position[idx1 + 1];
                end.z = position[idx1 + 2];
                const distance = end.distanceTo(start);
                lineDistances[i] = lineDistances[i - 1] + distance;
            }
            addAttribute(geometry, 'lineDistance', new THREE__namespace.BufferAttribute(lineDistances, 1));
        }
    }

    /* eslint-disable indent */
    const TYPES = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'];
    function getGeoJSONType(feature) {
        return feature.geometry ? feature.geometry.type : null;
    }
    function isGeoJSON(feature) {
        const type = getGeoJSONType(feature);
        if (type) {
            for (let i = 0, len = TYPES.length; i < len; i++) {
                if (TYPES[i] === type) {
                    return true;
                }
            }
        }
        return false;
    }
    function isGeoJSONPolygon(feature) {
        const type = getGeoJSONType(feature);
        if (type && (type === TYPES[4] || type === TYPES[5])) {
            return true;
        }
        return false;
    }
    function isGeoJSONLine(feature) {
        const type = getGeoJSONType(feature);
        if (type && (type === TYPES[2] || type === TYPES[3])) {
            return true;
        }
        return false;
    }
    function isGeoJSONPoint(feature) {
        const type = getGeoJSONType(feature);
        if (type && (type === TYPES[0] || type === TYPES[1])) {
            return true;
        }
        return false;
    }
    function isGeoJSONMulti(feature) {
        const type = getGeoJSONType(feature);
        if (type) {
            if (type.indexOf('Multi') > -1) {
                return true;
            }
        }
        return false;
    }
    function getGeoJSONCoordinates(feature) {
        return feature.geometry ? feature.geometry.coordinates : [];
    }
    function getGeoJSONCenter(feature, out) {
        const type = getGeoJSONType(feature);
        if (!type || !feature.geometry) {
            return null;
        }
        const geometry = feature.geometry;
        const coordinates = geometry.coordinates;
        if (!coordinates) {
            return null;
        }
        // const coords: Array<Array<number>> = [];
        let sumX = 0, sumY = 0, coordLen = 0;
        switch (type) {
            case 'Point': {
                sumX = coordinates[0];
                sumY = coordinates[1];
                // coords.push(coordinates as Array<number>);
                coordLen++;
                break;
            }
            case 'MultiPoint':
            case 'LineString': {
                for (let i = 0, len = coordinates.length; i < len; i++) {
                    sumX += coordinates[i][0];
                    sumY += coordinates[i][1];
                    coordLen++;
                    // coords.push(coordinates[i] as Array<number>);
                }
                break;
            }
            case 'MultiLineString':
            case 'Polygon': {
                for (let i = 0, len = coordinates.length; i < len; i++) {
                    for (let j = 0, len1 = coordinates[i].length; j < len1; j++) {
                        // coords.push((coordinates[i] as Array<Array<number>>)[j]);
                        sumX += coordinates[i][j][0];
                        sumY += coordinates[i][j][1];
                        coordLen++;
                    }
                }
                break;
            }
            case 'MultiPolygon': {
                for (let i = 0, len = coordinates.length; i < len; i++) {
                    for (let j = 0, len1 = coordinates[i].length; j < len1; j++) {
                        for (let m = 0, len2 = coordinates[i][j].length; m < len2; m++) {
                            // coords.push(((coordinates[i] as Array<Array<Array<number>>>)[j])[m]);
                            sumX += coordinates[i][j][m][0];
                            sumY += coordinates[i][j][m][1];
                            coordLen++;
                        }
                    }
                }
                break;
            }
        }
        const x = sumX / coordLen, y = sumY / coordLen;
        if (out) {
            out.x = x;
            out.y = y;
            return out;
        }
        return new maptalks__namespace.Coordinate(x, y);
    }
    function spliteGeoJSONMulti(feature) {
        const type = getGeoJSONType(feature);
        if (!type || !feature.geometry) {
            return null;
        }
        const geometry = feature.geometry;
        const properties = feature.properties || {};
        const coordinates = geometry.coordinates;
        if (!coordinates) {
            return null;
        }
        const features = [];
        let fType;
        switch (type) {
            case 'MultiPoint': {
                fType = 'Point';
                break;
            }
            case 'MultiLineString': {
                fType = 'LineString';
                break;
            }
            case 'MultiPolygon': {
                fType = 'Polygon';
                break;
            }
        }
        if (fType) {
            for (let i = 0, len = coordinates.length; i < len; i++) {
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: fType,
                        coordinates: coordinates[i]
                    },
                    properties
                });
            }
        }
        else {
            features.push(feature);
        }
        return features;
    }

    var GeoJSONUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isGeoJSON: isGeoJSON,
        isGeoJSONPolygon: isGeoJSONPolygon,
        isGeoJSONLine: isGeoJSONLine,
        isGeoJSONPoint: isGeoJSONPoint,
        isGeoJSONMulti: isGeoJSONMulti,
        getGeoJSONCoordinates: getGeoJSONCoordinates,
        getGeoJSONCenter: getGeoJSONCenter,
        spliteGeoJSONMulti: spliteGeoJSONMulti
    });

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var polyExtrude$2 = {exports: {}};

    /*!
     * poly-extrude v0.4.0
      */

    (function (module, exports) {
    (function (global, factory) {
        factory(exports) ;
    })(commonjsGlobal, (function (exports) {
        var earcut$2 = {exports: {}};

        earcut$2.exports = earcut;

        earcut$2.exports["default"] = earcut;

        function earcut(data, holeIndices, dim) {
          dim = dim || 2;
          var hasHoles = holeIndices && holeIndices.length,
              outerLen = hasHoles ? holeIndices[0] * dim : data.length,
              outerNode = linkedList(data, 0, outerLen, dim, true),
              triangles = [];
          if (!outerNode || outerNode.next === outerNode.prev) return triangles;
          var minX, minY, maxX, maxY, x, y, invSize;
          if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim); // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox

          if (data.length > 80 * dim) {
            minX = maxX = data[0];
            minY = maxY = data[1];

            for (var i = dim; i < outerLen; i += dim) {
              x = data[i];
              y = data[i + 1];
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            } // minX, minY and invSize are later used to transform coords into integers for z-order calculation


            invSize = Math.max(maxX - minX, maxY - minY);
            invSize = invSize !== 0 ? 32767 / invSize : 0;
          }

          earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
          return triangles;
        } // create a circular doubly linked list from polygon points in the specified winding order


        function linkedList(data, start, end, dim, clockwise) {
          var i, last;

          if (clockwise === signedArea(data, start, end, dim) > 0) {
            for (i = start; i < end; i += dim) {
              last = insertNode(i, data[i], data[i + 1], last);
            }
          } else {
            for (i = end - dim; i >= start; i -= dim) {
              last = insertNode(i, data[i], data[i + 1], last);
            }
          }

          if (last && equals(last, last.next)) {
            removeNode(last);
            last = last.next;
          }

          return last;
        } // eliminate colinear or duplicate points


        function filterPoints(start, end) {
          if (!start) return start;
          if (!end) end = start;
          var p = start,
              again;

          do {
            again = false;

            if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
              removeNode(p);
              p = end = p.prev;
              if (p === p.next) break;
              again = true;
            } else {
              p = p.next;
            }
          } while (again || p !== end);

          return end;
        } // main ear slicing loop which triangulates a polygon (given as a linked list)


        function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
          if (!ear) return; // interlink polygon nodes in z-order

          if (!pass && invSize) indexCurve(ear, minX, minY, invSize);
          var stop = ear,
              prev,
              next; // iterate through ears, slicing them one by one

          while (ear.prev !== ear.next) {
            prev = ear.prev;
            next = ear.next;

            if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
              // cut off the triangle
              triangles.push(prev.i / dim | 0);
              triangles.push(ear.i / dim | 0);
              triangles.push(next.i / dim | 0);
              removeNode(ear); // skipping the next vertex leads to less sliver triangles

              ear = next.next;
              stop = next.next;
              continue;
            }

            ear = next; // if we looped through the whole remaining polygon and can't find any more ears

            if (ear === stop) {
              // try filtering points and slicing again
              if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1); // if this didn't work, try curing all small self-intersections locally
              } else if (pass === 1) {
                ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2); // as a last resort, try splitting the remaining polygon into two
              } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
              }

              break;
            }
          }
        } // check whether a polygon node forms a valid ear with adjacent nodes


        function isEar(ear) {
          var a = ear.prev,
              b = ear,
              c = ear.next;
          if (area(a, b, c) >= 0) return false; // reflex, can't be an ear
          // now make sure we don't have other points inside the potential ear

          var ax = a.x,
              bx = b.x,
              cx = c.x,
              ay = a.y,
              by = b.y,
              cy = c.y; // triangle bbox; min & max are calculated like this for speed

          var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx,
              y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy,
              x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx,
              y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
          var p = c.next;

          while (p !== a) {
            if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
            p = p.next;
          }

          return true;
        }

        function isEarHashed(ear, minX, minY, invSize) {
          var a = ear.prev,
              b = ear,
              c = ear.next;
          if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

          var ax = a.x,
              bx = b.x,
              cx = c.x,
              ay = a.y,
              by = b.y,
              cy = c.y; // triangle bbox; min & max are calculated like this for speed

          var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx,
              y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy,
              x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx,
              y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy; // z-order range for the current triangle bbox;

          var minZ = zOrder(x0, y0, minX, minY, invSize),
              maxZ = zOrder(x1, y1, minX, minY, invSize);
          var p = ear.prevZ,
              n = ear.nextZ; // look for points inside the triangle in both directions

          while (p && p.z >= minZ && n && n.z <= maxZ) {
            if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
            if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
          } // look for remaining points in decreasing z-order


          while (p && p.z >= minZ) {
            if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
          } // look for remaining points in increasing z-order


          while (n && n.z <= maxZ) {
            if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
          }

          return true;
        } // go through all polygon nodes and cure small local self-intersections


        function cureLocalIntersections(start, triangles, dim) {
          var p = start;

          do {
            var a = p.prev,
                b = p.next.next;

            if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
              triangles.push(a.i / dim | 0);
              triangles.push(p.i / dim | 0);
              triangles.push(b.i / dim | 0); // remove two nodes involved

              removeNode(p);
              removeNode(p.next);
              p = start = b;
            }

            p = p.next;
          } while (p !== start);

          return filterPoints(p);
        } // try splitting polygon into two and triangulate them independently


        function splitEarcut(start, triangles, dim, minX, minY, invSize) {
          // look for a valid diagonal that divides the polygon into two
          var a = start;

          do {
            var b = a.next.next;

            while (b !== a.prev) {
              if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b); // filter colinear points around the cuts

                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next); // run earcut on each half

                earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
                earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
                return;
              }

              b = b.next;
            }

            a = a.next;
          } while (a !== start);
        } // link every hole into the outer loop, producing a single-ring polygon without holes


        function eliminateHoles(data, holeIndices, outerNode, dim) {
          var queue = [],
              i,
              len,
              start,
              end,
              list;

          for (i = 0, len = holeIndices.length; i < len; i++) {
            start = holeIndices[i] * dim;
            end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            list = linkedList(data, start, end, dim, false);
            if (list === list.next) list.steiner = true;
            queue.push(getLeftmost(list));
          }

          queue.sort(compareX); // process holes from left to right

          for (i = 0; i < queue.length; i++) {
            outerNode = eliminateHole(queue[i], outerNode);
          }

          return outerNode;
        }

        function compareX(a, b) {
          return a.x - b.x;
        } // find a bridge between vertices that connects hole with an outer ring and and link it


        function eliminateHole(hole, outerNode) {
          var bridge = findHoleBridge(hole, outerNode);

          if (!bridge) {
            return outerNode;
          }

          var bridgeReverse = splitPolygon(bridge, hole); // filter collinear points around the cuts

          filterPoints(bridgeReverse, bridgeReverse.next);
          return filterPoints(bridge, bridge.next);
        } // David Eberly's algorithm for finding a bridge between hole and outer polygon


        function findHoleBridge(hole, outerNode) {
          var p = outerNode,
              hx = hole.x,
              hy = hole.y,
              qx = -Infinity,
              m; // find a segment intersected by a ray from the hole's leftmost point to the left;
          // segment's endpoint with lesser x will be potential connection point

          do {
            if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
              var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);

              if (x <= hx && x > qx) {
                qx = x;
                m = p.x < p.next.x ? p : p.next;
                if (x === hx) return m; // hole touches outer segment; pick leftmost endpoint
              }
            }

            p = p.next;
          } while (p !== outerNode);

          if (!m) return null; // look for points inside the triangle of hole point, segment intersection and endpoint;
          // if there are no points found, we have a valid connection;
          // otherwise choose the point of the minimum angle with the ray as connection point

          var stop = m,
              mx = m.x,
              my = m.y,
              tanMin = Infinity,
              tan;
          p = m;

          do {
            if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
              tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

              if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
                m = p;
                tanMin = tan;
              }
            }

            p = p.next;
          } while (p !== stop);

          return m;
        } // whether sector in vertex m contains sector in vertex p in the same coordinates


        function sectorContainsSector(m, p) {
          return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
        } // interlink polygon nodes in z-order


        function indexCurve(start, minX, minY, invSize) {
          var p = start;

          do {
            if (p.z === 0) p.z = zOrder(p.x, p.y, minX, minY, invSize);
            p.prevZ = p.prev;
            p.nextZ = p.next;
            p = p.next;
          } while (p !== start);

          p.prevZ.nextZ = null;
          p.prevZ = null;
          sortLinked(p);
        } // Simon Tatham's linked list merge sort algorithm
        // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html


        function sortLinked(list) {
          var i,
              p,
              q,
              e,
              tail,
              numMerges,
              pSize,
              qSize,
              inSize = 1;

          do {
            p = list;
            list = null;
            tail = null;
            numMerges = 0;

            while (p) {
              numMerges++;
              q = p;
              pSize = 0;

              for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
              }

              qSize = inSize;

              while (pSize > 0 || qSize > 0 && q) {
                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                  e = p;
                  p = p.nextZ;
                  pSize--;
                } else {
                  e = q;
                  q = q.nextZ;
                  qSize--;
                }

                if (tail) tail.nextZ = e;else list = e;
                e.prevZ = tail;
                tail = e;
              }

              p = q;
            }

            tail.nextZ = null;
            inSize *= 2;
          } while (numMerges > 1);

          return list;
        } // z-order of a point given coords and inverse of the longer side of data bbox


        function zOrder(x, y, minX, minY, invSize) {
          // coords are transformed into non-negative 15-bit integer range
          x = (x - minX) * invSize | 0;
          y = (y - minY) * invSize | 0;
          x = (x | x << 8) & 0x00FF00FF;
          x = (x | x << 4) & 0x0F0F0F0F;
          x = (x | x << 2) & 0x33333333;
          x = (x | x << 1) & 0x55555555;
          y = (y | y << 8) & 0x00FF00FF;
          y = (y | y << 4) & 0x0F0F0F0F;
          y = (y | y << 2) & 0x33333333;
          y = (y | y << 1) & 0x55555555;
          return x | y << 1;
        } // find the leftmost node of a polygon ring


        function getLeftmost(start) {
          var p = start,
              leftmost = start;

          do {
            if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y) leftmost = p;
            p = p.next;
          } while (p !== start);

          return leftmost;
        } // check if a point lies within a convex triangle


        function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
          return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
        } // check if a diagonal between two polygon nodes is valid (lies in polygon interior)


        function isValidDiagonal(a, b) {
          return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && ( // dones't intersect other edges
          locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && ( // locally visible
          area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
          equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
        } // signed area of a triangle


        function area(p, q, r) {
          return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        } // check if two points are equal


        function equals(p1, p2) {
          return p1.x === p2.x && p1.y === p2.y;
        } // check if two segments intersect


        function intersects(p1, q1, p2, q2) {
          var o1 = sign(area(p1, q1, p2));
          var o2 = sign(area(p1, q1, q2));
          var o3 = sign(area(p2, q2, p1));
          var o4 = sign(area(p2, q2, q1));
          if (o1 !== o2 && o3 !== o4) return true; // general case

          if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1

          if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1

          if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2

          if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

          return false;
        } // for collinear points p, q, r, check if point q lies on segment pr


        function onSegment(p, q, r) {
          return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
        }

        function sign(num) {
          return num > 0 ? 1 : num < 0 ? -1 : 0;
        } // check if a polygon diagonal intersects any polygon segments


        function intersectsPolygon(a, b) {
          var p = a;

          do {
            if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b)) return true;
            p = p.next;
          } while (p !== a);

          return false;
        } // check if a polygon diagonal is locally inside the polygon


        function locallyInside(a, b) {
          return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
        } // check if the middle point of a polygon diagonal is inside the polygon


        function middleInside(a, b) {
          var p = a,
              inside = false,
              px = (a.x + b.x) / 2,
              py = (a.y + b.y) / 2;

          do {
            if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) inside = !inside;
            p = p.next;
          } while (p !== a);

          return inside;
        } // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
        // if one belongs to the outer ring and another to a hole, it merges it into a single ring


        function splitPolygon(a, b) {
          var a2 = new Node(a.i, a.x, a.y),
              b2 = new Node(b.i, b.x, b.y),
              an = a.next,
              bp = b.prev;
          a.next = b;
          b.prev = a;
          a2.next = an;
          an.prev = a2;
          b2.next = a2;
          a2.prev = b2;
          bp.next = b2;
          b2.prev = bp;
          return b2;
        } // create a node and optionally link it with previous one (in a circular doubly linked list)


        function insertNode(i, x, y, last) {
          var p = new Node(i, x, y);

          if (!last) {
            p.prev = p;
            p.next = p;
          } else {
            p.next = last.next;
            p.prev = last;
            last.next.prev = p;
            last.next = p;
          }

          return p;
        }

        function removeNode(p) {
          p.next.prev = p.prev;
          p.prev.next = p.next;
          if (p.prevZ) p.prevZ.nextZ = p.nextZ;
          if (p.nextZ) p.nextZ.prevZ = p.prevZ;
        }

        function Node(i, x, y) {
          // vertex index in coordinates array
          this.i = i; // vertex coordinates

          this.x = x;
          this.y = y; // previous and next vertex nodes in a polygon ring

          this.prev = null;
          this.next = null; // z-order curve value

          this.z = 0; // previous and next nodes in z-order

          this.prevZ = null;
          this.nextZ = null; // indicates whether this is a steiner point

          this.steiner = false;
        } // return a percentage difference between the polygon area and its triangulation area;
        // used to verify correctness of triangulation


        earcut.deviation = function (data, holeIndices, dim, triangles) {
          var hasHoles = holeIndices && holeIndices.length;
          var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
          var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));

          if (hasHoles) {
            for (var i = 0, len = holeIndices.length; i < len; i++) {
              var start = holeIndices[i] * dim;
              var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
              polygonArea -= Math.abs(signedArea(data, start, end, dim));
            }
          }

          var trianglesArea = 0;

          for (i = 0; i < triangles.length; i += 3) {
            var a = triangles[i] * dim;
            var b = triangles[i + 1] * dim;
            var c = triangles[i + 2] * dim;
            trianglesArea += Math.abs((data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
          }

          return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
        };

        function signedArea(data, start, end, dim) {
          var sum = 0;

          for (var i = start, j = end - dim; i < end; i += dim) {
            sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
            j = i;
          }

          return sum;
        } // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts


        earcut.flatten = function (data) {
          var dim = data[0][0].length,
              result = {
            vertices: [],
            holes: [],
            dimensions: dim
          },
              holeIndex = 0;

          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
              for (var d = 0; d < dim; d++) {
                result.vertices.push(data[i][j][d]);
              }
            }

            if (i > 0) {
              holeIndex += data[i - 1].length;
              result.holes.push(holeIndex);
            }
          }

          return result;
        };

        var earcut$1 = earcut$2.exports;

        /**
         * https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-clockwise/index.ts
         * @param {*} ring
         * @returns
         */
        function isClockwise(ring) {
          var sum = 0;
          var i = 1;
          var prev;
          var cur;
          var len = ring.length;

          while (i < len) {
            prev = cur || ring[0];
            cur = ring[i];
            sum += (cur[0] - prev[0]) * (cur[1] + prev[1]);
            i++;
          }

          return sum > 0;
        }

        function v3Sub(out, v1, v2) {
          out[0] = v1[0] - v2[0];
          out[1] = v1[1] - v2[1];
          out[2] = v1[2] - v2[2];
          return out;
        }

        function v3Normalize(out, v) {
          var x = v[0];
          var y = v[1];
          var z = v[2];
          var d = Math.sqrt(x * x + y * y + z * z) || 1;
          out[0] = x / d;
          out[1] = y / d;
          out[2] = z / d;
          return out;
        }

        function v3Cross(out, v1, v2) {
          var ax = v1[0],
              ay = v1[1],
              az = v1[2],
              bx = v2[0],
              by = v2[1],
              bz = v2[2];
          out[0] = ay * bz - az * by;
          out[1] = az * bx - ax * bz;
          out[2] = ax * by - ay * bx;
          return out;
        }

        function generateNormal(indices, position) {
          function v3Set(p, a, b, c) {
            p[0] = a;
            p[1] = b;
            p[2] = c;
          }

          var p1 = [];
          var p2 = [];
          var p3 = [];
          var v21 = [];
          var v32 = [];
          var n = [];
          var len = indices.length;
          var normals = new Float32Array(position.length);
          var f = 0;

          while (f < len) {
            // const i1 = indices[f++] * 3;
            // const i2 = indices[f++] * 3;
            // const i3 = indices[f++] * 3;
            // const i1 = indices[f];
            // const i2 = indices[f + 1];
            // const i3 = indices[f + 2];
            var a = indices[f],
                b = indices[f + 1],
                c = indices[f + 2];
            var i1 = a * 3,
                i2 = b * 3,
                i3 = c * 3;
            v3Set(p1, position[i1], position[i1 + 1], position[i1 + 2]);
            v3Set(p2, position[i2], position[i2 + 1], position[i2 + 2]);
            v3Set(p3, position[i3], position[i3 + 1], position[i3 + 2]);
            v3Sub(v32, p3, p2);
            v3Sub(v21, p1, p2);
            v3Cross(n, v32, v21); // Already be weighted by the triangle area

            for (var _i = 0; _i < 3; _i++) {
              normals[i1 + _i] += n[_i];
              normals[i2 + _i] += n[_i];
              normals[i3 + _i] += n[_i];
            }

            f += 3;
          }

          var i = 0;
          var l = normals.length;

          while (i < l) {
            v3Set(n, normals[i], normals[i + 1], normals[i + 2]);
            v3Normalize(n, n);
            normals[i] = n[0] || 0;
            normals[i + 1] = n[1] || 0;
            normals[i + 2] = n[2] || 0;
            i += 3;
          }

          return normals;
        }
        function merge(results) {
          if (results.length === 1) {
            var _result = {
              position: results[0].position,
              normal: results[0].normal,
              uv: results[0].uv,
              indices: results[0].indices,
              results: results
            };
            return _result;
          }

          var plen = 0,
              ilen = 0;

          for (var i = 0, len = results.length; i < len; i++) {
            var _results$i = results[i],
                position = _results$i.position,
                indices = _results$i.indices;
            plen += position.length;
            ilen += indices.length;
          }

          var result = {
            position: new Float32Array(plen),
            normal: new Float32Array(plen),
            uv: new Float32Array(plen / 3 * 2),
            indices: new Uint32Array(ilen),
            results: results
          };
          var pOffset = 0,
              pCount = 0,
              iIdx = 0,
              uvOffset = 0;

          for (var _i2 = 0, _len = results.length; _i2 < _len; _i2++) {
            var _results$_i = results[_i2],
                _position = _results$_i.position,
                _indices = _results$_i.indices,
                normal = _results$_i.normal,
                uv = _results$_i.uv;
            result.position.set(_position, pOffset);
            result.normal.set(normal, pOffset);
            result.uv.set(uv, uvOffset);
            var j = 0;
            var len1 = _indices.length;

            while (j < len1) {
              var pIndex = _indices[j] + pCount;
              result.indices[iIdx] = pIndex;
              iIdx++;
              j++;
            }

            uvOffset += uv.length;
            pOffset += _position.length;
            pCount += _position.length / 3;
          }

          return result;
        }
        function radToDeg(rad) {
          return rad * 180 / Math.PI;
        }
        function degToRad(angle) {
          return angle / 180 * Math.PI;
        } // https://github.com/mrdoob/three.js/blob/16f13e3b07e31d0e9a00df7c3366bbe0e464588c/src/geometries/ExtrudeGeometry.js?_pjax=%23js-repo-pjax-container#L736

        function generateSideWallUV(uvs, vertices, indexA, indexB, indexC, indexD) {
          var idx1 = indexA * 3,
              idx2 = indexB * 3,
              idx3 = indexC * 3,
              idx4 = indexD * 3;
          var a_x = vertices[idx1];
          var a_y = vertices[idx1 + 1];
          var a_z = vertices[idx1 + 2];
          var b_x = vertices[idx2];
          var b_y = vertices[idx2 + 1];
          var b_z = vertices[idx2 + 2];
          var c_x = vertices[idx3];
          var c_y = vertices[idx3 + 1];
          var c_z = vertices[idx3 + 2];
          var d_x = vertices[idx4];
          var d_y = vertices[idx4 + 1];
          var d_z = vertices[idx4 + 2];

          if (Math.abs(a_y - b_y) < Math.abs(a_x - b_x)) {
            uvs.push(a_x, 1 - a_z);
            uvs.push(b_x, 1 - b_z);
            uvs.push(c_x, 1 - c_z);
            uvs.push(d_x, 1 - d_z);
          } else {
            uvs.push(a_y, 1 - a_z);
            uvs.push(b_y, 1 - b_z);
            uvs.push(c_y, 1 - c_z);
            uvs.push(d_y, 1 - d_z);
          }
        }

        function extrudePolygons(polygons, options) {
          options = Object.assign({}, {
            depth: 2
          }, options);
          var results = polygons.map(function (polygon) {
            for (var i = 0, len = polygon.length; i < len; i++) {
              var ring = polygon[i];
              validateRing(ring);

              if (i === 0) {
                if (!isClockwise(ring)) {
                  polygon[i] = ring.reverse();
                }
              } else if (isClockwise(ring)) {
                polygon[i] = ring.reverse();
              }

              if (isClosedRing(ring)) {
                ring.splice(ring.length - 1, 1);
              }
            }

            var result = flatVertices(polygon, options);
            result.polygon = polygon;
            var triangles = earcut$1(result.flatVertices, result.holes, 2);
            generateTopAndBottom$1(result, triangles);
            generateSides$1(result, options);
            result.position = new Float32Array(result.points);
            result.indices = new Uint32Array(result.index);
            result.uv = new Float32Array(result.uvs);
            result.normal = generateNormal(result.indices, result.position);
            return result;
          });
          var result = merge(results);
          result.polygons = polygons;
          return result;
        }

        function generateTopAndBottom$1(result, triangles) {
          var index = [];
          var count = result.count;

          for (var i = 0, len = triangles.length; i < len; i += 3) {
            // top
            var a = triangles[i],
                b = triangles[i + 1],
                c = triangles[i + 2];
            index[i] = a;
            index[i + 1] = b;
            index[i + 2] = c; // bottom

            var idx = len + i;
            var a1 = count + a,
                b1 = count + b,
                c1 = count + c;
            index[idx] = a1;
            index[idx + 1] = b1;
            index[idx + 2] = c1;
          }

          result.index = index;
        }

        function generateSides$1(result, options) {
          var points = result.points,
              index = result.index,
              polygon = result.polygon,
              uvs = result.uvs;
          var z = options.depth;

          for (var i = 0, len = polygon.length; i < len; i++) {
            var ring = polygon[i];
            var j = 0;
            var len1 = ring.length;

            while (j < len1) {
              var v1 = ring[j];
              var v2 = ring[j + 1];

              if (j === len1 - 1) {
                v2 = ring[0];
              }

              var idx = points.length / 3;
              var x1 = v1[0],
                  y1 = v1[1],
                  x2 = v2[0],
                  y2 = v2[1];
              points.push(x1, y1, z, x2, y2, z, x1, y1, 0, x2, y2, 0);
              var a = idx + 2,
                  b = idx + 3,
                  c = idx,
                  d = idx + 1; // points.push(p3, p4, p1, p2);

              index.push(a, c, b, c, d, b); // index.push(c, d, b);

              generateSideWallUV(uvs, points, a, b, c, d);
              j++;
            }
          }
        }

        function calPolygonPointsCount(polygon) {
          var count = 0;
          var i = 0;
          var len = polygon.length;

          while (i < len) {
            count += polygon[i].length;
            i++;
          }

          return count;
        }

        function flatVertices(polygon, options) {
          var count = calPolygonPointsCount(polygon);
          var len = polygon.length;
          var holes = [],
              flatVertices = new Float32Array(count * 2),
              points = [],
              uvs = [];
          var pOffset = count * 3,
              uOffset = count * 2;
          var z = options.depth;
          var idx0 = 0,
              idx1 = 0,
              idx2 = 0;

          for (var i = 0; i < len; i++) {
            var ring = polygon[i];

            if (i > 0) {
              holes.push(idx0 / 2);
            }

            var j = 0;
            var len1 = ring.length;

            while (j < len1) {
              var c = ring[j];
              var x = c[0],
                  y = c[1];
              flatVertices[idx0++] = x;
              flatVertices[idx0++] = y; // top vertices

              points[idx1] = x;
              points[idx1 + 1] = y;
              points[idx1 + 2] = z; // bottom vertices

              points[pOffset + idx1] = x;
              points[pOffset + idx1 + 1] = y;
              points[pOffset + idx1 + 2] = 0;
              uvs[idx2] = x;
              uvs[idx2 + 1] = y;
              uvs[uOffset + idx2] = x;
              uvs[uOffset + idx2 + 1] = y;
              idx1 += 3;
              idx2 += 2;
              j++;
            }
          }

          return {
            flatVertices: flatVertices,
            holes: holes,
            points: points,
            count: count,
            uvs: uvs
          };
        }

        function validateRing(ring) {
          if (!isClosedRing(ring)) {
            ring.push(ring[0]);
          }
        }

        function isClosedRing(ring) {
          var len = ring.length;
          var _ring$ = ring[0],
              x1 = _ring$[0],
              y1 = _ring$[1],
              _ring = ring[len - 1],
              x2 = _ring[0],
              y2 = _ring[1];
          return x1 === x2 && y1 === y2;
        }

        function extrudePolylines(lines, options) {
          options = Object.assign({}, {
            depth: 2,
            lineWidth: 1
          }, options);
          var results = lines.map(function (line) {
            var result = expandLine(line, options);
            result.line = line;
            generateTopAndBottom(result, options);
            generateSides(result, options);
            result.position = new Float32Array(result.points);
            result.indices = new Uint32Array(result.index);
            result.uv = new Float32Array(result.uvs);
            result.normal = generateNormal(result.indices, result.position);
            return result;
          });
          var result = merge(results);
          result.lines = lines;
          return result;
        }

        function generateTopAndBottom(result, options) {
          var z = options.depth;
          var points = [],
              index = [],
              uvs = [];
          var leftPoints = result.leftPoints,
              rightPoints = result.rightPoints;
          var i = 0,
              len = leftPoints.length;

          while (i < len) {
            // top left
            var idx0 = i * 3;
            var _leftPoints$i = leftPoints[i],
                x1 = _leftPoints$i[0],
                y1 = _leftPoints$i[1],
                z1 = _leftPoints$i[2];
            points[idx0] = x1;
            points[idx0 + 1] = y1;
            points[idx0 + 2] = z + z1; // top right

            var _rightPoints$i = rightPoints[i],
                x2 = _rightPoints$i[0],
                y2 = _rightPoints$i[1],
                z2 = _rightPoints$i[2];
            var idx1 = len * 3 + idx0;
            points[idx1] = x2;
            points[idx1 + 1] = y2;
            points[idx1 + 2] = z + z2; // bottom left

            var idx2 = len * 2 * 3 + idx0;
            points[idx2] = x1;
            points[idx2 + 1] = y1;
            points[idx2 + 2] = z1; // bottom right

            var idx3 = len * 2 * 3 + len * 3 + idx0;
            points[idx3] = x2;
            points[idx3 + 1] = y2;
            points[idx3 + 2] = z2;
            i++;
          }

          i = 0;
          len = points.length;

          while (i < len) {
            var x = points[i],
                y = points[i + 1];
            uvs.push(x, y);
            i += 3;
          }

          i = 0;
          len = leftPoints.length;

          while (i < len - 1) {
            // top
            // left1 left2 right1,right2
            var a1 = i,
                b1 = i + 1,
                c1 = a1 + len,
                d1 = b1 + len;
            index.push(a1, c1, b1);
            index.push(c1, d1, b1); // bottom
            // left1 left2 right1,right2

            var len2 = len * 2;
            var a2 = i + len2,
                b2 = a2 + 1,
                c2 = a2 + len,
                d2 = b2 + len;
            index.push(a2, c2, b2);
            index.push(c2, d2, b2);
            i++;
          }

          result.index = index;
          result.points = points;
          result.uvs = uvs;
        }

        function generateSides(result, options) {
          var points = result.points,
              index = result.index,
              leftPoints = result.leftPoints,
              rightPoints = result.rightPoints,
              uvs = result.uvs;
          var z = options.depth;
          var rings = [leftPoints, rightPoints];

          function addOneSideIndex(v1, v2) {
            var idx = points.length / 3;
            points.push(v1[0], v1[1], z + v1[2], v2[0], v2[1], z + v2[2], v1[0], v1[1], v1[2], v2[0], v2[1], v2[2]);
            var a = idx + 2,
                b = idx + 3,
                c = idx,
                d = idx + 1;
            index.push(a, c, b, c, d, b);
            generateSideWallUV(uvs, points, a, b, c, d);
          }

          for (var i = 0, _len = rings.length; i < _len; i++) {
            var ring = rings[i];

            if (i > 0) {
              ring = ring.map(function (p) {
                return p;
              });
              ring = ring.reverse();
            }

            var j = 0;
            var len1 = ring.length - 1;

            while (j < len1) {
              var v1 = ring[j];
              var v2 = ring[j + 1];
              addOneSideIndex(v1, v2);
              j++;
            }
          }

          var len = leftPoints.length;
          var vs = [rightPoints[0], leftPoints[0], leftPoints[len - 1], rightPoints[len - 1]];

          for (var _i = 0; _i < vs.length; _i += 2) {
            var _v = vs[_i],
                _v2 = vs[_i + 1];
            addOneSideIndex(_v, _v2);
          }
        }

        var TEMPV1 = {
          x: 0,
          y: 0
        },
            TEMPV2 = {
          x: 0,
          y: 0
        };
        function expandLine(line, options) {
          // let preAngle = 0;
          var radius = options.lineWidth / 2;
          var points = [],
              leftPoints = [],
              rightPoints = [];
          var len = line.length;
          var i = 0;

          while (i < len) {
            var p1 = line[i],
                p2 = line[i + 1];
            var currentp = line[i]; // last vertex

            if (i === len - 1) {
              p1 = line[len - 2];
              p2 = line[len - 1];
            }

            var dy = p2[1] - p1[1],
                dx = p2[0] - p1[0];
            var rAngle = 0;
            var rad = Math.atan(dy / dx);
            var angle = radToDeg(rad); // preAngle = angle;

            if (i === 0 || i === len - 1) {
              rAngle = angle;
              rAngle -= 90;
            } else {
              // 至少3个顶点才会触发
              var p0 = line[i - 1];
              TEMPV1.x = p0[0] - p1[0];
              TEMPV1.y = p0[1] - p1[1];
              TEMPV2.x = p2[0] - p1[0];
              TEMPV2.y = p2[1] - p1[1];
              var vAngle = getAngle(TEMPV1, TEMPV2);
              rAngle = angle - vAngle / 2;
            }

            var rRad = degToRad(rAngle);
            var p3 = currentp;
            var x = Math.cos(rRad) + p3[0],
                y = Math.sin(rRad) + p3[1];
            var p4 = [x, y];

            var _translateLine = translateLine(p1, p2, radius),
                line1 = _translateLine[0],
                line2 = _translateLine[1];

            var op1 = lineIntersection(line1[0], line1[1], p3, p4);
            var op2 = lineIntersection(line2[0], line2[1], p3, p4); // 平行，回头路

            if (!op1 || !op2) {
              var len1 = points.length;
              var point1 = points[len1 - 2];
              var point2 = points[len1 - 1];

              if (!point1 || !point2) {
                continue;
              }

              op1 = [point1[0], point1[1]];
              op2 = [point2[0], point2[1]];
            }

            op1[2] = currentp[2] || 0;
            op2[2] = currentp[2] || 0; // const [op1, op2] = calOffsetPoint(rRad, radius, p1);

            points.push(op1, op2);

            if (leftOnLine(op1, p1, p2)) {
              leftPoints.push(op1);
              rightPoints.push(op2);
            } else {
              leftPoints.push(op2);
              rightPoints.push(op1);
            }

            i++;
          }

          return {
            offsetPoints: points,
            leftPoints: leftPoints,
            rightPoints: rightPoints
          };
        } // eslint-disable-next-line no-unused-vars

        var getAngle = function getAngle(_ref, _ref2) {
          var x1 = _ref.x,
              y1 = _ref.y;
          var x2 = _ref2.x,
              y2 = _ref2.y;
          var dot = x1 * x2 + y1 * y2;
          var det = x1 * y2 - y1 * x2;
          var angle = Math.atan2(det, dot) / Math.PI * 180;
          return (angle + 360) % 360;
        };

        function leftOnLine(p, p1, p2) {
          var x1 = p1[0],
              y1 = p1[1];
          var x2 = p2[0],
              y2 = p2[1];
          var x = p[0],
              y = p[1];
          return (y1 - y2) * x + (x2 - x1) * y + x1 * y2 - x2 * y1 > 0;
        }
        /**
         * 平移线
         * @param {*} p1
         * @param {*} p2
         * @param {*} distance
         * @returns
         */


        function translateLine(p1, p2, distance) {
          var dy = p2[1] - p1[1],
              dx = p2[0] - p1[0];
          var rad = Math.atan2(dy, dx);
          var rad1 = rad + Math.PI / 2;
          var offsetX = Math.cos(rad1) * distance,
              offsetY = Math.sin(rad1) * distance;
          var tp1 = [p1[0] + offsetX, p1[1] + offsetY];
          var tp2 = [p2[0] + offsetX, p2[1] + offsetY];
          var rad2 = rad - Math.PI / 2;
          offsetX = Math.cos(rad2) * distance;
          offsetY = Math.sin(rad2) * distance;
          var tp3 = [p1[0] + offsetX, p1[1] + offsetY];
          var tp4 = [p2[0] + offsetX, p2[1] + offsetY];
          return [[tp1, tp2], [tp3, tp4]];
        }
        /**
         * 直线交点
         * @param {*} p1
         * @param {*} p2
         * @param {*} p3
         * @param {*} p4
         * @returns
         */


        function lineIntersection(p1, p2, p3, p4) {
          var dx1 = p2[0] - p1[0],
              dy1 = p2[1] - p1[1];
          var dx2 = p4[0] - p3[0],
              dy2 = p4[1] - p3[1];

          if (dx1 === 0 && dx2 === 0) {
            return null;
          }

          if (dy1 === 0 && dy2 === 0) {
            return null;
          }

          var k1 = dy1 / dx1;
          var k2 = dy2 / dx2;
          var b1 = p1[1] - k1 * p1[0];
          var b2 = p3[1] - k2 * p3[0];
          var x, y;

          if (dx1 === 0) {
            x = p1[0];
            y = k2 * x + b2;
          } else if (dx2 === 0) {
            x = p3[0];
            y = k1 * x + b1;
          } else if (dy1 === 0) {
            y = p1[1];
            x = (y - b2) / k2;
          } else if (dy2 === 0) {
            y = p3[1];
            x = (y - b1) / k1;
          } else {
            x = (b2 - b1) / (k1 - k2);
            y = k1 * x + b1;
          }

          return [x, y];
        }

        function cylinder(point, options) {
          if (options === void 0) {
            options = {};
          }

          options = Object.assign({}, {
            radius: 1,
            height: 2,
            radialSegments: 6
          }, options);
          var radialSegments = Math.round(Math.max(4, options.radialSegments));
          var _options = options,
              radius = _options.radius,
              height = _options.height;
          var aRad = 360 / radialSegments / 360 * Math.PI * 2;
          var circlePointsLen = radialSegments + 1;
          var points = new Float32Array(circlePointsLen * 3 * 2);
          var centerx = point[0],
              centery = point[1];
          var idx = 0,
              uIdx = 0;
          var offset = circlePointsLen * 3,
              uOffset = circlePointsLen * 2;
          var indices = [],
              uvs = [];

          for (var i = -1; i < radialSegments; i++) {
            var rad = aRad * i;
            var x = Math.cos(rad) * radius + centerx,
                y = Math.sin(rad) * radius + centery; // bottom vertices

            points[idx] = x;
            points[idx + 1] = y;
            points[idx + 2] = 0; // top vertices

            points[idx + offset] = x;
            points[idx + 1 + offset] = y;
            points[idx + 2 + offset] = height;
            var u = 0,
                v = 0;
            u = 0.5 + x / radius / 2;
            v = 0.5 + y / radius / 2;
            uvs[uIdx] = u;
            uvs[uIdx + 1] = v;
            uvs[uIdx + uOffset] = u;
            uvs[uIdx + 1 + uOffset] = v;
            idx += 3;
            uIdx += 2;

            if (i > 1) {
              // bottom indices
              indices.push(0, i - 1, i);
            }
          }

          idx -= 3;
          points[idx] = points[0];
          points[idx + 1] = points[1];
          points[idx + 2] = points[2];
          var pointsLen = points.length;
          points[pointsLen - 3] = points[0];
          points[pointsLen - 2] = points[1];
          points[pointsLen - 1] = height;
          var indicesLen = indices.length; // top indices

          for (var _i = 0; _i < indicesLen; _i++) {
            var index = indices[_i];
            indices.push(index + circlePointsLen);
          }

          var sidePoints = new Float32Array((circlePointsLen * 3 * 2 - 6) * 2);
          var pIndex = -1;
          idx = circlePointsLen * 2;
          uIdx = 0;

          for (var _i2 = 0, len = points.length / 2; _i2 < len - 3; _i2 += 3) {
            var x1 = points[_i2],
                y1 = points[_i2 + 1],
                x2 = points[_i2 + 3],
                y2 = points[_i2 + 4];
            sidePoints[++pIndex] = x1;
            sidePoints[++pIndex] = y1;
            sidePoints[++pIndex] = height;
            sidePoints[++pIndex] = x2;
            sidePoints[++pIndex] = y2;
            sidePoints[++pIndex] = height;
            sidePoints[++pIndex] = x1;
            sidePoints[++pIndex] = y1;
            sidePoints[++pIndex] = 0;
            sidePoints[++pIndex] = x2;
            sidePoints[++pIndex] = y2;
            sidePoints[++pIndex] = 0;
            var a = idx + 2,
                b = idx + 3,
                c = idx,
                d = idx + 1; // indices.push(a, c, b, c, d, b);

            indices.push(c, a, d, a, b, d);
            idx += 4;
            var u1 = uIdx / circlePointsLen,
                u2 = (uIdx + 1) / circlePointsLen;
            uvs.push(u1, height / radius / 2, u2, height / radius / 2, u1, 0, u2, 0);
            uIdx++;
          }

          var position = new Float32Array(points.length + sidePoints.length);
          position.set(points, 0);
          position.set(sidePoints, points.length);
          var normal = generateNormal(indices, position);
          return {
            points: points,
            indices: new Uint32Array(indices),
            position: position,
            normal: normal,
            uv: new Float32Array(uvs)
          };
        }

        // import * as MathUtils from './MathUtils.js';
        // code copy from https://github.com/mrdoob/three.js/blob/dev/src/math/Vector3.js
        var Vector3 = /*#__PURE__*/function () {
          function Vector3(x, y, z) {
            if (x === void 0) {
              x = 0;
            }

            if (y === void 0) {
              y = 0;
            }

            if (z === void 0) {
              z = 0;
            }

            this.x = x;
            this.y = y;
            this.z = z;
          }

          var _proto = Vector3.prototype;

          _proto.set = function set(x, y, z) {
            if (z === undefined) z = this.z; // sprite.scale.set(x,y)

            this.x = x;
            this.y = y;
            this.z = z;
            return this;
          } // setScalar(scalar) {
          //     this.x = scalar;
          //     this.y = scalar;
          //     this.z = scalar;
          //     return this;
          // }
          // setX(x) {
          //     this.x = x;
          //     return this;
          // }
          // setY(y) {
          //     this.y = y;
          //     return this;
          // }
          // setZ(z) {
          //     this.z = z;
          //     return this;
          // }
          // setComponent(index, value) {
          //     switch (index) {
          //         case 0: this.x = value; break;
          //         case 1: this.y = value; break;
          //         case 2: this.z = value; break;
          //         default: throw new Error('index is out of range: ' + index);
          //     }
          //     return this;
          // }
          // getComponent(index) {
          //     switch (index) {
          //         case 0: return this.x;
          //         case 1: return this.y;
          //         case 2: return this.z;
          //         default: throw new Error('index is out of range: ' + index);
          //     }
          // }
          ;

          _proto.clone = function clone() {
            return new this.constructor(this.x, this.y, this.z);
          };

          _proto.copy = function copy(v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
          };

          _proto.add = function add(v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
          };

          _proto.addScalar = function addScalar(s) {
            this.x += s;
            this.y += s;
            this.z += s;
            return this;
          };

          _proto.addVectors = function addVectors(a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            return this;
          };

          _proto.addScaledVector = function addScaledVector(v, s) {
            this.x += v.x * s;
            this.y += v.y * s;
            this.z += v.z * s;
            return this;
          };

          _proto.sub = function sub(v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
          };

          _proto.subScalar = function subScalar(s) {
            this.x -= s;
            this.y -= s;
            this.z -= s;
            return this;
          };

          _proto.subVectors = function subVectors(a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            return this;
          };

          _proto.multiply = function multiply(v) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            return this;
          };

          _proto.multiplyScalar = function multiplyScalar(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            return this;
          };

          _proto.multiplyVectors = function multiplyVectors(a, b) {
            this.x = a.x * b.x;
            this.y = a.y * b.y;
            this.z = a.z * b.z;
            return this;
          } // applyEuler(euler) {
          //     return this.applyQuaternion(_quaternion.setFromEuler(euler));
          // }
          // applyAxisAngle(axis, angle) {
          //     return this.applyQuaternion(_quaternion.setFromAxisAngle(axis, angle));
          // }
          // applyMatrix3(m) {
          //     const x = this.x, y = this.y, z = this.z;
          //     const e = m.elements;
          //     this.x = e[0] * x + e[3] * y + e[6] * z;
          //     this.y = e[1] * x + e[4] * y + e[7] * z;
          //     this.z = e[2] * x + e[5] * y + e[8] * z;
          //     return this;
          // }
          // applyNormalMatrix(m) {
          //     return this.applyMatrix3(m).normalize();
          // }
          ;

          _proto.applyMatrix4 = function applyMatrix4(m) {
            var x = this.x,
                y = this.y,
                z = this.z;
            var e = m.elements;
            var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
            this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
            this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
            this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
            return this;
          } // applyQuaternion(q) {
          //     const x = this.x, y = this.y, z = this.z;
          //     const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
          //     // calculate quat * vector
          //     const ix = qw * x + qy * z - qz * y;
          //     const iy = qw * y + qz * x - qx * z;
          //     const iz = qw * z + qx * y - qy * x;
          //     const iw = - qx * x - qy * y - qz * z;
          //     // calculate result * inverse quat
          //     this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
          //     this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
          //     this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;
          //     return this;
          // }
          // project(camera) {
          //     return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
          // }
          // unproject(camera) {
          //     return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
          // }
          // transformDirection(m) {
          //     // input: THREE.Matrix4 affine matrix
          //     // vector interpreted as a direction
          //     const x = this.x, y = this.y, z = this.z;
          //     const e = m.elements;
          //     this.x = e[0] * x + e[4] * y + e[8] * z;
          //     this.y = e[1] * x + e[5] * y + e[9] * z;
          //     this.z = e[2] * x + e[6] * y + e[10] * z;
          //     return this.normalize();
          // }
          ;

          _proto.divide = function divide(v) {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;
            return this;
          };

          _proto.divideScalar = function divideScalar(scalar) {
            return this.multiplyScalar(1 / scalar);
          };

          _proto.min = function min(v) {
            this.x = Math.min(this.x, v.x);
            this.y = Math.min(this.y, v.y);
            this.z = Math.min(this.z, v.z);
            return this;
          };

          _proto.max = function max(v) {
            this.x = Math.max(this.x, v.x);
            this.y = Math.max(this.y, v.y);
            this.z = Math.max(this.z, v.z);
            return this;
          };

          _proto.clamp = function clamp(min, max) {
            // assumes min < max, componentwise
            this.x = Math.max(min.x, Math.min(max.x, this.x));
            this.y = Math.max(min.y, Math.min(max.y, this.y));
            this.z = Math.max(min.z, Math.min(max.z, this.z));
            return this;
          };

          _proto.clampScalar = function clampScalar(minVal, maxVal) {
            this.x = Math.max(minVal, Math.min(maxVal, this.x));
            this.y = Math.max(minVal, Math.min(maxVal, this.y));
            this.z = Math.max(minVal, Math.min(maxVal, this.z));
            return this;
          };

          _proto.clampLength = function clampLength(min, max) {
            var length = this.length();
            return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
          } // floor() {
          //     this.x = Math.floor(this.x);
          //     this.y = Math.floor(this.y);
          //     this.z = Math.floor(this.z);
          //     return this;
          // }
          // ceil() {
          //     this.x = Math.ceil(this.x);
          //     this.y = Math.ceil(this.y);
          //     this.z = Math.ceil(this.z);
          //     return this;
          // }
          // round() {
          //     this.x = Math.round(this.x);
          //     this.y = Math.round(this.y);
          //     this.z = Math.round(this.z);
          //     return this;
          // }
          // roundToZero() {
          //     this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
          //     this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
          //     this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
          //     return this;
          // }
          // negate() {
          //     this.x = -this.x;
          //     this.y = -this.y;
          //     this.z = -this.z;
          //     return this;
          // }
          ;

          _proto.dot = function dot(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
          } // TODO lengthSquared?
          ;

          _proto.lengthSq = function lengthSq() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
          };

          _proto.length = function length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
          } // manhattanLength() {
          //     return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
          // }
          ;

          _proto.normalize = function normalize() {
            return this.divideScalar(this.length() || 1);
          };

          _proto.setLength = function setLength(length) {
            return this.normalize().multiplyScalar(length);
          };

          _proto.lerp = function lerp(v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;
            return this;
          };

          _proto.lerpVectors = function lerpVectors(v1, v2, alpha) {
            this.x = v1.x + (v2.x - v1.x) * alpha;
            this.y = v1.y + (v2.y - v1.y) * alpha;
            this.z = v1.z + (v2.z - v1.z) * alpha;
            return this;
          };

          _proto.cross = function cross(v) {
            return this.crossVectors(this, v);
          };

          _proto.crossVectors = function crossVectors(a, b) {
            var ax = a.x,
                ay = a.y,
                az = a.z;
            var bx = b.x,
                by = b.y,
                bz = b.z;
            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;
            return this;
          } // projectOnVector(v) {
          //     const denominator = v.lengthSq();
          //     if (denominator === 0) return this.set(0, 0, 0);
          //     const scalar = v.dot(this) / denominator;
          //     return this.copy(v).multiplyScalar(scalar);
          // }
          // projectOnPlane(planeNormal) {
          //     _vector.copy(this).projectOnVector(planeNormal);
          //     return this.sub(_vector);
          // }
          // reflect(normal) {
          //     // reflect incident vector off plane orthogonal to normal
          //     // normal is assumed to have unit length
          //     return this.sub(_vector.copy(normal).multiplyScalar(2 * this.dot(normal)));
          // }
          // angleTo(v) {
          //     const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
          //     if (denominator === 0) return Math.PI / 2;
          //     const theta = this.dot(v) / denominator;
          //     // clamp, to handle numerical problems
          //     return Math.acos(MathUtils.clamp(theta, -1, 1));
          // }
          ;

          _proto.distanceTo = function distanceTo(v) {
            return Math.sqrt(this.distanceToSquared(v));
          } // distanceToSquared(v) {
          //     const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
          //     return dx * dx + dy * dy + dz * dz;
          // }
          // manhattanDistanceTo(v) {
          //     return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
          // }
          // setFromSpherical(s) {
          //     return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
          // }
          // setFromSphericalCoords(radius, phi, theta) {
          //     const sinPhiRadius = Math.sin(phi) * radius;
          //     this.x = sinPhiRadius * Math.sin(theta);
          //     this.y = Math.cos(phi) * radius;
          //     this.z = sinPhiRadius * Math.cos(theta);
          //     return this;
          // }
          // setFromCylindrical(c) {
          //     return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
          // }
          // setFromCylindricalCoords(radius, theta, y) {
          //     this.x = radius * Math.sin(theta);
          //     this.y = y;
          //     this.z = radius * Math.cos(theta);
          //     return this;
          // }
          // setFromMatrixPosition(m) {
          //     const e = m.elements;
          //     this.x = e[12];
          //     this.y = e[13];
          //     this.z = e[14];
          //     return this;
          // }
          // setFromMatrixScale(m) {
          //     const sx = this.setFromMatrixColumn(m, 0).length();
          //     const sy = this.setFromMatrixColumn(m, 1).length();
          //     const sz = this.setFromMatrixColumn(m, 2).length();
          //     this.x = sx;
          //     this.y = sy;
          //     this.z = sz;
          //     return this;
          // }
          // setFromMatrixColumn(m, index) {
          //     return this.fromArray(m.elements, index * 4);
          // }
          // setFromMatrix3Column(m, index) {
          //     return this.fromArray(m.elements, index * 3);
          // }
          // setFromEuler(e) {
          //     this.x = e._x;
          //     this.y = e._y;
          //     this.z = e._z;
          //     return this;
          // }
          // setFromColor(c) {
          //     this.x = c.r;
          //     this.y = c.g;
          //     this.z = c.b;
          //     return this;
          // }
          ;

          _proto.equals = function equals(v) {
            return v.x === this.x && v.y === this.y && v.z === this.z;
          };

          _proto.fromArray = function fromArray(array, offset) {
            if (offset === void 0) {
              offset = 0;
            }

            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];
            return this;
          } // toArray(array = [], offset = 0) {
          //     array[offset] = this.x;
          //     array[offset + 1] = this.y;
          //     array[offset + 2] = this.z;
          //     return array;
          // }
          // fromBufferAttribute(attribute, index) {
          //     this.x = attribute.getX(index);
          //     this.y = attribute.getY(index);
          //     this.z = attribute.getZ(index);
          //     return this;
          // }
          ;

          _proto.random = function random() {
            this.x = Math.random();
            this.y = Math.random();
            this.z = Math.random();
            return this;
          } // randomDirection() {
          //     // Derived from https://mathworld.wolfram.com/SpherePointPicking.html
          //     const u = (Math.random() - 0.5) * 2;
          //     const t = Math.random() * Math.PI * 2;
          //     const f = Math.sqrt(1 - u ** 2);
          //     this.x = f * Math.cos(t);
          //     this.y = f * Math.sin(t);
          //     this.z = u;
          //     return this;
          // }
          ;

          return Vector3;
        }();

        /* eslint-disable no-tabs */
        /**
         * PathPoint
         */

        var PathPoint = /*#__PURE__*/function () {
          function PathPoint() {
            this.pos = new Vector3();
            this.dir = new Vector3();
            this.right = new Vector3();
            this.up = new Vector3(); // normal

            this.dist = 0; // distance from start

            this.widthScale = 1; // for corner

            this.sharp = false; // marks as sharp corner
          }

          var _proto = PathPoint.prototype;

          _proto.lerpPathPoints = function lerpPathPoints(p1, p2, alpha) {
            this.pos.lerpVectors(p1.pos, p2.pos, alpha);
            this.dir.lerpVectors(p1.dir, p2.dir, alpha);
            this.up.lerpVectors(p1.up, p2.up, alpha);
            this.right.lerpVectors(p1.right, p2.right, alpha);
            this.dist = (p2.dist - p1.dist) * alpha + p1.dist;
            this.widthScale = (p2.widthScale - p1.widthScale) * alpha + p1.widthScale;
          };

          _proto.copy = function copy(source) {
            this.pos.copy(source.pos);
            this.dir.copy(source.dir);
            this.up.copy(source.up);
            this.right.copy(source.right);
            this.dist = source.dist;
            this.widthScale = source.widthScale;
          };

          return PathPoint;
        }();

        // code copy from https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js
        // import { WebGLCoordinateSystem, WebGPUCoordinateSystem } from '../constants.js';
        // import { Vector3 } from './Vector3.js';
        var Matrix4 = /*#__PURE__*/function () {
          function Matrix4(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
            this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

            if (n11 !== undefined) {
              this.set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44);
            }
          }

          var _proto = Matrix4.prototype;

          _proto.set = function set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
            var te = this.elements;
            te[0] = n11;
            te[4] = n12;
            te[8] = n13;
            te[12] = n14;
            te[1] = n21;
            te[5] = n22;
            te[9] = n23;
            te[13] = n24;
            te[2] = n31;
            te[6] = n32;
            te[10] = n33;
            te[14] = n34;
            te[3] = n41;
            te[7] = n42;
            te[11] = n43;
            te[15] = n44;
            return this;
          } // identity() {
          //     this.set(
          //         1, 0, 0, 0,
          //         0, 1, 0, 0,
          //         0, 0, 1, 0,
          //         0, 0, 0, 1
          //     );
          //     return this;
          // }
          // clone() {
          //     return new Matrix4().fromArray(this.elements);
          // }
          // copy(m) {
          //     const te = this.elements;
          //     const me = m.elements;
          //     te[0] = me[0]; te[1] = me[1]; te[2] = me[2]; te[3] = me[3];
          //     te[4] = me[4]; te[5] = me[5]; te[6] = me[6]; te[7] = me[7];
          //     te[8] = me[8]; te[9] = me[9]; te[10] = me[10]; te[11] = me[11];
          //     te[12] = me[12]; te[13] = me[13]; te[14] = me[14]; te[15] = me[15];
          //     return this;
          // }
          // copyPosition(m) {
          //     const te = this.elements, me = m.elements;
          //     te[12] = me[12];
          //     te[13] = me[13];
          //     te[14] = me[14];
          //     return this;
          // }
          // setFromMatrix3(m) {
          //     const me = m.elements;
          //     this.set(
          //         me[0], me[3], me[6], 0,
          //         me[1], me[4], me[7], 0,
          //         me[2], me[5], me[8], 0,
          //         0, 0, 0, 1
          //     );
          //     return this;
          // }
          // extractBasis(xAxis, yAxis, zAxis) {
          //     xAxis.setFromMatrixColumn(this, 0);
          //     yAxis.setFromMatrixColumn(this, 1);
          //     zAxis.setFromMatrixColumn(this, 2);
          //     return this;
          // }
          // makeBasis(xAxis, yAxis, zAxis) {
          //     this.set(
          //         xAxis.x, yAxis.x, zAxis.x, 0,
          //         xAxis.y, yAxis.y, zAxis.y, 0,
          //         xAxis.z, yAxis.z, zAxis.z, 0,
          //         0, 0, 0, 1
          //     );
          //     return this;
          // }
          // extractRotation(m) {
          //     // this method does not support reflection matrices
          //     const te = this.elements;
          //     const me = m.elements;
          //     const scaleX = 1 / _v1.setFromMatrixColumn(m, 0).length();
          //     const scaleY = 1 / _v1.setFromMatrixColumn(m, 1).length();
          //     const scaleZ = 1 / _v1.setFromMatrixColumn(m, 2).length();
          //     te[0] = me[0] * scaleX;
          //     te[1] = me[1] * scaleX;
          //     te[2] = me[2] * scaleX;
          //     te[3] = 0;
          //     te[4] = me[4] * scaleY;
          //     te[5] = me[5] * scaleY;
          //     te[6] = me[6] * scaleY;
          //     te[7] = 0;
          //     te[8] = me[8] * scaleZ;
          //     te[9] = me[9] * scaleZ;
          //     te[10] = me[10] * scaleZ;
          //     te[11] = 0;
          //     te[12] = 0;
          //     te[13] = 0;
          //     te[14] = 0;
          //     te[15] = 1;
          //     return this;
          // }
          // makeRotationFromEuler(euler) {
          //     const te = this.elements;
          //     const x = euler.x, y = euler.y, z = euler.z;
          //     const a = Math.cos(x), b = Math.sin(x);
          //     const c = Math.cos(y), d = Math.sin(y);
          //     const e = Math.cos(z), f = Math.sin(z);
          //     if (euler.order === 'XYZ') {
          //         const ae = a * e, af = a * f, be = b * e, bf = b * f;
          //         te[0] = c * e;
          //         te[4] = -c * f;
          //         te[8] = d;
          //         te[1] = af + be * d;
          //         te[5] = ae - bf * d;
          //         te[9] = -b * c;
          //         te[2] = bf - ae * d;
          //         te[6] = be + af * d;
          //         te[10] = a * c;
          //     } else if (euler.order === 'YXZ') {
          //         const ce = c * e, cf = c * f, de = d * e, df = d * f;
          //         te[0] = ce + df * b;
          //         te[4] = de * b - cf;
          //         te[8] = a * d;
          //         te[1] = a * f;
          //         te[5] = a * e;
          //         te[9] = -b;
          //         te[2] = cf * b - de;
          //         te[6] = df + ce * b;
          //         te[10] = a * c;
          //     } else if (euler.order === 'ZXY') {
          //         const ce = c * e, cf = c * f, de = d * e, df = d * f;
          //         te[0] = ce - df * b;
          //         te[4] = -a * f;
          //         te[8] = de + cf * b;
          //         te[1] = cf + de * b;
          //         te[5] = a * e;
          //         te[9] = df - ce * b;
          //         te[2] = -a * d;
          //         te[6] = b;
          //         te[10] = a * c;
          //     } else if (euler.order === 'ZYX') {
          //         const ae = a * e, af = a * f, be = b * e, bf = b * f;
          //         te[0] = c * e;
          //         te[4] = be * d - af;
          //         te[8] = ae * d + bf;
          //         te[1] = c * f;
          //         te[5] = bf * d + ae;
          //         te[9] = af * d - be;
          //         te[2] = -d;
          //         te[6] = b * c;
          //         te[10] = a * c;
          //     } else if (euler.order === 'YZX') {
          //         const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
          //         te[0] = c * e;
          //         te[4] = bd - ac * f;
          //         te[8] = bc * f + ad;
          //         te[1] = f;
          //         te[5] = a * e;
          //         te[9] = -b * e;
          //         te[2] = -d * e;
          //         te[6] = ad * f + bc;
          //         te[10] = ac - bd * f;
          //     } else if (euler.order === 'XZY') {
          //         const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
          //         te[0] = c * e;
          //         te[4] = -f;
          //         te[8] = d * e;
          //         te[1] = ac * f + bd;
          //         te[5] = a * e;
          //         te[9] = ad * f - bc;
          //         te[2] = bc * f - ad;
          //         te[6] = b * e;
          //         te[10] = bd * f + ac;
          //     }
          //     // bottom row
          //     te[3] = 0;
          //     te[7] = 0;
          //     te[11] = 0;
          //     // last column
          //     te[12] = 0;
          //     te[13] = 0;
          //     te[14] = 0;
          //     te[15] = 1;
          //     return this;
          // }
          // makeRotationFromQuaternion(q) {
          //     return this.compose(_zero, q, _one);
          // }
          // lookAt(eye, target, up) {
          //     const te = this.elements;
          //     _z.subVectors(eye, target);
          //     if (_z.lengthSq() === 0) {
          //         // eye and target are in the same position
          //         _z.z = 1;
          //     }
          //     _z.normalize();
          //     _x.crossVectors(up, _z);
          //     if (_x.lengthSq() === 0) {
          //         // up and z are parallel
          //         if (Math.abs(up.z) === 1) {
          //             _z.x += 0.0001;
          //         } else {
          //             _z.z += 0.0001;
          //         }
          //         _z.normalize();
          //         _x.crossVectors(up, _z);
          //     }
          //     _x.normalize();
          //     _y.crossVectors(_z, _x);
          //     te[0] = _x.x; te[4] = _y.x; te[8] = _z.x;
          //     te[1] = _x.y; te[5] = _y.y; te[9] = _z.y;
          //     te[2] = _x.z; te[6] = _y.z; te[10] = _z.z;
          //     return this;
          // }
          ;

          _proto.multiply = function multiply(m) {
            return this.multiplyMatrices(this, m);
          } // premultiply(m) {
          //     return this.multiplyMatrices(m, this);
          // }
          // multiplyMatrices(a, b) {
          //     const ae = a.elements;
          //     const be = b.elements;
          //     const te = this.elements;
          //     const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
          //     const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
          //     const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
          //     const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];
          //     const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
          //     const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
          //     const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
          //     const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
          //     te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
          //     te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
          //     te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
          //     te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
          //     te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
          //     te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
          //     te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
          //     te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
          //     te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
          //     te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
          //     te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
          //     te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
          //     te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
          //     te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
          //     te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
          //     te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
          //     return this;
          // }
          // multiplyScalar(s) {
          //     const te = this.elements;
          //     te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
          //     te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
          //     te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
          //     te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;
          //     return this;
          // }
          // determinant() {
          //     const te = this.elements;
          //     const n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
          //     const n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
          //     const n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
          //     const n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
          //     //TODO: make this more efficient
          //     //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )
          //     return (
          //         n41 * (
          //             + n14 * n23 * n32
          //             - n13 * n24 * n32
          //             - n14 * n22 * n33
          //             + n12 * n24 * n33
          //             + n13 * n22 * n34
          //             - n12 * n23 * n34
          //         ) +
          //         n42 * (
          //             + n11 * n23 * n34
          //             - n11 * n24 * n33
          //             + n14 * n21 * n33
          //             - n13 * n21 * n34
          //             + n13 * n24 * n31
          //             - n14 * n23 * n31
          //         ) +
          //         n43 * (
          //             + n11 * n24 * n32
          //             - n11 * n22 * n34
          //             - n14 * n21 * n32
          //             + n12 * n21 * n34
          //             + n14 * n22 * n31
          //             - n12 * n24 * n31
          //         ) +
          //         n44 * (
          //             - n13 * n22 * n31
          //             - n11 * n23 * n32
          //             + n11 * n22 * n33
          //             + n13 * n21 * n32
          //             - n12 * n21 * n33
          //             + n12 * n23 * n31
          //         )
          //     );
          // }
          // transpose() {
          //     const te = this.elements;
          //     let tmp;
          //     tmp = te[1]; te[1] = te[4]; te[4] = tmp;
          //     tmp = te[2]; te[2] = te[8]; te[8] = tmp;
          //     tmp = te[6]; te[6] = te[9]; te[9] = tmp;
          //     tmp = te[3]; te[3] = te[12]; te[12] = tmp;
          //     tmp = te[7]; te[7] = te[13]; te[13] = tmp;
          //     tmp = te[11]; te[11] = te[14]; te[14] = tmp;
          //     return this;
          // }
          // setPosition(x, y, z) {
          //     const te = this.elements;
          //     if (x.isVector3) {
          //         te[12] = x.x;
          //         te[13] = x.y;
          //         te[14] = x.z;
          //     } else {
          //         te[12] = x;
          //         te[13] = y;
          //         te[14] = z;
          //     }
          //     return this;
          // }
          // invert() {
          //     // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
          //     const te = this.elements,
          //         n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3],
          //         n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7],
          //         n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11],
          //         n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15],
          //         t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
          //         t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
          //         t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
          //         t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
          //     const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
          //     if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
          //     const detInv = 1 / det;
          //     te[0] = t11 * detInv;
          //     te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
          //     te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
          //     te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
          //     te[4] = t12 * detInv;
          //     te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
          //     te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
          //     te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
          //     te[8] = t13 * detInv;
          //     te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
          //     te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
          //     te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
          //     te[12] = t14 * detInv;
          //     te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
          //     te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
          //     te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
          //     return this;
          // }
          // scale(v) {
          //     const te = this.elements;
          //     const x = v.x, y = v.y, z = v.z;
          //     te[0] *= x; te[4] *= y; te[8] *= z;
          //     te[1] *= x; te[5] *= y; te[9] *= z;
          //     te[2] *= x; te[6] *= y; te[10] *= z;
          //     te[3] *= x; te[7] *= y; te[11] *= z;
          //     return this;
          // }
          // getMaxScaleOnAxis() {
          //     const te = this.elements;
          //     const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
          //     const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
          //     const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
          //     return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
          // }
          // makeTranslation(x, y, z) {
          //     if (x.isVector3) {
          //         this.set(
          //             1, 0, 0, x.x,
          //             0, 1, 0, x.y,
          //             0, 0, 1, x.z,
          //             0, 0, 0, 1
          //         );
          //     } else {
          //         this.set(
          //             1, 0, 0, x,
          //             0, 1, 0, y,
          //             0, 0, 1, z,
          //             0, 0, 0, 1
          //         );
          //     }
          //     return this;
          // }
          // makeRotationX(theta) {
          //     const c = Math.cos(theta), s = Math.sin(theta);
          //     this.set(
          //         1, 0, 0, 0,
          //         0, c, -s, 0,
          //         0, s, c, 0,
          //         0, 0, 0, 1
          //     );
          //     return this;
          // }
          // makeRotationY(theta) {
          //     const c = Math.cos(theta), s = Math.sin(theta);
          //     this.set(
          //         c, 0, s, 0,
          //         0, 1, 0, 0,
          //         -s, 0, c, 0,
          //         0, 0, 0, 1
          //     );
          //     return this;
          // }
          // makeRotationZ(theta) {
          //     const c = Math.cos(theta), s = Math.sin(theta);
          //     this.set(
          //         c, -s, 0, 0,
          //         s, c, 0, 0,
          //         0, 0, 1, 0,
          //         0, 0, 0, 1
          //     );
          //     return this;
          // }
          ;

          _proto.makeRotationAxis = function makeRotationAxis(axis, angle) {
            // Based on http://www.gamedev.net/reference/articles/article1199.asp
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var t = 1 - c;
            var x = axis.x,
                y = axis.y,
                z = axis.z;
            var tx = t * x,
                ty = t * y;
            this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
            return this;
          } // makeScale(x, y, z) {
          //     this.set(
          //         x, 0, 0, 0,
          //         0, y, 0, 0,
          //         0, 0, z, 0,
          //         0, 0, 0, 1
          //     );
          //     return this;
          // }
          // makeShear(xy, xz, yx, yz, zx, zy) {
          //     this.set(
          //         1, yx, zx, 0,
          //         xy, 1, zy, 0,
          //         xz, yz, 1, 0,
          //         0, 0, 0, 1
          //     );
          //     return this;
          // }
          // compose(position, quaternion, scale) {
          //     const te = this.elements;
          //     const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
          //     const x2 = x + x, y2 = y + y, z2 = z + z;
          //     const xx = x * x2, xy = x * y2, xz = x * z2;
          //     const yy = y * y2, yz = y * z2, zz = z * z2;
          //     const wx = w * x2, wy = w * y2, wz = w * z2;
          //     const sx = scale.x, sy = scale.y, sz = scale.z;
          //     te[0] = (1 - (yy + zz)) * sx;
          //     te[1] = (xy + wz) * sx;
          //     te[2] = (xz - wy) * sx;
          //     te[3] = 0;
          //     te[4] = (xy - wz) * sy;
          //     te[5] = (1 - (xx + zz)) * sy;
          //     te[6] = (yz + wx) * sy;
          //     te[7] = 0;
          //     te[8] = (xz + wy) * sz;
          //     te[9] = (yz - wx) * sz;
          //     te[10] = (1 - (xx + yy)) * sz;
          //     te[11] = 0;
          //     te[12] = position.x;
          //     te[13] = position.y;
          //     te[14] = position.z;
          //     te[15] = 1;
          //     return this;
          // }
          // decompose(position, quaternion, scale) {
          //     const te = this.elements;
          //     let sx = _v1.set(te[0], te[1], te[2]).length();
          //     const sy = _v1.set(te[4], te[5], te[6]).length();
          //     const sz = _v1.set(te[8], te[9], te[10]).length();
          //     // if determine is negative, we need to invert one scale
          //     const det = this.determinant();
          //     if (det < 0) sx = -sx;
          //     position.x = te[12];
          //     position.y = te[13];
          //     position.z = te[14];
          //     // scale the rotation part
          //     _m1.copy(this);
          //     const invSX = 1 / sx;
          //     const invSY = 1 / sy;
          //     const invSZ = 1 / sz;
          //     _m1.elements[0] *= invSX;
          //     _m1.elements[1] *= invSX;
          //     _m1.elements[2] *= invSX;
          //     _m1.elements[4] *= invSY;
          //     _m1.elements[5] *= invSY;
          //     _m1.elements[6] *= invSY;
          //     _m1.elements[8] *= invSZ;
          //     _m1.elements[9] *= invSZ;
          //     _m1.elements[10] *= invSZ;
          //     quaternion.setFromRotationMatrix(_m1);
          //     scale.x = sx;
          //     scale.y = sy;
          //     scale.z = sz;
          //     return this;
          // }
          // makePerspective(left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem) {
          //     const te = this.elements;
          //     const x = 2 * near / (right - left);
          //     const y = 2 * near / (top - bottom);
          //     const a = (right + left) / (right - left);
          //     const b = (top + bottom) / (top - bottom);
          //     let c, d;
          //     if (coordinateSystem === WebGLCoordinateSystem) {
          //         c = - (far + near) / (far - near);
          //         d = (- 2 * far * near) / (far - near);
          //     } else if (coordinateSystem === WebGPUCoordinateSystem) {
          //         c = - far / (far - near);
          //         d = (- far * near) / (far - near);
          //     } else {
          //         throw new Error('THREE.Matrix4.makePerspective(): Invalid coordinate system: ' + coordinateSystem);
          //     }
          //     te[0] = x; te[4] = 0; te[8] = a; te[12] = 0;
          //     te[1] = 0; te[5] = y; te[9] = b; te[13] = 0;
          //     te[2] = 0; te[6] = 0; te[10] = c; te[14] = d;
          //     te[3] = 0; te[7] = 0; te[11] = - 1; te[15] = 0;
          //     return this;
          // }
          // makeOrthographic(left, right, top, bottom, near, far, coordinateSystem = WebGLCoordinateSystem) {
          //     const te = this.elements;
          //     const w = 1.0 / (right - left);
          //     const h = 1.0 / (top - bottom);
          //     const p = 1.0 / (far - near);
          //     const x = (right + left) * w;
          //     const y = (top + bottom) * h;
          //     let z, zInv;
          //     if (coordinateSystem === WebGLCoordinateSystem) {
          //         z = (far + near) * p;
          //         zInv = - 2 * p;
          //     } else if (coordinateSystem === WebGPUCoordinateSystem) {
          //         z = near * p;
          //         zInv = - 1 * p;
          //     } else {
          //         throw new Error('THREE.Matrix4.makeOrthographic(): Invalid coordinate system: ' + coordinateSystem);
          //     }
          //     te[0] = 2 * w; te[4] = 0; te[8] = 0; te[12] = - x;
          //     te[1] = 0; te[5] = 2 * h; te[9] = 0; te[13] = - y;
          //     te[2] = 0; te[6] = 0; te[10] = zInv; te[14] = - z;
          //     te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;
          //     return this;
          // }
          ;

          _proto.equals = function equals(matrix) {
            var te = this.elements;
            var me = matrix.elements;

            for (var i = 0; i < 16; i++) {
              if (te[i] !== me[i]) return false;
            }

            return true;
          } // fromArray(array, offset = 0) {
          //     for (let i = 0; i < 16; i++) {
          //         this.elements[i] = array[i + offset];
          //     }
          //     return this;
          // }
          // toArray(array = [], offset = 0) {
          //     const te = this.elements;
          //     array[offset] = te[0];
          //     array[offset + 1] = te[1];
          //     array[offset + 2] = te[2];
          //     array[offset + 3] = te[3];
          //     array[offset + 4] = te[4];
          //     array[offset + 5] = te[5];
          //     array[offset + 6] = te[6];
          //     array[offset + 7] = te[7];
          //     array[offset + 8] = te[8];
          //     array[offset + 9] = te[9];
          //     array[offset + 10] = te[10];
          //     array[offset + 11] = te[11];
          //     array[offset + 12] = te[12];
          //     array[offset + 13] = te[13];
          //     array[offset + 14] = te[14];
          //     array[offset + 15] = te[15];
          //     return array;
          // }
          ;

          return Matrix4;
        }(); // const _v1 = new Vector3();

        function _inheritsLoose(subClass, superClass) {
          subClass.prototype = Object.create(superClass.prototype);
          subClass.prototype.constructor = subClass;

          _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
          };
          return _setPrototypeOf(o, p);
        }

        // code copy from https://github.com/mrdoob/three.js/blob/dev/src/extras/core/Curve.js
        // import * as MathUtils from '../../math/MathUtils.js';
        // import { Vector2 } from '../../math/Vector2.js';
        // import { Vector3 } from '../../math/Vector3.js';
        // import { Matrix4 } from '../../math/Matrix4.js';

        /**
         * Extensible curve object.
         *
         * Some common of curve methods:
         * .getPoint( t, optionalTarget ), .getTangent( t, optionalTarget )
         * .getPointAt( u, optionalTarget ), .getTangentAt( u, optionalTarget )
         * .getPoints(), .getSpacedPoints()
         * .getLength()
         * .updateArcLengths()
         *
         * This following curves inherit from THREE.Curve:
         *
         * -- 2D curves --
         * THREE.ArcCurve
         * THREE.CubicBezierCurve
         * THREE.EllipseCurve
         * THREE.LineCurve
         * THREE.QuadraticBezierCurve
         * THREE.SplineCurve
         *
         * -- 3D curves --
         * THREE.CatmullRomCurve3
         * THREE.CubicBezierCurve3
         * THREE.LineCurve3
         * THREE.QuadraticBezierCurve3
         *
         * A series of curves can be represented as a THREE.CurvePath.
         *
         **/
        var Curve = /*#__PURE__*/function () {
          function Curve() {
            this.type = 'Curve';
            this.arcLengthDivisions = 200;
          } // Virtual base class method to overwrite and implement in subclasses


          var _proto = Curve.prototype;

          _proto.getPoint = function getPoint() {
            console.warn('THREE.Curve: .getPoint() not implemented.');
            return null;
          } // Get point at relative position in curve according to arc length
          // - u [0 .. 1]
          ;

          _proto.getPointAt = function getPointAt(u, optionalTarget) {
            var t = this.getUtoTmapping(u);
            return this.getPoint(t, optionalTarget);
          } // Get sequence of points using getPoint( t )
          ;

          _proto.getPoints = function getPoints(divisions) {
            if (divisions === void 0) {
              divisions = 5;
            }

            var points = [];

            for (var d = 0; d <= divisions; d++) {
              points.push(this.getPoint(d / divisions));
            }

            return points;
          } // // Get sequence of points using getPointAt( u )
          // getSpacedPoints(divisions = 5) {
          //     const points = [];
          //     for (let d = 0; d <= divisions; d++) {
          //         points.push(this.getPointAt(d / divisions));
          //     }
          //     return points;
          // }
          // Get total curve arc length
          ;

          _proto.getLength = function getLength() {
            var lengths = this.getLengths();
            return lengths[lengths.length - 1];
          } // Get list of cumulative segment lengths
          ;

          _proto.getLengths = function getLengths(divisions) {
            if (divisions === void 0) {
              divisions = this.arcLengthDivisions;
            }

            if (this.cacheArcLengths && this.cacheArcLengths.length === divisions + 1 && !this.needsUpdate) {
              return this.cacheArcLengths;
            }

            this.needsUpdate = false;
            var cache = [];
            var current,
                last = this.getPoint(0);
            var sum = 0;
            cache.push(0);

            for (var p = 1; p <= divisions; p++) {
              current = this.getPoint(p / divisions);
              sum += current.distanceTo(last);
              cache.push(sum);
              last = current;
            }

            this.cacheArcLengths = cache;
            return cache; // { sums: cache, sum: sum }; Sum is in the last element.
          } // updateArcLengths() {
          //     this.needsUpdate = true;
          //     this.getLengths();
          // }
          // Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equidistant
          ;

          _proto.getUtoTmapping = function getUtoTmapping(u, distance) {
            var arcLengths = this.getLengths();
            var i = 0;
            var il = arcLengths.length;
            var targetArcLength; // The targeted u distance value to get

            if (distance) {
              targetArcLength = distance;
            } else {
              targetArcLength = u * arcLengths[il - 1];
            } // binary search for the index with largest value smaller than target u distance


            var low = 0,
                high = il - 1,
                comparison;

            while (low <= high) {
              i = Math.floor(low + (high - low) / 2); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

              comparison = arcLengths[i] - targetArcLength;

              if (comparison < 0) {
                low = i + 1;
              } else if (comparison > 0) {
                high = i - 1;
              } else {
                high = i;
                break; // DONE
              }
            }

            i = high;

            if (arcLengths[i] === targetArcLength) {
              return i / (il - 1);
            } // we could get finer grain at lengths, or use simple interpolation between two points


            var lengthBefore = arcLengths[i];
            var lengthAfter = arcLengths[i + 1];
            var segmentLength = lengthAfter - lengthBefore; // determine where we are between the 'before' and 'after' points

            var segmentFraction = (targetArcLength - lengthBefore) / segmentLength; // add that fractional amount to t

            var t = (i + segmentFraction) / (il - 1);
            return t;
          } // Returns a unit vector tangent at t
          // In case any sub curve does not implement its tangent derivation,
          // 2 points a small delta apart will be used to find its gradient
          // which seems to give a reasonable approximation
          // getTangent(t, optionalTarget) {
          //     const delta = 0.0001;
          //     let t1 = t - delta;
          //     let t2 = t + delta;
          //     // Capping in case of danger
          //     if (t1 < 0) t1 = 0;
          //     if (t2 > 1) t2 = 1;
          //     const pt1 = this.getPoint(t1);
          //     const pt2 = this.getPoint(t2);
          //     const tangent = optionalTarget || ((pt1.isVector2) ? new Vector2() : new Vector3());
          //     tangent.copy(pt2).sub(pt1).normalize();
          //     return tangent;
          // }
          // getTangentAt(u, optionalTarget) {
          //     const t = this.getUtoTmapping(u);
          //     return this.getTangent(t, optionalTarget);
          // }
          // computeFrenetFrames(segments, closed) {
          //     // see http://www.cs.indiana.edu/pub/techreports/TR425.pdf
          //     const normal = new Vector3();
          //     const tangents = [];
          //     const normals = [];
          //     const binormals = [];
          //     const vec = new Vector3();
          //     const mat = new Matrix4();
          //     // compute the tangent vectors for each segment on the curve
          //     for (let i = 0; i <= segments; i++) {
          //         const u = i / segments;
          //         tangents[i] = this.getTangentAt(u, new Vector3());
          //     }
          //     // select an initial normal vector perpendicular to the first tangent vector,
          //     // and in the direction of the minimum tangent xyz component
          //     normals[0] = new Vector3();
          //     binormals[0] = new Vector3();
          //     let min = Number.MAX_VALUE;
          //     const tx = Math.abs(tangents[0].x);
          //     const ty = Math.abs(tangents[0].y);
          //     const tz = Math.abs(tangents[0].z);
          //     if (tx <= min) {
          //         min = tx;
          //         normal.set(1, 0, 0);
          //     }
          //     if (ty <= min) {
          //         min = ty;
          //         normal.set(0, 1, 0);
          //     }
          //     if (tz <= min) {
          //         normal.set(0, 0, 1);
          //     }
          //     vec.crossVectors(tangents[0], normal).normalize();
          //     normals[0].crossVectors(tangents[0], vec);
          //     binormals[0].crossVectors(tangents[0], normals[0]);
          //     // compute the slowly-varying normal and binormal vectors for each segment on the curve
          //     for (let i = 1; i <= segments; i++) {
          //         normals[i] = normals[i - 1].clone();
          //         binormals[i] = binormals[i - 1].clone();
          //         vec.crossVectors(tangents[i - 1], tangents[i]);
          //         if (vec.length() > Number.EPSILON) {
          //             vec.normalize();
          //             const theta = Math.acos(MathUtils.clamp(tangents[i - 1].dot(tangents[i]), - 1, 1)); // clamp for floating pt errors
          //             normals[i].applyMatrix4(mat.makeRotationAxis(vec, theta));
          //         }
          //         binormals[i].crossVectors(tangents[i], normals[i]);
          //     }
          //     // if the curve is closed, postprocess the vectors so the first and last normal vectors are the same
          //     if (closed === true) {
          //         let theta = Math.acos(MathUtils.clamp(normals[0].dot(normals[segments]), - 1, 1));
          //         theta /= segments;
          //         if (tangents[0].dot(vec.crossVectors(normals[0], normals[segments])) > 0) {
          //             theta = - theta;
          //         }
          //         for (let i = 1; i <= segments; i++) {
          //             // twist a little...
          //             normals[i].applyMatrix4(mat.makeRotationAxis(tangents[i], theta * i));
          //             binormals[i].crossVectors(tangents[i], normals[i]);
          //         }
          //     }
          //     return {
          //         tangents: tangents,
          //         normals: normals,
          //         binormals: binormals
          //     };
          // }
          // clone() {
          //     return new this.constructor().copy(this);
          // }
          // copy(source) {
          //     this.arcLengthDivisions = source.arcLengthDivisions;
          //     return this;
          // }
          // toJSON() {
          //     const data = {
          //         metadata: {
          //             version: 4.6,
          //             type: 'Curve',
          //             generator: 'Curve.toJSON'
          //         }
          //     };
          //     data.arcLengthDivisions = this.arcLengthDivisions;
          //     data.type = this.type;
          //     return data;
          // }
          // fromJSON(json) {
          //     this.arcLengthDivisions = json.arcLengthDivisions;
          //     return this;
          // }
          ;

          return Curve;
        }();

        /**
         * // code copy from https://github.com/mrdoob/three.js/blob/dev/src/extras/core/Interpolations.js
         * Bezier Curves formulas obtained from
         * https://en.wikipedia.org/wiki/B%C3%A9zier_curve
         */


        function QuadraticBezierP0(t, p) {
          var k = 1 - t;
          return k * k * p;
        }

        function QuadraticBezierP1(t, p) {
          return 2 * (1 - t) * t * p;
        }

        function QuadraticBezierP2(t, p) {
          return t * t * p;
        }

        function QuadraticBezier(t, p0, p1, p2) {
          return QuadraticBezierP0(t, p0) + QuadraticBezierP1(t, p1) + QuadraticBezierP2(t, p2);
        } //

        var QuadraticBezierCurve3 = /*#__PURE__*/function (_Curve) {
          _inheritsLoose(QuadraticBezierCurve3, _Curve);

          function QuadraticBezierCurve3(v0, v1, v2) {
            var _this;

            if (v0 === void 0) {
              v0 = new Vector3();
            }

            if (v1 === void 0) {
              v1 = new Vector3();
            }

            if (v2 === void 0) {
              v2 = new Vector3();
            }

            _this = _Curve.call(this) || this;
            _this.isQuadraticBezierCurve3 = true;
            _this.type = 'QuadraticBezierCurve3';
            _this.v0 = v0;
            _this.v1 = v1;
            _this.v2 = v2;
            return _this;
          }

          var _proto = QuadraticBezierCurve3.prototype;

          _proto.getPoint = function getPoint(t, optionalTarget) {
            if (optionalTarget === void 0) {
              optionalTarget = new Vector3();
            }

            var point = optionalTarget;
            var v0 = this.v0,
                v1 = this.v1,
                v2 = this.v2;
            point.set(QuadraticBezier(t, v0.x, v1.x, v2.x), QuadraticBezier(t, v0.y, v1.y, v2.y), QuadraticBezier(t, v0.z, v1.z, v2.z));
            return point;
          } // copy(source) {
          //     super.copy(source);
          //     this.v0.copy(source.v0);
          //     this.v1.copy(source.v1);
          //     this.v2.copy(source.v2);
          //     return this;
          // }
          // toJSON() {
          //     const data = super.toJSON();
          //     data.v0 = this.v0.toArray();
          //     data.v1 = this.v1.toArray();
          //     data.v2 = this.v2.toArray();
          //     return data;
          // }
          // fromJSON(json) {
          //     super.fromJSON(json);
          //     this.v0.fromArray(json.v0);
          //     this.v1.fromArray(json.v1);
          //     this.v2.fromArray(json.v2);
          //     return this;
          // }
          ;

          return QuadraticBezierCurve3;
        }(Curve);

        /* eslint-disable no-tabs */
        var helpVec3_1 = new Vector3();
        var helpVec3_2 = new Vector3();
        var helpVec3_3 = new Vector3();
        var helpMat4 = new Matrix4();
        var helpCurve = new QuadraticBezierCurve3();

        function _getCornerBezierCurve(last, current, next, cornerRadius, firstCorner, out) {
          var lastDir = helpVec3_1.subVectors(current, last);
          var nextDir = helpVec3_2.subVectors(next, current);
          var lastDirLength = lastDir.length();
          var nextDirLength = nextDir.length();
          lastDir.normalize();
          nextDir.normalize(); // cornerRadius can not bigger then lineDistance / 2, auto fix this

          var v0Dist = Math.min((firstCorner ? lastDirLength / 2 : lastDirLength) * 0.999999, cornerRadius);
          out.v0.copy(current).sub(lastDir.multiplyScalar(v0Dist));
          out.v1.copy(current);
          var v2Dist = Math.min(nextDirLength / 2 * 0.999999, cornerRadius);
          out.v2.copy(current).add(nextDir.multiplyScalar(v2Dist));
          return out;
        }
        /**
         * PathPointList
         * input points to generate a PathPoint list
         */


        var PathPointList = /*#__PURE__*/function () {
          function PathPointList() {
            this.array = []; // path point array

            this.count = 0;
          }
          /**
           * Set points
           * @param {THREE.Vector3[]} points key points array
           * @param {number} cornerRadius? the corner radius. set 0 to disable round corner. default is 0.1
           * @param {number} cornerSplit? the corner split. default is 10.
           * @param {number} up? force up. default is auto up (calculate by tangent).
           * @param {boolean} close? close path. default is false.
           */


          var _proto = PathPointList.prototype;

          _proto.set = function set(points, cornerRadius, cornerSplit, up, close) {
            if (cornerRadius === void 0) {
              cornerRadius = 0.1;
            }

            if (cornerSplit === void 0) {
              cornerSplit = 10;
            }

            if (up === void 0) {
              up = null;
            }

            if (close === void 0) {
              close = false;
            }

            points = points.slice(0);

            if (points.length < 2) {
              console.warn('PathPointList: points length less than 2.');
              this.count = 0;
              return;
            } // Auto close


            if (close && !points[0].equals(points[points.length - 1])) {
              points.push(new Vector3().copy(points[0]));
            } // Generate path point list


            for (var i = 0, l = points.length; i < l; i++) {
              if (i === 0) {
                this._start(points[i], points[i + 1], up);
              } else if (i === l - 1) {
                if (close) {
                  // Connect end point and start point
                  this._corner(points[i], points[1], cornerRadius, cornerSplit, up); // Fix start point


                  var dist = this.array[0].dist; // should not copy dist

                  this.array[0].copy(this.array[this.count - 1]);
                  this.array[0].dist = dist;
                } else {
                  this._end(points[i]);
                }
              } else {
                this._corner(points[i], points[i + 1], cornerRadius, cornerSplit, up);
              }
            }
          }
          /**
           * Get distance of this path
           * @return {number}
           */
          ;

          _proto.distance = function distance() {
            if (this.count > 0) {
              return this.array[this.count - 1].dist;
            }

            return 0;
          };

          _proto._getByIndex = function _getByIndex(index) {
            if (!this.array[index]) {
              this.array[index] = new PathPoint();
            }

            return this.array[index];
          };

          _proto._start = function _start(current, next, up) {
            this.count = 0;

            var point = this._getByIndex(this.count);

            point.pos.copy(current);
            point.dir.subVectors(next, current); // init start up dir

            if (up) {
              point.up.copy(up);
            } else {
              // select an initial normal vector perpendicular to the first tangent vector
              var min = Number.MAX_VALUE;
              var tx = Math.abs(point.dir.x);
              var ty = Math.abs(point.dir.y);
              var tz = Math.abs(point.dir.z);

              if (tx < min) {
                min = tx;
                point.up.set(1, 0, 0);
              }

              if (ty < min) {
                min = ty;
                point.up.set(0, 1, 0);
              }

              if (tz < min) {
                point.up.set(0, 0, 1);
              }
            }

            point.right.crossVectors(point.dir, point.up).normalize();
            point.up.crossVectors(point.right, point.dir).normalize();
            point.dist = 0;
            point.widthScale = 1;
            point.sharp = false;
            point.dir.normalize();
            this.count++;
          };

          _proto._end = function _end(current) {
            var lastPoint = this.array[this.count - 1];

            var point = this._getByIndex(this.count);

            point.pos.copy(current);
            point.dir.subVectors(current, lastPoint.pos);
            var dist = point.dir.length();
            point.dir.normalize();
            point.up.copy(lastPoint.up); // copy last up

            var vec = helpVec3_1.crossVectors(lastPoint.dir, point.dir);

            if (vec.length() > Number.EPSILON) {
              vec.normalize();
              var theta = Math.acos(Math.min(Math.max(lastPoint.dir.dot(point.dir), -1), 1)); // clamp for floating pt errors

              point.up.applyMatrix4(helpMat4.makeRotationAxis(vec, theta));
            }

            point.right.crossVectors(point.dir, point.up).normalize();
            point.dist = lastPoint.dist + dist;
            point.widthScale = 1;
            point.sharp = false;
            this.count++;
          };

          _proto._corner = function _corner(current, next, cornerRadius, cornerSplit, up) {
            if (cornerRadius > 0 && cornerSplit > 0) {
              var lastPoint = this.array[this.count - 1];

              var curve = _getCornerBezierCurve(lastPoint.pos, current, next, cornerRadius, this.count - 1 === 0, helpCurve);

              var samplerPoints = curve.getPoints(cornerSplit); // TODO optimize

              for (var f = 0; f < cornerSplit; f++) {
                this._sharpCorner(samplerPoints[f], samplerPoints[f + 1], up, f === 0 ? 1 : 0);
              }

              if (!samplerPoints[cornerSplit].equals(next)) {
                this._sharpCorner(samplerPoints[cornerSplit], next, up, 2);
              }
            } else {
              this._sharpCorner(current, next, up, 0, true);
            }
          } // dirType: 0 - use middle dir / 1 - use last dir / 2- use next dir
          ;

          _proto._sharpCorner = function _sharpCorner(current, next, up, dirType, sharp) {
            if (dirType === void 0) {
              dirType = 0;
            }

            if (sharp === void 0) {
              sharp = false;
            }

            var lastPoint = this.array[this.count - 1];

            var point = this._getByIndex(this.count);

            var lastDir = helpVec3_1.subVectors(current, lastPoint.pos);
            var nextDir = helpVec3_2.subVectors(next, current);
            var lastDirLength = lastDir.length();
            lastDir.normalize();
            nextDir.normalize();
            point.pos.copy(current);

            if (dirType === 1) {
              point.dir.copy(lastDir);
            } else if (dirType === 2) {
              point.dir.copy(nextDir);
            } else {
              point.dir.addVectors(lastDir, nextDir);
              point.dir.normalize();
            }

            if (up) {
              if (point.dir.dot(up) === 1) {
                point.right.crossVectors(nextDir, up).normalize();
              } else {
                point.right.crossVectors(point.dir, up).normalize();
              }

              point.up.crossVectors(point.right, point.dir).normalize();
            } else {
              point.up.copy(lastPoint.up);
              var vec = helpVec3_3.crossVectors(lastPoint.dir, point.dir);

              if (vec.length() > Number.EPSILON) {
                vec.normalize();
                var theta = Math.acos(Math.min(Math.max(lastPoint.dir.dot(point.dir), -1), 1)); // clamp for floating pt errors

                point.up.applyMatrix4(helpMat4.makeRotationAxis(vec, theta));
              }

              point.right.crossVectors(point.dir, point.up).normalize();
            }

            point.dist = lastPoint.dist + lastDirLength;

            var _cos = lastDir.dot(nextDir);

            point.widthScale = Math.min(1 / Math.sqrt((1 + _cos) / 2), 1.415) || 1;
            point.sharp = Math.abs(_cos - 1) > 0.05 && sharp;
            this.count++;
          };

          return PathPointList;
        }();

        var UP = new Vector3(0, 0, 1);
        function expandPaths(lines, options) {
          options = Object.assign({}, {
            lineWidth: 1,
            cornerRadius: 0,
            cornerSplit: 10
          }, options);
          var results = lines.map(function (line) {
            var points = line.map(function (p) {
              var x = p[0],
                  y = p[1],
                  z = p[2];
              return new Vector3(x, y, z || 0);
            });
            var pathPointList = new PathPointList();
            pathPointList.set(points, options.cornerRadius, options.cornerSplit, UP);
            var result = generatePathVertexData(pathPointList, options);
            result.line = line;
            result.position = new Float32Array(result.points);
            result.indices = new Uint32Array(result.index);
            result.uv = new Float32Array(result.uvs);
            result.normal = new Float32Array(result.normal);
            return result;
          });
          var result = merge(results);
          result.lines = lines;
          return result;
        } // Vertex Data Generate Functions
        // code copy from https://github.com/shawn0326/three.path/blob/master/src/PathGeometry.js

        function generatePathVertexData(pathPointList, options) {
          var width = options.lineWidth || 0.1;
          var progress = 1;
          var halfWidth = width / 2;
          var sideWidth = width;
          var totalDistance = pathPointList.distance();
          var progressDistance = progress * totalDistance;

          if (totalDistance === 0) {
            return null;
          }

          var sharpUvOffset = halfWidth / sideWidth; // const sharpUvOffset2 = halfWidth / totalDistance;

          var count = 0; // modify data

          var position = [];
          var normal = [];
          var uv = [];
          var indices = [];
          var verticesCount = 0;
          var right = new Vector3();
          var left = new Vector3(); // for sharp corners

          var leftOffset = new Vector3();
          var rightOffset = new Vector3();
          var tempPoint1 = new Vector3();
          var tempPoint2 = new Vector3();

          function addVertices(pathPoint) {
            var first = position.length === 0;
            var sharpCorner = pathPoint.sharp && !first;
            var uvDist = pathPoint.dist / sideWidth; // const uvDist2 = pathPoint.dist / totalDistance;

            var dir = pathPoint.dir;
            var up = pathPoint.up;
            var _right = pathPoint.right;

            {
              right.copy(_right).multiplyScalar(halfWidth * pathPoint.widthScale);
            }

            {
              left.copy(_right).multiplyScalar(-halfWidth * pathPoint.widthScale);
            }

            right.add(pathPoint.pos);
            left.add(pathPoint.pos);

            if (sharpCorner) {
              leftOffset.fromArray(position, position.length - 6).sub(left);
              rightOffset.fromArray(position, position.length - 3).sub(right);
              var leftDist = leftOffset.length();
              var rightDist = rightOffset.length();
              var sideOffset = leftDist - rightDist;
              var longerOffset, longEdge;

              if (sideOffset > 0) {
                longerOffset = leftOffset;
                longEdge = left;
              } else {
                longerOffset = rightOffset;
                longEdge = right;
              }

              tempPoint1.copy(longerOffset).setLength(Math.abs(sideOffset)).add(longEdge); // eslint-disable-next-line prefer-const

              var _cos = tempPoint2.copy(longEdge).sub(tempPoint1).normalize().dot(dir); // eslint-disable-next-line prefer-const


              var _len = tempPoint2.copy(longEdge).sub(tempPoint1).length(); // eslint-disable-next-line prefer-const


              var _dist = _cos * _len * 2;

              tempPoint2.copy(dir).setLength(_dist).add(tempPoint1);

              if (sideOffset > 0) {
                position.push(tempPoint1.x, tempPoint1.y, tempPoint1.z, // 6
                right.x, right.y, right.z, // 5
                left.x, left.y, left.z, // 4
                right.x, right.y, right.z, // 3
                tempPoint2.x, tempPoint2.y, tempPoint2.z, // 2
                right.x, right.y, right.z // 1
                );
                verticesCount += 6;
                indices.push(verticesCount - 6, verticesCount - 8, verticesCount - 7, verticesCount - 6, verticesCount - 7, verticesCount - 5, verticesCount - 4, verticesCount - 6, verticesCount - 5, verticesCount - 2, verticesCount - 4, verticesCount - 1);
                count += 12;
              } else {
                position.push(left.x, left.y, left.z, // 6
                tempPoint1.x, tempPoint1.y, tempPoint1.z, // 5
                left.x, left.y, left.z, // 4
                right.x, right.y, right.z, // 3
                left.x, left.y, left.z, // 2
                tempPoint2.x, tempPoint2.y, tempPoint2.z // 1
                );
                verticesCount += 6;
                indices.push(verticesCount - 6, verticesCount - 8, verticesCount - 7, verticesCount - 6, verticesCount - 7, verticesCount - 5, verticesCount - 6, verticesCount - 5, verticesCount - 3, verticesCount - 2, verticesCount - 3, verticesCount - 1);
                count += 12;
              }

              normal.push(up.x, up.y, up.z, up.x, up.y, up.z, up.x, up.y, up.z, up.x, up.y, up.z, up.x, up.y, up.z, up.x, up.y, up.z);
              uv.push(uvDist - sharpUvOffset, 0, uvDist - sharpUvOffset, 1, uvDist, 0, uvDist, 1, uvDist + sharpUvOffset, 0, uvDist + sharpUvOffset, 1); // if (generateUv2) {
              //     uv2.push(
              //         uvDist2 - sharpUvOffset2, 0,
              //         uvDist2 - sharpUvOffset2, 1,
              //         uvDist2, 0,
              //         uvDist2, 1,
              //         uvDist2 + sharpUvOffset2, 0,
              //         uvDist2 + sharpUvOffset2, 1
              //     );
              // }
            } else {
              position.push(left.x, left.y, left.z, right.x, right.y, right.z);
              normal.push(up.x, up.y, up.z, up.x, up.y, up.z);
              uv.push(uvDist, 0, uvDist, 1); // if (generateUv2) {
              //     uv2.push(
              //         uvDist2, 0,
              //         uvDist2, 1
              //     );
              // }

              verticesCount += 2;

              if (!first) {
                indices.push(verticesCount - 2, verticesCount - 4, verticesCount - 3, verticesCount - 2, verticesCount - 3, verticesCount - 1);
                count += 6;
              }
            }
          }

          var lastPoint;

          if (progressDistance > 0) {
            for (var i = 0; i < pathPointList.count; i++) {
              var pathPoint = pathPointList.array[i];

              if (pathPoint.dist > progressDistance) {
                var prevPoint = pathPointList.array[i - 1];
                lastPoint = new PathPoint(); // linear lerp for progress

                var alpha = (progressDistance - prevPoint.dist) / (pathPoint.dist - prevPoint.dist);
                lastPoint.lerpPathPoints(prevPoint, pathPoint, alpha);
                addVertices(lastPoint);
                break;
              } else {
                addVertices(pathPoint);
              }
            }
          } else {
            lastPoint = pathPointList.array[0];
          }

          return {
            points: position,
            normal: normal,
            uvs: uv,
            index: indices,
            count: count
          };
        }

        exports.cylinder = cylinder;
        exports.expandLine = expandLine;
        exports.expandPaths = expandPaths;
        exports.extrudePolygons = extrudePolygons;
        exports.extrudePolylines = extrudePolylines;

        Object.defineProperty(exports, '__esModule', { value: true });

    }));

    }(polyExtrude$2, polyExtrude$2.exports));

    var polyExtrude = /*@__PURE__*/getDefaultExportFromCjs(polyExtrude$2.exports);

    var polyExtrude$1 = /*#__PURE__*/_mergeNamespaces({
        __proto__: null,
        'default': polyExtrude
    }, [polyExtrude$2.exports]);

    //Using cache to reduce computation
    function distanceToVector3(distance, layer, cache = {}) {
        if (cache[distance] === undefined) {
            cache[distance] = layer.distanceToVector3(distance, distance).x;
        }
        return cache[distance];
    }
    function altitudeToVector3(altitude, layer, cache = {}) {
        if (cache[altitude] === undefined) {
            cache[altitude] = layer.altitudeToVector3(altitude, altitude).x;
        }
        return cache[altitude];
    }
    /**
     *Get the center point of the point set
     * @param {*} coordinates
     */
    function getCenterOfPoints(coordinates = []) {
        let sumX = 0, sumY = 0;
        const len = coordinates.length;
        for (let i = 0; i < len; i++) {
            const { coordinate, lnglat, lnglats, xy, xys } = coordinates[i];
            const c = coordinate || lnglat || lnglats || xy || xys || coordinates[i];
            let x, y;
            if (Array.isArray(c)) {
                x = c[0];
                y = c[1];
            }
            else if (c instanceof maptalks__namespace.Coordinate) {
                x = c.x;
                y = c.y;
            }
            sumX += x;
            sumY += y;
        }
        return new maptalks__namespace.Coordinate(sumX / len, sumY / len);
    }
    function setBottomHeight(geometry, bottomHeight, layer, cache) {
        if (bottomHeight === undefined || typeof bottomHeight !== 'number' || bottomHeight === 0) {
            return 0;
        }
        let position;
        if (geometry instanceof THREE__namespace.BufferGeometry) {
            position = geometry.attributes.position.array;
        }
        else if (Array.isArray(geometry) || geometry instanceof Float32Array) {
            position = geometry;
        }
        else {
            position = geometry.position;
        }
        let h = 0;
        if (position) {
            if (cache) {
                if (cache[bottomHeight] === undefined) {
                    cache[bottomHeight] = layer.altitudeToVector3(bottomHeight, bottomHeight).x;
                }
                h = cache[bottomHeight];
            }
            else {
                h = layer.altitudeToVector3(bottomHeight, bottomHeight).x;
            }
            const len = position.length;
            if (position[0] instanceof THREE__namespace.Vector3) {
                for (let i = 0; i < len; i++) {
                    position[i].z += h;
                }
            }
            else {
                for (let i = 0; i < len; i += 3) {
                    position[i + 2] += h;
                }
            }
        }
        return h;
    }
    function getGeometriesColorArray(geometriesAttributes) {
        const len = geometriesAttributes.length;
        let colorsLen = 0;
        for (let i = 0; i < len; i++) {
            const { count } = geometriesAttributes[i].position;
            colorsLen += count;
        }
        return new Float32Array(colorsLen * 3);
    }
    const TEMP_VECTOR3$2 = new THREE__namespace.Vector3();
    const heightCache$3 = new Map();
    function coordiantesToArrayBuffer(coordiantes = [], layer) {
        const len = coordiantes.length;
        const hasHeight = !!layer;
        const dimensional = hasHeight ? 3 : 2;
        const array = new Float64Array(len * dimensional);
        heightCache$3.clear();
        for (let i = 0; i < len; i++) {
            let x, y;
            const c = coordiantes[i];
            let height;
            if (c.x) {
                x = c.x;
                y = c.y;
                height = c.z;
            }
            else {
                x = c[0];
                y = c[1];
                height = c[2];
            }
            array[i * dimensional] = x;
            array[i * dimensional + 1] = y;
            height = height || 0;
            if (hasHeight && height !== 0) {
                if (!heightCache$3.has(height)) {
                    const z = layer.altitudeToVector3(height, height, null, TEMP_VECTOR3$2).x;
                    heightCache$3.set(height, z);
                }
                array[i * dimensional + 2] = heightCache$3.get(height);
            }
        }
        return array.buffer;
    }
    function getPolygonProperties(polygon) {
        return (isGeoJSONPolygon(polygon) ? polygon['properties'] : polygon.getProperties()) || {};
    }
    function getLineStringProperties(lineString) {
        return (isGeoJSONLine(lineString) ? lineString['properties'] : lineString.getProperties()) || {};
    }

    const topColor$1 = new THREE__namespace.Color('#fff'), bottomColor$1 = new THREE__namespace.Color('#fff');
    /**
     * this is for ExtrudeMesh util
     */
    /**
     * Fix the bug in the center of multipoygon
     * @param {maptalks.Polygon} polygon
     * @param {*} layer
     */
    // export function toShape(datas = []) {
    //     const shapes = [];
    //     for (let i = 0, len = datas.length; i < len; i++) {
    //         const { outer, holes } = datas[i];
    //         const shape = [outer];
    //         if (holes && holes.length) {
    //             for (let j = 0, len1 = holes.length; j < len1; j++) {
    //                 shape.push(holes[j]);
    //             }
    //         }
    //         shapes.push(shape);
    //     }
    //     return shapes;
    // }
    /**
     *  Support custom center point
     * @param {maptalks.Polygon|maptalks.MultiPolygon} polygon
     * @param {*} height
     * @param {*} layer
     */
    function getExtrudeGeometry(polygon, height, layer, center) {
        const { position, normal, uv, indices } = getExtrudeGeometryParams(polygon, height, layer, center);
        const color = new Float32Array(position.length);
        color.fill(1, 0, position.length);
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        addAttribute(bufferGeomertry, 'color', new THREE__namespace.BufferAttribute(color, 3));
        addAttribute(bufferGeomertry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(bufferGeomertry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        addAttribute(bufferGeomertry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        bufferGeomertry.setIndex(new THREE__namespace.BufferAttribute(indices, 1));
        return bufferGeomertry;
    }
    function getExtrudeGeometryParams(polygon, height, layer, center, centerPt, altCache) {
        const datas = getPolygonPositions(polygon, layer, center, centerPt, false);
        const shapes = datas;
        //Possible later use of geojson
        if (!shapes)
            return null;
        //Reduce height and repeat calculation
        if (altCache) {
            if (altCache[height] == null) {
                altCache[height] = layer.altitudeToVector3(height, height).x;
            }
            height = altCache[height];
        }
        else {
            height = layer.altitudeToVector3(height, height).x;
        }
        const { position, normal, uv, indices } = polyExtrude$2.exports.extrudePolygons(shapes, {
            depth: height
        });
        return {
            position, normal, uv, indices
        };
    }
    /**
     *
     * @param {*} geometry
     * @param {*} color
     * @param {*} _topColor
     */
    function initVertexColors$1(geometry, color, _topColor, minZ) {
        if (minZ === undefined) {
            minZ = 0;
        }
        const position = geometry.attributes.position.array;
        const len = position.length;
        bottomColor$1.setStyle(color);
        topColor$1.setStyle(_topColor);
        let colors;
        if (Array.isArray(minZ)) {
            let colorLen = 0;
            for (let i = 0, len = minZ.length; i < len; i++) {
                const { count } = minZ[i].position;
                colorLen += count * 3;
            }
            colors = new Float32Array(colorLen);
        }
        else {
            colors = new Float32Array(position.length);
        }
        if (Array.isArray(minZ)) {
            for (let i = 0, len = minZ.length; i < len; i++) {
                const { middleZ, start, end } = minZ[i].position;
                for (let j = start; j < end; j += 3) {
                    const z = position[j + 2];
                    if (z > middleZ) {
                        colors[j] = topColor$1.r;
                        colors[j + 1] = topColor$1.g;
                        colors[j + 2] = topColor$1.b;
                    }
                    else {
                        colors[j] = bottomColor$1.r;
                        colors[j + 1] = bottomColor$1.g;
                        colors[j + 2] = bottomColor$1.b;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < len; i += 3) {
                const z = position[i + 2];
                if (z > minZ) {
                    colors[i] = topColor$1.r;
                    colors[i + 1] = topColor$1.g;
                    colors[i + 2] = topColor$1.b;
                }
                else {
                    colors[i] = bottomColor$1.r;
                    colors[i + 1] = bottomColor$1.g;
                    colors[i + 2] = bottomColor$1.b;
                }
            }
        }
        addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
        return colors;
    }
    /**
     *
     * @param {*} polygon
     * @param {*} layer
     * @param {*} center
     */
    function getPolygonPositions(polygon, layer, center, centerPt, isArrayBuff = false) {
        if (!polygon) {
            return null;
        }
        let datas = [];
        if (polygon instanceof maptalks__namespace.MultiPolygon) {
            datas = polygon.getGeometries().map(p => {
                return getSinglePolygonPositions(p, layer, center || polygon.getCenter(), centerPt, isArrayBuff);
            });
        }
        else if (polygon instanceof maptalks__namespace.Polygon) {
            const data = getSinglePolygonPositions(polygon, layer, center || polygon.getCenter(), centerPt, isArrayBuff);
            datas.push(data);
        }
        else if (isGeoJSONPolygon(polygon)) {
            // const cent = getGeoJSONCenter(polygon);
            if (!isGeoJSONMulti(polygon)) {
                const data = getSinglePolygonPositions(polygon, layer, center || getGeoJSONCenter(polygon), centerPt, isArrayBuff);
                datas.push(data);
            }
            else {
                const fs = spliteGeoJSONMulti(polygon);
                for (let i = 0, len = fs.length; i < len; i++) {
                    datas.push(getSinglePolygonPositions(fs[i], layer, center || getGeoJSONCenter(polygon), centerPt, isArrayBuff));
                }
            }
        }
        return datas;
    }
    function getSinglePolygonPositions(polygon, layer, center, centerPt, isArrayBuff = false) {
        let shell, holes;
        //it is pre for geojson,Possible later use of geojson
        if (isGeoJSONPolygon(polygon)) {
            const coordinates = getGeoJSONCoordinates(polygon);
            shell = coordinates[0];
            holes = coordinates.slice(1, coordinates.length);
            center = center || getGeoJSONCenter(polygon);
        }
        else if (polygon instanceof maptalks__namespace.Polygon) {
            shell = polygon.getShell();
            holes = polygon.getHoles();
            center = center || polygon.getCenter();
        }
        centerPt = centerPt || layer.coordinateToVector3(center);
        let outer;
        if (isArrayBuff) {
            outer = layer.coordinatiesToGLFloatArray(shell, centerPt).positons2d;
        }
        else {
            outer = layer.coordinatiesToGLArray(shell, centerPt);
        }
        const data = [(isArrayBuff ? outer.buffer : outer)];
        if (holes && holes.length > 0) {
            for (let i = 0, len = holes.length; i < len; i++) {
                let pts;
                if (isArrayBuff) {
                    pts = layer.coordinatiesToGLFloatArray(holes[i], centerPt).positons2d;
                }
                else {
                    pts = layer.coordinatiesToGLArray(holes[i], centerPt);
                }
                data.push((isArrayBuff ? pts.buffer : pts));
            }
        }
        return data;
    }
    function getPolygonArrayBuffer(polygon) {
        if (!polygon) {
            return null;
        }
        let datas = [];
        if (polygon instanceof maptalks__namespace.MultiPolygon) {
            datas = polygon.getGeometries().map(p => {
                return getSinglePolygonArrayBuffer(p, false);
            });
        }
        else if (polygon instanceof maptalks__namespace.Polygon) {
            const data = getSinglePolygonArrayBuffer(polygon, false);
            datas.push(data);
        }
        else if (isGeoJSONPolygon(polygon)) {
            // const cent = getGeoJSONCenter(polygon);
            if (!isGeoJSONMulti(polygon)) {
                const data = getSinglePolygonArrayBuffer(polygon, true);
                datas.push(data);
            }
            else {
                const fs = spliteGeoJSONMulti(polygon);
                for (let i = 0, len = fs.length; i < len; i++) {
                    datas.push(getSinglePolygonArrayBuffer(fs[i], true));
                }
            }
        }
        return datas;
    }
    function getSinglePolygonArrayBuffer(polygon, isGeoJSON) {
        let shell, holes;
        //it is pre for geojson,Possible later use of geojson
        if (isGeoJSON) {
            const coordinates = getGeoJSONCoordinates(polygon);
            shell = coordinates[0];
            holes = coordinates.slice(1, coordinates.length);
        }
        else if (polygon instanceof maptalks__namespace.Polygon) {
            shell = polygon.getShell();
            holes = polygon.getHoles();
        }
        const outer = coordiantesToArrayBuffer(shell);
        const data = [outer];
        if (holes && holes.length > 0) {
            for (let i = 0, len = holes.length; i < len; i++) {
                const pts = coordiantesToArrayBuffer(holes[i]);
                data.push(pts);
            }
        }
        return data;
    }

    var ExtrudeUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getExtrudeGeometry: getExtrudeGeometry,
        getExtrudeGeometryParams: getExtrudeGeometryParams,
        initVertexColors: initVertexColors$1,
        getPolygonPositions: getPolygonPositions,
        getSinglePolygonPositions: getSinglePolygonPositions,
        getPolygonArrayBuffer: getPolygonArrayBuffer,
        getSinglePolygonArrayBuffer: getSinglePolygonArrayBuffer
    });

    const COMMA = ',';
    const heightCache$2 = new Map();
    const TEMP_VECTOR3$1 = new THREE__namespace.Vector3();
    /**
     *
     * @param {maptalks.LineString} lineString
     * @param {ThreeLayer} layer
     */
    function getLinePosition(lineString, layer, center, hasVectorArray = true) {
        let positionsV = [];
        let positions, positions2d;
        if (Array.isArray(lineString) && lineString[0] instanceof THREE__namespace.Vector3) {
            positionsV = lineString;
        }
        else {
            if (Array.isArray(lineString)) {
                lineString = new maptalks__namespace.LineString(lineString);
            }
            const z = 0;
            //support geojson
            let coordinates, cent;
            if (isGeoJSON(lineString)) {
                coordinates = getGeoJSONCoordinates(lineString);
                if (!center) {
                    cent = getGeoJSONCenter(lineString);
                }
            }
            else if (lineString instanceof maptalks__namespace.LineString) {
                coordinates = lineString.getCoordinates();
                if (!center) {
                    cent = lineString.getCenter();
                }
            }
            const centerPt = layer.coordinateToVector3(center || cent);
            if (hasVectorArray) {
                heightCache$2.clear();
                for (let i = 0, len = coordinates.length; i < len; i++) {
                    const coordinate = coordinates[i];
                    const height = coordinate.z || coordinate[2] || 0;
                    if (!heightCache$2.has(height)) {
                        const vz = layer.altitudeToVector3(height, height, null, TEMP_VECTOR3$1).x;
                        heightCache$2.set(height, vz);
                    }
                    const v = layer.coordinateToVector3(coordinate, z).sub(centerPt);
                    v.z += (heightCache$2.get(height) || 0);
                    positionsV.push(v);
                }
            }
            else {
                const result = layer.coordinatiesToGLFloatArray(coordinates, centerPt, true);
                positions = result.positions;
                positions2d = result.positons2d;
            }
        }
        if (!hasVectorArray) {
            return {
                positions,
                positionsV,
                positions2d,
                arrayBuffer: positions.buffer
            };
        }
        positions2d = new Float32Array(positionsV.length * 2);
        positions = new Float32Array(positionsV.length * 3);
        for (let i = 0, len = positionsV.length; i < len; i++) {
            const idx = i * 3;
            const v = positionsV[i];
            positions[idx] = v.x;
            positions[idx + 1] = v.y;
            positions[idx + 2] = v.z;
            const idx1 = i * 2;
            positions2d[idx1] = v.x;
            positions2d[idx1 + 1] = v.y;
        }
        return {
            positions,
            positionsV,
            positions2d,
            arrayBuffer: positions.buffer
        };
    }
    /**
     *
     * @param {maptalks.LineString} lineString
     * @param {Number} lineWidth
     * @param {Number} depth
     * @param {ThreeLayer} layer
     */
    function getExtrudeLineGeometry(lineString, lineWidth = 1, depth = 1, layer, center) {
        const { indices, position, normal, uv } = getExtrudeLineParams(lineString, lineWidth, depth, layer, center);
        const geometry = new THREE__namespace.BufferGeometry();
        addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        addAttribute(geometry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(geometry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        geometry.setIndex(new THREE__namespace.BufferAttribute(indices, 1));
        return geometry;
    }
    /**
     *
     * @param {Array[Array]} chunkLines
     * @param {*} layer
     */
    function getChunkLinesPosition(chunkLines, layer, positionMap, centerPt) {
        const positions = [], positionsV = [], lnglats = [];
        let preKey;
        let v;
        for (let i = 0, len = chunkLines.length; i < len; i++) {
            const line = chunkLines[i];
            for (let j = 0, len1 = line.length; j < len1; j++) {
                const lnglat = line[j];
                const key = lnglat.join(COMMA).toString();
                if (!preKey) {
                    lnglats.push(lnglat);
                    preKey = key;
                    v = layer.coordinateToVector3(lnglat, 0).sub(centerPt);
                    positions.push(v.x, v.y, v.z);
                    positionsV.push(v);
                    continue;
                }
                if (key !== preKey) {
                    v = layer.coordinateToVector3(lnglat, 0).sub(centerPt);
                    positions.push(v.x, v.y, v.z);
                    positionsV.push(v);
                    lnglats.push(lnglat);
                }
                preKey = key;
            }
        }
        return {
            positions: positions,
            positionsV: positionsV,
            lnglats: lnglats
        };
    }
    function mergeChunkLineCoordinates(chunkLines) {
        let preKey;
        const lnglats = [];
        for (let i = 0, len = chunkLines.length; i < len; i++) {
            const line = chunkLines[i];
            for (let j = 0, len1 = line.length; j < len1; j++) {
                const lnglat = line[j];
                const key = lnglat.join(COMMA).toString();
                if (!preKey) {
                    lnglats.push(lnglat);
                    preKey = key;
                    continue;
                }
                if (key !== preKey) {
                    lnglats.push(lnglat);
                }
                preKey = key;
            }
        }
        return lnglats;
    }
    /**
     *
     * @param {*} lineString
     * @param {*} lineWidth
     * @param {*} depth
     * @param {*} layer
     */
    function getExtrudeLineParams(lineString, lineWidth = 1, depth = 1, layer, center) {
        const positions = getLinePosition(lineString, layer, center).positionsV;
        const ps = [];
        for (let i = 0, len = positions.length; i < len; i++) {
            const p = positions[i];
            ps.push([p.x, p.y, p.z]);
        }
        const { indices, position, normal, uv } = polyExtrude$2.exports.extrudePolylines([ps], {
            lineWidth: lineWidth,
            depth: depth
        });
        return {
            position: position,
            normal: normal,
            indices: indices,
            uv
        };
    }
    /**
     *
     * @param {*} lineString
     * @param {*} lineWidth
     * @param {*} cornerRadius
     * @param {*} layer
     */
    function getPathParams(lineString, lineWidth = 1, cornerRadius = 1, layer, center) {
        const positions = getLinePosition(lineString, layer, center).positionsV;
        const ps = [];
        for (let i = 0, len = positions.length; i < len; i++) {
            const p = positions[i];
            ps.push([p.x, p.y, p.z]);
        }
        const { indices, position, normal, uv } = polyExtrude$2.exports.expandPaths([ps], {
            lineWidth: lineWidth,
            cornerRadius: cornerRadius
        });
        return {
            position: position,
            normal: normal,
            indices: indices,
            uv
        };
    }
    function LineStringSplit(lineString) {
        let lineStrings = [], center;
        if (lineString instanceof maptalks__namespace.MultiLineString) {
            lineStrings = lineString.getGeometries();
            center = lineString.getCenter();
        }
        else if (lineString instanceof maptalks__namespace.LineString) {
            lineStrings.push(lineString);
            center = lineString.getCenter();
        }
        else if (isGeoJSON(lineString)) {
            center = getGeoJSONCenter(lineString);
            if (isGeoJSONMulti(lineString)) {
                lineStrings = spliteGeoJSONMulti(lineString);
            }
            else {
                lineStrings.push(lineString);
            }
        }
        return {
            lineStrings,
            center
        };
    }
    function setLineSegmentPosition(position, positionsV) {
        for (let i = 0, len = positionsV.length; i < len; i++) {
            const v = positionsV[i];
            if (i > 0 && i < len - 1) {
                position.push(v.x, v.y, v.z);
            }
            position.push(v.x, v.y, v.z);
        }
    }
    function getLineSegmentPosition(ps) {
        const position = new Float32Array(ps.length * 2 - 6);
        let j = 0;
        for (let i = 0, len = ps.length / 3; i < len; i++) {
            const x = ps[i * 3], y = ps[i * 3 + 1], z = ps[i * 3 + 2];
            if (i > 0 && i < len - 1) {
                const idx = j * 3;
                position[idx] = x;
                position[idx + 1] = y;
                position[idx + 2] = z;
                j++;
            }
            const idx = j * 3;
            position[idx] = x;
            position[idx + 1] = y;
            position[idx + 2] = z;
            j++;
        }
        return position;
    }
    function mergeLinePositions(positionsList) {
        let len = 0;
        const l = positionsList.length;
        if (l === 1) {
            return positionsList[0];
        }
        for (let i = 0; i < l; i++) {
            len += positionsList[i].length;
        }
        const position = new Float32Array(len);
        let offset = 0;
        for (let i = 0; i < l; i++) {
            position.set(positionsList[i], offset);
            offset += positionsList[i].length;
        }
        return position;
    }
    function getLineArrayBuffer(lineString, layer) {
        if (lineString instanceof maptalks__namespace.LineString) {
            return coordiantesToArrayBuffer(lineString.getCoordinates(), layer);
        }
        else if (isGeoJSONLine(lineString)) {
            return coordiantesToArrayBuffer(lineString.geometry.coordinates, layer);
        }
    }
    let defaultGeometry;
    function getDefaultLineGeometry() {
        if (!defaultGeometry) {
            defaultGeometry = new THREE__namespace.BufferGeometry();
            addAttribute(defaultGeometry, 'position', new THREE__namespace.BufferAttribute(new Float32Array(3), 3));
        }
        return defaultGeometry;
    }

    var LineUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getLinePosition: getLinePosition,
        getExtrudeLineGeometry: getExtrudeLineGeometry,
        getChunkLinesPosition: getChunkLinesPosition,
        mergeChunkLineCoordinates: mergeChunkLineCoordinates,
        getExtrudeLineParams: getExtrudeLineParams,
        getPathParams: getPathParams,
        LineStringSplit: LineStringSplit,
        setLineSegmentPosition: setLineSegmentPosition,
        getLineSegmentPosition: getLineSegmentPosition,
        mergeLinePositions: mergeLinePositions,
        getLineArrayBuffer: getLineArrayBuffer,
        getDefaultLineGeometry: getDefaultLineGeometry
    });

    // eslint-disable-next-line quotes
    const workerName = '__maptalks.three__';
    function getWorkerName() {
        return workerName;
    }

    let MeshActor;
    if (maptalks__namespace.worker) {
        MeshActor = class extends maptalks__namespace.worker.Actor {
            test(info, cb) {
                //send data to worker thread
                this.send(info, null, cb);
            }
            pushQueue(q = {}) {
                const { type, data, callback, layer, key, center, lineStrings, options, id, baseOptions } = q;
                let params;
                if (type.indexOf('ExtrudePolygon') > -1) {
                    params = gengerateExtrudePolygons(data, center, layer, options, baseOptions);
                }
                else if (type === 'ExtrudeLines' || type === 'Paths') {
                    params = gengerateExtrudeLines(data, center, layer, lineStrings, options, baseOptions);
                }
                else if (type === 'Point') ;
                else if (type === 'Line' || type === 'FatLine') {
                    params = gengerateLines(data, center, layer, lineStrings, options, baseOptions);
                }
                else if (type === 'Lines' || type === 'FatLines') {
                    params = gengerateLines(data, center, layer, lineStrings, options, baseOptions);
                }
                else if (type === 'ExtrudeLine' || type === 'Path') {
                    params = gengerateExtrudeLines(data, center, layer, lineStrings, options, baseOptions);
                }
                else if (type === 'Bar' || type === 'Bars') {
                    params = generateBars(data);
                }
                if (!params) {
                    console.error(`No processing logic found for type:${type}`);
                    return;
                }
                this.send({ type, datas: params.datas, glRes: params.glRes, matrix: params.matrix, center: params.center }, params.transfer, function (err, message) {
                    if (err) {
                        console.error(err);
                    }
                    message.key = key;
                    message.id = id;
                    callback(message);
                });
            }
        };
    }
    var actor$1;
    function getActor() {
        if (!maptalks__namespace.worker) {
            console.error('maptalks.worker is not defined,You can\'t use ThreeVectorTileLayer');
        }
        if (!actor$1 && MeshActor) {
            actor$1 = new MeshActor(getWorkerName());
        }
        return actor$1;
    }
    /**
     *
     * @param distance
     * @param layer
     * @param altCache
     * @returns
     */
    function getDistance(distance, layer, altCache = {}) {
        if (distance !== undefined && typeof distance === 'number' && distance !== 0) {
            if (altCache[distance] === undefined) {
                altCache[distance] = layer.distanceToVector3(distance, distance).x;
            }
            return altCache[distance];
        }
        return 0;
    }
    function getAltitude(altitude, layer, altCache = {}) {
        if (altitude !== undefined && typeof altitude === 'number' && altitude !== 0) {
            if (altCache[altitude] === undefined) {
                altCache[altitude] = layer.altitudeToVector3(altitude, altitude).x;
            }
            return altCache[altitude];
        }
        return 0;
    }
    function mergeOptions(properties, baseOptions) {
        if (!baseOptions) {
            return properties || {};
        }
        return Object.assign({}, baseOptions, properties);
    }
    /**
     * generate extrudepolygons data for worker
     * @param {*} polygons
     * @param {*} layer
     */
    function gengerateExtrudePolygons(polygons = [], center, layer, options = [], baseOptions) {
        const isMercator = layer.isMercator();
        let glRes, matrix;
        if (isMercator) {
            const map = layer.getMap();
            glRes = map.getGLRes();
            matrix = map.getSpatialReference().getTransformation().matrix;
        }
        let centerPt;
        if (center) {
            centerPt = layer.coordinateToVector3(center);
        }
        const len = polygons.length;
        const datas = [], transfer = [], altCache = {};
        for (let i = 0; i < len; i++) {
            const polygon = polygons[i];
            const p = polygon;
            let properties = options[i] ? options[i] : getPolygonProperties(p);
            properties = mergeOptions(properties, baseOptions);
            if (!center) {
                centerPt = layer.coordinateToVector3(properties.center);
            }
            let data;
            if (isMercator) {
                data = getPolygonArrayBuffer(polygon);
            }
            else {
                data = getPolygonPositions(polygon, layer, properties.center || center, centerPt, true);
            }
            for (let j = 0, len1 = data.length; j < len1; j++) {
                const d = data[j];
                for (let m = 0, len2 = d.length; m < len2; m++) {
                    //ring
                    transfer.push(d[m]);
                }
            }
            let height = properties.height || 1;
            let bottomHeight = properties.bottomHeight || 0;
            height = getAltitude(height, layer, altCache);
            bottomHeight = getAltitude(bottomHeight, layer, altCache);
            const d = {
                id: properties.id,
                data,
                height,
                bottomHeight
            };
            if (isMercator) {
                d.center = [centerPt.x, centerPt.y];
            }
            datas.push(d);
            //delete Internal properties
            if (p._properties) {
                delete p._properties;
            }
        }
        return {
            datas,
            transfer,
            glRes,
            matrix,
            center: isMercator ? [centerPt.x, centerPt.y] : null
        };
    }
    /**
     * generate ExtrudeLines data for worker
     * @param {*} lineStringList
     * @param {*} center
     * @param {*} layer
     */
    function gengerateExtrudeLines(lineStringList, center, layer, lineStrings, options = [], baseOptions) {
        const isMercator = layer.isMercator();
        let glRes, matrix;
        if (isMercator) {
            const map = layer.getMap();
            glRes = map.getGLRes();
            matrix = map.getSpatialReference().getTransformation().matrix;
        }
        let centerPt;
        if (center) {
            centerPt = layer.coordinateToVector3(center);
        }
        const datas = [], transfer = [], cache = {}, altCache = {};
        const len = lineStringList.length;
        for (let i = 0; i < len; i++) {
            const multiLineString = lineStringList[i];
            let properties = options[i] ? options[i] : getLineStringProperties(lineStrings[i]);
            properties = mergeOptions(properties, baseOptions);
            if (!center) {
                centerPt = layer.coordinateToVector3(properties.center);
            }
            let width = properties.width || 1;
            let height = properties.height || 1;
            let cornerRadius = properties.cornerRadius || 0;
            let bottomHeight = properties.bottomHeight || 0;
            //for ExtrudeLineTrail ,slice lines the center is lineCenter
            const parentCenter = properties.parentCenter;
            width = getDistance(width, layer, cache);
            cornerRadius = getDistance(cornerRadius, layer, cache);
            height = getAltitude(height, layer, altCache);
            bottomHeight = getAltitude(bottomHeight, layer, altCache);
            const data = [];
            for (let j = 0, len1 = multiLineString.length; j < len1; j++) {
                const lineString = multiLineString[j];
                let arrayBuffer;
                if (isMercator) {
                    arrayBuffer = getLineArrayBuffer(lineString, layer);
                }
                else {
                    arrayBuffer = getLinePosition(lineString, layer, parentCenter || center, false).arrayBuffer;
                }
                transfer.push(arrayBuffer);
                data.push(arrayBuffer);
            }
            const d = {
                id: properties.id,
                data,
                height,
                width,
                cornerRadius,
                bottomHeight
            };
            if (isMercator) {
                d.center = [centerPt.x, centerPt.y];
            }
            datas.push(d);
        }
        return {
            datas,
            transfer,
            glRes,
            matrix,
            center: isMercator ? [centerPt.x, centerPt.y] : null
        };
    }
    /**
     * generate Lines data for worker
     * @param lineStringList
     * @param center
     * @param layer
     * @param lineStrings
     * @param options
     * @returns
     */
    function gengerateLines(lineStringList, center, layer, lineStrings, options = [], baseOptions) {
        const isMercator = layer.isMercator();
        let glRes, matrix;
        if (isMercator) {
            const map = layer.getMap();
            glRes = map.getGLRes();
            matrix = map.getSpatialReference().getTransformation().matrix;
        }
        let centerPt;
        if (center) {
            centerPt = layer.coordinateToVector3(center);
        }
        const datas = [], transfer = [], altCache = {};
        const len = lineStringList.length;
        for (let i = 0; i < len; i++) {
            const multiLineString = lineStringList[i];
            let properties = options[i] ? options[i] : getLineStringProperties(lineStrings[i]);
            properties = mergeOptions(properties, baseOptions);
            if (!center) {
                centerPt = layer.coordinateToVector3(properties.center);
            }
            let bottomHeight = properties.bottomHeight || 0;
            bottomHeight = getAltitude(bottomHeight, layer, altCache);
            const data = [];
            for (let j = 0, len1 = multiLineString.length; j < len1; j++) {
                const lineString = multiLineString[j];
                if (isMercator) {
                    const arrayBuffer = getLineArrayBuffer(lineString, layer);
                    transfer.push(arrayBuffer);
                    data.push(arrayBuffer);
                }
                else {
                    const arrayBuffer = getLinePosition(lineString, layer, center, false).arrayBuffer;
                    transfer.push(arrayBuffer);
                    data.push(arrayBuffer);
                }
            }
            const d = {
                id: properties.id,
                data,
                bottomHeight
            };
            if (isMercator) {
                d.center = [centerPt.x, centerPt.y];
            }
            datas.push(d);
        }
        return {
            datas,
            transfer,
            glRes,
            matrix,
            center: isMercator ? [centerPt.x, centerPt.y] : null
        };
    }
    function generateBars(data) {
        const len = data.length;
        const datas = new Float32Array(len * 7);
        let idx = 0;
        for (let i = 0; i < len; i++) {
            let { center, radialSegments, radius, height, altitude, id } = data[i];
            center = center || [0, 0];
            datas[idx] = center[0];
            datas[idx + 1] = center[1];
            datas[idx + 2] = radialSegments || 6;
            datas[idx + 3] = radius || 1;
            datas[idx + 4] = height;
            datas[idx + 5] = altitude || 0;
            datas[idx + 6] = id;
            idx += 7;
        }
        const buffer = datas.buffer;
        return {
            datas: buffer, transfer: [buffer]
        };
    }

    function getDatas(queues) {
        return queues.map(q => {
            return q.data;
        });
    }
    function getOptions(queues) {
        return queues.map(q => {
            return q.option || q.baseObject.getOptions();
        });
    }
    class BaseObjectTask {
        constructor() {
            this.queueMap = {};
            this.tempQueue = [];
            this.time = this.getCurrentTime();
            this.deQueueCount = 5;
            this.resultQueue = [];
        }
        getActor() {
            return getActor();
        }
        getCurrentTime() {
            return maptalks__namespace.Util.now();
        }
        loop() {
            this.deQueue();
        }
        push(data) {
            this.tempQueue.push(data);
            if (data.id) {
                this.queueMap[data.id] = data;
            }
            return this;
        }
        reset() {
            this.time = this.getCurrentTime();
            this.tempQueue = [];
            return this;
        }
        pushResult(result) {
            if (!result) {
                return;
            }
            if (!Array.isArray(result)) {
                result = [result];
            }
            result.forEach(d => {
                this.resultQueue.push(d);
            });
            return this;
        }
        deQueue() {
            if (!this.resultQueue.length) {
                return this;
            }
            const count = this.deQueueCount;
            const resultList = this.resultQueue.slice(0, count) || [];
            resultList.forEach(result => {
                const { id } = result;
                if (this.queueMap[id]) {
                    const { baseObject } = this.queueMap[id];
                    if (baseObject && baseObject._workerLoad) {
                        const layer = baseObject.getLayer();
                        if (layer) {
                            baseObject._workerLoad(result);
                        }
                        else {
                            console.warn(baseObject, ' worker Processing completed but removed from the layer');
                        }
                    }
                    delete this.queueMap[id];
                }
            });
            this.resultQueue.splice(0, count);
            return this;
        }
    }
    class ExtrudePolygonTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'ExtrudePolygon',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class ExtrudePolygonsTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'ExtrudePolygons',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        center: queue.center,
                        baseOptions: queue.option,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class ExtrudeLineTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'ExtrudeLine',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    lineStrings: this.tempQueue.map(q => {
                        return q.lineString;
                    }),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class ExtrudeLinesTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'ExtrudeLines',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        lineStrings: queue.lineStrings,
                        center: queue.center,
                        baseOptions: queue.option,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class LineTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 200;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'Line',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    lineStrings: this.tempQueue.map(q => {
                        return q.lineString;
                    }),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class LinesTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'Lines',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        lineStrings: queue.lineStrings,
                        center: queue.center,
                        baseOptions: queue.option,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class FatLineTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'FatLine',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    lineStrings: this.tempQueue.map(q => {
                        return q.lineString;
                    }),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class FatLinesTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'FatLines',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        lineStrings: queue.lineStrings,
                        center: queue.center,
                        baseOptions: queue.option,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class BarTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'Bar',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class BarsTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 1;
        }
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'Bars',
                        layer: queue.layer,
                        data: queue.data,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class PathTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'Path',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    lineStrings: this.tempQueue.map(q => {
                        return q.lineString;
                    }),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class PathsTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'Paths',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        lineStrings: queue.lineStrings,
                        center: queue.center,
                        baseOptions: queue.option,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    const ExtrudePolygonTaskIns = new ExtrudePolygonTask();
    const ExtrudePolygonsTaskIns = new ExtrudePolygonsTask();
    const ExtrudeLineTaskIns = new ExtrudeLineTask();
    const ExtrudeLinesTaskIns = new ExtrudeLinesTask();
    const LineTaskIns = new LineTask();
    const LinesTaskIns = new LinesTask();
    const FatLineTaskIns = new FatLineTask();
    const FatLinesTaskIns = new FatLinesTask();
    const BarTaskIns = new BarTask();
    const BarsTaskIns = new BarsTask();
    const PathTaskIns = new PathTask();
    const PathsTaskIns = new PathsTask();
    const BaseObjectTaskManager = {
        isRunning: false,
        tasks: [],
        addTask: (taskIns) => {
            if (taskIns) {
                BaseObjectTaskManager.tasks.push(taskIns);
            }
        },
        removeTask: (taskIns) => {
            BaseObjectTaskManager.tasks.splice(BaseObjectTaskManager.tasks.indexOf(taskIns), 1);
        },
        loop() {
            ExtrudePolygonTaskIns.loop();
            ExtrudePolygonsTaskIns.loop();
            ExtrudeLineTaskIns.loop();
            ExtrudeLinesTaskIns.loop();
            LineTaskIns.loop();
            LinesTaskIns.loop();
            FatLineTaskIns.loop();
            FatLinesTaskIns.loop();
            BarTaskIns.loop();
            BarsTaskIns.loop();
            PathTaskIns.loop();
            PathsTaskIns.loop();
            BaseObjectTaskManager.tasks.forEach(taskIns => {
                if (taskIns && taskIns.loop) {
                    taskIns.loop();
                }
            });
            maptalks__namespace.Util.requestAnimFrame(BaseObjectTaskManager.loop);
        },
        star() {
            if (!BaseObjectTaskManager.isRunning) {
                BaseObjectTaskManager.isRunning = true;
                BaseObjectTaskManager.loop();
            }
        }
    };

    function mergeBufferGeometries(geometries) {
        const { position, normal, uv, indices } = mergeBufferGeometriesAttribute(geometries);
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        const color = new Float32Array(position.length);
        color.fill(1, 0, position.length);
        addAttribute(bufferGeomertry, 'color', new THREE__namespace.BufferAttribute(color, 3));
        addAttribute(bufferGeomertry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(bufferGeomertry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        if (uv && uv.length) {
            addAttribute(bufferGeomertry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        }
        bufferGeomertry.setIndex(new THREE__namespace.BufferAttribute(indices, 1));
        return bufferGeomertry;
    }
    function mergeBufferGeometriesAttribute(geometries) {
        const attributes = {}, attributesLen = {};
        for (let i = 0; i < geometries.length; ++i) {
            const geometry = geometries[i];
            for (const name in geometry) {
                if (attributes[name] === undefined) {
                    attributes[name] = [];
                    attributesLen[name] = 0;
                }
                attributes[name].push(geometry[name]);
                attributesLen[name] += geometry[name].length;
            }
        }
        // merge attributes
        const mergedGeometry = {};
        let indexOffset = 0;
        const mergedIndex = new Uint32Array(attributesLen['indices']);
        for (const name in attributes) {
            if (name === 'indices') {
                const indices = attributes[name];
                let iIndex = 0;
                for (let i = 0, len = indices.length; i < len; i++) {
                    const index = indices[i];
                    for (let j = 0, len1 = index.length; j < len1; j++) {
                        mergedIndex[iIndex] = index[j] + indexOffset;
                        iIndex++;
                        // mergedIndex.push(index[j] + indexOffset);
                    }
                    indexOffset += attributes['position'][i].length / 3;
                }
            }
            else {
                const mergedAttribute = mergeBufferAttributes(attributes[name], attributesLen[name]);
                if (!mergedAttribute)
                    return null;
                mergedGeometry[name] = mergedAttribute;
            }
        }
        mergedGeometry['indices'] = mergedIndex;
        return mergedGeometry;
    }
    function mergeBufferAttributes(attributes, arrayLength) {
        const array = new Float32Array(arrayLength);
        let offset = 0;
        for (let i = 0; i < attributes.length; ++i) {
            array.set(attributes[i], offset);
            offset += attributes[i].length;
        }
        return array;
    }
    function generateBufferGeometry(data) {
        //arraybuffer data
        const { position, normal, uv, indices } = data;
        // const color = new Float32Array(position.length);
        // color.fill(1, 0, position.length);
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        // addAttribute(bufferGeomertry, 'color', new THREE.BufferAttribute(color, 3));
        addAttribute(bufferGeomertry, 'normal', new THREE__namespace.BufferAttribute(new Float32Array(normal), 3));
        addAttribute(bufferGeomertry, 'position', new THREE__namespace.BufferAttribute(new Float32Array(position), 3));
        addAttribute(bufferGeomertry, 'uv', new THREE__namespace.BufferAttribute(new Float32Array(uv), 2));
        bufferGeomertry.setIndex(new THREE__namespace.BufferAttribute(new Uint32Array(indices), 1));
        return bufferGeomertry;
    }
    function generatePickBufferGeometry(geometry) {
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        addAttribute(bufferGeomertry, 'normal', geometry.getAttribute('normal'));
        addAttribute(bufferGeomertry, 'position', geometry.getAttribute('position').clone());
        bufferGeomertry.setIndex(geometry.getIndex());
        return bufferGeomertry;
    }
    let defaultBufferGeometry;
    function getDefaultBufferGeometry() {
        if (!defaultBufferGeometry) {
            const SIZE = 0.000001;
            defaultBufferGeometry = getBoxGeometry(SIZE, SIZE, SIZE);
        }
        return defaultBufferGeometry;
    }
    getDefaultBufferGeometry();

    var MergeGeometryUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        mergeBufferGeometries: mergeBufferGeometries,
        mergeBufferGeometriesAttribute: mergeBufferGeometriesAttribute,
        generateBufferGeometry: generateBufferGeometry,
        generatePickBufferGeometry: generatePickBufferGeometry,
        getDefaultBufferGeometry: getDefaultBufferGeometry
    });

    // type Cache = {
    //     [key: number]: THREE.BufferGeometry
    // }
    // const barGeometryCache: Cache = {};
    const defaultBoxGeometry = getBoxGeometry(1, 1, 1);
    defaultBoxGeometry.translate(0, 0, 0.5);
    const topColor = new THREE__namespace.Color('#fff'), bottomColor = new THREE__namespace.Color('#fff');
    // function getDefaultCylinderBufferGeometry(radialSegments: number = 6): THREE.BufferGeometry {
    //     if (!barGeometryCache[radialSegments]) {
    //         const geometry = new THREE.CylinderBufferGeometry(1, 1, 1, radialSegments, 1);
    //         geometry.rotateX(Math.PI / 2);
    //         geometry.translate(0, 0, 0.5);
    //         geometry.rotateZ(Math.PI / 6);
    //         barGeometryCache[radialSegments] = geometry;
    //     }
    //     return barGeometryCache[radialSegments];
    // }
    function getClylinderGeometry(property) {
        const { position, normal, uv, indices } = polyExtrude$2.exports.cylinder(property.center || [0, 0], property);
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        addAttribute(bufferGeomertry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(bufferGeomertry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        addAttribute(bufferGeomertry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        bufferGeomertry.setIndex(new THREE__namespace.BufferAttribute(indices, 1));
        return bufferGeomertry;
    }
    /**
     * Reuse Geometry   , Meter as unit
     * @param {*} property
     */
    // eslint-disable-next-line no-unused-vars
    function getGeometry(property) {
        // const {
        //     height,
        //     radialSegments,
        //     radius
        // } = property;
        // const geometry = getDefaultCylinderBufferGeometry(radialSegments).clone();
        // geometry.scale(radius, radius, height);
        // return geometry;
        const options = Object.assign({}, property);
        if (options._radius) {
            options.radius = options._radius;
        }
        return getClylinderGeometry(options);
    }
    /**
     * init Colors
     * @param {*} geometry
     * @param {*} color
     * @param {*} _topColor
     */
    function initVertexColors(geometry, color, _topColor, key = 'y', minZ = 0) {
        let offset = 0;
        if (key === 'y') {
            offset = 1;
        }
        else if (key === 'z') {
            offset = 2;
        }
        const position = geometry.attributes.position.array;
        const len = position.length;
        bottomColor.setStyle(color);
        topColor.setStyle(_topColor);
        const colors = new Float32Array(len);
        if (Array.isArray(minZ)) {
            for (let i = 0, len = minZ.length; i < len; i++) {
                const { middleZ, start, end } = minZ[i].position;
                for (let j = start; j < end; j += 3) {
                    const z = position[j + 2];
                    if (z > middleZ) {
                        colors[j] = topColor.r;
                        colors[j + 1] = topColor.g;
                        colors[j + 2] = topColor.b;
                    }
                    else {
                        colors[j] = bottomColor.r;
                        colors[j + 1] = bottomColor.g;
                        colors[j + 2] = bottomColor.b;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < len; i += 3) {
                const y = position[i + offset];
                if (y > minZ) {
                    colors[i] = topColor.r;
                    colors[i + 1] = topColor.g;
                    colors[i + 2] = topColor.b;
                    // colors.push(topColor.r, topColor.g, topColor.b);
                }
                else {
                    colors[i] = bottomColor.r;
                    colors[i + 1] = bottomColor.g;
                    colors[i + 2] = bottomColor.b;
                    // colors.push(bottomColor.r, bottomColor.g, bottomColor.b);
                }
            }
        }
        addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
        return colors;
    }
    function mergeBarGeometry(geometries) {
        const attributes = [];
        const len = geometries.length;
        let colorLen = 0;
        for (let i = 0; i < len; i++) {
            const { color } = geometries[i].attributes;
            if (color) {
                colorLen += color.array.length;
            }
        }
        const colors = new Float32Array(colorLen);
        let offset = 0;
        for (let i = 0, len = geometries.length; i < len; i++) {
            const { color, normal, position, uv } = geometries[i].attributes;
            const index = geometries[i].index;
            if (color) {
                colors.set(color.array, offset);
                offset += color.array.length;
                // for (let j = 0, len1 = color.array.length; j < len1; j++) {
                //     colors.push(color.array[j]);
                // }
            }
            attributes.push({
                // color: color.array,
                normal: normal.array,
                uv: uv.array,
                position: position.array,
                indices: index.array
            });
        }
        const bufferGeometry = mergeBufferGeometries(attributes);
        if (colors.length) {
            addAttribute(bufferGeometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
            // for (let i = 0, len = colors.length; i < len; i++) {
            //     bufferGeometry.attributes.color.array[i] = colors[i];
            // }
        }
        for (let i = 0, len = geometries.length; i < len; i++) {
            geometries[i].dispose();
        }
        return bufferGeometry;
    }
    function getDefaultBoxGeometry() {
        return defaultBoxGeometry;
    }

    const OPTIONS$k = {
        radius: 10,
        height: 100,
        radialSegments: 6,
        altitude: 0,
        topColor: '',
        bottomColor: '#2d2f61',
        heightEnable: true
    };
    /**
     *
     */
    class Bar extends BaseObject {
        constructor(coordinate, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$k, options, { layer, coordinate });
            super();
            this._initOptions(options);
            const { height, radius, topColor, bottomColor, altitude, asynchronous } = options;
            options.height = layer.altitudeToVector3(height, height).x;
            options.radius = layer.distanceToVector3(radius, radius).x;
            let geometry;
            if (asynchronous) {
                geometry = getDefaultBufferGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                BarTaskIns.push({
                    data: { radius: options.radius, height: options.height, radialSegments: options.radialSegments, id },
                    layer,
                    id,
                    baseObject: this
                });
            }
            else {
                geometry = getGeometry(options);
                if (topColor) {
                    initVertexColors(geometry, bottomColor, topColor, 'z', options.height / 2);
                    material.vertexColors = getVertexColors();
                }
            }
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const position = layer.coordinateToVector3(coordinate, z);
            this.getObject3d().position.copy(position);
            this.type = 'Bar';
        }
        _workerLoad(data) {
            const bufferGeometry = generateBufferGeometry(data);
            const { topColor, bottomColor, height } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                const layer = this.getLayer();
                const extrudeH = layer.altitudeToVector3(height, height).x;
                initVertexColors(bufferGeometry, bottomColor, topColor, 'z', extrudeH / 2);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._fire('workerload', { target: this });
        }
    }

    function initColors(cs) {
        const colors = [];
        if (cs && cs.length) {
            cs.forEach(color => {
                color = (color instanceof THREE__namespace.Color ? color : new THREE__namespace.Color(color));
                colors.push(color.r, color.g, color.b);
            });
        }
        return colors;
    }
    const OPTIONS$j = {
        altitude: 0,
        bottomHeight: 0,
        colors: null
    };
    /**
     *
     */
    class Line extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$j, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { lineStrings, center } = LineStringSplit(lineString);
            const { asynchronous } = options;
            let geometry;
            if (asynchronous) {
                geometry = getDefaultLineGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                LineTaskIns.push({
                    id,
                    data: lineStrings,
                    layer,
                    key: options.key,
                    lineString,
                    baseObject: this
                });
            }
            else {
                const positionList = [];
                for (let i = 0, len = lineStrings.length; i < len; i++) {
                    const lineString = lineStrings[i];
                    const { positions } = getLinePosition(lineString, layer, center, false);
                    positionList.push(getLineSegmentPosition(positions));
                }
                const position = mergeLinePositions(positionList);
                geometry = new THREE__namespace.BufferGeometry();
                addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(position, 3));
                setBottomHeight(geometry, options.bottomHeight, layer);
                const colors = initColors(options.colors);
                if (colors && colors.length) {
                    addAttribute(geometry, 'color', new THREE__namespace.Float32BufferAttribute(colors, 3));
                    material.vertexColors = getVertexColors();
                }
            }
            this._createLineSegments(geometry, material);
            const { altitude } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this.type = 'Line';
        }
        _workerLoad(result) {
            const geometry = new THREE__namespace.BufferGeometry();
            addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(new Float32Array(result.position), 3));
            const colors = initColors(this.getOptions().colors);
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (colors && colors.length) {
                addAttribute(geometry, 'color', new THREE__namespace.Float32BufferAttribute(colors, 3));
                material.vertexColors = getVertexColors();
            }
            this._computeLineDistances(geometry);
            object3d.geometry = geometry;
            object3d.material.needsUpdate = true;
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$i = {
        bottomHeight: 0,
        width: 3,
        height: 1,
        altitude: 0,
        topColor: null,
        bottomColor: '#2d2f61',
        heightEnable: true
    };
    /**
     *
     */
    class ExtrudeLine extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$i, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { height, width, bottomColor, topColor, bottomHeight, altitude, asynchronous } = options;
            const h = layer.altitudeToVector3(height, height).x;
            const w = layer.distanceToVector3(width, width).x;
            const { lineStrings, center } = LineStringSplit(lineString);
            let geometry;
            if (asynchronous) {
                geometry = getDefaultBufferGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                ExtrudeLineTaskIns.push({
                    id,
                    data: lineStrings,
                    layer,
                    center,
                    lineString,
                    baseObject: this
                });
            }
            else {
                const extrudeParams = [];
                let minZ = 0;
                const cache = {};
                for (let i = 0, len = lineStrings.length; i < len; i++) {
                    const attribute = getExtrudeLineParams(lineStrings[i], w, h, layer, center);
                    minZ = setBottomHeight(attribute, bottomHeight, layer, cache);
                    extrudeParams.push(attribute);
                }
                geometry = mergeBufferGeometries(extrudeParams);
                if (topColor) {
                    initVertexColors$1(geometry, bottomColor, topColor, minZ + h / 2);
                    material.vertexColors = getVertexColors();
                }
            }
            this._createMesh(geometry, material);
            // const center = (isGeoJSON(lineString) ? getGeoJSONCenter(lineString) : lineString.getCenter());
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this.type = 'ExtrudeLine';
        }
        _workerLoad(result) {
            const bufferGeometry = generateBufferGeometry(result);
            const { topColor, bottomColor, bottomHeight, height } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                const layer = this.getLayer();
                const h = layer.altitudeToVector3(bottomHeight, bottomHeight).x;
                const extrudeH = layer.altitudeToVector3(height, height).x;
                initVertexColors$1(bufferGeometry, bottomColor, topColor, h + extrudeH / 2);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$h = {
        altitude: 0,
        height: 1,
        bottomHeight: 0,
        topColor: null,
        bottomColor: '#2d2f61',
        heightEnable: true
    };
    /**
     *
     */
    class ExtrudePolygon extends BaseObject {
        constructor(polygon, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$h, options, { layer, polygon });
            super();
            this._initOptions(options);
            const { height, topColor, bottomColor, altitude, bottomHeight, asynchronous } = options;
            let geometry;
            const center = (isGeoJSONPolygon(polygon) ? getGeoJSONCenter(polygon) : polygon.getCenter());
            if (asynchronous) {
                geometry = getDefaultBufferGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                ExtrudePolygonTaskIns.push({
                    data: polygon,
                    layer,
                    id,
                    baseObject: this
                });
            }
            else {
                geometry = getExtrudeGeometry(polygon, height, layer);
                const h = setBottomHeight(geometry, bottomHeight, layer);
                if (topColor) {
                    const extrudeH = layer.altitudeToVector3(height, height).x;
                    initVertexColors$1(geometry, bottomColor, topColor, h + extrudeH / 2);
                    material.vertexColors = getVertexColors();
                }
            }
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this.type = 'ExtrudePolygon';
        }
        _workerLoad(data) {
            const bufferGeometry = generateBufferGeometry(data);
            const { topColor, bottomColor, bottomHeight, height } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                const layer = this.getLayer();
                const h = layer.altitudeToVector3(bottomHeight, bottomHeight).x;
                const extrudeH = layer.altitudeToVector3(height, height).x;
                initVertexColors$1(bufferGeometry, bottomColor, topColor, h + extrudeH / 2);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$g = {
        altitude: 0,
        coordinate: null
    };
    /**
     * Model container
     */
    class Model extends BaseObject {
        constructor(model, options = {}, layer) {
            if (!options.coordinate) {
                console.warn('coordinate is null,it is important to locate the model');
                options.coordinate = layer.getMap().getCenter();
            }
            options = maptalks__namespace.Util.extend({}, OPTIONS$g, options, { layer, model });
            super();
            this._initOptions(options);
            this._createGroup();
            this.getObject3d().add(model);
            const { altitude, coordinate } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const position = layer.coordinateToVector3(coordinate, z);
            this.getObject3d().position.copy(position);
            this.type = 'Model';
        }
        getCoordinates() {
            const coordinate = this.options.coordinate;
            const altitude = this.options.altitude;
            const c = new maptalks__namespace.Coordinate(coordinate);
            c.z = altitude;
            return c;
        }
    }

    const PI = Math.PI / 180;
    const R = 6378137;
    const MINLENGTH = 0.1;
    function formatLineArray(polyline) {
        const lnglats = polyline.getCoordinates();
        return lnglats.map(lnglat => {
            return lnglat.toArray();
        });
    }
    function degreesToRadians(d) {
        return d * PI;
    }
    function distance(c1, c2) {
        if (!c1 || !c2) {
            return 0;
        }
        if (!Array.isArray(c1)) {
            c1 = c1.toArray();
        }
        if (!Array.isArray(c2)) {
            c2 = c2.toArray();
        }
        let b = degreesToRadians(c1[1]);
        const d = degreesToRadians(c2[1]), e = b - d, f = degreesToRadians(c1[0]) - degreesToRadians(c2[0]);
        b = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(e / 2), 2) + Math.cos(b) * Math.cos(d) * Math.pow(Math.sin(f / 2), 2)));
        b *= R;
        return Math.round(b * 1E5) / 1E5;
    }
    function lineLength(polyline) {
        let lnglatArray = polyline;
        if (!Array.isArray(polyline)) {
            lnglatArray = formatLineArray(polyline);
        }
        let l = 0;
        for (let i = 0, len = lnglatArray.length; i < len - 1; i++) {
            l += distance(lnglatArray[i], lnglatArray[i + 1]);
        }
        return l;
    }
    function getPercentLngLat(l, length) {
        const { len, c1, c2 } = l;
        const dx = c2[0] - c1[0], dy = c2[1] - c1[1];
        const percent = length / len;
        const lng = c1[0] + percent * dx;
        const lat = c1[1] + percent * dy;
        return [lng, lat];
    }
    /**
     * This is not an accurate line segment cutting method, but rough, in order to speed up the calculation,
     * the correct cutting algorithm can be referred to. http://turfjs.org/docs/#lineChunk
     * @param {*} cs
     * @param {*} lineChunkLength
     */
    function lineSlice(cs, lineChunkLength = 10) {
        lineChunkLength = Math.max(lineChunkLength, MINLENGTH);
        if (!Array.isArray(cs)) {
            cs = formatLineArray(cs);
        }
        const LEN = cs.length;
        let list = [];
        let totalLen = 0;
        for (let i = 0; i < LEN - 1; i++) {
            const len = distance(cs[i], cs[i + 1]);
            const floorlen = Math.floor(len);
            list.push({
                c1: cs[i],
                len: floorlen,
                c2: cs[i + 1]
            });
            totalLen += floorlen;
        }
        if (totalLen <= lineChunkLength) {
            const lnglats = list.map(d => {
                return [d.c1, d.c2];
            });
            return lnglats;
        }
        if (list.length === 1) {
            if (list[0].len <= lineChunkLength) {
                return [
                    [list[0].c1, list[0].c2]
                ];
            }
        }
        const LNGLATSLEN = list.length;
        const first = list[0];
        let idx = 0;
        let currentLngLat;
        let currentLen = 0;
        const lines = [];
        let lls = [first.c1];
        while (idx < LNGLATSLEN) {
            const { len, c2 } = list[idx];
            currentLen += len;
            if (currentLen < lineChunkLength) {
                lls.push(c2);
                if (idx === LNGLATSLEN - 1) {
                    lines.push(lls);
                }
                idx++;
            }
            if (currentLen === lineChunkLength) {
                lls.push(c2);
                currentLen = 0;
                lines.push(lls);
                //next
                lls = [c2];
                idx++;
            }
            if (currentLen > lineChunkLength) {
                const offsetLen = (len - currentLen + lineChunkLength);
                currentLngLat = getPercentLngLat(list[idx], offsetLen);
                lls.push(currentLngLat);
                lines.push(lls);
                currentLen = 0;
                list[idx].c1 = currentLngLat;
                list[idx].len = len - offsetLen;
                //next
                lls = [];
                lls.push(currentLngLat);
            }
        }
        return lines;
    }

    var GeoUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        distance: distance,
        lineLength: lineLength,
        lineSlice: lineSlice
    });

    const MAX_POINTS = 1000;
    /**
     *
     * @param {THREE.BufferGeometry} geometry
     * @param {*} ps
     * @param {*} norls
     * @param {*} indices
     */
    function setExtrudeLineGeometryAttribute(geometry, ps, norls, indices) {
        const len = ps.length;
        geometry.attributes.normal.count = len;
        geometry.attributes.position.count = len;
        const positions = geometry.attributes.position.array;
        const normals = geometry.attributes.normal.array;
        for (let i = 0; i < len; i++) {
            positions[i] = ps[i];
            normals[i] = norls[i];
        }
        // geometry.index.array = new Uint16Array(indices.length);
        geometry.index.count = indices.length;
        // geometry.index.needsUpdate = true;
        for (let i = 0, len1 = indices.length; i < len1; i++) {
            geometry.index.array[i] = indices[i];
        }
        // geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
        // geometry.setDrawRange(0, len / 3);
    }
    const OPTIONS$f = {
        trail: 5,
        chunkLength: 50,
        width: 2,
        height: 1,
        speed: 1,
        altitude: 0,
        interactive: false,
        heightEnable: true
    };
    /**
     *
     */
    class ExtrudeLineTrail extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$f, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { width, height, altitude, speed, chunkLength, trail } = options;
            let center, coordinates;
            if (isGeoJSON(lineString)) {
                center = getGeoJSONCenter(lineString);
                coordinates = getGeoJSONCoordinates(lineString);
            }
            else {
                center = lineString.getCenter();
                coordinates = lineString;
            }
            const chunkLines = lineSlice(coordinates, chunkLength);
            const centerPt = layer.coordinateToVector3(center);
            //cache position for  faster computing,reduce double counting
            // const positionMap: { [key: string]: THREE.Vector3 } = {};
            // const positions = getChunkLinesPosition(chunkLines.slice(0, 1), layer, positionMap, centerPt).positionsV;
            //generate geometry
            const geometry = new THREE__namespace.BufferGeometry();
            const ps = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
            const norls = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
            const inds = new Uint16Array(MAX_POINTS);
            addAttribute(geometry, 'position', (new THREE__namespace.BufferAttribute(ps, 3)));
            addAttribute(geometry, 'normal', (new THREE__namespace.BufferAttribute(norls, 3)));
            geometry.setIndex(new THREE__namespace.BufferAttribute(inds, 1));
            const lineWidth = layer.distanceToVector3(width, width).x;
            const depth = layer.altitudeToVector3(height, height).x;
            // const params = getExtrudeLineParams(positions, lineWidth, depth, layer);
            // setExtrudeLineGeometryAttribute(geometry, params.position, params.normal, params.indices);
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this._params = {
                index: 0,
                chunkLines,
                geometries: [],
                layer,
                trail: Math.max(1, trail),
                lineWidth,
                depth,
                speed: Math.min(1, speed),
                idx: 0,
                loaded: true,
                center,
                // positionMap,
                centerPt,
                workerInitCount: 0
            };
            this._init(this._params);
            this.type = 'ExtrudeLineTrail';
        }
        /**
         * Follow-up support for adding webworker
         * @param {*} params
         */
        _init(params) {
            const { layer, trail, lineWidth, depth, chunkLines, positionMap, centerPt, center } = params;
            const len = chunkLines.length, geometries = [];
            if (this.options.asynchronous) {
                params.loaded = false;
                const parentId = maptalks__namespace.Util.GUID();
                for (let i = 0; i < len; i++) {
                    const lines = chunkLines.slice(i, i + trail);
                    const coordinates = mergeChunkLineCoordinates(lines);
                    const lineString = {
                        type: 'Feature',
                        geometry: {
                            type: "LineString",
                            coordinates
                        }
                    };
                    const id = `${parentId}-${i}`;
                    const option = maptalks__namespace.Util.extend({}, this.options);
                    option.parentCenter = center;
                    option.id = id;
                    option.center = center;
                    ExtrudeLineTaskIns.push({
                        id,
                        data: [lineString],
                        layer,
                        center,
                        lineString,
                        baseObject: this,
                        option
                    });
                }
            }
            else {
                for (let i = 0; i < len; i++) {
                    const lines = chunkLines.slice(i, i + trail);
                    const ps = getChunkLinesPosition(lines, layer, positionMap, centerPt).positionsV;
                    geometries.push(getExtrudeLineParams(ps, lineWidth, depth, layer));
                }
            }
        }
        _animation() {
            const { index, geometries, speed, idx, chunkLines, trail, lineWidth, depth, loaded, layer, positionMap, centerPt } = this._params;
            if (!loaded)
                return;
            const i = Math.round(index);
            if (i > idx && i <= chunkLines.length - 1) {
                // console.log(i, geometries.length);
                this._params.idx++;
                let p = geometries[i];
                //if not init, this is will running
                if (!p) {
                    const lines = chunkLines.slice(i, i + trail);
                    const ps = getChunkLinesPosition(lines, layer, positionMap, centerPt).positionsV;
                    p = getExtrudeLineParams(ps, lineWidth, depth, layer);
                    geometries[i] = p;
                }
                const object3d = this.getObject3d();
                setExtrudeLineGeometryAttribute(object3d.geometry, p.position, p.normal, p.indices);
                object3d.geometry.attributes.position.needsUpdate = true;
                object3d.geometry.attributes.normal.needsUpdate = true;
                object3d.geometry.index.needsUpdate = true;
            }
            if (index >= chunkLines.length - 1) {
                this._params.index = -1;
                this._params.idx = -1;
            }
            this._params.index += speed;
        }
        _workerLoad(result) {
            if (!result) {
                return this;
            }
            const { id, indices, position, normal, uv } = result;
            if (!id || !indices || !position || !normal || !uv) {
                return;
            }
            let index = id.split('-')[1];
            index = parseInt(index);
            if (maptalks__namespace.Util.isNumber(index)) {
                const geometries = this._params.geometries;
                geometries[index] = {
                    indices: new Uint32Array(indices),
                    position: new Float32Array(position),
                    uv: new Float32Array(uv),
                    normal: new Float32Array(normal)
                };
                this._params.workerInitCount++;
            }
            if (this._params.workerInitCount === this._params.chunkLines.length) {
                this._params.loaded = true;
                this._fire('workerload', { target: this });
            }
        }
    }

    const EVENTS$1 = ['click', 'mousemove', 'mousedown', 'mouseup', 'dblclick', 'contextmenu'].join(' ').toString();
    const defaultMaterial = new THREE__namespace.MeshBasicMaterial();
    defaultMaterial.vertexColors = getVertexColors();
    /**
     * This is for the merger, MergedExtrudeMesh,Points ...
     * @param {*} Base
     */
    const MergedMixin = (Base) => {
        return class extends Base {
            // this._faceMap=[];
            // this._baseObjects = [];
            // this._datas = [];
            // this.faceIndex = null;
            // this.index=null;
            // this._geometriesAttributes = [];
            // this._geometryCache = geometry.clone();
            // this.isHide = false;
            /**
             *
             * @param {*} baseObjects
             */
            _initBaseObjectsEvent(baseObjects) {
                if (baseObjects && Array.isArray(baseObjects) && baseObjects.length) {
                    for (let i = 0, len = baseObjects.length; i < len; i++) {
                        const baseObject = baseObjects[i];
                        this._proxyEvent(baseObject);
                    }
                }
                return this;
            }
            /**
             *Events representing the merge
             * @param {*} baseObject
             */
            _proxyEvent(baseObject) {
                baseObject.on('add', (e) => {
                    this._showGeometry(e.target, true);
                });
                baseObject.on('remove', (e) => {
                    this._showGeometry(e.target, false);
                });
                baseObject.on('mouseout', (e) => {
                    this._mouseover = false;
                    this.fire('mouseout', Object.assign({}, e, { target: this, selectMesh: (this.getSelectMesh ? this.getSelectMesh() : null) }));
                    // this._showGeometry(e.target, false);
                });
                baseObject.on(EVENTS$1, (e) => {
                    this.fire(e.type, Object.assign({}, e, { target: this, selectMesh: (this.getSelectMesh ? this.getSelectMesh() : null) }));
                });
            }
            /**
             * Get the index of the monomer to be hidden
             * @param {*} attribute
             */
            _getHideGeometryIndex(attribute) {
                const indexs = [];
                let count = 0;
                for (let i = 0, len = this._geometriesAttributes.length; i < len; i++) {
                    if (this._geometriesAttributes[i].hide === true) {
                        indexs.push(i);
                        count += this._geometriesAttributes[i][attribute].count;
                    }
                }
                return {
                    indexs,
                    count
                };
            }
            /**
             * update geometry attributes
             * @param {*} bufferAttribute
             * @param {*} attribute
             */
            _updateAttribute(bufferAttribute, attribute) {
                const { indexs } = this._getHideGeometryIndex(attribute);
                const array = this._geometryCache.attributes[attribute].array;
                const len = array.length;
                for (let i = 0; i < len; i++) {
                    bufferAttribute.array[i] = array[i];
                }
                let value = NaN;
                if (this.getObject3d() instanceof THREE__namespace.LineSegments) {
                    value = 0;
                }
                for (let j = 0; j < indexs.length; j++) {
                    const index = indexs[j];
                    const { start, end } = this._geometriesAttributes[index][attribute];
                    for (let i = start; i < end; i++) {
                        bufferAttribute.array[i] = value;
                    }
                }
                return this;
            }
            /**
             * show or hide monomer
             * @param {*} baseObject
             * @param {*} isHide
             */
            _showGeometry(baseObject, isHide) {
                let index;
                if (baseObject) {
                    index = baseObject.getOptions().index;
                }
                if (index != null) {
                    const geometryAttributes = this._geometriesAttributes[index];
                    const { hide } = geometryAttributes;
                    if (hide === isHide) {
                        return this;
                    }
                    geometryAttributes.hide = isHide;
                    const buffGeom = this.getObject3d().geometry;
                    this._updateAttribute(buffGeom.attributes.position, 'position');
                    // this._updateAttribute(buffGeom.attributes.normal, 'normal', 3);
                    // this._updateAttribute(buffGeom.attributes.color, 'color', 3);
                    // this._updateAttribute(buffGeom.attributes.uv, 'uv', 2);
                    buffGeom.attributes.position.needsUpdate = true;
                    // buffGeom.attributes.color.needsUpdate = true;
                    // buffGeom.attributes.normal.needsUpdate = true;
                    // buffGeom.attributes.uv.needsUpdate = true;
                    this.isHide = isHide;
                }
                return this;
            }
            /**
             * Get selected monomer
             */
            // eslint-disable-next-line consistent-return
            getSelectMesh() {
                const index = this._getIndex();
                if (index != null) {
                    return {
                        data: this._datas[index],
                        baseObject: this._baseObjects[index]
                    };
                }
            }
            _getIndex(faceIndex) {
                if (faceIndex == null) {
                    faceIndex = this.faceIndex || this.index;
                }
                return faceIndex;
            }
            _init() {
                const pick = this.getLayer().getPick();
                this.on('add', () => {
                    pick.add(this.pickObject3d);
                });
                this.on('remove', () => {
                    pick.remove(this.pickObject3d);
                });
            }
            //Different objects need to implement their own methods
            _setPickObject3d() {
                if (!this._colorMap) {
                    return;
                }
                // multiplexing geometry
                const geometry = this._geometryCache || this.getObject3d().geometry.clone();
                const pick = this.getLayer().getPick();
                const { _geometriesAttributes } = this;
                const len = _geometriesAttributes.length;
                const colors = getGeometriesColorArray(_geometriesAttributes);
                let cIndex = 0;
                for (let i = 0; i < len; i++) {
                    const color = pick.getColor();
                    const colorIndex = color.getHex();
                    this._colorMap[colorIndex] = i;
                    const { count } = _geometriesAttributes[i].position;
                    this._datas[i].colorIndex = colorIndex;
                    for (let j = 0; j < count; j++) {
                        colors[cIndex] = color.r;
                        colors[cIndex + 1] = color.g;
                        colors[cIndex + 2] = color.b;
                        cIndex += 3;
                    }
                }
                addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
                // const material = new THREE.MeshBasicMaterial();
                // material.vertexColors = THREE.VertexColors;
                const color = pick.getColor();
                const colorIndex = color.getHex();
                const mesh = new THREE__namespace.Mesh(geometry, defaultMaterial);
                mesh.position.copy(this.getObject3d().position);
                mesh['_colorIndex'] = colorIndex;
                this.setPickObject3d(mesh);
            }
        };
    };

    const OPTIONS$e = {
        altitude: 0,
        height: 1,
        bottomHeight: 0,
        topColor: null,
        bottomColor: '#2d2f61',
    };
    const TEMP_COORD$1 = new maptalks__namespace.Coordinate(0, 0);
    class ExtrudePolygons extends MergedMixin(BaseObject) {
        constructor(polygons, options, material, layer) {
            if (!Array.isArray(polygons)) {
                polygons = [polygons];
            }
            const len = polygons.length;
            if (len === 0) {
                console.error('polygons is empty');
            }
            // const centers = [];
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (let i = 0; i < len; i++) {
                const polygon = polygons[i];
                const center = (polygon.getCenter ? polygon.getCenter() : getGeoJSONCenter(polygon, TEMP_COORD$1));
                let x, y;
                if (Array.isArray(center)) {
                    x = center[0];
                    y = center[1];
                }
                else if (center instanceof maptalks__namespace.Coordinate) {
                    x = center.x;
                    y = center.y;
                }
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
            // Get the center point of the point set
            const center = new maptalks__namespace.Coordinate((minX + maxX) / 2, (minY + maxY) / 2);
            options = maptalks__namespace.Util.extend({}, OPTIONS$e, options, { layer, polygons, coordinate: center });
            const { topColor, bottomColor, altitude, asynchronous } = options;
            let bufferGeometry;
            const extrudePolygons = [], geometriesAttributes = [];
            super();
            if (asynchronous) {
                bufferGeometry = getDefaultBufferGeometry();
                ExtrudePolygonsTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    layer,
                    key: options.key,
                    center,
                    data: polygons,
                    baseObject: this,
                    option: options,
                });
            }
            else {
                const centerPt = layer.coordinateToVector3(center);
                const geometries = [];
                let psIndex = 0;
                const altCache = {};
                for (let i = 0; i < len; i++) {
                    const polygon = polygons[i];
                    const opts = maptalks__namespace.Util.extend({}, options, getPolygonProperties(polygon));
                    const height = opts.height || 1;
                    const bottomHeight = opts.bottomHeight || 0;
                    const buffGeom = getExtrudeGeometryParams(polygon, height, layer, center, centerPt, altCache);
                    geometries.push(buffGeom);
                    const minZ = setBottomHeight(buffGeom, bottomHeight, layer, altCache);
                    // const extrudePolygon = new ExtrudePolygon(polygon, Object.assign({}, options, { height, index: i }), material, layer);
                    // extrudePolygons.push(extrudePolygon);
                    const { position, normal, uv, indices } = buffGeom;
                    indices.length / 3;
                    const psCount = position.length / 3; 
                    //  colorCount = buffGeom.attributes.color.count,
                    normal.length / 3; uv.length / 2;
                    geometriesAttributes[i] = {
                        position: {
                            middleZ: minZ + altCache[height] / 2,
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        // normal: {
                        //     count: normalCount,
                        //     start: normalIndex,
                        //     end: normalIndex + normalCount * 3,
                        // },
                        // // color: {
                        // //     count: colorCount,
                        // //     start: colorIndex,
                        // //     end: colorIndex + colorCount * 3,
                        // // },
                        // uv: {
                        //     count: uvCount,
                        //     start: uvIndex,
                        //     end: uvIndex + uvCount * 2,
                        // },
                        hide: false
                    };
                    psIndex += psCount * 3;
                }
                bufferGeometry = mergeBufferGeometries(geometries);
                if (topColor) {
                    initVertexColors$1(bufferGeometry, bottomColor, topColor, geometriesAttributes);
                    material.vertexColors = getVertexColors();
                }
            }
            this._initOptions(options);
            this._createMesh(bufferGeometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            //Face corresponding to monomer
            // this._faceMap = faceMap;
            this._baseObjects = extrudePolygons;
            this._datas = polygons;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(extrudePolygons);
            if (!asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'ExtrudePolygons';
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const polygon = this._datas[index];
                    const opts = Object.assign({}, this.options, isGeoJSONPolygon(polygon) ? polygon.properties : polygon.getProperties(), { index });
                    this._baseObjects[index] = new ExtrudePolygon(polygon, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const bufferGeometry = generateBufferGeometry(result);
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            const { topColor, bottomColor } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                initVertexColors$1(bufferGeometry, bottomColor, topColor, geometriesAttributes);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    function positionsConvert(worldPoints, altitude = 0, layer) {
        const vectors = [], cache = {};
        for (let i = 0, len = worldPoints.length; i < len; i += 3) {
            let x = worldPoints[i], y = worldPoints[i + 1], z = worldPoints[i + 2];
            if (altitude > 0) {
                z += altitudeToVector3(altitude, layer, cache);
            }
            vectors.push(new THREE__namespace.Vector3(x, y, z));
        }
        return vectors;
    }
    function vectors2Pixel(worldPoints, size, camera, altitude = 0, layer) {
        if (!(worldPoints[0] instanceof THREE__namespace.Vector3)) {
            worldPoints = positionsConvert(worldPoints, altitude, layer);
        }
        const pixels = worldPoints.map(worldPoint => {
            return vector2Pixel(worldPoint, size, camera);
        });
        return pixels;
    }
    // eslint-disable-next-line camelcase
    function vector2Pixel(world_vector, size, camera) {
        // eslint-disable-next-line camelcase
        const vector = world_vector.project(camera);
        const halfWidth = size.width / 2;
        const halfHeight = size.height / 2;
        const result = {
            x: Math.round(vector.x * halfWidth + halfWidth),
            y: Math.round(-vector.y * halfHeight + halfHeight)
        };
        return result;
    }

    var IdentifyUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        vectors2Pixel: vectors2Pixel,
        vector2Pixel: vector2Pixel
    });

    const OPTIONS$d = {
        altitude: 0,
        height: 0,
        color: null
    };
    const vector$1 = new THREE__namespace.Vector3();
    class Point extends BaseObject {
        constructor(coordinate, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$d, options, { layer, coordinate });
            super();
            let { height, altitude, color, size } = options;
            const vs = [], colors = [];
            if (color) {
                color = (color instanceof THREE__namespace.Color ? color : new THREE__namespace.Color(color));
                colors.push(color.r, color.g, color.b);
            }
            const z = layer.altitudeToVector3(height, height).x;
            const v = layer.coordinateToVector3(coordinate, z);
            vs.push(0, 0, v.z);
            const geometry = new THREE__namespace.BufferGeometry();
            addAttribute(geometry, 'position', new THREE__namespace.Float32BufferAttribute(vs, 3, true));
            if (colors.length) {
                addAttribute(geometry, 'color', new THREE__namespace.Float32BufferAttribute(colors, 3, true));
            }
            if (size !== undefined) {
                addAttribute(geometry, 'size', new THREE__namespace.Float32BufferAttribute([size], 1, true));
            }
            options.positions = v;
            this._initOptions(options);
            this._createPoints(geometry, material);
            const z1 = layer.altitudeToVector3(altitude, altitude).x;
            const v1 = new THREE__namespace.Vector3(v.x, v.y, z1);
            this.getObject3d().position.copy(v1);
            this.type = 'Point';
        }
        /**
         *
         * @param {maptalks.Coordinate} coordinate
         */
        identify(coordinate) {
            const layer = this.getLayer(), size = this.getMap().getSize(), camera = this.getLayer().getCamera(), positions = this.getOptions().positions, altitude = this.getOptions().altitude;
            //Size of points
            let pointSize = this.getObject3d().material.size;
            if (pointSize === undefined) {
                pointSize = this.options.size || 1;
            }
            const pixel = this.getMap().coordToContainerPoint(coordinate);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            vector$1.x = positions.x;
            vector$1.y = positions.y;
            vector$1.z = positions.z + z;
            //3D vector to screen coordinates
            const p = vector2Pixel(vector$1, size, camera);
            //Distance between two points
            const distance = Math.sqrt(Math.pow(pixel.x - p.x, 2) + Math.pow(pixel.y - p.y, 2));
            return (distance <= pointSize / 2);
        }
    }

    const ROW = 30, COL = 30;
    function contains(b, p) {
        const { minx, miny, maxx, maxy } = b;
        const [x, y] = p;
        if (minx <= x && x <= maxx && miny <= y && y <= maxy) {
            return true;
        }
        return false;
    }
    class BBox {
        constructor(minlng, minlat, maxlng, maxlat) {
            this.minlng = minlng;
            this.minlat = minlat;
            this.maxlng = maxlng;
            this.maxlat = maxlat;
            this.minx = Infinity;
            this.miny = Infinity;
            this.maxx = -Infinity;
            this.maxy = -Infinity;
            this.coordinates = [];
            this.positions = [];
            this.indexs = [];
            this.key = null;
        }
        /**
         *
         * @param {*} map
         */
        updateBBoxPixel(map) {
            let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
            const { minlng, minlat, maxlng, maxlat } = this;
            [
                [minlng, minlat],
                [minlng, maxlat],
                [maxlng, minlat],
                [maxlng, maxlat]
            ].map(lnglat => {
                return new maptalks__namespace.Coordinate(lnglat);
            }).map(coordinate => {
                return map.coordToContainerPoint(coordinate);
            }).forEach(pixel => {
                minx = Math.min(minx, pixel.x);
                miny = Math.min(miny, pixel.y);
                maxx = Math.max(maxx, pixel.x);
                maxy = Math.max(maxy, pixel.y);
            });
            this.minx = minx;
            this.miny = miny;
            this.maxx = maxx;
            this.maxy = maxy;
            return this;
        }
        /**
         *Determine whether a point is included
         * @param {*} c
         */
        containsCoordinate(c) {
            let lng, lat;
            if (Array.isArray(c)) {
                lng = c[0];
                lat = c[1];
            }
            else if (c instanceof maptalks__namespace.Coordinate) {
                lng = c.x;
                lat = c.y;
            }
            const { minlng, minlat, maxlng, maxlat } = this;
            return (minlng <= lng && lng <= maxlng && minlat <= lat && lat <= maxlat);
        }
        /**
         *Judge rectangle intersection
         * @param {*} pixel
         * @param {*} size
         */
        isRecCross(pixel, size) {
            const { x, y } = pixel;
            const rec = {
                minx: x - size / 2,
                miny: y - size / 2,
                maxx: x + size / 2,
                maxy: y + size / 2
            };
            const { minx, miny, maxx, maxy } = rec;
            if (contains(this, [minx, miny]) ||
                contains(this, [minx, maxy]) ||
                contains(this, [maxx, miny]) ||
                contains(this, [maxx, maxy]) ||
                contains(rec, [this.minx, this.miny]) ||
                contains(rec, [this.minx, this.maxy]) ||
                contains(rec, [this.maxx, this.miny]) ||
                contains(rec, [this.maxx, this.maxy])) {
                return true;
            }
            return false;
        }
        /**
         *generate grids
         * @param {*} minlng
         * @param {*} minlat
         * @param {*} maxlng
         * @param {*} maxlat
         */
        static initGrids(minlng, minlat, maxlng, maxlat) {
            const grids = [], offsetX = maxlng - minlng, offsetY = maxlat - minlat;
            const averageX = offsetX / COL, averageY = offsetY / ROW;
            let x = minlng, y = minlat;
            for (let i = 0; i < COL; i++) {
                x = minlng + i * averageX;
                for (let j = 0; j < ROW; j++) {
                    y = minlat + j * averageY;
                    const bounds = new BBox(x, y, x + averageX, y + averageY);
                    bounds.key = j + '-' + i;
                    grids.push(bounds);
                }
            }
            return { grids, averageX, averageY, ROWS: ROW, COLS: COL };
        }
    }

    const OPTIONS$c = {
        altitude: 0
    };
    const vector = new THREE__namespace.Vector3();
    function roundFun(value, n) {
        const tempValue = Math.pow(10, n);
        return Math.round(value * tempValue) / tempValue;
    }
    /**
     *points
     */
    class Points extends MergedMixin(BaseObject) {
        constructor(points, options, material, layer) {
            if (!Array.isArray(points)) {
                points = [points];
            }
            options = maptalks__namespace.Util.extend({}, OPTIONS$c, options, { layer, points });
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (let i = 0, len = points.length; i < len; i++) {
                const { coordinate } = points[i];
                let x, y;
                if (Array.isArray(coordinate)) {
                    x = coordinate[0];
                    y = coordinate[1];
                }
                else if (coordinate instanceof maptalks__namespace.Coordinate) {
                    x = coordinate.x;
                    y = coordinate.y;
                }
                points[i].coords = [x, y];
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
            const centerPt = layer.coordinateToVector3([(minX + maxX) / 2, (minY + maxY) / 2]);
            const { grids, averageX, averageY, ROWS, COLS } = BBox.initGrids(minX, minY, maxX, maxY);
            grids.length;
            const vs = new Float32Array(points.length * 3), vectors = [], colors = new Float32Array(points.length * 3), sizes = new Float32Array(points.length), pointMeshes = [], geometriesAttributes = [];
            const cache = {};
            let maxSize = 0;
            let hasColor = false, hasSize = false;
            const TEMP_VECTOR = new THREE__namespace.Vector3(0, 0, 0);
            for (let i = 0, len = points.length; i < len; i++) {
                let { coordinate, height, color, size, coords } = points[i];
                const idx = i * 3;
                if (color) {
                    hasColor = true;
                    color = (color instanceof THREE__namespace.Color ? color : new THREE__namespace.Color(color));
                    colors[idx] = color.r;
                    colors[idx + 1] = color.g;
                    colors[idx + 2] = color.b;
                }
                if (size) {
                    hasSize = true;
                    sizes[i] = size;
                    maxSize = Math.max(maxSize, size);
                }
                const z = altitudeToVector3(height, layer, cache);
                const v = layer.coordinateToVector3(coordinate, z);
                TEMP_VECTOR.x = v.x;
                TEMP_VECTOR.y = v.y;
                TEMP_VECTOR.z = v.z;
                TEMP_VECTOR.sub(centerPt);
                // const v1 = v.clone().sub(centerPt);
                vs[idx] = TEMP_VECTOR.x;
                vs[idx + 1] = TEMP_VECTOR.y;
                vs[idx + 2] = TEMP_VECTOR.z;
                vectors.push(v);
                geometriesAttributes[i] = {
                    position: {
                        count: 1,
                        start: i * 3,
                        end: i * 3 + 3
                    },
                    hide: false
                };
                let row = roundFun(((coords[1] - minY) / averageY), 4);
                let col = roundFun(((coords[0] - minX) / averageX), 4);
                row -= 1;
                col -= 1;
                row = Math.max(0, row);
                col = Math.max(0, col);
                row = Math.ceil(row);
                col = Math.ceil(col);
                const gridIndex = col * ROWS + row;
                if (grids[gridIndex]) {
                    grids[gridIndex].positions.push(v);
                    grids[gridIndex].indexs.push(i);
                }
                // for (let j = 0; j < gridslen; j++) {
                //     if (grids[j].containsCoordinate(coordinate)) {
                //         // grids[j].coordinates.push(coordinate);
                //         grids[j].positions.push(v);
                //         grids[j].indexs.push(i);
                //         console.log(j, gridIndex);
                //         break;
                //     }
                // }
            }
            const geometry = new THREE__namespace.BufferGeometry();
            addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(vs, 3, true));
            if (hasColor) {
                addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
            }
            if (hasSize) {
                addAttribute(geometry, 'size', new THREE__namespace.BufferAttribute(sizes, 1, true));
            }
            //for identify
            options.positions = vectors;
            super();
            this._initOptions(options);
            this._createPoints(geometry, material);
            const altitude = options.altitude;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = centerPt.clone();
            v.z = z;
            this.getObject3d().position.copy(v);
            this._baseObjects = pointMeshes;
            this._datas = points;
            this.faceIndex = null;
            this._geometriesAttributes = geometriesAttributes;
            this._geometryCache = geometry.clone();
            this.isHide = false;
            this._initBaseObjectsEvent(pointMeshes);
            this._grids = grids;
            this._bindMapEvents();
            this.type = 'Points';
            this.maxSize = maxSize;
        }
        _bindMapEvents() {
            const map = this.getMap();
            const events = 'zoomstart zooming zoomend movestart moving moveend pitch rotate';
            this.on('add', () => {
                this._updateGrids();
                map.on(events, this._updateGrids, this);
            });
            this.on('remove', () => {
                map.off(events, this._updateGrids, this);
            });
        }
        _updateGrids() {
            const map = this.getMap();
            this._grids.forEach(b => {
                if (b.indexs.length) {
                    b.updateBBoxPixel(map);
                }
            });
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this.faceIndex;
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const data = this._datas[index];
                    const { coordinate, height, color, size } = data;
                    this._baseObjects[index] = new Point(coordinate, { height, index, color, size }, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        /**
       *
       * @param {maptalks.Coordinate} coordinate
       */
        identify(coordinate) {
            const layer = this.getLayer(), size = this.getMap().getSize(), camera = this.getLayer().getCamera(), altitude = this.getOptions().altitude, map = this.getMap();
            const z = layer.altitudeToVector3(altitude, altitude).x;
            let pointSize = this.getObject3d().material.size;
            const isDynamicSize = pointSize === undefined;
            const pixel = map.coordToContainerPoint(coordinate);
            const bs = [];
            this._grids.forEach(b => {
                if (b.indexs.length) {
                    if (b.isRecCross(pixel, isDynamicSize ? this.maxSize : pointSize)) {
                        bs.push(b);
                    }
                }
            });
            if (bs.length < 1) {
                return false;
            }
            for (let i = 0, len = bs.length; i < len; i++) {
                for (let len1 = bs[i].positions.length, j = len1 - 1; j >= 0; j--) {
                    if (isDynamicSize) {
                        pointSize = this._datas[bs[i].indexs[j]].size || 1;
                    }
                    const v = bs[i].positions[j];
                    vector.x = v.x;
                    vector.y = v.y;
                    vector.z = v.z + z;
                    const p = vector2Pixel(vector, size, camera);
                    const distance = Math.sqrt(Math.pow(pixel.x - p.x, 2) + Math.pow(pixel.y - p.y, 2));
                    if (distance <= pointSize / 2) {
                        this.faceIndex = bs[i].indexs[j];
                        return true;
                    }
                }
            }
            return false;
        }
    }

    const OPTIONS$b = {
        coordinate: '',
        radius: 10,
        height: 100,
        radialSegments: 6,
        altitude: 0,
        topColor: '',
        bottomColor: '#2d2f61',
    };
    /**
     * merged bars
     */
    class Bars extends MergedMixin(BaseObject) {
        constructor(points, options, material, layer) {
            if (!Array.isArray(points)) {
                points = [points];
            }
            const len = points.length;
            const center = getCenterOfPoints(points);
            const centerPt = layer.coordinateToVector3(center);
            const geometries = [], bars = [], geometriesAttributes = [];
            let psIndex = 0;
            const cache = {}, altCache = {};
            super();
            options = maptalks__namespace.Util.extend({}, { altitude: 0, layer, points }, OPTIONS$b, options);
            this._initOptions(options);
            let geometry;
            const TEMP_VECTOR = new THREE__namespace.Vector3();
            if (options.asynchronous) {
                geometry = getDefaultBufferGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                const datas = [];
                for (let i = 0; i < len; i++) {
                    const opts = maptalks__namespace.Util.extend({ index: i }, options, points[i]);
                    const { radius, radialSegments, altitude, height, coordinate } = opts;
                    const r = distanceToVector3(radius, layer, cache);
                    points[i]._radius = r;
                    const h = altitudeToVector3(height, layer, altCache);
                    const alt = altitudeToVector3(altitude, layer, altCache);
                    const v = layer.coordinateToVector3(coordinate, 0, TEMP_VECTOR).sub(centerPt);
                    datas.push({ radialSegments, radius: r, height: h, center: [v.x, v.y], altitude: alt });
                }
                BarsTaskIns.push({
                    id,
                    data: datas,
                    layer,
                    baseObject: this
                });
            }
            else {
                for (let i = 0; i < len; i++) {
                    const opts = maptalks__namespace.Util.extend({ index: i }, options, points[i]);
                    const { radius, radialSegments, altitude, topColor, bottomColor, height, coordinate } = opts;
                    const r = distanceToVector3(radius, layer, cache);
                    const h = altitudeToVector3(height, layer, altCache);
                    const alt = altitudeToVector3(altitude, layer, altCache);
                    const v = layer.coordinateToVector3(coordinate, 0, TEMP_VECTOR).sub(centerPt);
                    const buffGeom = getGeometry({ radius: r, height: h, radialSegments, center: [v.x, v.y] });
                    if (topColor) {
                        initVertexColors(buffGeom, bottomColor, topColor, 'z', h / 2);
                        material.vertexColors = getVertexColors();
                    }
                    // buffGeom.rotateX(Math.PI / 2);
                    const parray = buffGeom.attributes.position.array;
                    for (let j = 0, len1 = parray.length; j < len1; j += 3) {
                        parray[j + 2] += alt;
                        // parray[j] += v.x;
                        // parray[j + 1] += v.y;
                        // parray[j + 2] += v.z;
                    }
                    geometries.push(buffGeom);
                    const bar = new Bar(coordinate, opts, material, layer);
                    bars.push(bar);
                    buffGeom.index.count / 3;
                    const psCount = buffGeom.attributes.position.count; 
                    //  colorCount = buffGeom.attributes.color.count,
                    buffGeom.attributes.normal.count; buffGeom.attributes.uv.count;
                    geometriesAttributes[i] = {
                        position: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        // normal: {
                        //     count: normalCount,
                        //     start: normalIndex,
                        //     end: normalIndex + normalCount * 3,
                        // },
                        // // color: {
                        // //     count: colorCount,
                        // //     start: colorIndex,
                        // //     end: colorIndex + colorCount * 3,
                        // // },
                        // uv: {
                        //     count: uvCount,
                        //     start: uvIndex,
                        //     end: uvIndex + uvCount * 2,
                        // },
                        hide: false
                    };
                    psIndex += psCount * 3;
                }
                geometry = mergeBarGeometry(geometries);
            }
            this._createMesh(geometry, material);
            const altitude = options.altitude;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = centerPt.clone();
            v.z = z;
            this.getObject3d().position.copy(v);
            // this._faceMap = faceMap;
            this._baseObjects = bars;
            this._datas = points;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(geometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(bars);
            if (!options.asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'Bars';
        }
        // eslint-disable-next-line no-unused-vars
        identify() {
            return this.picked;
        }
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const bar = this._datas[index];
                    const opts = Object.assign({}, this.options, bar, { index, asynchronous: false });
                    this._baseObjects[index] = new Bar(bar.coordinate, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            this._geometriesAttributes = geometriesAttributes;
            const bufferGeometry = generateBufferGeometry(result);
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            const { topColor, bottomColor } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                initVertexColors(bufferGeometry, bottomColor, topColor, 'z', geometriesAttributes);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$a = {
        width: 3,
        height: 1,
        altitude: 0,
        topColor: null,
        bottomColor: '#2d2f61'
    };
    class ExtrudeLines extends MergedMixin(BaseObject) {
        constructor(lineStrings, options, material, layer) {
            if (!Array.isArray(lineStrings)) {
                lineStrings = [lineStrings];
            }
            const centers = [], lineStringList = [];
            const len = lineStrings.length;
            for (let i = 0; i < len; i++) {
                const lineString = lineStrings[i];
                const result = LineStringSplit(lineString);
                centers.push(result.center);
                lineStringList.push(result.lineStrings);
            }
            // Get the center point of the point set
            const center = getCenterOfPoints(centers);
            options = maptalks__namespace.Util.extend({}, OPTIONS$a, options, { layer, lineStrings, coordinate: center });
            const { altitude, topColor, bottomColor, asynchronous } = options;
            let bufferGeometry;
            const extrudeLines = [], geometriesAttributes = [];
            super();
            if (asynchronous) {
                bufferGeometry = getDefaultBufferGeometry();
                ExtrudeLinesTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    layer,
                    key: options.key,
                    center,
                    data: lineStringList,
                    lineStrings,
                    baseObject: this,
                    option: options,
                });
            }
            else {
                const geometries = [];
                let psIndex = 0;
                const cache = {}, altCache = {};
                for (let i = 0; i < len; i++) {
                    const lineString = lineStrings[i];
                    const opts = maptalks__namespace.Util.extend({}, options, getLineStringProperties(lineString), { index: i });
                    const { height, width, bottomHeight } = opts;
                    const w = distanceToVector3(width, layer, cache);
                    const h = altitudeToVector3(height, layer, altCache);
                    const lls = lineStringList[i];
                    const extrudeParams = [];
                    let minZ = 0;
                    for (let m = 0, le = lls.length; m < le; m++) {
                        const attribute = getExtrudeLineParams(lls[m], w, h, layer, center);
                        minZ = setBottomHeight(attribute, bottomHeight, layer, cache);
                        extrudeParams.push(attribute);
                    }
                    const buffGeom = mergeBufferGeometriesAttribute(extrudeParams);
                    geometries.push(buffGeom);
                    // const extrudeLine = new ExtrudeLine(lineString, opts, material, layer);
                    // extrudeLines.push(extrudeLine);
                    const { position, normal, indices } = buffGeom;
                    indices.length / 3;
                    const psCount = position.length / 3; 
                    //  colorCount = buffGeom.attributes.color.count,
                    normal.length / 3;
                    geometriesAttributes[i] = {
                        position: {
                            middleZ: minZ + h / 2,
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        // normal: {
                        //     count: normalCount,
                        //     start: normalIndex,
                        //     end: normalIndex + normalCount * 3,
                        // },
                        // color: {
                        //     count: colorCount,
                        //     start: colorIndex,
                        //     end: colorIndex + colorCount * 3,
                        // },
                        // uv: {
                        //     count: uvCount,
                        //     start: uvIndex,
                        //     end: uvIndex + uvCount * 2,
                        // },
                        hide: false
                    };
                    psIndex += psCount * 3;
                    // colorIndex += colorCount * 3;
                    // uvIndex += uvCount * 2;
                }
                bufferGeometry = mergeBufferGeometries(geometries);
                if (topColor) {
                    initVertexColors$1(bufferGeometry, bottomColor, topColor, geometriesAttributes);
                    material.vertexColors = getVertexColors();
                }
            }
            this._initOptions(options);
            this._createMesh(bufferGeometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            //Face corresponding to monomer
            // this._faceMap = faceMap;
            this._baseObjects = extrudeLines;
            this._datas = lineStrings;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(extrudeLines);
            if (!asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'ExtrudeLines';
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const lineString = this._datas[index];
                    const opts = Object.assign({}, this.options, isGeoJSONLine(lineString) ? lineString.properties : lineString.getProperties(), { index });
                    this._baseObjects[index] = new ExtrudeLine(lineString, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const bufferGeometry = generateBufferGeometry(result);
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            const { topColor, bottomColor, bottomHeight, height } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                initVertexColors$1(bufferGeometry, bottomColor, topColor, geometriesAttributes);
                material.vertexColors = getVertexColors();
            }
            this.getObject3d().geometry = bufferGeometry;
            this.getObject3d().material.needsUpdate = true;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$9 = {
        altitude: 0,
        colors: null
    };
    /**
     *
     */
    class Lines extends MergedMixin(BaseObject) {
        constructor(lineStrings, options, material, layer) {
            if (!Array.isArray(lineStrings)) {
                lineStrings = [lineStrings];
            }
            const centers = [], lineStringList = [];
            const len = lineStrings.length;
            for (let i = 0; i < len; i++) {
                const lineString = lineStrings[i];
                const result = LineStringSplit(lineString);
                centers.push(result.center);
                lineStringList.push(result.lineStrings);
            }
            // Get the center point of the point set
            const center = getCenterOfPoints(centers);
            options = maptalks__namespace.Util.extend({}, OPTIONS$9, options, { layer, lineStrings, coordinate: center });
            super();
            this._initOptions(options);
            const { asynchronous } = options;
            let geometry;
            const lines = [], cache = {};
            let geometriesAttributes = [], psIndex = 0, positionList = [];
            if (asynchronous) {
                geometry = getDefaultLineGeometry();
                LinesTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    layer,
                    key: options.key,
                    center,
                    data: lineStringList,
                    lineStrings,
                    baseObject: this,
                    option: options,
                });
            }
            else {
                for (let i = 0; i < len; i++) {
                    const lls = lineStringList[i];
                    let psCount = 0;
                    for (let m = 0, le = lls.length; m < le; m++) {
                        const properties = getLineStringProperties(lls[m]);
                        const opts = maptalks__namespace.Util.extend({}, options, properties);
                        const { positions } = getLinePosition(lls[m], layer, center, false);
                        setBottomHeight(positions, opts.bottomHeight, layer, cache);
                        psCount += (positions.length / 3 * 2 - 2);
                        positionList.push(getLineSegmentPosition(positions));
                    }
                    geometriesAttributes[i] = {
                        position: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        hide: false
                    };
                    psIndex += psCount * 3;
                }
                const position = mergeLinePositions(positionList);
                geometry = new THREE__namespace.BufferGeometry();
                addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(position, 3));
            }
            this._createLineSegments(geometry, material);
            const { altitude } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            // this._faceMap = faceMap;
            this._baseObjects = lines;
            this._datas = lineStrings;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this.index = null;
            this._geometryCache = geometry.clone();
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(lines);
            if (!asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'Lines';
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const lineString = this._datas[index];
                    const opts = maptalks__namespace.Util.extend({}, this.getOptions(), { index }, isGeoJSONLine(lineString) ? lineString.properties : lineString.getProperties());
                    this._baseObjects[index] = new Line(lineString, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        _setPickObject3d() {
            if (!this._colorMap) {
                return;
            }
            const geometry = this._geometryCache || this.getObject3d().geometry.clone();
            const pick = this.getLayer().getPick();
            const { _geometriesAttributes } = this;
            const len = _geometriesAttributes.length;
            const colors = getGeometriesColorArray(_geometriesAttributes);
            let cIndex = 0;
            for (let i = 0; i < len; i++) {
                const color = pick.getColor();
                const colorIndex = color.getHex();
                this._colorMap[colorIndex] = i;
                const { count } = _geometriesAttributes[i].position;
                this._datas[i].colorIndex = colorIndex;
                for (let j = 0; j < count; j++) {
                    colors[cIndex] = color.r;
                    colors[cIndex + 1] = color.g;
                    colors[cIndex + 2] = color.b;
                    cIndex += 3;
                }
            }
            addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
            const material = this.getObject3d().material.clone();
            material.color.set('#fff');
            material.vertexColors = getVertexColors();
            const color = pick.getColor();
            const colorIndex = color.getHex();
            const mesh = new THREE__namespace.LineSegments(geometry, material);
            mesh.position.copy(this.getObject3d().position);
            mesh['_colorIndex'] = colorIndex;
            this.setPickObject3d(mesh);
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        _workerLoad(result) {
            const { position, geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const geometry = new THREE__namespace.BufferGeometry();
            addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(new Float32Array(position), 3));
            this._computeLineDistances(geometry);
            this._geometryCache = geometry.clone();
            this.getObject3d().geometry = geometry;
            this.getObject3d().material.needsUpdate = true;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    /*

    Global sharing

    */
    //Maximum concurrent
    const MAX = 10;
    const waitingQueue = [];
    const currentQueue = [];
    function getQueues() {
        return {
            waitingQueue,
            currentQueue
        };
    }
    /**
     *
     * @param {*} key
     * @param {*} url
     * @param {*} callback
     * @param {*} img
     * @param {*} vt
     */
    function pushQueue(key, url, callback, img, vt) {
        // url += `?key=${key}`;
        const q = {
            key,
            url,
            callback,
            img,
            vt
        };
        if (currentQueue.length < MAX) {
            currentQueue.push(q);
            vt.loopMessage(q);
        }
        else {
            waitingQueue.push(q);
        }
    }
    /**
     *
     * @param {*} index
     */
    function outQueue(index) {
        const callback = deleteQueueItem(waitingQueue, index);
        if (callback) {
            callback(index);
        }
    }
    /**
     *
     * @param {*} queArray
     * @param {*} index
     */
    function deleteQueueItem(queArray, index) {
        for (let i = 0, len = queArray.length; i < len; i++) {
            const q = queArray[i];
            if (q) {
                const { key, callback } = q;
                if (index === key) {
                    queArray.splice(i, 1);
                    return callback;
                }
            }
        }
        return null;
    }
    /**
     *
     * @param {*} key
     * @param {*} vt
     */
    function nextLoop(key, vt) {
        deleteQueueItem(currentQueue, key);
        if (waitingQueue.length) {
            currentQueue.push(waitingQueue[0]);
            waitingQueue.splice(0, 1);
            const last = currentQueue[currentQueue.length - 1];
            vt.loopMessage(last);
        }
    }

    const canvas$1 = document.createElement('canvas');
    const SIZE = 256;
    canvas$1.width = canvas$1.height = SIZE;
    let DEFAULT_IMAGE;
    function generateImage$1(key, debug = false) {
        if (DEFAULT_IMAGE) {
            return DEFAULT_IMAGE;
        }
        const ctx = canvas$1.getContext('2d');
        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.save();
        DEFAULT_IMAGE = canvas$1.toDataURL();
        return DEFAULT_IMAGE;
    }
    function createCanvas(width = 1, height = 1) {
        let canvas;
        if (typeof document === 'undefined') ;
        else {
            canvas = document.createElement('canvas');
            if (width) {
                canvas.width = width;
            }
            if (height) {
                canvas.height = height;
            }
        }
        return canvas;
    }

    /**
     *
     */
    class BaseVectorTileLayer extends maptalks__namespace.TileLayer {
        constructor(url, options = {}) {
            super(maptalks__namespace.Util.GUID(), maptalks__namespace.Util.extend({ urlTemplate: url }, options));
            this._opts = null;
            this._layer = null;
            this.material = null;
            this.getMaterial = null;
            this._baseObjectKeys = {};
            this._loadTiles = {};
            this._add = null;
            this._layerLaodTime = new Date().getTime();
        }
        isAsynchronous() {
            return this._opts.worker;
        }
        /**
         *get current all baseobject
         */
        getBaseObjects() {
            const loadTiles = this._loadTiles;
            const baseos = [];
            for (let key in loadTiles) {
                const baseobjects = this._baseObjectKeys[key];
                if (baseobjects && Array.isArray(baseobjects) && baseobjects.length) {
                    for (let i = 0, len = baseobjects.length; i < len; i++) {
                        baseos.push(baseobjects[i]);
                    }
                }
            }
            return baseos;
        }
        /**
       * This method should be overridden for event handling
       * @param {*} type
       * @param {*} e
       */
        // eslint-disable-next-line no-unused-vars
        onSelectMesh(type, e) {
        }
        /**
       * this is can override
       * @param {*} index
       * @param {*} json
       */
        // eslint-disable-next-line no-unused-vars
        formatBaseObjects(index, json) {
            return [];
        }
        //queue loop
        // eslint-disable-next-line no-unused-vars
        loopMessage(q) {
        }
        /**
        *
        * @param {*} q
        */
        getTileData(q) {
            const { key, url, callback, img } = q;
            maptalks__namespace.Ajax.getJSON(url, {}, function (error, res) {
                if (error) {
                    console.error(error);
                    callback(key, null, img);
                }
                else {
                    callback(key, res, img);
                }
            });
        }
        _getCurentTileKeys() {
            const tileGrids = this.getTiles().tileGrids || [];
            const keys = [], keysMap = {};
            for (let i = 0, len = tileGrids.length; i < len; i++) {
                const d = tileGrids[i];
                const tiles = d.tiles || [];
                for (let j = 0, len1 = tiles.length; j < len1; j++) {
                    const { id } = tiles[j];
                    keys.push(id);
                    keysMap[id] = true;
                }
            }
            return { keys, keysMap };
        }
        _isLoad() {
            const { keys } = this._getCurentTileKeys();
            const keys1 = Object.keys(this._renderer.tilesInView);
            if (keys.length === keys1.length) {
                return true;
            }
            return false;
        }
        _layerOnLoad() {
            // This event will be triggered multiple times per unit time
            const time = new Date().getTime();
            const offsetTime = time - this._layerLaodTime;
            if (offsetTime < 20) {
                return;
            }
            this._layerLaodTime = time;
            const tilesInView = this._renderer.tilesInView, loadTiles = this._loadTiles, threeLayer = this._layer, keys = this._baseObjectKeys;
            const tilesInViewLen = Object.keys(tilesInView).length, loadTilesLen = Object.keys(loadTiles).length;
            const needsRemoveBaseObjects = [];
            if (tilesInViewLen && loadTilesLen) {
                for (let index in loadTiles) {
                    if (!tilesInView[index]) {
                        if (keys[index]) {
                            (keys[index] || []).forEach(baseobject => {
                                needsRemoveBaseObjects.push(baseobject);
                            });
                        }
                    }
                }
            }
            if (needsRemoveBaseObjects.length) {
                threeLayer.removeMesh(needsRemoveBaseObjects, false);
            }
            if (tilesInViewLen && loadTilesLen) {
                for (let index in tilesInView) {
                    if (!loadTiles[index]) {
                        if (keys[index]) {
                            const baseobject = keys[index];
                            threeLayer.addMesh(baseobject);
                        }
                        else {
                            const { x, y, z } = this._getXYZOfIndex(index);
                            this.getTileUrl(x, y, z);
                        }
                    }
                }
            }
            this._loadTiles = Object.assign({}, tilesInView);
            this._diffCache();
        }
        _init() {
        }
        _workerLoad(e) {
            const baseobject = e.target;
            const img = baseobject._img;
            img.currentCount++;
            if (img.currentCount === img.needCount) {
                img.src = generateImage$1(img._key, this._opts.debug);
            }
        }
        _generateBaseObjects(index, res, img) {
            if (res && img) {
                const { keysMap } = this._getCurentTileKeys();
                //not in current ,ignore
                if (!keysMap[index]) {
                    img.src = generateImage$1(index, this._opts.debug);
                    return;
                }
                const baseobjects = this.formatBaseObjects(index, res);
                if (baseobjects.length) {
                    img.needCount = baseobjects.length;
                    img.currentCount = 0;
                    for (let i = 0, len = baseobjects.length; i < len; i++) {
                        const baseobject = baseobjects[i];
                        baseobject._img = img;
                        baseobject._vt = this;
                        if (!this.isVisible()) {
                            baseobject.hide();
                        }
                        this._cachetile(index, baseobject);
                        if (!baseobject.isAsynchronous()) {
                            img.currentCount++;
                        }
                    }
                    this._layer.addMesh(baseobjects, false);
                    if (img.needCount === img.currentCount) {
                        img.src = generateImage$1(index, this._opts.debug);
                    }
                    if (this.isAsynchronous()) {
                        baseobjects.filter(baseobject => {
                            return baseobject.isAsynchronous();
                        }).forEach(baseobject => {
                            baseobject.on('workerload', this._workerLoad, this);
                        });
                    }
                    else {
                        img.src = generateImage$1(index, this._opts.debug);
                    }
                }
                else {
                    img.src = generateImage$1(index, this._opts.debug);
                }
                this._loadTiles[index] = true;
            }
            else if (img) {
                img.src = generateImage$1(index, this._opts.debug);
            }
        }
        _diffCache() {
            // if (this._layer.getMap().isInteracting()) {
            //     return;
            // }
            if (Object.keys(this._baseObjectKeys).length > this._renderer.tileCache.max) {
                const tileCache = this._renderer.tileCache.data;
                const tilesInView = this._renderer.tilesInView;
                const needsRemoveBaseObjects = [];
                for (let index in this._baseObjectKeys) {
                    if (!tileCache[index] && !tilesInView[index]) {
                        (this._baseObjectKeys[index] || []).forEach(baseobject => {
                            if (baseobject.isAdd) {
                                needsRemoveBaseObjects.push(baseobject);
                            }
                        });
                        this._diposeBaseObject(index);
                        delete this._baseObjectKeys[index];
                    }
                }
                // Batch deletion can have better performance
                if (needsRemoveBaseObjects.length) {
                    this._layer.removeMesh(needsRemoveBaseObjects, false);
                }
            }
        }
        _diposeBaseObject(index) {
            const baseobjects = this._baseObjectKeys[index];
            if (baseobjects && baseobjects.length) {
                baseobjects.forEach(baseobject => {
                    baseobject.getObject3d().geometry.dispose();
                    if (baseobject._geometryCache) {
                        baseobject._geometryCache.dispose();
                    }
                    const bos = baseobject._baseObjects;
                    if (bos && bos.length) {
                        bos.forEach(bo => {
                            bo.getObject3d().geometry.dispose();
                            bo = null;
                        });
                    }
                    baseobject._datas = null;
                    baseobject._geometriesAttributes = null;
                    baseobject._faceMap = null;
                    baseobject._colorMap = null;
                    if (baseobject.pickObject3d) {
                        baseobject.pickObject3d.geometry.dispose();
                        // baseobject.pickObject3d.material.dispose();
                    }
                    baseobject = null;
                });
            }
        }
        _cachetile(index, baseobject) {
            if (!this._baseObjectKeys[index]) {
                this._baseObjectKeys[index] = [];
            }
            this._baseObjectKeys[index].push(baseobject);
        }
        _getXYZOfIndex(index) {
            const splitstr = index.indexOf('_') > -1 ? '_' : '-';
            let [y, x, z] = index.split(splitstr).slice(1, 4);
            const x1 = parseInt(x);
            const y1 = parseInt(y);
            const z1 = parseInt(z);
            return { x: x1, y: y1, z: z1 };
        }
        _getTileExtent(x, y, z) {
            const map = this.getMap(), res = map._getResolution(z), tileConfig = this._getTileConfig(), tileExtent = tileConfig.getTilePrjExtent(x, y, res);
            return tileExtent;
        }
        /**
         *
         * @param {} x
         * @param {*} y
         * @param {*} z
         */
        _getTileLngLatExtent(x, y, z) {
            const tileExtent = this._getTileExtent(x, y, z);
            let max = tileExtent.getMax(), min = tileExtent.getMin();
            const map = this.getMap();
            const projection = map.getProjection();
            min = projection.unproject(min);
            max = projection.unproject(max);
            return new maptalks__namespace.Extent(min, max);
        }
    }

    const OPTIONS$8 = {
        worker: false
    };
    /**
     *Provide a simple data loading layer with large amount of data
     */
    class ThreeVectorTileLayer extends BaseVectorTileLayer {
        constructor(url, options = {}, getMaterial, layer) {
            super(maptalks__namespace.Util.GUID(), maptalks__namespace.Util.extend({ urlTemplate: url }, OPTIONS$8, options));
            this._opts = options;
            this._layer = layer;
            this.getMaterial = getMaterial;
            this._baseObjectKeys = {};
            this._loadTiles = {};
            this._add = null;
            this._layerLaodTime = new Date().getTime();
            this._init();
        }
        /**
         * this is can override
         * @param {*} index
         * @param {*} json
         */
        formatBaseObjects(index, json) {
            const opts = this._opts, baseobjects = [];
            const asynchronous = this.isAsynchronous();
            for (let layerName in json) {
                const geojson = json[layerName] || {};
                let features;
                if (Array.isArray(geojson)) {
                    features = geojson;
                }
                else if (geojson.type === 'FeatureCollection') {
                    features = geojson.features;
                }
                if (features && features.length) {
                    const polygons = [], lineStrings = [], points = [];
                    for (let i = 0, len = features.length; i < len; i++) {
                        const feature = features[i];
                        if (isGeoJSONPolygon(feature)) {
                            polygons.push(feature);
                        }
                        else if (isGeoJSONLine(feature)) {
                            const fs = spliteGeoJSONMulti(feature);
                            for (let j = 0, len1 = fs.length; j < len1; j++) {
                                lineStrings.push(fs[j]);
                            }
                        }
                        else if (isGeoJSONPoint(feature)) {
                            const fs = spliteGeoJSONMulti(feature);
                            for (let j = 0, len1 = fs.length; j < len1; j++) {
                                points.push(maptalks__namespace.Util.extend({}, fs[j].properties, fs[j], { coordinate: getGeoJSONCoordinates(fs[j]) }));
                            }
                        }
                    }
                    if (polygons.length) {
                        const material = this._getMaterial(layerName, polygons, index, geojson);
                        if (material) {
                            const extrudepolygons = this._layer.toExtrudePolygons(polygons, maptalks__namespace.Util.extend({}, { topColor: '#fff', layerName, asynchronous, key: index }, opts), material);
                            baseobjects.push(extrudepolygons);
                        }
                    }
                    if (lineStrings.length) {
                        const material = this._getMaterial(layerName, lineStrings, index, geojson);
                        if (material && (material instanceof THREE__namespace.LineBasicMaterial || material instanceof THREE__namespace.LineDashedMaterial)) {
                            const lines = this._layer.toLines(lineStrings, maptalks__namespace.Util.extend({}, { layerName, asynchronous }, opts), material);
                            baseobjects.push(lines);
                        }
                    }
                    if (points.length) {
                        const material = this._getMaterial(layerName, points, index, geojson);
                        if (material && material instanceof THREE__namespace.PointsMaterial) {
                            const ps = this._layer.toPoints(points, maptalks__namespace.Util.extend({}, { layerName, asynchronous }, opts), material);
                            baseobjects.push(ps);
                        }
                    }
                }
            }
            return baseobjects;
        }
        //queue loop
        loopMessage(q) {
            const { currentQueue } = getQueues();
            if (currentQueue.length > 0) {
                this.getTileData(q);
            }
        }
        _init() {
            this.on('layerload', this._layerOnLoad);
            this.on('add', () => {
                if (this._add === false) {
                    const baseobjects = this.getBaseObjects();
                    this._layer.addMesh(baseobjects);
                }
                this._add = true;
                /**
                 * layerload have a bug ,Sometimes it doesn't trigger,I don't know why
                 * Add heartbeat detection mechanism
                 */
                this.intervalId = setInterval(() => {
                    if (this._isLoad() && (!this._layer.getMap().isInteracting())) {
                        this.fire('layerload');
                    }
                }, 1000);
            });
            this.on('remove', () => {
                this._add = false;
                const baseobjects = this.getBaseObjects();
                this._layer.removeMesh(baseobjects);
                clearInterval(this.intervalId);
            });
            this.on('show', () => {
                const baseobjects = this.getBaseObjects();
                baseobjects.forEach(baseobject => {
                    baseobject.show();
                });
                for (let key in this._baseObjectKeys) {
                    const baseobjects = this._baseObjectKeys[key] || [];
                    baseobjects.forEach(baseobject => {
                        baseobject.show();
                    });
                }
            });
            this.on('hide', () => {
                const baseobjects = this.getBaseObjects();
                baseobjects.forEach(baseobject => {
                    baseobject.hide();
                });
                for (let key in this._baseObjectKeys) {
                    const baseobjects = this._baseObjectKeys[key] || [];
                    baseobjects.forEach(baseobject => {
                        baseobject.hide();
                    });
                }
            });
            this.on('renderercreate', (e) => {
                e.renderer.loadTile = function loadTile(tile) {
                    var tileSize = this.layer.getTileSize();
                    var tileImage = new Image();
                    tileImage.width = tileSize['width'];
                    tileImage.height = tileSize['height'];
                    tileImage.onload = this.onTileLoad.bind(this, tileImage, tile);
                    tileImage.onerror = this.onTileError.bind(this, tileImage, tile);
                    this.loadTileImage(tileImage, tile['url'], tile.id);
                    return tileImage;
                };
                e.renderer.deleteTile = function (tile) {
                    if (!tile || !tile.image) {
                        return;
                    }
                    tile.image.onload = null;
                    tile.image.onerror = null;
                    const tileinfo = tile.info || {};
                    outQueue(tileinfo.id);
                };
                e.renderer.loadTileImage = (img, url, key) => {
                    img._key = key;
                    pushQueue(key, url, (index, json, image) => {
                        // img.src = generateImage(key, this._opts.debug);
                        this._generateBaseObjects(index, json, image);
                        nextLoop(index, this);
                    }, img, this);
                };
            });
        }
        _getMaterial(layerName, data, index, geojson) {
            if (this.getMaterial && maptalks__namespace.Util.isFunction(this.getMaterial)) {
                return this.getMaterial(layerName, data, index, geojson);
            }
            return null;
        }
    }

    function getPlaneGeometryAttribute(width, height, devideW, devideH) {
        const dx = width / devideW, dy = height / devideH;
        const minX = -width / 2, maxY = height / 2, minY = -height / 2;
        const len = (devideW + 1) * (devideH + 1);
        const position = new Float32Array(len * 3), uv = new Float32Array(len * 2), normal = new Float32Array(len * 3), tempIndex = new Uint32Array(len * 10);
        let index = 0, uIndex = 0, iIndex = 0;
        for (let j = 0; j <= devideH; j++) {
            for (let i = 0; i <= devideW; i++) {
                const x = minX + dx * i;
                const y = maxY - dy * j;
                position[index] = x;
                position[index + 1] = y;
                position[index + 2] = 0;
                normal[index] = 0;
                normal[index + 1] = 0;
                normal[index + 2] = 1;
                const uvx = (x - minX) / width, uvy = (y - minY) / height;
                uv[uIndex] = uvx;
                uv[uIndex + 1] = uvy;
                index += 3;
                uIndex += 2;
                if (i < devideW && j < devideH) {
                    const a = j * (devideW + 1) + i, b = a + 1, c = (devideW + 1) * (j + 1) + i, d = c + 1;
                    tempIndex[iIndex] = a;
                    tempIndex[iIndex + 1] = c;
                    tempIndex[iIndex + 2] = b;
                    tempIndex[iIndex + 3] = c;
                    tempIndex[iIndex + 4] = d;
                    tempIndex[iIndex + 5] = b;
                    iIndex += 6;
                }
            }
        }
        const indexArray = new Uint32Array(iIndex);
        for (let i = 0, len = indexArray.length; i < len; i++) {
            indexArray[i] = tempIndex[i];
        }
        return {
            position,
            uv,
            normal,
            indexs: indexArray
        };
    }
    function getPlaneGeometry(width, height, devideW, devideH) {
        const { position, uv, normal, indexs } = getPlaneGeometryAttribute(width, height, devideW, devideH);
        const geometry = new THREE__namespace.BufferGeometry();
        addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        addAttribute(geometry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(geometry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        geometry.setIndex(new THREE__namespace.BufferAttribute(indexs, 1));
        return geometry;
    }

    // import { addAttribute } from './util/ThreeAdaptUtil';
    const textureLoader = new THREE__namespace.TextureLoader();
    const canvas = document.createElement('canvas'), tileSize = 256;
    function getRGBData(image, width = tileSize, height = tileSize) {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        return ctx.getImageData(0, 0, width, height).data;
    }
    function generateImage(image) {
        if (!image) {
            return null;
        }
        let img;
        if (typeof image === 'string') {
            img = new Image();
            img.src = image;
        }
        else if (image instanceof HTMLCanvasElement) {
            img = new Image();
            img.src = image.toDataURL();
        }
        else if (image instanceof Image) {
            img = new Image();
            img.src = image.src;
            img.crossOrigin = image.crossOrigin;
        }
        if (img && !img.crossOrigin) {
            img.crossOrigin = 'Anonymous';
        }
        return img;
    }
    const heightCache$1 = new Map();
    function updateGeometryPosition(image, geometry, layer, options) {
        if (!geometry || !layer) {
            return;
        }
        const { imageWidth, imageHeight, flaserBoundary } = options;
        let imgdata;
        if (image instanceof Uint32Array || image instanceof Uint8ClampedArray) {
            imgdata = image;
        }
        else {
            imgdata = getRGBData(image, imageWidth, imageHeight);
        }
        if (!imgdata) {
            console.error('image is error type data', image);
            return;
        }
        let idx = 0, row = 0, rowIndex = 0;
        const isBoundary = () => {
            return (row === 0 || (row + 1) === imageHeight || rowIndex === 0 || (rowIndex + 1) === imageWidth);
        };
        const out = new THREE__namespace.Vector3();
        const cache = heightCache$1;
        //rgb to height  https://docs.mapbox.com/help/troubleshooting/access-elevation-data/
        for (let i = 0, len = imgdata.length; i < len; i += 4) {
            const R = imgdata[i], G = imgdata[i + 1], B = imgdata[i + 2];
            const height = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1);
            let z = 0;
            if (!isBoundary() || !flaserBoundary) {
                const value = cache.get(height);
                if (value !== undefined) {
                    z = value;
                }
                else {
                    z = layer.altitudeToVector3(height, height, null, out).x;
                    cache.set(height, z);
                }
            }
            geometry.attributes.position.array[idx * 3 + 2] = z;
            idx++;
            rowIndex++;
            if (rowIndex === imageWidth) {
                row++;
                rowIndex = 0;
            }
        }
        geometry.attributes.position.needsUpdate = true;
    }
    const OPTIONS$7 = {
        interactive: false,
        altitude: 0,
        image: null,
        imageWidth: 256,
        imageHeight: 256,
        texture: null,
        flaserBoundary: true,
        bufferPixel: 1
    };
    /**
     *
     */
    class Terrain extends BaseObject {
        constructor(extent, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$7, options, { layer, extent });
            const { texture, image, altitude, imageHeight, imageWidth, flaserBoundary, bufferPixel } = options;
            // if (!image) {
            //     console.error('not find image');
            // }
            if (!(extent instanceof maptalks__namespace.Extent)) {
                extent = new maptalks__namespace.Extent(extent);
            }
            const { xmin, ymin, xmax, ymax } = extent;
            const coords = [
                [xmin, ymin],
                [xmin, ymax],
                [xmax, ymax],
                [xmax, ymin]
            ];
            let vxmin = Infinity, vymin = Infinity, vxmax = -Infinity, vymax = -Infinity;
            coords.forEach(coord => {
                const v = layer.coordinateToVector3(coord);
                const { x, y } = v;
                vxmin = Math.min(x, vxmin);
                vymin = Math.min(y, vymin);
                vxmax = Math.max(x, vxmax);
                vymax = Math.max(y, vymax);
            });
            const dx = vxmax - vxmin, dy = vymax - vymin;
            const ax = dx / imageWidth, ay = dy / imageHeight;
            //buffer pixel size
            vxmin -= ax * bufferPixel;
            vxmax += ax * bufferPixel;
            vymin -= ay * bufferPixel;
            vymax += ay * bufferPixel;
            const w = Math.abs(vxmax - vxmin), h = Math.abs(vymax - vymin);
            const rgbImg = generateImage(image), img = generateImage(texture);
            // const geometry = new THREE.PlaneBufferGeometry(w, h, imageWidth - 1, imageHeight - 1);
            const geometry = getPlaneGeometry(w, h, imageWidth - 1, imageHeight - 1);
            super();
            this._initOptions(options);
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(extent.getCenter(), z);
            this.getObject3d().position.copy(v);
            material.transparent = true;
            if (rgbImg) {
                rgbImg.onload = () => {
                    updateGeometryPosition(rgbImg, geometry, layer, { imageWidth, imageHeight, flaserBoundary });
                    this.fire('dataload', {});
                };
                rgbImg.onerror = function () {
                    console.error(`not load ${rgbImg.src}`);
                    this.fire('dataerror', {});
                };
            }
            if (img) {
                material.opacity = 0;
                textureLoader.load(img.src, (texture) => {
                    material.map = texture;
                    material.opacity = 1;
                    material.needsUpdate = true;
                    this.fire('textureload', {});
                });
            }
            else {
                material.opacity = 1;
            }
            this.type = 'Terrain';
        }
        updateData(image) {
            const geometry = this.getObject3d().geometry;
            const layer = this.getLayer();
            updateGeometryPosition(image, geometry, layer, this.getOptions());
            this.fire('updatedata', {});
            return this;
        }
    }

    const OPTIONS$6 = {
        // worker: false
        scale: 1,
        tileDivisor: 4
    };
    /**
     *
     */
    class TerrainVectorTileLayer extends BaseVectorTileLayer {
        constructor(url, options = {}, material, layer) {
            super(maptalks__namespace.Util.GUID(), maptalks__namespace.Util.extend({ urlTemplate: url }, OPTIONS$6, options));
            this._opts = options;
            this._layer = layer;
            this.material = material;
            this._baseObjectKeys = {};
            this._loadTiles = {};
            this._add = null;
            this._imgQueue = {};
            this._layerLaodTime = new Date().getTime();
            this._init();
        }
        isAsynchronous() {
            return false;
        }
        /**
         * this is can override
         * @param {*} index
         * @param {*} json
         */
        formatBaseObjects(index, image) {
            const opts = this.options, baseobjects = [];
            const { scale, tileDivisor } = opts;
            const { x, y, z } = this._getXYZOfIndex(index);
            const zoom = this.getMap().getZoom();
            const texture = this.getTileUrl(x, y, z);
            const [imageWidth, imageHeight] = this.options.tileSize;
            const extent = this._getTileLngLatExtent(x, y, z);
            const material = this.material.clone();
            if ((z + 1) >= Math.round(zoom)) {
                const terrain = new Terrain(extent, {
                    image,
                    imageWidth: imageWidth / tileDivisor,
                    imageHeight: imageHeight / tileDivisor,
                    texture
                }, material, this._layer);
                terrain.getObject3d().scale.set(scale, scale, 1);
                baseobjects.push(terrain);
            }
            return baseobjects;
        }
        //queue loop
        loopMessage(q) {
            this.getTileData(q);
        }
        _init() {
            this.on('layerload', this._layerOnLoad);
            this.on('add', () => {
                if (this._add === false) {
                    const baseobjects = this.getBaseObjects();
                    this._layer.addMesh(baseobjects);
                }
                this._add = true;
                /**
                 * layerload have a bug ,Sometimes it doesn't trigger,I don't know why
                 * Add heartbeat detection mechanism
                 */
                this.intervalId = setInterval(() => {
                    if (this._isLoad() && (!this._layer.getMap().isInteracting())) {
                        this.fire('layerload');
                    }
                }, 1000);
            });
            this.on('remove', () => {
                this._add = false;
                const baseobjects = this.getBaseObjects();
                this._layer.removeMesh(baseobjects);
                clearInterval(this.intervalId);
            });
            this.on('show', () => {
                const baseobjects = this.getBaseObjects();
                baseobjects.forEach(baseobject => {
                    baseobject.show();
                });
                for (let key in this._baseObjectKeys) {
                    const baseobjects = this._baseObjectKeys[key] || [];
                    baseobjects.forEach(baseobject => {
                        baseobject.show();
                    });
                }
            });
            this.on('hide', () => {
                const baseobjects = this.getBaseObjects();
                baseobjects.forEach(baseobject => {
                    baseobject.hide();
                });
                for (let key in this._baseObjectKeys) {
                    const baseobjects = this._baseObjectKeys[key] || [];
                    baseobjects.forEach(baseobject => {
                        baseobject.hide();
                    });
                }
            });
            this.on('renderercreate', (e) => {
                e.renderer.loadTile = function loadTile(tile) {
                    var tileSize = this.layer.getTileSize();
                    var tileImage = new Image();
                    tileImage.width = tileSize['width'];
                    tileImage.height = tileSize['height'];
                    tileImage.onload = this.onTileLoad.bind(this, tileImage, tile);
                    tileImage.onerror = this.onTileError.bind(this, tileImage, tile);
                    this.loadTileImage(tileImage, tile['url'], tile.id);
                    return tileImage;
                };
                e.renderer.deleteTile = (tile) => {
                    if (!tile || !tile.image) {
                        return;
                    }
                    tile.image.onload = null;
                    tile.image.onerror = null;
                    const tileinfo = tile.info || {};
                    const rgbImage = this._imgQueue[tileinfo.id];
                    if (rgbImage) {
                        rgbImage.src = '';
                        rgbImage.onload = null;
                        rgbImage.onerror = null;
                        delete this._imgQueue[tileinfo.id];
                    }
                };
                e.renderer.loadTileImage = (img, url, key) => {
                    img._key = key;
                    const rgbImage = new Image();
                    this._imgQueue[key] = rgbImage;
                    const q = {
                        key,
                        url,
                        rgbImage,
                        callback: (index, rgbImage, image) => {
                            this._generateBaseObjects(index, rgbImage, image);
                        },
                        img,
                        vt: this
                    };
                    this.loopMessage(q);
                };
            });
        }
    }

    /*!
     * Code from baidu mapv
     * License: BSD-3
     * https://github.com/huiyan-fe/mapv
     *
     */
    /**
     * Category
     * @param {Object} [options]   Available options:
     *                             {Object} gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"}
     */
    function Intensity(options) {
        options = options || {};
        this.gradient = options.gradient || {
            0.25: 'rgba(0, 0, 255, 1)',
            0.55: 'rgba(0, 255, 0, 1)',
            0.85: 'rgba(255, 255, 0, 1)',
            1.0: 'rgba(255, 0, 0, 1)'
        };
        this.maxSize = options.maxSize || 35;
        this.minSize = options.minSize || 0;
        this.max = options.max || 100;
        this.min = options.min || 0;
        this.initPalette();
    }
    Intensity.prototype.setMax = function (value) {
        this.max = value || 100;
    };
    Intensity.prototype.setMin = function (value) {
        this.min = value || 0;
    };
    Intensity.prototype.setMaxSize = function (maxSize) {
        this.maxSize = maxSize || 35;
    };
    Intensity.prototype.setMinSize = function (minSize) {
        this.minSize = minSize || 0;
    };
    Intensity.prototype.initPalette = function () {
        var gradient = this.gradient;
        var canvas = createCanvas(256, 1);
        var paletteCtx = this.paletteCtx = canvas.getContext('2d');
        var lineGradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
        for (var key in gradient) {
            lineGradient.addColorStop(parseFloat(key), gradient[key]);
        }
        paletteCtx.fillStyle = lineGradient;
        paletteCtx.fillRect(0, 0, 256, 1);
    };
    Intensity.prototype.getColor = function (value) {
        var imageData = this.getImageData(value);
        return 'rgba(' + imageData[0] + ', ' + imageData[1] + ', ' + imageData[2] + ', ' + imageData[3] / 256 + ')';
    };
    Intensity.prototype.getImageData = function (value) {
        var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;
        if (value === undefined) {
            return imageData;
        }
        var max = this.max;
        var min = this.min;
        if (value > max) {
            value = max;
        }
        if (value < min) {
            value = min;
        }
        var index = Math.floor((value - min) / (max - min) * (256 - 1)) * 4;
        return [imageData[index], imageData[index + 1], imageData[index + 2], imageData[index + 3]];
    };
    /**
     * @param Number value
     * @param Number max of value
     * @param Number max of size
     * @param Object other options
     */
    Intensity.prototype.getSize = function (value) {
        var size = 0;
        var max = this.max;
        var min = this.min;
        var maxSize = this.maxSize;
        var minSize = this.minSize;
        if (value > max) {
            value = max;
        }
        if (value < min) {
            value = min;
        }
        if (max > min) {
            size = minSize + (value - min) / (max - min) * (maxSize - minSize);
        }
        else {
            return maxSize;
        }
        return size;
    };
    Intensity.prototype.getLegend = function (options) {
        var gradient = this.gradient;
        var width = options.width || 20;
        var height = options.height || 180;
        var canvas = createCanvas(width, height);
        var paletteCtx = canvas.getContext('2d');
        var lineGradient = paletteCtx.createLinearGradient(0, height, 0, 0);
        for (var key in gradient) {
            lineGradient.addColorStop(parseFloat(key), gradient[key]);
        }
        paletteCtx.fillStyle = lineGradient;
        paletteCtx.fillRect(0, 0, width, height);
        return canvas;
    };

    /*!
     * Code from baidu mapv
     * License: BSD-3
     * https://github.com/huiyan-fe/mapv
     *
     */
    function createCircle(size) {
        var shadowBlur = size / 2;
        var r2 = size + shadowBlur;
        var offsetDistance = 10000;
        var circle = createCanvas(r2 * 2, r2 * 2);
        var context = circle.getContext('2d');
        context.shadowBlur = shadowBlur;
        context.shadowColor = 'black';
        context.shadowOffsetX = context.shadowOffsetY = offsetDistance;
        context.beginPath();
        context.arc(r2 - offsetDistance, r2 - offsetDistance, size, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        return circle;
    }
    function colorize(pixels, gradient, options) {
        var max = getMax(options);
        var min = getMin(options);
        var diff = max - min;
        var range = options.range || null;
        var jMin = 0;
        var jMax = 1024;
        if (range && range.length === 2) {
            jMin = (range[0] - min) / diff * 1024;
        }
        if (range && range.length === 2) {
            jMax = (range[1] - min) / diff * 1024;
        }
        var maxOpacity = options.maxOpacity || 0.8;
        var minOpacity = options.minOpacity || 0;
        // var range = options.range;
        for (var i = 3, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i] * 4; // get gradient color from opacity value
            if (pixels[i] / 256 > maxOpacity) {
                pixels[i] = 256 * maxOpacity;
            }
            if (pixels[i] / 256 < minOpacity) {
                pixels[i] = 256 * minOpacity;
            }
            if (j && j >= jMin && j <= jMax) {
                pixels[i - 3] = gradient[j];
                pixels[i - 2] = gradient[j + 1];
                pixels[i - 1] = gradient[j + 2];
            }
            else {
                pixels[i] = 0;
            }
        }
    }
    function getMax(options) {
        var max = options.max || 100;
        return max;
    }
    function getMin(options) {
        var min = options.min || 0;
        return min;
    }
    function drawGray(context, dataSet, options) {
        var max = getMax(options);
        // var min = getMin(options);
        // console.log(max)
        var size = options._size || options.size || 13;
        var circle = createCircle(size);
        var circleHalfWidth = circle.width / 2;
        var circleHalfHeight = circle.height / 2;
        var data = dataSet;
        var dataOrderByAlpha = {};
        data.forEach(function (item) {
            var count = item.count === undefined ? 1 : item.count;
            var alpha = Math.min(1, count / max).toFixed(2);
            dataOrderByAlpha[alpha] = dataOrderByAlpha[alpha] || [];
            dataOrderByAlpha[alpha].push(item);
        });
        for (var i in dataOrderByAlpha) {
            if (isNaN(i))
                continue;
            var _data = dataOrderByAlpha[i];
            context.beginPath();
            if (!options.withoutAlpha) {
                context.globalAlpha = i;
            }
            // context.strokeStyle = intensity.getColor(i * max);
            _data.forEach(function (item) {
                var coordinates = item.coordinate;
                var count = item.count === undefined ? 1 : item.count;
                context.globalAlpha = count / max;
                context.drawImage(circle, coordinates[0] - circleHalfWidth, coordinates[1] - circleHalfHeight);
            });
        }
    }
    function draw(context, data, options) {
        if (context.canvas.width <= 0 || context.canvas.height <= 0) {
            return;
        }
        var strength = options.strength || 0.3;
        context.strokeStyle = 'rgba(0,0,0,' + strength + ')';
        // var shadowCanvas = new Canvas(context.canvas.width, context.canvas.height);
        var shadowCanvas = createCanvas(context.canvas.width, context.canvas.height);
        var shadowContext = shadowCanvas.getContext('2d');
        shadowContext.scale(devicePixelRatio, devicePixelRatio);
        options = options || {};
        // var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        context.save();
        var intensity = new Intensity({
            gradient: options.gradient
        });
        drawGray(shadowContext, data, options);
        // return false;
        if (!options.absolute) {
            var colored = shadowContext.getImageData(0, 0, context.canvas.width, context.canvas.height);
            colorize(colored.data, intensity.getImageData(), options);
            context.putImageData(colored, 0, 0);
            context.restore();
        }
        intensity = null;
        shadowCanvas = null;
    }
    var HeatMapUitl = {
        draw,
        drawGray,
        colorize
    };

    const OPTIONS$5 = {
        altitude: 0,
        interactive: false,
        min: 0,
        max: 100,
        size: 13,
        gradient: { 0.25: 'rgb(0,0,255)', 0.55: 'rgb(0,255,0)', 0.85: 'yellow', 1.0: 'rgb(255,0,0)' },
        gridScale: 0.5
    };
    const CANVAS_MAX_SIZE = 2048;
    /**
     *
     */
    class HeatMap extends BaseObject {
        constructor(data, options, material, layer) {
            if (!Array.isArray(data)) {
                data = [data];
            }
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            const vs = [];
            //Calculate bbox
            for (let i = 0, len = data.length; i < len; i++) {
                const { coordinate, lnglat, xy } = data[i];
                const coord = coordinate || lnglat || xy;
                if (!coord) {
                    console.warn('not find coordinate');
                    continue;
                }
                const v = layer.coordinateToVector3(coord);
                vs.push(v);
                const { x, y } = v;
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
            options = maptalks__namespace.Util.extend({}, OPTIONS$5, options, { layer, points: data });
            // Calculate canvas width and height
            let { gridScale, altitude, size } = options;
            const offsetX = Math.abs(maxX - minX), offsetY = Math.abs(maxY - minY);
            const maxOffset = Math.max((offsetX * gridScale), (offsetY * gridScale));
            if (maxOffset > CANVAS_MAX_SIZE) {
                console.warn(`gridScale: ${gridScale} it's too big. I hope it's a smaller value,canvas max size is ${CANVAS_MAX_SIZE}* ${CANVAS_MAX_SIZE}`);
                const offset = maxOffset / gridScale;
                gridScale = CANVAS_MAX_SIZE / offset;
            }
            let canvasWidth = Math.ceil(offsetX * gridScale), canvasHeight = Math.ceil(offsetY * gridScale);
            const scaleX = canvasWidth / offsetX, scaleY = canvasHeight / offsetY;
            const pixels = [];
            const bufferSize = Math.ceil(size * 2);
            for (let i = 0, len = vs.length; i < len; i++) {
                const v = vs[i];
                v.x -= minX;
                v.y -= minY;
                v.x *= scaleX;
                v.y *= scaleY;
                v.y = canvasHeight - v.y;
                //translate x y
                v.x += bufferSize;
                v.y += bufferSize;
                //for heat draw data
                pixels.push({
                    coordinate: [v.x, v.y],
                    count: data[i].count
                });
            }
            //buffer canvas size
            canvasWidth += bufferSize * 2;
            canvasHeight += bufferSize * 2;
            let shadowCanvas = createCanvas(canvasWidth, canvasHeight);
            let shadowContext = shadowCanvas.getContext('2d');
            // shadowContext.scale(devicePixelRatio, devicePixelRatio);
            HeatMapUitl.drawGray(shadowContext, pixels, options);
            const colored = shadowContext.getImageData(0, 0, shadowContext.canvas.width, shadowContext.canvas.height);
            let maxAlpha = -Infinity;
            const blackps = new Float32Array(colored.data.length / 4), alphas = new Float32Array(colored.data.length / 4);
            for (let i = 3, len = colored.data.length, j = 0; i < len; i += 4) {
                const alpha = colored.data[i];
                maxAlpha = Math.max(maxAlpha, alpha);
                alphas[j] = alpha;
                //Points that do not need to be drawn
                if (alpha <= 0) {
                    blackps[j] = 1;
                }
                j++;
            }
            const intensity = new Intensity({
                gradient: options.gradient
            });
            HeatMapUitl.colorize(colored.data, intensity.getImageData(), options);
            shadowCanvas = null;
            shadowContext = null;
            // const geometry = new THREE.PlaneBufferGeometry(offsetX, offsetY, canvasWidth - 1, canvasHeight - 1);
            const geometry = getPlaneGeometry(offsetX, offsetY, canvasWidth - 1, canvasHeight - 1);
            const index = geometry.getIndex().array;
            const position = geometry.attributes.position.array;
            // Index of the points that really need to be drawn
            const colors = new Float32Array(position.length);
            const tempIndex = new Uint32Array(position.length * 6);
            const color = new THREE__namespace.Color();
            let iIndex = 0;
            for (let i = 0, len = position.length, j = 0, len1 = index.length, m = 0, len2 = colored.data.length, n = 0; i < Math.max(len, len1, len2); i += 3) {
                if (i < len) {
                    const alpha = alphas[n];
                    if (alpha > 0) {
                        position[i + 2] = alpha / maxAlpha;
                    }
                }
                if (j < len1) {
                    const a = index[j], b = index[j + 1], c = index[j + 2];
                    if ((!blackps[a]) || (!blackps[b]) || (!blackps[c])) {
                        tempIndex[iIndex] = a;
                        tempIndex[iIndex + 1] = b;
                        tempIndex[iIndex + 2] = c;
                        iIndex += 3;
                    }
                }
                if (m < len2) {
                    const r = colored.data[m], g = colored.data[m + 1], b = colored.data[m + 2]; // a = colored.data[i + 3];
                    const rgb = `rgb(${r},${g},${b})`;
                    color.setStyle(rgb);
                    colors[j] = color.r;
                    colors[j + 1] = color.g;
                    colors[j + 2] = color.b;
                }
                j += 3;
                m += 4;
                n++;
            }
            const filterIndex = new Uint32Array(iIndex);
            for (let i = 0; i < iIndex; i++) {
                filterIndex[i] = tempIndex[i];
            }
            geometry.setIndex(new THREE__namespace.BufferAttribute(filterIndex, 1));
            addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
            material.vertexColors = getVertexColors();
            super();
            this._initOptions(options);
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            this.getObject3d().position.copy(new THREE__namespace.Vector3((minX + maxX) / 2, (minY + maxY) / 2, z));
            this.type = 'HeatMap';
        }
    }

    const color = new THREE__namespace.Color();
    let colorIndex = 1;
    /**
     *https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes_gpu.html
     */
    class GPUPick {
        constructor(layer) {
            this.object3ds = [];
            this.layer = layer;
            this.camera = layer.getCamera();
            this.renderer = layer.getThreeRenderer();
            this.pickingTexture = new THREE__namespace.WebGLRenderTarget(1, 1);
            this.pickingScene = new THREE__namespace.Scene();
        }
        getColor() {
            color.setHex(colorIndex);
            colorIndex++;
            return color;
        }
        add(object3d) {
            if (object3d) {
                const colorIndex = object3d['_colorIndex'];
                if (colorIndex) {
                    this.object3ds[colorIndex] = object3d;
                    this.pickingScene.add(object3d);
                }
            }
            return this;
        }
        remove(object3d) {
            if (object3d) {
                const colorIndex = object3d['_colorIndex'];
                if (colorIndex) {
                    this.object3ds[colorIndex] = null;
                    this.pickingScene.remove(object3d);
                }
            }
            return this;
        }
        isEmpty() {
            if (this.pickingScene.children.length === 0) {
                return true;
            }
            for (let i = 0, len = this.pickingScene.children.length; i < len; i++) {
                const mesh = this.pickingScene.children[i];
                if (mesh) {
                    const object3d = mesh['__parent'];
                    if (object3d && object3d.getOptions().interactive === true) {
                        return false;
                    }
                }
            }
            return true;
        }
        pick(pixel) {
            if (!pixel) {
                return;
            }
            if (this.isEmpty()) {
                return;
            }
            const { camera, renderer, pickingTexture, pickingScene, object3ds, layer } = this;
            const len = this.pickingScene.children.length;
            // reset all object3d picked
            for (let i = 0; i < len; i++) {
                const object3d = this.pickingScene.children[i];
                if (object3d && object3d['__parent']) {
                    object3d['__parent'].picked = false;
                }
            }
            //resize size
            const { width, height } = layer._getRenderer().canvas;
            const pw = pickingTexture.width, ph = pickingTexture.height;
            if (width !== pw || height !== ph) {
                pickingTexture.setSize(width, height);
            }
            //render the picking scene off-screen
            // set the view offset to represent just a single pixel under the mouse
            // camera.setViewOffset(width, height, mouse.x, mouse.y, 1, 1);
            // render the scene
            renderer.setRenderTarget(pickingTexture);
            renderer.clear();
            if (camera && camera.layers) {
                this.camera.layers.set(0);
            }
            renderer.render(pickingScene, camera);
            // clear the view offset so rendering returns to normal
            // camera.clearViewOffset();
            //create buffer for reading single pixel
            const pixelBuffer = new Uint8Array(4);
            //read the pixel
            const { x, y } = pixel;
            let devicePixelRatio = window.devicePixelRatio;
            const map = layer.getMap();
            if (map) {
                devicePixelRatio = map.getDevicePixelRatio ? map.getDevicePixelRatio() : map.options.devicePixelRatio;
            }
            const offsetX = (x * devicePixelRatio), offsetY = (pickingTexture.height - y * devicePixelRatio);
            renderer.readRenderTargetPixels(pickingTexture, Math.round(offsetX), Math.round(offsetY), 1, 1, pixelBuffer);
            //interpret the pixel as an ID
            const id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);
            const object3d = object3ds[id];
            if (object3d) {
                if (object3d['__parent']) {
                    object3ds[id]['__parent'].picked = true;
                }
            }
            else {
                //for merged mesh
                for (let i = 0; i < len; i++) {
                    const object3d = this.pickingScene.children[i];
                    if (object3d && object3d['__parent']) {
                        const parent = object3d['__parent'];
                        if (parent._colorMap && parent._colorMap[id] != null) {
                            parent.picked = true;
                            parent.index = parent._colorMap[id];
                            break;
                        }
                    }
                }
            }
            renderer.setRenderTarget(null);
        }
    }

    const OPTIONS$4 = {
        bottomHeight: 0,
        altitude: 0
    };
    class FatLine extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$4, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { asynchronous } = options;
            const { lineStrings, center } = LineStringSplit(lineString);
            const geometry = new LineGeometry();
            let position;
            if (asynchronous) {
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                FatLineTaskIns.push({
                    id,
                    data: lineStrings,
                    lineString,
                    center,
                    layer,
                    baseObject: this
                });
            }
            else {
                const positionList = [], cache = {};
                for (let m = 0, le = lineStrings.length; m < le; m++) {
                    const positions = getLinePosition(lineStrings[m], layer, center, false).positions;
                    setBottomHeight(positions, options.bottomHeight, layer, cache);
                    positionList.push(getLineSegmentPosition(positions));
                }
                position = mergeLinePositions(positionList);
                geometry.setPositions(position);
            }
            this._setMaterialRes(layer, material);
            this._createLine2(geometry, material);
            const { altitude } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            if (!asynchronous) {
                this._setPickObject3d(position, material.linewidth);
                this._init();
            }
            this.type = 'FatLine';
        }
        _init() {
            const pick = this.getLayer().getPick();
            this.on('add', () => {
                pick.add(this.pickObject3d);
            });
            this.on('remove', () => {
                pick.remove(this.pickObject3d);
            });
        }
        _setMaterialRes(layer, material) {
            const map = layer.getMap();
            if (!map) {
                return this;
            }
            const size = map.getSize();
            const width = size.width, height = size.height;
            material.resolution.set(width, height);
        }
        _setPickObject3d(ps, linewidth) {
            // if (!this._colorMap) {
            //     return;
            // }
            const geometry = new LineGeometry();
            geometry.setPositions(ps);
            const pick = this.getLayer().getPick();
            const color = pick.getColor();
            const colors = [];
            for (let i = 0, len = ps.length / 3; i < len; i++) {
                colors.push(color.r, color.g, color.b);
            }
            geometry.setColors(colors);
            const material = new LineMaterial({
                color: '#fff',
                // side: THREE.BackSide,
                linewidth,
                vertexColors: getVertexColors()
            });
            this._setMaterialRes(this.getLayer(), material);
            const colorIndex = color.getHex();
            const mesh = new Line2(geometry, material);
            mesh.position.copy(this.getObject3d().position);
            mesh._colorIndex = colorIndex;
            this.setPickObject3d(mesh);
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        setSymbol(material) {
            if (material && material instanceof THREE__namespace.Material) {
                material.needsUpdate = true;
                const size = this.getMap().getSize();
                const width = size.width, height = size.height;
                material.resolution.set(width, height);
                this.getObject3d().material = material;
            }
            return this;
        }
        _workerLoad(result) {
            const position = new Float32Array(result.position);
            const object3d = this.getObject3d();
            object3d.geometry.setPositions(position);
            object3d.computeLineDistances();
            this._setPickObject3d(position, object3d.material.linewidth);
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
        _animation() {
            const layer = this.getLayer();
            if (!layer) {
                return this;
            }
            const object3d = this.getObject3d();
            const pickObject3d = this.getPickObject3d();
            [object3d, pickObject3d].forEach(object3d => {
                if (object3d) {
                    this._setMaterialRes(layer, object3d.material);
                }
            });
        }
    }

    const OPTIONS$3 = {
        altitude: 0,
        colors: null
    };
    /**
     *
     */
    class FatLines extends MergedMixin(BaseObject) {
        constructor(lineStrings, options, material, layer) {
            if (!Array.isArray(lineStrings)) {
                lineStrings = [lineStrings];
            }
            const centers = [], lineStringList = [];
            const len = lineStrings.length;
            for (let i = 0; i < len; i++) {
                const lineString = lineStrings[i];
                const result = LineStringSplit(lineString);
                centers.push(result.center);
                lineStringList.push(result.lineStrings);
            }
            // Get the center point of the point set
            const center = getCenterOfPoints(centers);
            options = maptalks__namespace.Util.extend({}, OPTIONS$3, options, { layer, lineStrings, coordinate: center });
            super();
            this._initOptions(options);
            const { asynchronous } = options;
            const geometry = new LineGeometry();
            const lines = [], cache = {};
            let geometriesAttributes = [], psIndex = 0, positionList = [];
            let position;
            let newPosition;
            if (asynchronous) {
                FatLinesTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    data: lineStringList,
                    key: options.key,
                    center,
                    layer,
                    baseObject: this,
                    lineStrings,
                    option: options,
                });
            }
            else {
                //LineSegmentsGeometry
                for (let i = 0; i < len; i++) {
                    const lls = lineStringList[i];
                    let psCount = 0;
                    for (let m = 0, le = lls.length; m < le; m++) {
                        const properties = getLineStringProperties(lls[m]);
                        const opts = maptalks__namespace.Util.extend({}, options, properties);
                        const { positions } = getLinePosition(lls[m], layer, center, false);
                        setBottomHeight(positions, opts.bottomHeight, layer, cache);
                        psCount += (positions.length / 3 * 2 - 2);
                        positionList.push(getLineSegmentPosition(positions));
                    }
                    geometriesAttributes[i] = {
                        position: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        instanceStart: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        instanceEnd: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        hide: false
                    };
                    psIndex += psCount * 3;
                }
                position = mergeLinePositions(positionList);
                geometry.setPositions(position);
            }
            this._setMaterialRes(layer, material);
            this._createLine2(geometry, material);
            const { altitude } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            // this._faceMap = faceMap;
            this._baseObjects = lines;
            this._datas = lineStrings;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this.index = null;
            this._geometryCache = new LineGeometry();
            if (!asynchronous) {
                newPosition = new Float32Array(position);
                this._geometryCache.setPositions(newPosition);
            }
            this._colorMap = {};
            this.isHide = false;
            this._initBaseObjectsEvent(lines);
            if (!asynchronous) {
                this._setPickObject3d(newPosition, material.linewidth);
                this._init();
            }
            this.type = 'FatLines';
        }
        _setMaterialRes(layer, material) {
            const map = layer.getMap();
            if (!map) {
                return this;
            }
            const size = map.getSize();
            const width = size.width, height = size.height;
            material.resolution.set(width, height);
        }
        _setPickObject3d(ps, linewidth) {
            if (!this._colorMap) {
                return;
            }
            const geometry = this._geometryCache || new LineGeometry();
            geometry.setPositions(ps);
            const pick = this.getLayer().getPick();
            const { _geometriesAttributes } = this;
            const colors = getGeometriesColorArray(_geometriesAttributes);
            let cIndex = 0;
            for (let i = 0, len = _geometriesAttributes.length; i < len; i++) {
                const color = pick.getColor();
                const colorIndex = color.getHex();
                this._colorMap[colorIndex] = i;
                const { count } = _geometriesAttributes[i].position;
                this._datas[i].colorIndex = colorIndex;
                for (let j = 0; j < count; j++) {
                    colors[cIndex] = color.r;
                    colors[cIndex + 1] = color.g;
                    colors[cIndex + 2] = color.b;
                    cIndex += 3;
                }
            }
            geometry.setColors(colors);
            const material = new LineMaterial({
                // color: color.getStyle(),
                // side: THREE.BackSide,
                color: '#fff',
                linewidth,
                vertexColors: getVertexColors()
                // dashed: false
            });
            this._setMaterialRes(this.getLayer(), material);
            const color = pick.getColor();
            const colorIndex = color.getHex();
            const mesh = new Line2(geometry, material);
            mesh.position.copy(this.getObject3d().position);
            mesh._colorIndex = colorIndex;
            this.setPickObject3d(mesh);
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        setSymbol(material) {
            if (material && material instanceof THREE__namespace.Material) {
                material.needsUpdate = true;
                const size = this.getMap().getSize();
                const width = size.width, height = size.height;
                material.resolution.set(width, height);
                this.getObject3d().material = material;
            }
            return this;
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const lineString = this._datas[index];
                    const opts = maptalks__namespace.Util.extend({}, this.getOptions(), { index }, isGeoJSONLine(lineString) ? lineString.properties : lineString.getProperties());
                    this._baseObjects[index] = new FatLine(lineString, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        /**
           * update geometry attributes
           * @param {*} bufferAttribute
           * @param {*} attribute
           */
        _updateAttribute(bufferAttribute, attribute) {
            const { indexs } = this._getHideGeometryIndex(attribute);
            const array = this._geometryCache.attributes[attribute].array;
            const len = array.length;
            for (let i = 0; i < len; i++) {
                bufferAttribute.array[i] = array[i];
            }
            let value = -100000;
            for (let j = 0; j < indexs.length; j++) {
                const index = indexs[j];
                const { start, end } = this._geometriesAttributes[index][attribute];
                for (let i = start; i < end; i++) {
                    bufferAttribute.array[i] = value;
                }
            }
            return this;
        }
        _showGeometry(baseObject, isHide) {
            let index;
            if (baseObject) {
                index = baseObject.getOptions().index;
            }
            if (index != null) {
                const geometryAttributes = this._geometriesAttributes[index];
                const { hide } = geometryAttributes;
                if (hide === isHide) {
                    return this;
                }
                geometryAttributes.hide = isHide;
                const buffGeom = this.getObject3d().geometry;
                this._updateAttribute(buffGeom.attributes.instanceStart, 'instanceStart');
                this._updateAttribute(buffGeom.attributes.instanceEnd, 'instanceEnd');
                // this._updateAttribute(buffGeom.attributes.instanceDistanceStart, 'instanceDistanceStart');
                // this._updateAttribute(buffGeom.attributes.instanceDistanceEnd, 'instanceDistanceEnd');
                buffGeom.attributes.instanceStart.data.needsUpdate = true;
                buffGeom.attributes.instanceEnd.data.needsUpdate = true;
                // buffGeom.attributes.instanceDistanceStart.data.needsUpdate = true;
                // buffGeom.attributes.instanceDistanceEnd.data.needsUpdate = true;
                this.isHide = isHide;
            }
            return this;
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const object3d = this.getObject3d();
            const position = new Float32Array(result.position);
            const newPosition = new Float32Array(position);
            object3d.geometry.setPositions(new Float32Array(position));
            this._geometryCache.setPositions(newPosition);
            this._setPickObject3d(newPosition, object3d.material.linewidth);
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
        _animation() {
            const layer = this.getLayer();
            if (!layer) {
                return this;
            }
            const object3d = this.getObject3d();
            const pickObject3d = this.getPickObject3d();
            [object3d, pickObject3d].forEach(object3d => {
                if (object3d) {
                    this._setMaterialRes(layer, object3d.material);
                }
            });
        }
    }

    const OPTIONS$2 = {
        radius: 10,
        height: 100,
        altitude: 0,
        topColor: '',
        bottomColor: '#2d2f61',
        heightEnable: true
    };
    class Box extends BaseObject {
        constructor(coordinate, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$2, options, { layer, coordinate });
            super();
            this._initOptions(options);
            const { height, radius, topColor, bottomColor, altitude } = options;
            const h = layer.altitudeToVector3(height, height).x;
            const r = layer.distanceToVector3(radius, radius).x;
            const geometry = getDefaultBoxGeometry().clone();
            geometry.scale(r * 2, r * 2, h);
            if (topColor) {
                initVertexColors(geometry, bottomColor, topColor, 'z', h / 2);
                material.vertexColors = getVertexColors();
            }
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const position = layer.coordinateToVector3(coordinate, z);
            this.getObject3d().position.copy(position);
            this.type = 'Box';
        }
    }

    class Boxs extends MergedMixin(BaseObject) {
        constructor(points, options, material, layer) {
            if (!Array.isArray(points)) {
                points = [points];
            }
            const len = points.length;
            const center = getCenterOfPoints(points);
            const centerPt = layer.coordinateToVector3(center);
            const geometries = [], bars = [], geometriesAttributes = [];
            let psIndex = 0;
            options = maptalks__namespace.Util.extend({}, { altitude: 0, layer, points }, options);
            const cache = {}, altCache = {};
            for (let i = 0; i < len; i++) {
                const opts = maptalks__namespace.Util.extend({ index: i }, options, points[i]);
                const { radius, altitude, topColor, bottomColor, height, coordinate } = opts;
                const r = distanceToVector3(radius, layer, cache);
                const h = altitudeToVector3(height, layer, altCache);
                const alt = altitudeToVector3(altitude, layer, altCache);
                const buffGeom = getDefaultBoxGeometry().clone();
                buffGeom.scale(r * 2, r * 2, h);
                if (topColor) {
                    initVertexColors(buffGeom, bottomColor, topColor, 'z', h / 2);
                    material.vertexColors = getVertexColors();
                }
                const v = layer.coordinateToVector3(coordinate).sub(centerPt);
                const parray = buffGeom.attributes.position.array;
                for (let j = 0, len1 = parray.length; j < len1; j += 3) {
                    parray[j + 2] += alt;
                    parray[j] += v.x;
                    parray[j + 1] += v.y;
                    parray[j + 2] += v.z;
                }
                geometries.push(buffGeom);
                const bar = new Box(coordinate, opts, material, layer);
                bars.push(bar);
                buffGeom.index.count / 3;
                const psCount = buffGeom.attributes.position.count; 
                //  colorCount = buffGeom.attributes.color.count,
                buffGeom.attributes.normal.count; buffGeom.attributes.uv.count;
                geometriesAttributes[i] = {
                    position: {
                        count: psCount,
                        start: psIndex,
                        end: psIndex + psCount * 3,
                    },
                    // normal: {
                    //     count: normalCount,
                    //     start: normalIndex,
                    //     end: normalIndex + normalCount * 3,
                    // },
                    // // color: {
                    // //     count: colorCount,
                    // //     start: colorIndex,
                    // //     end: colorIndex + colorCount * 3,
                    // // },
                    // uv: {
                    //     count: uvCount,
                    //     start: uvIndex,
                    //     end: uvIndex + uvCount * 2,
                    // },
                    hide: false
                };
                psIndex += psCount * 3;
            }
            super();
            this._initOptions(options);
            const geometry = mergeBarGeometry(geometries);
            this._createMesh(geometry, material);
            const altitude = options.altitude;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = centerPt.clone();
            v.z = z;
            this.getObject3d().position.copy(v);
            // this._faceMap = faceMap;
            this._baseObjects = bars;
            this._datas = points;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(geometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(bars);
            this._setPickObject3d();
            this._init();
            this.type = 'Boxs';
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
    }

    var earcut$2 = {exports: {}};

    earcut$2.exports = earcut;
    earcut$2.exports.default = earcut;

    function earcut(data, holeIndices, dim) {

        dim = dim || 2;

        var hasHoles = holeIndices && holeIndices.length,
            outerLen = hasHoles ? holeIndices[0] * dim : data.length,
            outerNode = linkedList(data, 0, outerLen, dim, true),
            triangles = [];

        if (!outerNode || outerNode.next === outerNode.prev) return triangles;

        var minX, minY, maxX, maxY, x, y, invSize;

        if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

        // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
        if (data.length > 80 * dim) {
            minX = maxX = data[0];
            minY = maxY = data[1];

            for (var i = dim; i < outerLen; i += dim) {
                x = data[i];
                y = data[i + 1];
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }

            // minX, minY and invSize are later used to transform coords into integers for z-order calculation
            invSize = Math.max(maxX - minX, maxY - minY);
            invSize = invSize !== 0 ? 1 / invSize : 0;
        }

        earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

        return triangles;
    }

    // create a circular doubly linked list from polygon points in the specified winding order
    function linkedList(data, start, end, dim, clockwise) {
        var i, last;

        if (clockwise === (signedArea(data, start, end, dim) > 0)) {
            for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
        } else {
            for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
        }

        if (last && equals(last, last.next)) {
            removeNode(last);
            last = last.next;
        }

        return last;
    }

    // eliminate colinear or duplicate points
    function filterPoints(start, end) {
        if (!start) return start;
        if (!end) end = start;

        var p = start,
            again;
        do {
            again = false;

            if (!p.steiner && (equals(p, p.next) || area$1(p.prev, p, p.next) === 0)) {
                removeNode(p);
                p = end = p.prev;
                if (p === p.next) break;
                again = true;

            } else {
                p = p.next;
            }
        } while (again || p !== end);

        return end;
    }

    // main ear slicing loop which triangulates a polygon (given as a linked list)
    function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
        if (!ear) return;

        // interlink polygon nodes in z-order
        if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

        var stop = ear,
            prev, next;

        // iterate through ears, slicing them one by one
        while (ear.prev !== ear.next) {
            prev = ear.prev;
            next = ear.next;

            if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
                // cut off the triangle
                triangles.push(prev.i / dim);
                triangles.push(ear.i / dim);
                triangles.push(next.i / dim);

                removeNode(ear);

                // skipping the next vertex leads to less sliver triangles
                ear = next.next;
                stop = next.next;

                continue;
            }

            ear = next;

            // if we looped through the whole remaining polygon and can't find any more ears
            if (ear === stop) {
                // try filtering points and slicing again
                if (!pass) {
                    earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

                // if this didn't work, try curing all small self-intersections locally
                } else if (pass === 1) {
                    ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                    earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

                // as a last resort, try splitting the remaining polygon into two
                } else if (pass === 2) {
                    splitEarcut(ear, triangles, dim, minX, minY, invSize);
                }

                break;
            }
        }
    }

    // check whether a polygon node forms a valid ear with adjacent nodes
    function isEar(ear) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area$1(a, b, c) >= 0) return false; // reflex, can't be an ear

        // now make sure we don't have other points inside the potential ear
        var p = ear.next.next;

        while (p !== ear.prev) {
            if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area$1(p.prev, p, p.next) >= 0) return false;
            p = p.next;
        }

        return true;
    }

    function isEarHashed(ear, minX, minY, invSize) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area$1(a, b, c) >= 0) return false; // reflex, can't be an ear

        // triangle bbox; min & max are calculated like this for speed
        var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
            minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
            maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
            maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

        // z-order range for the current triangle bbox;
        var minZ = zOrder(minTX, minTY, minX, minY, invSize),
            maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

        var p = ear.prevZ,
            n = ear.nextZ;

        // look for points inside the triangle in both directions
        while (p && p.z >= minZ && n && n.z <= maxZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area$1(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;

            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area$1(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        // look for remaining points in decreasing z-order
        while (p && p.z >= minZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area$1(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
        }

        // look for remaining points in increasing z-order
        while (n && n.z <= maxZ) {
            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area$1(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        return true;
    }

    // go through all polygon nodes and cure small local self-intersections
    function cureLocalIntersections(start, triangles, dim) {
        var p = start;
        do {
            var a = p.prev,
                b = p.next.next;

            if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

                triangles.push(a.i / dim);
                triangles.push(p.i / dim);
                triangles.push(b.i / dim);

                // remove two nodes involved
                removeNode(p);
                removeNode(p.next);

                p = start = b;
            }
            p = p.next;
        } while (p !== start);

        return filterPoints(p);
    }

    // try splitting polygon into two and triangulate them independently
    function splitEarcut(start, triangles, dim, minX, minY, invSize) {
        // look for a valid diagonal that divides the polygon into two
        var a = start;
        do {
            var b = a.next.next;
            while (b !== a.prev) {
                if (a.i !== b.i && isValidDiagonal(a, b)) {
                    // split the polygon in two by the diagonal
                    var c = splitPolygon(a, b);

                    // filter colinear points around the cuts
                    a = filterPoints(a, a.next);
                    c = filterPoints(c, c.next);

                    // run earcut on each half
                    earcutLinked(a, triangles, dim, minX, minY, invSize);
                    earcutLinked(c, triangles, dim, minX, minY, invSize);
                    return;
                }
                b = b.next;
            }
            a = a.next;
        } while (a !== start);
    }

    // link every hole into the outer loop, producing a single-ring polygon without holes
    function eliminateHoles(data, holeIndices, outerNode, dim) {
        var queue = [],
            i, len, start, end, list;

        for (i = 0, len = holeIndices.length; i < len; i++) {
            start = holeIndices[i] * dim;
            end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            list = linkedList(data, start, end, dim, false);
            if (list === list.next) list.steiner = true;
            queue.push(getLeftmost(list));
        }

        queue.sort(compareX);

        // process holes from left to right
        for (i = 0; i < queue.length; i++) {
            outerNode = eliminateHole(queue[i], outerNode);
            outerNode = filterPoints(outerNode, outerNode.next);
        }

        return outerNode;
    }

    function compareX(a, b) {
        return a.x - b.x;
    }

    // find a bridge between vertices that connects hole with an outer ring and and link it
    function eliminateHole(hole, outerNode) {
        var bridge = findHoleBridge(hole, outerNode);
        if (!bridge) {
            return outerNode;
        }

        var bridgeReverse = splitPolygon(bridge, hole);

        // filter collinear points around the cuts
        var filteredBridge = filterPoints(bridge, bridge.next);
        filterPoints(bridgeReverse, bridgeReverse.next);

        // Check if input node was removed by the filtering
        return outerNode === bridge ? filteredBridge : outerNode;
    }

    // David Eberly's algorithm for finding a bridge between hole and outer polygon
    function findHoleBridge(hole, outerNode) {
        var p = outerNode,
            hx = hole.x,
            hy = hole.y,
            qx = -Infinity,
            m;

        // find a segment intersected by a ray from the hole's leftmost point to the left;
        // segment's endpoint with lesser x will be potential connection point
        do {
            if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
                var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
                if (x <= hx && x > qx) {
                    qx = x;
                    if (x === hx) {
                        if (hy === p.y) return p;
                        if (hy === p.next.y) return p.next;
                    }
                    m = p.x < p.next.x ? p : p.next;
                }
            }
            p = p.next;
        } while (p !== outerNode);

        if (!m) return null;

        if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

        // look for points inside the triangle of hole point, segment intersection and endpoint;
        // if there are no points found, we have a valid connection;
        // otherwise choose the point of the minimum angle with the ray as connection point

        var stop = m,
            mx = m.x,
            my = m.y,
            tanMin = Infinity,
            tan;

        p = m;

        do {
            if (hx >= p.x && p.x >= mx && hx !== p.x &&
                    pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

                tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

                if (locallyInside(p, hole) &&
                    (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                    m = p;
                    tanMin = tan;
                }
            }

            p = p.next;
        } while (p !== stop);

        return m;
    }

    // whether sector in vertex m contains sector in vertex p in the same coordinates
    function sectorContainsSector(m, p) {
        return area$1(m.prev, m, p.prev) < 0 && area$1(p.next, m, m.next) < 0;
    }

    // interlink polygon nodes in z-order
    function indexCurve(start, minX, minY, invSize) {
        var p = start;
        do {
            if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
            p.prevZ = p.prev;
            p.nextZ = p.next;
            p = p.next;
        } while (p !== start);

        p.prevZ.nextZ = null;
        p.prevZ = null;

        sortLinked(p);
    }

    // Simon Tatham's linked list merge sort algorithm
    // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
    function sortLinked(list) {
        var i, p, q, e, tail, numMerges, pSize, qSize,
            inSize = 1;

        do {
            p = list;
            list = null;
            tail = null;
            numMerges = 0;

            while (p) {
                numMerges++;
                q = p;
                pSize = 0;
                for (i = 0; i < inSize; i++) {
                    pSize++;
                    q = q.nextZ;
                    if (!q) break;
                }
                qSize = inSize;

                while (pSize > 0 || (qSize > 0 && q)) {

                    if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                        e = p;
                        p = p.nextZ;
                        pSize--;
                    } else {
                        e = q;
                        q = q.nextZ;
                        qSize--;
                    }

                    if (tail) tail.nextZ = e;
                    else list = e;

                    e.prevZ = tail;
                    tail = e;
                }

                p = q;
            }

            tail.nextZ = null;
            inSize *= 2;

        } while (numMerges > 1);

        return list;
    }

    // z-order of a point given coords and inverse of the longer side of data bbox
    function zOrder(x, y, minX, minY, invSize) {
        // coords are transformed into non-negative 15-bit integer range
        x = 32767 * (x - minX) * invSize;
        y = 32767 * (y - minY) * invSize;

        x = (x | (x << 8)) & 0x00FF00FF;
        x = (x | (x << 4)) & 0x0F0F0F0F;
        x = (x | (x << 2)) & 0x33333333;
        x = (x | (x << 1)) & 0x55555555;

        y = (y | (y << 8)) & 0x00FF00FF;
        y = (y | (y << 4)) & 0x0F0F0F0F;
        y = (y | (y << 2)) & 0x33333333;
        y = (y | (y << 1)) & 0x55555555;

        return x | (y << 1);
    }

    // find the leftmost node of a polygon ring
    function getLeftmost(start) {
        var p = start,
            leftmost = start;
        do {
            if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
            p = p.next;
        } while (p !== start);

        return leftmost;
    }

    // check if a point lies within a convex triangle
    function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
               (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
               (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
    }

    // check if a diagonal between two polygon nodes is valid (lies in polygon interior)
    function isValidDiagonal(a, b) {
        return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
               (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
                (area$1(a.prev, a, b.prev) || area$1(a, b.prev, b)) || // does not create opposite-facing sectors
                equals(a, b) && area$1(a.prev, a, a.next) > 0 && area$1(b.prev, b, b.next) > 0); // special zero-length case
    }

    // signed area of a triangle
    function area$1(p, q, r) {
        return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    }

    // check if two points are equal
    function equals(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    }

    // check if two segments intersect
    function intersects(p1, q1, p2, q2) {
        var o1 = sign(area$1(p1, q1, p2));
        var o2 = sign(area$1(p1, q1, q2));
        var o3 = sign(area$1(p2, q2, p1));
        var o4 = sign(area$1(p2, q2, q1));

        if (o1 !== o2 && o3 !== o4) return true; // general case

        if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
        if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
        if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
        if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

        return false;
    }

    // for collinear points p, q, r, check if point q lies on segment pr
    function onSegment(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
    }

    function sign(num) {
        return num > 0 ? 1 : num < 0 ? -1 : 0;
    }

    // check if a polygon diagonal intersects any polygon segments
    function intersectsPolygon(a, b) {
        var p = a;
        do {
            if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                    intersects(p, p.next, a, b)) return true;
            p = p.next;
        } while (p !== a);

        return false;
    }

    // check if a polygon diagonal is locally inside the polygon
    function locallyInside(a, b) {
        return area$1(a.prev, a, a.next) < 0 ?
            area$1(a, b, a.next) >= 0 && area$1(a, a.prev, b) >= 0 :
            area$1(a, b, a.prev) < 0 || area$1(a, a.next, b) < 0;
    }

    // check if the middle point of a polygon diagonal is inside the polygon
    function middleInside(a, b) {
        var p = a,
            inside = false,
            px = (a.x + b.x) / 2,
            py = (a.y + b.y) / 2;
        do {
            if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                    (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
                inside = !inside;
            p = p.next;
        } while (p !== a);

        return inside;
    }

    // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
    // if one belongs to the outer ring and another to a hole, it merges it into a single ring
    function splitPolygon(a, b) {
        var a2 = new Node(a.i, a.x, a.y),
            b2 = new Node(b.i, b.x, b.y),
            an = a.next,
            bp = b.prev;

        a.next = b;
        b.prev = a;

        a2.next = an;
        an.prev = a2;

        b2.next = a2;
        a2.prev = b2;

        bp.next = b2;
        b2.prev = bp;

        return b2;
    }

    // create a node and optionally link it with previous one (in a circular doubly linked list)
    function insertNode(i, x, y, last) {
        var p = new Node(i, x, y);

        if (!last) {
            p.prev = p;
            p.next = p;

        } else {
            p.next = last.next;
            p.prev = last;
            last.next.prev = p;
            last.next = p;
        }
        return p;
    }

    function removeNode(p) {
        p.next.prev = p.prev;
        p.prev.next = p.next;

        if (p.prevZ) p.prevZ.nextZ = p.nextZ;
        if (p.nextZ) p.nextZ.prevZ = p.prevZ;
    }

    function Node(i, x, y) {
        // vertex index in coordinates array
        this.i = i;

        // vertex coordinates
        this.x = x;
        this.y = y;

        // previous and next vertex nodes in a polygon ring
        this.prev = null;
        this.next = null;

        // z-order curve value
        this.z = null;

        // previous and next nodes in z-order
        this.prevZ = null;
        this.nextZ = null;

        // indicates whether this is a steiner point
        this.steiner = false;
    }

    // return a percentage difference between the polygon area and its triangulation area;
    // used to verify correctness of triangulation
    earcut.deviation = function (data, holeIndices, dim, triangles) {
        var hasHoles = holeIndices && holeIndices.length;
        var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

        var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
        if (hasHoles) {
            for (var i = 0, len = holeIndices.length; i < len; i++) {
                var start = holeIndices[i] * dim;
                var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
                polygonArea -= Math.abs(signedArea(data, start, end, dim));
            }
        }

        var trianglesArea = 0;
        for (i = 0; i < triangles.length; i += 3) {
            var a = triangles[i] * dim;
            var b = triangles[i + 1] * dim;
            var c = triangles[i + 2] * dim;
            trianglesArea += Math.abs(
                (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
                (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
        }

        return polygonArea === 0 && trianglesArea === 0 ? 0 :
            Math.abs((trianglesArea - polygonArea) / polygonArea);
    };

    function signedArea(data, start, end, dim) {
        var sum = 0;
        for (var i = start, j = end - dim; i < end; i += dim) {
            sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
            j = i;
        }
        return sum;
    }

    // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
    earcut.flatten = function (data) {
        var dim = data[0][0].length,
            result = {vertices: [], holes: [], dimensions: dim},
            holeIndex = 0;

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
            }
            if (i > 0) {
                holeIndex += data[i - 1].length;
                result.holes.push(holeIndex);
            }
        }
        return result;
    };

    var earcut$1 = earcut$2.exports;

    /*
     (c) 2017, Vladimir Agafonkin
     Simplify.js, a high-performance JS polyline simplification library
     mourner.github.io/simplify-js
    */

    // to suit your point format, run search/replace for '.x' and '.y';
    // for 3D version, see 3d branch (configurability would draw significant performance overhead)

    // square distance between 2 points
    function getSqDist(p1, p2) {

        var dx = p1[0] - p2[0],
            dy = p1[1] - p2[1];

        return dx * dx + dy * dy;
    }

    // square distance from a point to a segment
    function getSqSegDist(p, p1, p2) {

        var x = p1[0],
            y = p1[1],
            dx = p2[0] - x,
            dy = p2[1] - y;

        if (dx !== 0 || dy !== 0) {

            var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

            if (t > 1) {
                x = p2[0];
                y = p2[1];

            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }

        dx = p[0] - x;
        dy = p[1] - y;

        return dx * dx + dy * dy;
    }
    // rest of the code doesn't care about point format

    // basic distance-based simplification
    function simplifyRadialDist(points, sqTolerance) {

        var prevPoint = points[0],
            newPoints = [prevPoint],
            point;

        for (var i = 1, len = points.length; i < len; i++) {
            point = points[i];

            if (getSqDist(point, prevPoint) > sqTolerance) {
                newPoints.push(point);
                prevPoint = point;
            }
        }

        if (prevPoint !== point) newPoints.push(point);

        return newPoints;
    }

    function simplifyDPStep(points, first, last, sqTolerance, simplified) {
        var maxSqDist = sqTolerance,
            index;

        for (var i = first + 1; i < last; i++) {
            var sqDist = getSqSegDist(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
            simplified.push(points[index]);
            if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
        }
    }

    // simplification using Ramer-Douglas-Peucker algorithm
    function simplifyDouglasPeucker(points, sqTolerance) {
        var last = points.length - 1;

        var simplified = [points[0]];
        simplifyDPStep(points, 0, last, sqTolerance, simplified);
        simplified.push(points[last]);

        return simplified;
    }

    // both algorithms combined for awesome performance
    function simplify(points, tolerance, highestQuality) {

        if (points.length <= 2) return points;

        var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

        points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
        points = simplifyDouglasPeucker(points, sqTolerance);

        return points;
    }

    function dot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    }
    function v2Dot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1];
    }

    function normalize(out, v) {
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const d = Math.sqrt(x * x + y * y + z * z);
        out[0] = x / d;
        out[1] = y / d;
        out[2] = z / d;
        return out;
    }

    function v2Normalize(out, v) {
        const x = v[0];
        const y = v[1];
        const d = Math.sqrt(x * x + y * y);
        out[0] = x / d;
        out[1] = y / d;
        return out;
    }

    function scale(out, v, s) {
        out[0] = v[0] * s;
        out[1] = v[1] * s;
        out[2] = v[2] * s;
        return out;
    }

    function scaleAndAdd(out, v1, v2, s) {
        out[0] = v1[0] + v2[0] * s;
        out[1] = v1[1] + v2[1] * s;
        out[2] = v1[2] + v2[2] * s;
        return out;
    }

    function v2Add(out, v1, v2) {
        out[0] = v1[0] + v2[0];
        out[1] = v1[1] + v2[1];
        return out;
    }

    function v3Sub(out, v1, v2) {
        out[0] = v1[0] - v2[0];
        out[1] = v1[1] - v2[1];
        out[2] = v1[2] - v2[2];
        return out;
    }

    function v3Normalize(out, v) {
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const d = Math.sqrt(x * x + y * y + z * z);
        out[0] = x / d;
        out[1] = y / d;
        out[2] = z / d;
        return out;
    }

    function v3Cross(out, v1, v2) {
        var ax = v1[0], ay = v1[1], az = v1[2],
            bx = v2[0], by = v2[1], bz = v2[2];

        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    }

    const rel = [];
    // start and end must be normalized
    function slerp(out, start, end, t) {
        // https://keithmaggio.wordpress.com/2011/02/15/math-magician-lerp-slerp-and-nlerp/
        const cosT = dot(start, end);
        const theta = Math.acos(cosT) * t;

        scaleAndAdd(rel, end, start, -cosT);
        normalize(rel, rel);// start and rel Orthonormal basis

        scale(out, start, Math.cos(theta));
        scaleAndAdd(out, out, rel, Math.sin(theta));

        return out;
    }

    function lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4, out, writeOffset) {
        const dx1 = x2 - x1;
        const dx2 = x4 - x3;
        const dy1 = y2 - y1;
        const dy2 = y4 - y3;

        const cross = dy2 * dx1 - dx2 * dy1;
        const tmp1 = y1 - y3;
        const tmp2 = x1 - x3;
        const t1 = (dx2 * tmp1 - dy2 * tmp2) / cross;
        // const t2 = (dx1 * tmp1 - dy1 * tmp2) / cross;

        if (out) {
            writeOffset = writeOffset || 0;
            out[writeOffset] = x1 + t1 * (x2 - x1);
            out[writeOffset + 1] = y1 + t1 * (y2 - y1);
        }

        return t1;
    }

    function area(points, start, end) {
        // Signed polygon area
        const n = end - start;
        if (n < 3) {
            return 0;
        }
        let area = 0;
        for (let i = (end - 1) * 2, j = start * 2; j < end * 2;) {
            const x0 = points[i];
            const y0 = points[i + 1];
            const x1 = points[j];
            const y1 = points[j + 1];
            i = j;
            j += 2;
            area += x0 * y1 - x1 * y0;
        }

        return area;
    }

    // TODO fitRect x, y are negative?

    function triangulate(vertices, holes, dimensions = 2) {
        return earcut$1(vertices, holes, dimensions);
    }
    function flatten(data) {
        return earcut$1.flatten(data);
    }

    const v1 = [];
    const v2 = [];
    const v = [];

    function innerOffsetPolygon(
        vertices, out, start, end, outStart, offset, miterLimit, close,
        removeIntersections,
        // offsetLines
    ) {
        const checkMiterLimit = miterLimit != null;
        let cursor = outStart;
        let indicesMap = null;
        if (checkMiterLimit) {
            indicesMap = new Uint32Array(end - start);
        }
        let prevOffsetX;
        let prevOffsetY;
        let prevCursor;
        let tmpIntersection = [];

        for (let i = start; i < end; i++) {
            const nextIdx = i === end - 1 ? start : i + 1;
            const prevIdx = i === start ? end - 1 : i - 1;
            const x1 = vertices[prevIdx * 2];
            const y1 = vertices[prevIdx * 2 + 1];
            const x2 = vertices[i * 2];
            const y2 = vertices[i * 2 + 1];
            const x3 = vertices[nextIdx * 2];
            const y3 = vertices[nextIdx * 2 + 1];

            v1[0] = x2 - x1;
            v1[1] = y2 - y1;
            v2[0] = x3 - x2;
            v2[1] = y3 - y2;

            v2Normalize(v1, v1);
            v2Normalize(v2, v2);

            checkMiterLimit && (indicesMap[i] = cursor);

            let needCheckIntersection = false;
            let offsetX;
            let offsetY;
            if (!close && i === start) {
                v[0] = v2[1];
                v[1] = -v2[0];
                v2Normalize(v, v);
                prevOffsetX = out[cursor * 2] = x2 + v[0] * offset;
                prevOffsetY = out[cursor * 2 + 1] = y2 + v[1] * offset;
                prevCursor = cursor;

                // offsetLines && offsetLines.push([x2, y2, prevOffsetX, prevOffsetY, cursor])
                cursor++;
            }
            else if (!close && i === end - 1) {
                v[0] = v1[1];
                v[1] = -v1[0];
                v2Normalize(v, v);

                offsetX = x2 + v[0] * offset;
                offsetY = y2 + v[1] * offset;

                needCheckIntersection = true;
            }
            else {
                // PENDING Why using sub will lost the direction info.
                v2Add(v, v2, v1);
                const tmp = v[1];
                v[1] = -v[0];
                v[0] = tmp;

                v2Normalize(v, v);

                const cosA = v2Dot(v, v2);
                const sinA = Math.sqrt(1 - cosA * cosA);
                // PENDING
                // Make sure it's offset lines instead of vertices.
                const miter = offset * Math.min(10, 1 / sinA);

                const isCovex = offset * cosA < 0;

                if (checkMiterLimit && (1 / sinA) > miterLimit && isCovex) {
                    // No need to check line intersection on the outline.
                    const mx = x2 + v[0] * offset;
                    const my = y2 + v[1] * offset;
                    const halfA = Math.acos(sinA) / 2;
                    const dist = Math.tan(halfA) * Math.abs(offset);
                    out[cursor * 2] = mx + v[1] * dist;
                    out[cursor * 2 + 1] = my - v[0] * dist;
                    cursor++;
                    out[cursor * 2] = mx - v[1] * dist;
                    out[cursor * 2 + 1] = my + v[0] * dist;
                    cursor++;
                }
                else {
                    offsetX = x2 + v[0] * miter;
                    offsetY = y2 + v[1] * miter;
                    needCheckIntersection = true;
                }

                if (needCheckIntersection) {
                    // TODO Handle with whole.
                    if (removeIntersections && prevOffsetX != null) {
                        // Greedy, only check with previous offset line
                        // PENDING: Is it necessary to check with other lines?
                        const t = lineIntersection(
                            x1, y1, prevOffsetX, prevOffsetY,
                            x2, y2, offsetX, offsetY, tmpIntersection, 0
                        );
                        // Use a eplison
                        if (t >= -1e-2 && t <= 1 + 1e-2) {
                            // Update previous offset points.
                            out[prevCursor * 2] = offsetX = tmpIntersection[0];
                            out[prevCursor * 2 + 1] = offsetY = tmpIntersection[1];
                        }
                    }

                    prevOffsetX = out[cursor * 2] = offsetX;
                    prevOffsetY = out[cursor * 2 + 1] = offsetY;
                    prevCursor = cursor;

                    // offsetLines && offsetLines.push([x2, y2, offsetX, offsetY, cursor])

                    cursor++;
                }
            }
        }


        return indicesMap;
    }



    function innerOffsetPolyline(
        vertices, out, start, end, outStart, offset, miterLimit, close
    ) {
        const checkMiterLimit = miterLimit != null;
        let outOff = outStart;
        let indicesMap = null;
        if (checkMiterLimit) {
            indicesMap = new Uint32Array(end - start);
        }
        for (let i = start; i < end; i++) {
            const nextIdx = i === end - 1 ? start : i + 1;
            const prevIdx = i === start ? end - 1 : i - 1;
            const x1 = vertices[prevIdx * 2];
            const y1 = vertices[prevIdx * 2 + 1];
            const x2 = vertices[i * 2];
            const y2 = vertices[i * 2 + 1];
            const x3 = vertices[nextIdx * 2];
            const y3 = vertices[nextIdx * 2 + 1];

            v1[0] = x2 - x1;
            v1[1] = y2 - y1;
            v2[0] = x3 - x2;
            v2[1] = y3 - y2;

            v2Normalize(v1, v1);
            v2Normalize(v2, v2);

            checkMiterLimit && (indicesMap[i] = outOff);
            if (!close && i === start) {
                v[0] = v2[1];
                v[1] = -v2[0];
                v2Normalize(v, v);
                out[outOff * 2] = x2 + v[0] * offset;
                out[outOff * 2 + 1] = y2 + v[1] * offset;
                outOff++;
            }
            else if (!close && i === end - 1) {
                v[0] = v1[1];
                v[1] = -v1[0];
                v2Normalize(v, v);
                out[outOff * 2] = x2 + v[0] * offset;
                out[outOff * 2 + 1] = y2 + v[1] * offset;
                outOff++;
            }
            else {
                // PENDING Why using sub will lost the direction info.
                v2Add(v, v2, v1);
                const tmp = v[1];
                v[1] = -v[0];
                v[0] = tmp;

                v2Normalize(v, v);

                const cosA = v2Dot(v, v2);
                const sinA = Math.sqrt(1 - cosA * cosA);
                // PENDING
                const miter = offset * Math.min(10, 1 / sinA);

                const isCovex = offset * cosA < 0;

                if (checkMiterLimit && (1 / sinA) > miterLimit && isCovex) {
                    const mx = x2 + v[0] * offset;
                    const my = y2 + v[1] * offset;
                    const halfA = Math.acos(sinA) / 2;
                    const dist = Math.tan(halfA) * Math.abs(offset);
                    out[outOff * 2] = mx + v[1] * dist;
                    out[outOff * 2 + 1] = my - v[0] * dist;
                    outOff++;
                    out[outOff * 2] = mx - v[1] * dist;
                    out[outOff * 2 + 1] = my + v[0] * dist;
                    outOff++;
                }
                else {
                    out[outOff * 2] = x2 + v[0] * miter;
                    out[outOff * 2 + 1] = y2 + v[1] * miter;
                    outOff++;
                }
            }
        }

        return indicesMap;
    }

    function offsetPolygon(vertices, holes, offset, miterLimit, close) {
        const offsetVertices = miterLimit != null ? [] : new Float32Array(vertices.length);
        const exteriorSize = (holes && holes.length) ? holes[0] : vertices.length / 2;

        innerOffsetPolygon(
            vertices, offsetVertices, 0, exteriorSize, 0, offset, miterLimit, close, true
        );

        if (holes) {
            for (let i = 0; i < holes.length; i++) {
                const start = holes[i];
                const end = holes[i + 1] || vertices.length / 2;
                innerOffsetPolygon(
                    vertices, offsetVertices, start, end,
                    miterLimit != null ? offsetVertices.length / 2 : start,
                    offset, miterLimit, close, false
                );
            }
        }

        // TODO holes
        // Remove intersections of offseted polygon
        // let len = offsetLines.length;
        // let tmpIntersection = [];
        // for (let i = 0; i < len; i++) {
        //     const line1 = offsetLines[i];
        //     for (let k = i + 1; k < len; k++) {
        //         const line2 = offsetLines[k];

        //         const t = lineIntersection(
        //             line1[0], line1[1], line1[2], line1[3],
        //             line2[0], line2[1], line2[2], line2[3], tmpIntersection, 0
        //         );
        //         // Use a eplison
        //         if (t >= -1e-2 && t <= 1 + 1e-2) {
        //             const cursor1 = line1[4] * 2;
        //             const cursor2 = line2[4] * 2;
        //             // Update
        //             offsetVertices[cursor1] = offsetVertices[cursor2] = line1[2] = line2[2] = tmpIntersection[0];
        //             offsetVertices[cursor1 + 1] = offsetVertices[cursor2 + 1] = line1[3] = line2[3]= tmpIntersection[1];
        //         }
        //     }
        // }
        return offsetVertices;
    }

    function reversePoints(points, stride, start, end) {
        for (let i = 0; i < Math.floor((end - start) / 2); i++) {
            for (let j = 0; j < stride; j++) {
                const a = (i + start) * stride + j;
                const b = (end - i - 1) * stride + j;
                const tmp = points[a];
                points[a] = points[b];
                points[b] = tmp;
            }
        }

        return points;
    }

    function convertToClockwise(vertices, holes) {
        let polygonVertexCount = vertices.length / 2;
        let start = 0;
        let end = holes && holes.length ? holes[0] : polygonVertexCount;
        if (area(vertices, start, end) > 0) {
            reversePoints(vertices, 2, start, end);
        }
        for (let h = 1; h < (holes ? holes.length : 0) + 1; h++) {
            start = holes[h - 1];
            end = holes[h] || polygonVertexCount;
            if (area(vertices, start, end) < 0) {
                reversePoints(vertices, 2, start, end);
            }
        }
    }

    function normalizeOpts(opts) {

        opts.depth = opts.depth || 1;
        opts.bevelSize = opts.bevelSize || 0;
        opts.bevelSegments = opts.bevelSegments == null ? 2 : opts.bevelSegments;
        opts.smoothBevel = opts.smoothBevel || false;
        opts.simplify = opts.simplify || 0;

        if (opts.smoothSide == null) {
            opts.smoothSide = 'auto';
        }
        if (opts.smoothSideThreshold == null) {
            opts.smoothSideThreshold = 0.9;
        }

        // Normalize bevel options.
        if (typeof opts.depth === 'number') {
            opts.bevelSize = Math.min(!(opts.bevelSegments > 0) ? 0 : opts.bevelSize, opts.depth / 2);
        }
        if (!(opts.bevelSize > 0)) {
            opts.bevelSegments = 0;
        }
        opts.bevelSegments = Math.round(opts.bevelSegments);

        const boundingRect = opts.boundingRect;
        opts.translate = opts.translate || [0, 0];
        opts.scale = opts.scale || [1, 1];
        if (opts.fitRect) {
            let targetX = opts.fitRect.x == null
                ? (boundingRect.x || 0)
                : opts.fitRect.x;
            let targetY = opts.fitRect.y == null
                ? (boundingRect.y || 0)
                : opts.fitRect.y;
            let targetWidth = opts.fitRect.width;
            let targetHeight = opts.fitRect.height;
            if (targetWidth == null) {
                if (targetHeight != null) {
                    targetWidth = targetHeight / boundingRect.height * boundingRect.width;
                }
                else {
                    targetWidth = boundingRect.width;
                    targetHeight = boundingRect.height;
                }
            }
            else if (targetHeight == null) {
                targetHeight = targetWidth / boundingRect.width * boundingRect.height;
            }
            opts.scale = [
                targetWidth / boundingRect.width,
                targetHeight / boundingRect.height
            ];
            opts.translate = [
                (targetX - boundingRect.x) * opts.scale[0],
                (targetY - boundingRect.y) * opts.scale[1]
            ];
        }
    }

    function generateNormal(indices, position) {

        function v3Set(p, a, b, c) {
            p[0] = a; p[1] = b; p[2] = c;
        }

        const p1 = [];
        const p2 = [];
        const p3 = [];

        const v21 = [];
        const v32 = [];

        const n = [];

        const len = indices.length;
        const normals = new Float32Array(position.length);

        for (let f = 0; f < len;) {
            const i1 = indices[f++] * 3;
            const i2 = indices[f++] * 3;
            const i3 = indices[f++] * 3;

            v3Set(p1, position[i1], position[i1 + 1], position[i1 + 2]);
            v3Set(p2, position[i2], position[i2 + 1], position[i2 + 2]);
            v3Set(p3, position[i3], position[i3 + 1], position[i3 + 2]);

            v3Sub(v21, p1, p2);
            v3Sub(v32, p2, p3);
            v3Cross(n, v21, v32);
            // Already be weighted by the triangle area
            for (let i = 0; i < 3; i++) {
                normals[i1 + i] = normals[i1 + i] + n[i];
                normals[i2 + i] = normals[i2 + i] + n[i];
                normals[i3 + i] = normals[i3 + i] + n[i];
            }
        }

        for (var i = 0; i < normals.length;) {
            v3Set(n, normals[i], normals[i + 1], normals[i + 2]);
            v3Normalize(n, n);
            normals[i++] = n[0];
            normals[i++] = n[1];
            normals[i++] = n[2];

        }

        return normals;
    }
    // 0,0----1,0
    // 0,1----1,1
    const quadToTriangle = [
        [0, 0], [1, 0], [1, 1],
        [0, 0], [1, 1], [0, 1]
    ];

    function ringDistance(vertices, start, end) {
        let distance = 0;
        let preX = vertices[start], preY = vertices[start + 1];
        const firstX = preX, firstY = preY;
        for (let i = start + 2; i < end; i += 2) {
            const x = vertices[i], y = vertices[i + 1];
            distance += Math.sqrt((x - preX) * (x - preX) + (y - preY) * (y - preY));
            preX = x;
            preY = y;
        }
        distance += Math.sqrt((preX - firstX) * (preX - firstX) + (preY - firstY) * (preY - firstY));
        return distance;
    }

    // Add side vertices and indices. Include bevel.
    function addExtrudeSide(
        out, { vertices, topVertices, splittedMap, depth, rect }, start, end,
        cursors, opts
    ) {
        const ringVertexCount = end - start;

        const splitBevel = opts.smoothBevel ? 1 : 2;
        const bevelSize = Math.min(depth / 2, opts.bevelSize);
        const bevelSegments = opts.bevelSegments;
        const vertexOffset = cursors.vertex;
        const ringPerimeter = cursors.ringPerimeter;
        const size = Math.max(rect.width, rect.height, depth, ringPerimeter);

        function isDuplicateVertex(idx) {
            const nextIdx = (idx + 1) % ringVertexCount;
            const x0 = vertices[idx * 2];
            const y0 = vertices[idx * 2 + 1];
            const x1 = vertices[nextIdx * 2];
            const y1 = vertices[nextIdx * 2 + 1];
            return x0 === x1 && y0 === y1;
        }

        // Side vertices
        if (bevelSize > 0) {
            const v0 = [0, 0, 1];
            const v1 = [];
            const v2 = [0, 0, -1];
            const v = [];

            let ringCount = 0;
            let vLen = new Float32Array(ringVertexCount);
            for (let k = 0; k < 2; k++) {
                const z = (k === 0 ? (depth - bevelSize) : bevelSize);
                for (let s = 0; s <= bevelSegments * splitBevel; s++) {
                    let uLen = 0;
                    let prevX;
                    let prevY;
                    for (let i = 0; i < ringVertexCount; i++) {
                        const idx = (i % ringVertexCount + start) * 2;
                        const rawIdx = splittedMap ? splittedMap[idx / 2] * 2 : idx;
                        v1[0] = vertices[idx] - topVertices[rawIdx];
                        v1[1] = vertices[idx + 1] - topVertices[rawIdx + 1];
                        v1[2] = 0;
                        const l = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
                        v1[0] /= l;
                        v1[1] /= l;

                        const t = (Math.floor(s / splitBevel) + (s % splitBevel)) / bevelSegments;
                        k === 0 ? slerp(v, v0, v1, t)
                            : slerp(v, v1, v2, t);

                        const t2 = k === 0 ? t : 1 - t;
                        const a = bevelSize * Math.sin(t2 * Math.PI / 2);
                        const b = l * Math.cos(t2 * Math.PI / 2);

                        // ellipse radius
                        const r = bevelSize * l / Math.sqrt(a * a + b * b);

                        const x = v[0] * r + topVertices[rawIdx];
                        const y = v[1] * r + topVertices[rawIdx + 1];
                        const zz = v[2] * r + z;
                        out.position[cursors.vertex * 3] = x;
                        out.position[cursors.vertex * 3 + 1] = y;
                        out.position[cursors.vertex * 3 + 2] = zz;

                        // TODO Cache and optimize
                        if (i > 0) {
                            uLen += Math.sqrt((prevX - x) * (prevX - x) + (prevY - y) * (prevY - y));
                        }
                        if (s > 0 || k > 0) {
                            let tmp = (cursors.vertex - ringVertexCount) * 3;
                            let prevX2 = out.position[tmp];
                            let prevY2 = out.position[tmp + 1];
                            let prevZ2 = out.position[tmp + 2];

                            vLen[i] += Math.sqrt(
                                (prevX2 - x) * (prevX2 - x)
                                + (prevY2 - y) * (prevY2 - y)
                                + (prevZ2 - zz) * (prevZ2 - zz)
                            );
                        }
                        out.uv[cursors.vertex * 2] = uLen / size;
                        out.uv[cursors.vertex * 2 + 1] = vLen[i] / size;

                        prevX = x;
                        prevY = y;
                        cursors.vertex++;

                        // Just ignore this face if vertex are duplicted in `splitVertices`
                        if (isDuplicateVertex(i)) {
                            continue;
                        }
                        if ((splitBevel > 1 && (s % splitBevel)) || (splitBevel === 1 && s >= 1)) {
                            for (let f = 0; f < 6; f++) {
                                const m = (quadToTriangle[f][0] + i) % ringVertexCount;
                                const n = quadToTriangle[f][1] + ringCount;
                                out.indices[cursors.index++] = (n - 1) * ringVertexCount + m + vertexOffset;
                            }
                        }
                    }

                    ringCount++;
                }
            }
        }
        else {
            for (let k = 0; k < 2; k++) {
                const z = k === 0 ? depth - bevelSize : bevelSize;
                let uLen = 0;
                let prevX;
                let prevY;
                for (let i = 0; i < ringVertexCount; i++) {
                    const idx = (i % ringVertexCount + start) * 2;
                    const x = vertices[idx];
                    const y = vertices[idx + 1];
                    out.position[cursors.vertex * 3] = x;
                    out.position[cursors.vertex * 3 + 1] = y;
                    out.position[cursors.vertex * 3 + 2] = z;
                    if (i > 0) {
                        uLen += Math.sqrt((prevX - x) * (prevX - x) + (prevY - y) * (prevY - y));
                    }
                    out.uv[cursors.vertex * 2] = uLen / size;
                    out.uv[cursors.vertex * 2 + 1] = z / size;
                    prevX = x;
                    prevY = y;

                    cursors.vertex++;
                }
            }
        }
        // Connect the side
        const sideStartRingN = bevelSize > 0 ? (bevelSegments * splitBevel + 1) : 1;
        for (let i = 0; i < ringVertexCount; i++) {
            // Just ignore this face if vertex are duplicted in `splitVertices`
            if (isDuplicateVertex(i)) {
                continue;
            }
            for (let f = 0; f < 6; f++) {
                const m = (quadToTriangle[f][0] + i) % ringVertexCount;
                const n = quadToTriangle[f][1] + sideStartRingN;
                out.indices[cursors.index++] = (n - 1) * ringVertexCount + m + vertexOffset;
            }
        }
    }

    function addTopAndBottom({ indices, topVertices, rect, depth }, out, cursors, opts) {
        if (topVertices.length <= 4) {
            return;
        }

        const vertexOffset = cursors.vertex;
        // Top indices
        const indicesLen = indices.length;
        for (let i = 0; i < indicesLen; i++) {
            out.indices[cursors.index++] = vertexOffset + indices[i];
        }
        const size = Math.max(rect.width, rect.height);
        // Top and bottom vertices
        for (let k = 0; k < (opts.excludeBottom ? 1 : 2); k++) {
            for (let i = 0; i < topVertices.length; i += 2) {
                const x = topVertices[i];
                const y = topVertices[i + 1];
                out.position[cursors.vertex * 3] = x;
                out.position[cursors.vertex * 3 + 1] = y;
                out.position[cursors.vertex * 3 + 2] = (1 - k) * depth;

                out.uv[cursors.vertex * 2] = (x - rect.x) / size;
                out.uv[cursors.vertex * 2 + 1] = (y - rect.y) / size;
                cursors.vertex++;
            }
        }
        // Bottom indices
        if (!opts.excludeBottom) {
            const vertexCount = topVertices.length / 2;
            for (let i = 0; i < indicesLen; i += 3) {
                for (let k = 0; k < 3; k++) {
                    out.indices[cursors.index++] = vertexOffset + vertexCount + indices[i + 2 - k];
                }
            }
        }
    }

    /**
     * Split vertices for sharp side.
     */
    function splitVertices(vertices, holes, smoothSide, smoothSideThreshold) {
        const isAutoSmooth = smoothSide == null || smoothSide === 'auto';
        if (smoothSide === true) {
            return { vertices, holes };
        }
        const newVertices = [];
        const newHoles = holes && [];
        const count = vertices.length / 2;
        const v1 = [];
        const v2 = [];

        // Map of splitted index to raw index
        const splittedMap = [];

        let start = 0;
        let end = 0;

        const polysCount = (holes ? holes.length : 0) + 1;
        for (let h = 0; h < polysCount; h++) {
            if (h === 0) {
                end = holes && holes.length ? holes[0] : count;
            }
            else {
                start = holes[h - 1];
                end = holes[h] || count;
            }

            for (let i = start; i < end; i++) {
                const x2 = vertices[i * 2];
                const y2 = vertices[i * 2 + 1];
                const nextIdx = i === end - 1 ? start : i + 1;
                const x3 = vertices[nextIdx * 2];
                const y3 = vertices[nextIdx * 2 + 1];

                if (isAutoSmooth) {
                    const prevIdx = i === start ? end - 1 : i - 1;
                    const x1 = vertices[prevIdx * 2];
                    const y1 = vertices[prevIdx * 2 + 1];

                    v1[0] = x1 - x2;
                    v1[1] = y1 - y2;
                    v2[0] = x3 - x2;
                    v2[1] = y3 - y2;

                    v2Normalize(v1, v1);
                    v2Normalize(v2, v2);

                    const angleCos = v2Dot(v1, v2) * 0.5 + 0.5;

                    if ((1 - angleCos) > smoothSideThreshold) {
                        newVertices.push(x2, y2);
                        splittedMap.push(i);
                    }
                    else {
                        newVertices.push(x2, y2, x2, y2);
                        splittedMap.push(i, i);
                    }
                }
                else {
                    newVertices.push(x2, y2, x2, y2);
                    splittedMap.push(i, i);
                }
            }

            if (h < polysCount - 1 && newHoles) {
                newHoles.push(newVertices.length / 2);
            }
        }

        return {
            vertices: new Float32Array(newVertices),
            splittedMap,
            holes: newHoles
        };
    }

    function innerExtrudeTriangulatedPolygon(preparedData, opts) {
        let indexCount = 0;
        let vertexCount = 0;

        for (let p = 0; p < preparedData.length; p++) {
            const { indices, vertices, splittedMap, topVertices, depth } = preparedData[p];
            const bevelSize = Math.min(depth / 2, opts.bevelSize);
            const bevelSegments = !(bevelSize > 0) ? 0 : opts.bevelSegments;

            const holes = preparedData[p].holes || [];

            indexCount += indices.length * (opts.excludeBottom ? 1 : 2);
            vertexCount += topVertices.length / 2 * (opts.excludeBottom ? 1 : 2);
            const ringCount = 2 + bevelSegments * 2;

            let start = 0;
            let end = 0;
            for (let h = 0; h < holes.length + 1; h++) {
                if (h === 0) {
                    end = holes.length ? holes[0] : vertices.length / 2;
                }
                else {
                    start = holes[h - 1];
                    end = holes[h] || vertices.length / 2;
                }

                const faceEnd = splittedMap ? splittedMap[end - 1] + 1 : end;
                const faceStart = splittedMap ? splittedMap[start] : start;
                indexCount += (faceEnd - faceStart) * 6 * (ringCount - 1);

                const sideRingVertexCount = end - start;
                vertexCount += sideRingVertexCount * ringCount
                    // Double the bevel vertex number if not smooth
                    + (!opts.smoothBevel ? bevelSegments * sideRingVertexCount * 2 : 0);
            }
        }

        const data = {
            position: new Float32Array(vertexCount * 3),
            indices: new (vertexCount > 0xffff ? Uint32Array : Uint16Array)(indexCount),
            uv: new Float32Array(vertexCount * 2)
        };

        const cursors = {
            vertex: 0, index: 0, ringPerimeter: 0
        };

        for (let d = 0; d < preparedData.length; d++) {
            addTopAndBottom(preparedData[d], data, cursors, opts);
        }

        for (let d = 0; d < preparedData.length; d++) {
            const { holes, vertices } = preparedData[d];
            const vertexCount = vertices.length / 2;

            let start = 0;
            let end = (holes && holes.length) ? holes[0] : vertexCount;
            cursors.ringPerimeter = ringDistance(preparedData[d].topVertices, start, end);
            // Add exterior
            addExtrudeSide(data, preparedData[d], start, end, cursors, opts);
            // Add holes
            if (holes) {
                for (let h = 0; h < holes.length; h++) {
                    start = holes[h];
                    end = holes[h + 1] || vertexCount;
                    cursors.ringPerimeter = ringDistance(preparedData[d].topVertices, start, end);
                    addExtrudeSide(data, preparedData[d], start, end, cursors, opts);
                }
            }
        }

        // Wrap uv
        for (let i = 0; i < data.uv.length; i++) {
            const val = data.uv[i];
            if (val > 0 && Math.round(val) === val) {
                data.uv[i] = 1;
            }
            else {
                data.uv[i] = val % 1;
            }
        }

        data.normal = generateNormal(data.indices, data.position);
        // PENDING
        data.boundingRect = preparedData[0] && preparedData[0].rect;

        return data;
    }

    function convertPolylineToTriangulatedPolygon(polyline, polylineIdx, opts) {
        const lineWidth = opts.lineWidth;
        const pointCount = polyline.length;
        const points = new Float32Array(pointCount * 2);
        const translate = opts.translate || [0, 0];
        const scale = opts.scale || [1, 1];
        for (let i = 0, k = 0; i < pointCount; i++) {
            points[k++] = polyline[i][0] * scale[0] + translate[0];
            points[k++] = polyline[i][1] * scale[1] + translate[1];
        }

        if (area(points, 0, pointCount) < 0) {
            reversePoints(points, 2, 0, pointCount);
        }

        const insidePoints = [];
        const outsidePoints = [];
        const miterLimit = opts.miterLimit;
        const outsideIndicesMap = innerOffsetPolyline(
            points, outsidePoints, 0, pointCount, 0, -lineWidth / 2, miterLimit, false);
        reversePoints(points, 2, 0, pointCount);
        const insideIndicesMap = innerOffsetPolyline(
            points, insidePoints, 0, pointCount, 0, -lineWidth / 2, miterLimit, false);

        const polygonVertexCount = (insidePoints.length + outsidePoints.length) / 2;
        const polygonVertices = new Float32Array(polygonVertexCount * 2);

        let offset = 0;
        const outsidePointCount = outsidePoints.length / 2;
        for (let i = 0; i < outsidePoints.length; i++) {
            polygonVertices[offset++] = outsidePoints[i];
        }
        for (let i = 0; i < insidePoints.length; i++) {
            polygonVertices[offset++] = insidePoints[i];
        }

        // Built indices
        const indices = new (polygonVertexCount > 0xffff ? Uint32Array : Uint16Array)(
            ((pointCount - 1) * 2 + (polygonVertexCount - pointCount * 2)) * 3
        );
        let off = 0;
        for (let i = 0; i < pointCount - 1; i++) {
            const i2 = i + 1;
            indices[off++] = outsidePointCount - 1 - outsideIndicesMap[i];
            indices[off++] = outsidePointCount - 1 - outsideIndicesMap[i] - 1;
            indices[off++] = insideIndicesMap[i] + 1 + outsidePointCount;

            indices[off++] = outsidePointCount - 1 - outsideIndicesMap[i];
            indices[off++] = insideIndicesMap[i] + 1 + outsidePointCount;
            indices[off++] = insideIndicesMap[i] + outsidePointCount;

            if (insideIndicesMap[i2] - insideIndicesMap[i] === 2) {
                indices[off++] = insideIndicesMap[i] + 2 + outsidePointCount;
                indices[off++] = insideIndicesMap[i] + 1 + outsidePointCount;
                indices[off++] = outsidePointCount - outsideIndicesMap[i2] - 1;
            }
            else if (outsideIndicesMap[i2] - outsideIndicesMap[i] === 2) {
                indices[off++] = insideIndicesMap[i2] + outsidePointCount;
                indices[off++] = outsidePointCount - 1 - (outsideIndicesMap[i] + 1);
                indices[off++] = outsidePointCount - 1 - (outsideIndicesMap[i] + 2);
            }
        }

        const topVertices = opts.bevelSize > 0
            ? offsetPolygon(polygonVertices, [], opts.bevelSize, null, true) : polygonVertices;
        const boundingRect = opts.boundingRect;

        const res = splitVertices(polygonVertices, null, opts.smoothSide, opts.smoothSideThreshold);
        return {
            vertices: res.vertices,
            rawVertices: topVertices,
            splittedMap: res.splittedMap,
            indices,
            topVertices,
            rect: {
                x: boundingRect.x * scale[0] + translate[0],
                y: boundingRect.y * scale[1] + translate[1],
                width: boundingRect.width * scale[0],
                height: boundingRect.height * scale[1],
            },
            depth: typeof opts.depth === 'function' ? opts.depth(polylineIdx) : opts.depth,
            holes: []
        };
    }

    function removeClosePointsOfPolygon(polygon, epsilon) {
        const newPolygon = [];
        for (let k = 0; k < polygon.length; k++) {
            const points = polygon[k];
            const newPoints = [];
            const len = points.length;
            let x1 = points[len - 1][0];
            let y1 = points[len - 1][1];
            let dist = 0;
            for (let i = 0; i < len; i++) {
                let x2 = points[i][0];
                let y2 = points[i][1];
                const dx = x2 - x1;
                const dy = y2 - y1;
                dist += Math.sqrt(dx * dx + dy * dy);
                if (dist > epsilon) {
                    newPoints.push(points[i]);
                    dist = 0;
                }
                x1 = x2;
                y1 = y2;
            }
            if (newPoints.length >= 3) {
                newPolygon.push(newPoints);
            }
        }
        return newPolygon.length > 0 ? newPolygon : null;
    }

    function simplifyPolygon(polygon, tolerance) {
        const newPolygon = [];
        for (let k = 0; k < polygon.length; k++) {
            let points = polygon[k];
            points = simplify(points, tolerance, true);
            if (points.length >= 3) {
                newPolygon.push(points);
            }
        }
        return newPolygon.length > 0 ? newPolygon : null;
    }
    /**
     *
     * @param {Array} polygons Polygons array that match GeoJSON MultiPolygon geometry.
     * @param {Object} [opts]
     * @param {number|Function} [opts.depth]
     * @param {number} [opts.bevelSize = 0]
     * @param {number} [opts.bevelSegments = 2]
     * @param {number} [opts.simplify = 0]
     * @param {boolean} [opts.smoothSide = 'auto']
     * @param {boolean} [opts.smoothSideThreshold = 0.9]    // Will not smooth sharp side.
     * @param {boolean} [opts.smoothBevel = false]
     * @param {boolean} [opts.excludeBottom = false]
     * @param {Object} [opts.fitRect] translate and scale will be ignored if fitRect is set
     * @param {Array} [opts.translate]
     * @param {Array} [opts.scale]
     *
     * @return {Object} {indices, position, uv, normal, boundingRect}
     */
    function extrudePolygon(polygons, opts) {

        opts = Object.assign({}, opts);

        const min = [Infinity, Infinity];
        const max = [-Infinity, -Infinity];
        for (let i = 0; i < polygons.length; i++) {
            updateBoundingRect(polygons[i][0], min, max);
        }
        opts.boundingRect = opts.boundingRect || {
            x: min[0], y: min[1], width: max[0] - min[0], height: max[1] - min[1]
        };

        normalizeOpts(opts);

        const preparedData = [];
        const translate = opts.translate || [0, 0];
        const scale = opts.scale || [1, 1];
        const boundingRect = opts.boundingRect;
        const transformdRect = {
            x: boundingRect.x * scale[0] + translate[0],
            y: boundingRect.y * scale[1] + translate[1],
            width: boundingRect.width * scale[0],
            height: boundingRect.height * scale[1],
        };

        const epsilon = Math.min(
            boundingRect.width, boundingRect.height
        ) / 1e5;
        for (let i = 0; i < polygons.length; i++) {
            let newPolygon = removeClosePointsOfPolygon(polygons[i], epsilon);
            if (!newPolygon) {
                continue;
            }
            const simplifyTolerance = opts.simplify / Math.max(scale[0], scale[1]);
            if (simplifyTolerance > 0) {
                newPolygon = simplifyPolygon(newPolygon, simplifyTolerance);
            }
            if (!newPolygon) {
                continue;
            }

            const { vertices, holes, dimensions } = earcut$1.flatten(newPolygon);

            for (let k = 0; k < vertices.length;) {
                vertices[k] = vertices[k++] * scale[0] + translate[0];
                vertices[k] = vertices[k++] * scale[1] + translate[1];
            }

            convertToClockwise(vertices, holes);

            if (dimensions !== 2) {
                throw new Error('Only 2D polygon points are supported');
            }
            const topVertices = opts.bevelSize > 0
                ? offsetPolygon(vertices, holes, opts.bevelSize, null, true) : vertices;
            const indices = triangulate(topVertices, holes, dimensions);
            const res = splitVertices(vertices, holes, opts.smoothSide, opts.smoothSideThreshold);

            preparedData.push({
                indices,
                vertices: res.vertices,
                rawVertices: vertices,
                topVertices,
                holes: res.holes,
                splittedMap: res.splittedMap,
                rect: transformdRect,
                depth: typeof opts.depth === 'function' ? opts.depth(i) : opts.depth
            });
        }
        return innerExtrudeTriangulatedPolygon(preparedData, opts);
    }
    /**
     *
     * @param {Array} polylines Polylines array that match GeoJSON MultiLineString geometry.
     * @param {Object} [opts]
     * @param {number} [opts.depth]
     * @param {number} [opts.bevelSize = 0]
     * @param {number} [opts.bevelSegments = 2]
     * @param {number} [opts.simplify = 0]
     * @param {boolean} [opts.smoothSide = 'auto']
     * @param {boolean} [opts.smoothSideThreshold = 0.9]    // Will not smooth sharp side.
     * @param {boolean} [opts.smoothBevel = false]
     * @param {boolean} [opts.excludeBottom = false]
     * @param {boolean} [opts.lineWidth = 1]
     * @param {boolean} [opts.miterLimit = 2]
     * @param {Object} [opts.fitRect] translate and scale will be ignored if fitRect is set
     * @param {Array} [opts.translate]
     * @param {Array} [opts.scale]
     * @param {Object} [opts.boundingRect]
     * @return {Object} {indices, position, uv, normal, boundingRect}
     */
    function extrudePolyline(polylines, opts) {

        opts = Object.assign({}, opts);

        const min = [Infinity, Infinity];
        const max = [-Infinity, -Infinity];
        for (let i = 0; i < polylines.length; i++) {
            updateBoundingRect(polylines[i], min, max);
        }
        opts.boundingRect = opts.boundingRect || {
            x: min[0], y: min[1], width: max[0] - min[0], height: max[1] - min[1]
        };

        normalizeOpts(opts);
        const scale = opts.scale || [1, 1];

        if (opts.lineWidth == null) {
            opts.lineWidth = 1;
        }
        if (opts.miterLimit == null) {
            opts.miterLimit = 2;
        }
        const preparedData = [];
        // Extrude polyline to polygon
        for (let i = 0; i < polylines.length; i++) {
            let newPolyline = polylines[i];
            const simplifyTolerance = opts.simplify / Math.max(scale[0], scale[1]);
            if (simplifyTolerance > 0) {
                newPolyline = simplify(newPolyline, simplifyTolerance, true);
            }
            preparedData.push(convertPolylineToTriangulatedPolygon(newPolyline, i, opts));
        }

        return innerExtrudeTriangulatedPolygon(preparedData, opts);
    }

    function updateBoundingRect(points, min, max) {
        for (let i = 0; i < points.length; i++) {
            min[0] = Math.min(points[i][0], min[0]);
            min[1] = Math.min(points[i][1], min[1]);
            max[0] = Math.max(points[i][0], max[0]);
            max[1] = Math.max(points[i][1], max[1]);
        }
    }

    /**
     *
     * @param {Object} geojson
     * @param {Object} [opts]
     * @param {number} [opts.depth]
     * @param {number} [opts.bevelSize = 0]
     * @param {number} [opts.bevelSegments = 2]
     * @param {number} [opts.simplify = 0]
     * @param {boolean} [opts.smoothSide = 'auto']
     * @param {boolean} [opts.smoothSideThreshold = 0.9]    // Will not smooth sharp side.
     * @param {boolean} [opts.smoothBevel = false]
     * @param {boolean} [opts.excludeBottom = false]
     * @param {boolean} [opts.lineWidth = 1]
     * @param {boolean} [opts.miterLimit = 2]
     * @param {Object} [opts.fitRect] translate and scale will be ignored if fitRect is set
     * @param {Array} [opts.translate]
     * @param {Array} [opts.scale]
     * @param {Object} [opts.boundingRect]
     * @return {Object} {polyline: {indices, position, uv, normal}, polygon: {indices, position, uv, normal}}
     */

    // TODO Not merge feature
    function extrudeGeoJSON(geojson, opts) {

        opts = Object.assign({}, opts);

        const polylines = [];
        const polygons = [];

        const polylineFeatureIndices = [];
        const polygonFeatureIndices = [];

        const min = [Infinity, Infinity];
        const max = [-Infinity, -Infinity];

        for (let i = 0; i < geojson.features.length; i++) {
            const feature = geojson.features[i];
            const geometry = feature.geometry;
            if (geometry && geometry.coordinates) {
                switch (geometry.type) {
                    case 'LineString':
                        polylines.push(geometry.coordinates);
                        polylineFeatureIndices.push(i);
                        updateBoundingRect(geometry.coordinates, min, max);
                        break;
                    case 'MultiLineString':
                        for (let k = 0; k < geometry.coordinates.length; k++) {
                            polylines.push(geometry.coordinates[k]);
                            polylineFeatureIndices.push(i);
                            updateBoundingRect(geometry.coordinates[k], min, max);
                        }
                        break;
                    case 'Polygon':
                        polygons.push(geometry.coordinates);
                        polygonFeatureIndices.push(i);
                        updateBoundingRect(geometry.coordinates[0], min, max);
                        break;
                    case 'MultiPolygon':
                        for (let k = 0; k < geometry.coordinates.length; k++) {
                            polygons.push(geometry.coordinates[k]);
                            polygonFeatureIndices.push(i);
                            updateBoundingRect(geometry.coordinates[k][0], min, max);
                        }
                        break;
                }
            }
        }

        opts.boundingRect = opts.boundingRect || {
            x: min[0], y: min[1], width: max[0] - min[0], height: max[1] - min[1]
        };

        const originalDepth = opts.depth;
        return {
            polyline: extrudePolyline(polylines, Object.assign(opts, {
                depth: function (idx) {
                    if (typeof originalDepth === 'function') {
                        return originalDepth(
                            geojson.features[polylineFeatureIndices[idx]]
                        );
                    }
                    return originalDepth;
                }
            })),
            polygon: extrudePolygon(polygons, Object.assign(opts, {
                depth: function (idx) {
                    if (typeof originalDepth === 'function') {
                        return originalDepth(
                            geojson.features[polygonFeatureIndices[idx]]
                        );
                    }
                    return originalDepth;
                }
            }))
        };
    }

    var main = /*#__PURE__*/Object.freeze({
        __proto__: null,
        triangulate: triangulate,
        flatten: flatten,
        offsetPolygon: offsetPolygon,
        extrudePolygon: extrudePolygon,
        extrudePolyline: extrudePolyline,
        extrudeGeoJSON: extrudeGeoJSON
    });

    const fetchDataWorkerKey = '__maptalks.three.fetchdata__';
    function fetchDataWorkerCode(exports) {
        const tasks = [], taskings = [], concurrentCount = 5;
        exports.initialize = function () {
        };
        exports.onmessage = function (message, postResponse) {
            const data = message.data;
            const task = {
                url: data,
                postResponse,
                abort: false
            };
            loopTask(task);
        };
        function loopTask(task) {
            if (task.abort) {
                taskings.splice(taskings.indexOf(task), 1);
                if (tasks.length) {
                    taskings.push(tasks[0]);
                    tasks.splice(0, 1);
                    fetchData(taskings[taskings.length - 1]);
                }
            }
            else if (taskings.length < concurrentCount) {
                taskings.push(task);
                fetchData(task);
            }
            else {
                tasks.push(task);
            }
        }
        function fetchData(task) {
            fetch(task.url).then(res => res.text()).then((json) => {
                const blob = new Blob([json], { type: 'application/json' });
                blob.arrayBuffer().then(arrayBuffer => {
                    task.postResponse(null, arrayBuffer, [arrayBuffer]);
                    task.abort = true;
                    loopTask(task);
                });
            }).catch(error => {
                console.error(error);
                task.abort = true;
                loopTask(task);
            });
        }
    }
    var actor;
    function getFetchDataActor() {
        if (!maptalks__namespace.worker) {
            console.error('maptalks.worker is not defined,You can\'t use');
        }
        if (!actor) {
            actor = new maptalks__namespace.worker.Actor(fetchDataWorkerKey);
        }
        return actor;
    }

    const OPTIONS$1 = {
        bottomHeight: 0,
        width: 3,
        cornerRadius: 0,
        altitude: 0,
        topColor: null,
        bottomColor: '#2d2f61',
        heightEnable: true
    };
    /**
     *
     */
    class Path extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$1, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { width, cornerRadius, bottomHeight, altitude, asynchronous } = options;
            const cr = layer.distanceToVector3(cornerRadius, cornerRadius).x;
            const w = layer.distanceToVector3(width, width).x;
            const { lineStrings, center } = LineStringSplit(lineString);
            let geometry;
            if (asynchronous) {
                geometry = getDefaultBufferGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                PathTaskIns.push({
                    id,
                    data: lineStrings,
                    layer,
                    center,
                    lineString,
                    baseObject: this
                });
            }
            else {
                const extrudeParams = [];
                const cache = {};
                for (let i = 0, len = lineStrings.length; i < len; i++) {
                    const attribute = getPathParams(lineStrings[i], w, cr, layer, center);
                    setBottomHeight(attribute, bottomHeight, layer, cache);
                    extrudeParams.push(attribute);
                }
                geometry = mergeBufferGeometries(extrudeParams);
            }
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this.type = 'Path';
        }
        _workerLoad(result) {
            const bufferGeometry = generateBufferGeometry(result);
            const object3d = this.getObject3d();
            object3d.geometry = bufferGeometry;
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS = {
        width: 3,
        cornerRadius: 0,
        altitude: 0,
        topColor: null,
        bottomColor: '#2d2f61'
    };
    class Paths extends MergedMixin(BaseObject) {
        constructor(lineStrings, options, material, layer) {
            if (!Array.isArray(lineStrings)) {
                lineStrings = [lineStrings];
            }
            const centers = [], lineStringList = [];
            const len = lineStrings.length;
            for (let i = 0; i < len; i++) {
                const lineString = lineStrings[i];
                const result = LineStringSplit(lineString);
                centers.push(result.center);
                lineStringList.push(result.lineStrings);
            }
            // Get the center point of the point set
            const center = getCenterOfPoints(centers);
            options = maptalks__namespace.Util.extend({}, OPTIONS, options, { layer, lineStrings, coordinate: center });
            const { altitude, asynchronous } = options;
            let bufferGeometry;
            const extrudeLines = [], geometriesAttributes = [];
            super();
            if (asynchronous) {
                bufferGeometry = getDefaultBufferGeometry();
                PathsTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    layer,
                    key: options.key,
                    center,
                    data: lineStringList,
                    lineStrings,
                    baseObject: this,
                    option: options,
                });
            }
            else {
                const geometries = [];
                let psIndex = 0;
                const cache = {}, altCache = {};
                for (let i = 0; i < len; i++) {
                    const lineString = lineStrings[i];
                    const opts = maptalks__namespace.Util.extend({}, options, getLineStringProperties(lineString), { index: i });
                    const { cornerRadius, width, bottomHeight } = opts;
                    const w = distanceToVector3(width, layer, cache);
                    const rc = distanceToVector3(cornerRadius, layer, altCache);
                    const lls = lineStringList[i];
                    const extrudeParams = [];
                    let minZ = 0;
                    for (let m = 0, le = lls.length; m < le; m++) {
                        const attribute = getPathParams(lls[m], w, rc, layer, center);
                        minZ = setBottomHeight(attribute, bottomHeight, layer, cache);
                        extrudeParams.push(attribute);
                    }
                    const buffGeom = mergeBufferGeometriesAttribute(extrudeParams);
                    geometries.push(buffGeom);
                    // const extrudeLine = new ExtrudeLine(lineString, opts, material, layer);
                    // extrudeLines.push(extrudeLine);
                    const { position, normal, indices } = buffGeom;
                    indices.length / 3;
                    const psCount = position.length / 3; 
                    //  colorCount = buffGeom.attributes.color.count,
                    normal.length / 3;
                    geometriesAttributes[i] = {
                        position: {
                            middleZ: minZ,
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        // normal: {
                        //     count: normalCount,
                        //     start: normalIndex,
                        //     end: normalIndex + normalCount * 3,
                        // },
                        // color: {
                        //     count: colorCount,
                        //     start: colorIndex,
                        //     end: colorIndex + colorCount * 3,
                        // },
                        // uv: {
                        //     count: uvCount,
                        //     start: uvIndex,
                        //     end: uvIndex + uvCount * 2,
                        // },
                        hide: false
                    };
                    psIndex += psCount * 3;
                    // colorIndex += colorCount * 3;
                    // uvIndex += uvCount * 2;
                }
                bufferGeometry = mergeBufferGeometries(geometries);
            }
            this._initOptions(options);
            this._createMesh(bufferGeometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            //Face corresponding to monomer
            // this._faceMap = faceMap;
            this._baseObjects = extrudeLines;
            this._datas = lineStrings;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(extrudeLines);
            if (!asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'Paths';
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const lineString = this._datas[index];
                    const opts = Object.assign({}, this.options, isGeoJSONLine(lineString) ? lineString.properties : lineString.getProperties(), { index });
                    this._baseObjects[index] = new Path(lineString, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const bufferGeometry = generateBufferGeometry(result);
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            this.getObject3d().geometry = bufferGeometry;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    var workerCode = `(function(t){"use strict";
/*!
   * poly-extrude v0.4.0
    */var n={exports:{}};function r(t,n,r){r=r||2;var e,a,o,h,u,v,f,x=n&&n.length,d=x?n[0]*r:t.length,y=i(t,0,d,r,!0),g=[];if(!y||y.next===y.prev)return g;if(x&&(y=function(t,n,r,e){var s,a,o,h=[];for(s=0,a=n.length;s<a;s++)(o=i(t,n[s]*e,s<a-1?n[s+1]*e:t.length,e,!1))===o.next&&(o.steiner=!0),h.push(p(o));for(h.sort(l),s=0;s<h.length;s++)r=c(h[s],r);return r}(t,n,y,r)),t.length>80*r){e=o=t[0],a=h=t[1];for(var m=r;m<d;m+=r)(u=t[m])<e&&(e=u),(v=t[m+1])<a&&(a=v),u>o&&(o=u),v>h&&(h=v);f=0!==(f=Math.max(o-e,h-a))?32767/f:0}return s(y,g,r,e,a,f,0),g}function i(t,n,r,i,e){var s,a;if(e===V(t,n,r,i)>0)for(s=n;s<r;s+=i)a=A(s,t[s],t[s+1],a);else for(s=r-i;s>=n;s-=i)a=A(s,t[s],t[s+1],a);return a&&g(a,a.next)&&(P(a),a=a.next),a}function e(t,n){if(!t)return t;n||(n=t);var r,i=t;do{if(r=!1,i.steiner||!g(i,i.next)&&0!==y(i.prev,i,i.next))i=i.next;else{if(P(i),(i=n=i.prev)===i.next)break;r=!0}}while(r||i!==n);return n}function s(t,n,r,i,l,c,v){if(t){!v&&c&&function(t,n,r,i){var e=t;do{0===e.z&&(e.z=f(e.x,e.y,n,r,i)),e.prevZ=e.prev,e.nextZ=e.next,e=e.next}while(e!==t);e.prevZ.nextZ=null,e.prevZ=null,function(t){var n,r,i,e,s,a,o,h,u=1;do{for(r=t,t=null,s=null,a=0;r;){for(a++,i=r,o=0,n=0;n<u&&(o++,i=i.nextZ);n++);for(h=u;o>0||h>0&&i;)0!==o&&(0===h||!i||r.z<=i.z)?(e=r,r=r.nextZ,o--):(e=i,i=i.nextZ,h--),s?s.nextZ=e:t=e,e.prevZ=s,s=e;r=i}s.nextZ=null,u*=2}while(a>1)}(e)}(t,i,l,c);for(var p,x,d=t;t.prev!==t.next;)if(p=t.prev,x=t.next,c?o(t,i,l,c):a(t))n.push(p.i/r|0),n.push(t.i/r|0),n.push(x.i/r|0),P(t),t=x.next,d=x.next;else if((t=x)===d){v?1===v?s(t=h(e(t),n,r),n,r,i,l,c,2):2===v&&u(t,n,r,i,l,c):s(e(t),n,r,i,l,c,1);break}}}function a(t){var n=t.prev,r=t,i=t.next;if(y(n,r,i)>=0)return!1;for(var e=n.x,s=r.x,a=i.x,o=n.y,h=r.y,u=i.y,l=e<s?e<a?e:a:s<a?s:a,c=o<h?o<u?o:u:h<u?h:u,v=e>s?e>a?e:a:s>a?s:a,f=o>h?o>u?o:u:h>u?h:u,p=i.next;p!==n;){if(p.x>=l&&p.x<=v&&p.y>=c&&p.y<=f&&x(e,o,s,h,a,u,p.x,p.y)&&y(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function o(t,n,r,i){var e=t.prev,s=t,a=t.next;if(y(e,s,a)>=0)return!1;for(var o=e.x,h=s.x,u=a.x,l=e.y,c=s.y,v=a.y,p=o<h?o<u?o:u:h<u?h:u,d=l<c?l<v?l:v:c<v?c:v,g=o>h?o>u?o:u:h>u?h:u,m=l>c?l>v?l:v:c>v?c:v,z=f(p,d,n,r,i),M=f(g,m,n,r,i),w=t.prevZ,b=t.nextZ;w&&w.z>=z&&b&&b.z<=M;){if(w.x>=p&&w.x<=g&&w.y>=d&&w.y<=m&&w!==e&&w!==a&&x(o,l,h,c,u,v,w.x,w.y)&&y(w.prev,w,w.next)>=0)return!1;if(w=w.prevZ,b.x>=p&&b.x<=g&&b.y>=d&&b.y<=m&&b!==e&&b!==a&&x(o,l,h,c,u,v,b.x,b.y)&&y(b.prev,b,b.next)>=0)return!1;b=b.nextZ}for(;w&&w.z>=z;){if(w.x>=p&&w.x<=g&&w.y>=d&&w.y<=m&&w!==e&&w!==a&&x(o,l,h,c,u,v,w.x,w.y)&&y(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;b&&b.z<=M;){if(b.x>=p&&b.x<=g&&b.y>=d&&b.y<=m&&b!==e&&b!==a&&x(o,l,h,c,u,v,b.x,b.y)&&y(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function h(t,n,r){var i=t;do{var s=i.prev,a=i.next.next;!g(s,a)&&m(s,i,i.next,a)&&w(s,a)&&w(a,s)&&(n.push(s.i/r|0),n.push(i.i/r|0),n.push(a.i/r|0),P(i),P(i.next),i=t=a),i=i.next}while(i!==t);return e(i)}function u(t,n,r,i,a,o){var h=t;do{for(var u=h.next.next;u!==h.prev;){if(h.i!==u.i&&d(h,u)){var l=b(h,u);return h=e(h,h.next),l=e(l,l.next),s(h,n,r,i,a,o,0),void s(l,n,r,i,a,o,0)}u=u.next}h=h.next}while(h!==t)}function l(t,n){return t.x-n.x}function c(t,n){var r=function(t,n){var r,i=n,e=t.x,s=t.y,a=-1/0;do{if(s<=i.y&&s>=i.next.y&&i.next.y!==i.y){var o=i.x+(s-i.y)*(i.next.x-i.x)/(i.next.y-i.y);if(o<=e&&o>a&&(a=o,r=i.x<i.next.x?i:i.next,o===e))return r}i=i.next}while(i!==n);if(!r)return null;var h,u=r,l=r.x,c=r.y,f=1/0;i=r;do{e>=i.x&&i.x>=l&&e!==i.x&&x(s<c?e:a,s,l,c,s<c?a:e,s,i.x,i.y)&&(h=Math.abs(s-i.y)/(e-i.x),w(i,t)&&(h<f||h===f&&(i.x>r.x||i.x===r.x&&v(r,i)))&&(r=i,f=h)),i=i.next}while(i!==u);return r}(t,n);if(!r)return n;var i=b(r,t);return e(i,i.next),e(r,r.next)}function v(t,n){return y(t.prev,t,n.prev)<0&&y(n.next,t,t.next)<0}function f(t,n,r,i,e){return(t=1431655765&((t=858993459&((t=252645135&((t=16711935&((t=(t-r)*e|0)|t<<8))|t<<4))|t<<2))|t<<1))|(n=1431655765&((n=858993459&((n=252645135&((n=16711935&((n=(n-i)*e|0)|n<<8))|n<<4))|n<<2))|n<<1))<<1}function p(t){var n=t,r=t;do{(n.x<r.x||n.x===r.x&&n.y<r.y)&&(r=n),n=n.next}while(n!==t);return r}function x(t,n,r,i,e,s,a,o){return(e-a)*(n-o)>=(t-a)*(s-o)&&(t-a)*(i-o)>=(r-a)*(n-o)&&(r-a)*(s-o)>=(e-a)*(i-o)}function d(t,n){return t.next.i!==n.i&&t.prev.i!==n.i&&!function(t,n){var r=t;do{if(r.i!==t.i&&r.next.i!==t.i&&r.i!==n.i&&r.next.i!==n.i&&m(r,r.next,t,n))return!0;r=r.next}while(r!==t);return!1}(t,n)&&(w(t,n)&&w(n,t)&&function(t,n){var r=t,i=!1,e=(t.x+n.x)/2,s=(t.y+n.y)/2;do{r.y>s!=r.next.y>s&&r.next.y!==r.y&&e<(r.next.x-r.x)*(s-r.y)/(r.next.y-r.y)+r.x&&(i=!i),r=r.next}while(r!==t);return i}(t,n)&&(y(t.prev,t,n.prev)||y(t,n.prev,n))||g(t,n)&&y(t.prev,t,t.next)>0&&y(n.prev,n,n.next)>0)}function y(t,n,r){return(n.y-t.y)*(r.x-n.x)-(n.x-t.x)*(r.y-n.y)}function g(t,n){return t.x===n.x&&t.y===n.y}function m(t,n,r,i){var e=M(y(t,n,r)),s=M(y(t,n,i)),a=M(y(r,i,t)),o=M(y(r,i,n));return e!==s&&a!==o||(!(0!==e||!z(t,r,n))||(!(0!==s||!z(t,i,n))||(!(0!==a||!z(r,t,i))||!(0!==o||!z(r,n,i)))))}function z(t,n,r){return n.x<=Math.max(t.x,r.x)&&n.x>=Math.min(t.x,r.x)&&n.y<=Math.max(t.y,r.y)&&n.y>=Math.min(t.y,r.y)}function M(t){return t>0?1:t<0?-1:0}function w(t,n){return y(t.prev,t,t.next)<0?y(t,n,t.next)>=0&&y(t,t.prev,n)>=0:y(t,n,t.prev)<0||y(t,t.next,n)<0}function b(t,n){var r=new S(t.i,t.x,t.y),i=new S(n.i,n.x,n.y),e=t.next,s=n.prev;return t.next=n,n.prev=t,r.next=e,e.prev=r,i.next=r,r.prev=i,s.next=i,i.prev=s,i}function A(t,n,r,i){var e=new S(t,n,r);return i?(e.next=i.next,e.prev=i,i.next.prev=e,i.next=e):(e.prev=e,e.next=e),e}function P(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function S(t,n,r){this.i=t,this.x=n,this.y=r,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function V(t,n,r,i){for(var e=0,s=n,a=r-i;s<r;s+=i)e+=(t[a]-t[s])*(t[s+1]+t[a+1]),a=s;return e}n.exports=r,n.exports.default=r,r.deviation=function(t,n,r,i){var e=n&&n.length,s=e?n[0]*r:t.length,a=Math.abs(V(t,0,s,r));if(e)for(var o=0,h=n.length;o<h;o++){var u=n[o]*r,l=o<h-1?n[o+1]*r:t.length;a-=Math.abs(V(t,u,l,r))}var c=0;for(o=0;o<i.length;o+=3){var v=i[o]*r,f=i[o+1]*r,p=i[o+2]*r;c+=Math.abs((t[v]-t[p])*(t[f+1]-t[v+1])-(t[v]-t[f])*(t[p+1]-t[v+1]))}return 0===a&&0===c?0:Math.abs((c-a)/a)},r.flatten=function(t){for(var n=t[0][0].length,r={vertices:[],holes:[],dimensions:n},i=0,e=0;e<t.length;e++){for(var s=0;s<t[e].length;s++)for(var a=0;a<n;a++)r.vertices.push(t[e][s][a]);e>0&&(i+=t[e-1].length,r.holes.push(i))}return r};var Z=n.exports;function F(t){for(var n,r,i=0,e=1,s=t.length;e<s;)n=r||t[0],i+=((r=t[e])[0]-n[0])*(r[1]+n[1]),e++;return i>0}function L(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t}function _(t,n){var r=n[0],i=n[1],e=n[2],s=Math.sqrt(r*r+i*i+e*e)||1;return t[0]=r/s,t[1]=i/s,t[2]=e/s,t}function I(t,n){function r(t,n,r,i){t[0]=n,t[1]=r,t[2]=i}for(var i,e,s,a,o,h,u,l,c,v=[],f=[],p=[],x=[],d=[],y=[],g=t.length,m=new Float32Array(n.length),z=0;z<g;){var M=3*t[z],w=3*t[z+1],b=3*t[z+2];r(v,n[M],n[M+1],n[M+2]),r(f,n[w],n[w+1],n[w+2]),r(p,n[b],n[b+1],n[b+2]),L(d,p,f),L(x,v,f),i=y,s=x,a=void 0,o=void 0,h=void 0,u=void 0,l=void 0,c=void 0,a=(e=d)[0],o=e[1],h=e[2],u=s[0],l=s[1],c=s[2],i[0]=o*c-h*l,i[1]=h*u-a*c,i[2]=a*l-o*u;for(var A=0;A<3;A++)m[M+A]+=y[A],m[w+A]+=y[A],m[b+A]+=y[A];z+=3}for(var P=0,S=m.length;P<S;)r(y,m[P],m[P+1],m[P+2]),_(y,y),m[P]=y[0]||0,m[P+1]=y[1]||0,m[P+2]=y[2]||0,P+=3;return m}function E(t){if(1===t.length)return{position:t[0].position,normal:t[0].normal,uv:t[0].uv,indices:t[0].indices,results:t};for(var n=0,r=0,i=0,e=t.length;i<e;i++){var s=t[i],a=s.position,o=s.indices;n+=a.length,r+=o.length}for(var h={position:new Float32Array(n),normal:new Float32Array(n),uv:new Float32Array(n/3*2),indices:new Uint32Array(r),results:t},u=0,l=0,c=0,v=0,f=0,p=t.length;f<p;f++){var x=t[f],d=x.position,y=x.indices,g=x.normal,m=x.uv;h.position.set(d,u),h.normal.set(g,u),h.uv.set(m,v);for(var z=0,M=y.length;z<M;){var w=y[z]+l;h.indices[c]=w,c++,z++}v+=m.length,u+=d.length,l+=d.length/3}return h}function O(t){return 180*t/Math.PI}function U(t){return t/180*Math.PI}function q(t,n,r,i,e,s){var a=3*r,o=3*i,h=3*e,u=3*s,l=n[a],c=n[a+1],v=n[a+2],f=n[o],p=n[o+1],x=n[o+2],d=n[h],y=n[h+1],g=n[h+2],m=n[u],z=n[u+1],M=n[u+2];Math.abs(c-p)<Math.abs(l-f)?(t.push(l,1-v),t.push(f,1-x),t.push(d,1-g),t.push(m,1-M)):(t.push(c,1-v),t.push(p,1-x),t.push(y,1-g),t.push(z,1-M))}function R(t,n){n=Object.assign({},{depth:2},n);var r=t.map((function(t){for(var r=0,i=t.length;r<i;r++){var e=t[r];j(e),0===r?F(e)||(t[r]=e.reverse()):F(e)&&(t[r]=e.reverse()),B(e)&&e.splice(e.length-1,1)}var s=function(t,n){for(var r=function(t){var n=0,r=0,i=t.length;for(;r<i;)n+=t[r].length,r++;return n}(t),i=t.length,e=[],s=new Float32Array(2*r),a=[],o=[],h=3*r,u=2*r,l=n.depth,c=0,v=0,f=0,p=0;p<i;p++){var x=t[p];p>0&&e.push(c/2);for(var d=0,y=x.length;d<y;){var g=x[d],m=g[0],z=g[1];s[c++]=m,s[c++]=z,a[v]=m,a[v+1]=z,a[v+2]=l,a[h+v]=m,a[h+v+1]=z,a[h+v+2]=0,o[f]=m,o[f+1]=z,o[u+f]=m,o[u+f+1]=z,v+=3,f+=2,d++}}return{flatVertices:s,holes:e,points:a,count:r,uvs:o}}(t,n);return s.polygon=t,function(t,n){for(var r=[],i=t.count,e=0,s=n.length;e<s;e+=3){var a=n[e],o=n[e+1],h=n[e+2];r[e]=a,r[e+1]=o,r[e+2]=h;var u=s+e,l=i+a,c=i+o,v=i+h;r[u]=l,r[u+1]=c,r[u+2]=v}t.index=r}(s,Z(s.flatVertices,s.holes,2)),function(t,n){for(var r=t.points,i=t.index,e=t.polygon,s=t.uvs,a=n.depth,o=0,h=e.length;o<h;o++)for(var u=e[o],l=0,c=u.length;l<c;){var v=u[l],f=u[l+1];l===c-1&&(f=u[0]);var p=r.length/3,x=v[0],d=v[1],y=f[0],g=f[1];r.push(x,d,a,y,g,a,x,d,0,y,g,0);var m=p+2,z=p+3,M=p,w=p+1;i.push(m,M,z,M,w,z),q(s,r,m,z,M,w),l++}}(s,n),s.position=new Float32Array(s.points),s.indices=new Uint32Array(s.index),s.uv=new Float32Array(s.uvs),s.normal=I(s.indices,s.position),s})),i=E(r);return i.polygons=t,i}function j(t){B(t)||t.push(t[0])}function B(t){var n=t.length,r=t[0],i=r[0],e=r[1],s=t[n-1],a=s[0],o=s[1];return i===a&&e===o}function C(t,n){n=Object.assign({},{depth:2,lineWidth:1},n);var r=t.map((function(t){var r=function(t,n){var r=n.lineWidth/2,i=[],e=[],s=[],a=t.length,o=0;for(;o<a;){var h=t[o],u=t[o+1],l=t[o];o===a-1&&(h=t[a-2],u=t[a-1]);var c=u[1]-h[1],v=u[0]-h[0],f=0,p=O(Math.atan(c/v));if(0===o||o===a-1)f=p,f-=90;else{var x=t[o-1];k.x=x[0]-h[0],k.y=x[1]-h[1],H.x=u[0]-h[0],H.y=u[1]-h[1],f=p-N(k,H)/2}var d=U(f),y=l,g=[Math.cos(d)+y[0],Math.sin(d)+y[1]],m=W(h,u,r),z=m[0],M=m[1],w=D(z[0],z[1],y,g),b=D(M[0],M[1],y,g);if(!w||!b){var A=i.length,P=i[A-2],S=i[A-1];if(!P||!S)continue;w=[P[0],P[1]],b=[S[0],S[1]]}w[2]=l[2]||0,b[2]=l[2]||0,i.push(w,b),T(w,h,u)?(e.push(w),s.push(b)):(e.push(b),s.push(w)),o++}return{offsetPoints:i,leftPoints:e,rightPoints:s}}(t,n);return r.line=t,function(t,n){var r=n.depth,i=[],e=[],s=[],a=t.leftPoints,o=t.rightPoints,h=0,u=a.length;for(;h<u;){var l=3*h,c=a[h],v=c[0],f=c[1],p=c[2];i[l]=v,i[l+1]=f,i[l+2]=r+p;var x=o[h],d=x[0],y=x[1],g=x[2],m=3*u+l;i[m]=d,i[m+1]=y,i[m+2]=r+g;var z=2*u*3+l;i[z]=v,i[z+1]=f,i[z+2]=p;var M=2*u*3+3*u+l;i[M]=d,i[M+1]=y,i[M+2]=g,h++}h=0,u=i.length;for(;h<u;){var w=i[h],b=i[h+1];s.push(w,b),h+=3}h=0,u=a.length;for(;h<u-1;){var A=h,P=h+1,S=A+u,V=P+u;e.push(A,S,P),e.push(S,V,P);var Z=h+2*u,F=Z+1,L=Z+u,_=F+u;e.push(Z,L,F),e.push(L,_,F),h++}t.index=e,t.points=i,t.uvs=s}(r,n),function(t,n){var r=t.points,i=t.index,e=t.leftPoints,s=t.rightPoints,a=t.uvs,o=n.depth,h=[e,s];function u(t,n){var e=r.length/3;r.push(t[0],t[1],o+t[2],n[0],n[1],o+n[2],t[0],t[1],t[2],n[0],n[1],n[2]);var s=e+2,h=e+3,u=e,l=e+1;i.push(s,u,h,u,l,h),q(a,r,s,h,u,l)}for(var l=0,c=h.length;l<c;l++){var v=h[l];l>0&&(v=(v=v.map((function(t){return t}))).reverse());for(var f=0,p=v.length-1;f<p;){u(v[f],v[f+1]),f++}}for(var x=e.length,d=[s[0],e[0],e[x-1],s[x-1]],y=0;y<d.length;y+=2){u(d[y],d[y+1])}}(r,n),r.position=new Float32Array(r.points),r.indices=new Uint32Array(r.index),r.uv=new Float32Array(r.uvs),r.normal=I(r.indices,r.position),r})),i=E(r);return i.lines=t,i}var k={x:0,y:0},H={x:0,y:0};var N=function(t,n){var r=t.x,i=t.y,e=n.x,s=n.y,a=r*e+i*s,o=r*s-i*e;return(Math.atan2(o,a)/Math.PI*180+360)%360};function T(t,n,r){var i=n[0],e=n[1],s=r[0],a=r[1];return(e-a)*t[0]+(s-i)*t[1]+i*a-s*e>0}function W(t,n,r){var i=n[1]-t[1],e=n[0]-t[0],s=Math.atan2(i,e),a=s+Math.PI/2,o=Math.cos(a)*r,h=Math.sin(a)*r,u=[t[0]+o,t[1]+h],l=[n[0]+o,n[1]+h],c=s-Math.PI/2;return o=Math.cos(c)*r,h=Math.sin(c)*r,[[u,l],[[t[0]+o,t[1]+h],[n[0]+o,n[1]+h]]]}function D(t,n,r,i){var e=n[0]-t[0],s=n[1]-t[1],a=i[0]-r[0],o=i[1]-r[1];if(0===e&&0===a)return null;if(0===s&&0===o)return null;var h,u,l=s/e,c=o/a,v=t[1]-l*t[0],f=r[1]-c*r[0];return 0===e?u=c*(h=t[0])+f:0===a?u=l*(h=r[0])+v:0===s?h=((u=t[1])-f)/c:0===o?h=((u=r[1])-v)/l:u=l*(h=(f-v)/(l-c))+v,[h,u]}function Q(t,n){void 0===n&&(n={}),n=Object.assign({},{radius:1,height:2,radialSegments:6},n);for(var r=Math.round(Math.max(4,n.radialSegments)),i=n,e=i.radius,s=i.height,a=360/r/360*Math.PI*2,o=r+1,h=new Float32Array(3*o*2),u=t[0],l=t[1],c=0,v=0,f=3*o,p=2*o,x=[],d=[],y=-1;y<r;y++){var g=a*y,m=Math.cos(g)*e+u,z=Math.sin(g)*e+l;h[c]=m,h[c+1]=z,h[c+2]=0,h[c+f]=m,h[c+1+f]=z,h[c+2+f]=s;var M,w;M=.5+m/e/2,w=.5+z/e/2,d[v]=M,d[v+1]=w,d[v+p]=M,d[v+1+p]=w,c+=3,v+=2,y>1&&x.push(0,y-1,y)}h[c-=3]=h[0],h[c+1]=h[1],h[c+2]=h[2];var b=h.length;h[b-3]=h[0],h[b-2]=h[1],h[b-1]=s;for(var A=x.length,P=0;P<A;P++){var S=x[P];x.push(S+o)}var V=new Float32Array(2*(3*o*2-6)),Z=-1;c=2*o,v=0;for(var F=0,L=h.length/2;F<L-3;F+=3){var _=h[F],E=h[F+1],O=h[F+3],U=h[F+4];V[++Z]=_,V[++Z]=E,V[++Z]=s,V[++Z]=O,V[++Z]=U,V[++Z]=s,V[++Z]=_,V[++Z]=E,V[++Z]=0,V[++Z]=O,V[++Z]=U,V[++Z]=0;var q=c+2,R=c+3,j=c,B=c+1;x.push(j,q,B,q,R,B),c+=4;var C=v/o,k=(v+1)/o;d.push(C,s/e/2,k,s/e/2,C,0,k,0),v++}var H=new Float32Array(h.length+V.length);H.set(h,0),H.set(V,h.length);var N=I(x,H);return{points:h,indices:new Uint32Array(x),position:H,normal:N,uv:new Float32Array(d)}}var X=function(){function t(t,n,r){void 0===t&&(t=0),void 0===n&&(n=0),void 0===r&&(r=0),this.x=t,this.y=n,this.z=r}var n=t.prototype;return n.set=function(t,n,r){return void 0===r&&(r=this.z),this.x=t,this.y=n,this.z=r,this},n.clone=function(){return new this.constructor(this.x,this.y,this.z)},n.copy=function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this},n.add=function(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this},n.addScalar=function(t){return this.x+=t,this.y+=t,this.z+=t,this},n.addVectors=function(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this},n.addScaledVector=function(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this},n.sub=function(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this},n.subScalar=function(t){return this.x-=t,this.y-=t,this.z-=t,this},n.subVectors=function(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this},n.multiply=function(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this},n.multiplyScalar=function(t){return this.x*=t,this.y*=t,this.z*=t,this},n.multiplyVectors=function(t,n){return this.x=t.x*n.x,this.y=t.y*n.y,this.z=t.z*n.z,this},n.applyMatrix4=function(t){var n=this.x,r=this.y,i=this.z,e=t.elements,s=1/(e[3]*n+e[7]*r+e[11]*i+e[15]);return this.x=(e[0]*n+e[4]*r+e[8]*i+e[12])*s,this.y=(e[1]*n+e[5]*r+e[9]*i+e[13])*s,this.z=(e[2]*n+e[6]*r+e[10]*i+e[14])*s,this},n.divide=function(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this},n.divideScalar=function(t){return this.multiplyScalar(1/t)},n.min=function(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this},n.max=function(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this},n.clamp=function(t,n){return this.x=Math.max(t.x,Math.min(n.x,this.x)),this.y=Math.max(t.y,Math.min(n.y,this.y)),this.z=Math.max(t.z,Math.min(n.z,this.z)),this},n.clampScalar=function(t,n){return this.x=Math.max(t,Math.min(n,this.x)),this.y=Math.max(t,Math.min(n,this.y)),this.z=Math.max(t,Math.min(n,this.z)),this},n.clampLength=function(t,n){var r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(t,Math.min(n,r)))},n.dot=function(t){return this.x*t.x+this.y*t.y+this.z*t.z},n.lengthSq=function(){return this.x*this.x+this.y*this.y+this.z*this.z},n.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},n.normalize=function(){return this.divideScalar(this.length()||1)},n.setLength=function(t){return this.normalize().multiplyScalar(t)},n.lerp=function(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this},n.lerpVectors=function(t,n,r){return this.x=t.x+(n.x-t.x)*r,this.y=t.y+(n.y-t.y)*r,this.z=t.z+(n.z-t.z)*r,this},n.cross=function(t){return this.crossVectors(this,t)},n.crossVectors=function(t,n){var r=t.x,i=t.y,e=t.z,s=n.x,a=n.y,o=n.z;return this.x=i*o-e*a,this.y=e*s-r*o,this.z=r*a-i*s,this},n.distanceTo=function(t){return Math.sqrt(this.distanceToSquared(t))},n.equals=function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z},n.fromArray=function(t,n){return void 0===n&&(n=0),this.x=t[n],this.y=t[n+1],this.z=t[n+2],this},n.random=function(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this},t}(),G=function(){function t(){this.pos=new X,this.dir=new X,this.right=new X,this.up=new X,this.dist=0,this.widthScale=1,this.sharp=!1}var n=t.prototype;return n.lerpPathPoints=function(t,n,r){this.pos.lerpVectors(t.pos,n.pos,r),this.dir.lerpVectors(t.dir,n.dir,r),this.up.lerpVectors(t.up,n.up,r),this.right.lerpVectors(t.right,n.right,r),this.dist=(n.dist-t.dist)*r+t.dist,this.widthScale=(n.widthScale-t.widthScale)*r+t.widthScale},n.copy=function(t){this.pos.copy(t.pos),this.dir.copy(t.dir),this.up.copy(t.up),this.right.copy(t.right),this.dist=t.dist,this.widthScale=t.widthScale},t}(),J=function(){function t(t,n,r,i,e,s,a,o,h,u,l,c,v,f,p,x){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],void 0!==t&&this.set(t,n,r,i,e,s,a,o,h,u,l,c,v,f,p,x)}var n=t.prototype;return n.set=function(t,n,r,i,e,s,a,o,h,u,l,c,v,f,p,x){var d=this.elements;return d[0]=t,d[4]=n,d[8]=r,d[12]=i,d[1]=e,d[5]=s,d[9]=a,d[13]=o,d[2]=h,d[6]=u,d[10]=l,d[14]=c,d[3]=v,d[7]=f,d[11]=p,d[15]=x,this},n.multiply=function(t){return this.multiplyMatrices(this,t)},n.makeRotationAxis=function(t,n){var r=Math.cos(n),i=Math.sin(n),e=1-r,s=t.x,a=t.y,o=t.z,h=e*s,u=e*a;return this.set(h*s+r,h*a-i*o,h*o+i*a,0,h*a+i*o,u*a+r,u*o-i*s,0,h*o-i*a,u*o+i*s,e*o*o+r,0,0,0,0,1),this},n.equals=function(t){for(var n=this.elements,r=t.elements,i=0;i<16;i++)if(n[i]!==r[i])return!1;return!0},t}();function K(t,n){return K=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,n){return t.__proto__=n,t},K(t,n)}function Y(t,n,r,i){return function(t,n){var r=1-t;return r*r*n}(t,n)+function(t,n){return 2*(1-t)*t*n}(t,r)+function(t,n){return t*t*n}(t,i)}var $=function(t){var n,r;function i(n,r,i){var e;return void 0===n&&(n=new X),void 0===r&&(r=new X),void 0===i&&(i=new X),(e=t.call(this)||this).isQuadraticBezierCurve3=!0,e.type="QuadraticBezierCurve3",e.v0=n,e.v1=r,e.v2=i,e}return r=t,(n=i).prototype=Object.create(r.prototype),n.prototype.constructor=n,K(n,r),i.prototype.getPoint=function(t,n){void 0===n&&(n=new X);var r=n,i=this.v0,e=this.v1,s=this.v2;return r.set(Y(t,i.x,e.x,s.x),Y(t,i.y,e.y,s.y),Y(t,i.z,e.z,s.z)),r},i}(function(){function t(){this.type="Curve",this.arcLengthDivisions=200}var n=t.prototype;return n.getPoint=function(){return console.warn("THREE.Curve: .getPoint() not implemented."),null},n.getPointAt=function(t,n){var r=this.getUtoTmapping(t);return this.getPoint(r,n)},n.getPoints=function(t){void 0===t&&(t=5);for(var n=[],r=0;r<=t;r++)n.push(this.getPoint(r/t));return n},n.getLength=function(){var t=this.getLengths();return t[t.length-1]},n.getLengths=function(t){if(void 0===t&&(t=this.arcLengthDivisions),this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;var n,r=[],i=this.getPoint(0),e=0;r.push(0);for(var s=1;s<=t;s++)e+=(n=this.getPoint(s/t)).distanceTo(i),r.push(e),i=n;return this.cacheArcLengths=r,r},n.getUtoTmapping=function(t,n){var r,i=this.getLengths(),e=0,s=i.length;r=n||t*i[s-1];for(var a,o=0,h=s-1;o<=h;)if((a=i[e=Math.floor(o+(h-o)/2)]-r)<0)o=e+1;else{if(!(a>0)){h=e;break}h=e-1}if(i[e=h]===r)return e/(s-1);var u=i[e];return(e+(r-u)/(i[e+1]-u))/(s-1)},t}()),tt=new X,nt=new X,rt=new X,it=new J,et=new $;var st=function(){function t(){this.array=[],this.count=0}var n=t.prototype;return n.set=function(t,n,r,i,e){if(void 0===n&&(n=.1),void 0===r&&(r=10),void 0===i&&(i=null),void 0===e&&(e=!1),(t=t.slice(0)).length<2)return console.warn("PathPointList: points length less than 2."),void(this.count=0);e&&!t[0].equals(t[t.length-1])&&t.push((new X).copy(t[0]));for(var s=0,a=t.length;s<a;s++)if(0===s)this._start(t[s],t[s+1],i);else if(s===a-1)if(e){this._corner(t[s],t[1],n,r,i);var o=this.array[0].dist;this.array[0].copy(this.array[this.count-1]),this.array[0].dist=o}else this._end(t[s]);else this._corner(t[s],t[s+1],n,r,i)},n.distance=function(){return this.count>0?this.array[this.count-1].dist:0},n._getByIndex=function(t){return this.array[t]||(this.array[t]=new G),this.array[t]},n._start=function(t,n,r){this.count=0;var i=this._getByIndex(this.count);if(i.pos.copy(t),i.dir.subVectors(n,t),r)i.up.copy(r);else{var e=Number.MAX_VALUE,s=Math.abs(i.dir.x),a=Math.abs(i.dir.y),o=Math.abs(i.dir.z);s<e&&(e=s,i.up.set(1,0,0)),a<e&&(e=a,i.up.set(0,1,0)),o<e&&i.up.set(0,0,1)}i.right.crossVectors(i.dir,i.up).normalize(),i.up.crossVectors(i.right,i.dir).normalize(),i.dist=0,i.widthScale=1,i.sharp=!1,i.dir.normalize(),this.count++},n._end=function(t){var n=this.array[this.count-1],r=this._getByIndex(this.count);r.pos.copy(t),r.dir.subVectors(t,n.pos);var i=r.dir.length();r.dir.normalize(),r.up.copy(n.up);var e=tt.crossVectors(n.dir,r.dir);if(e.length()>Number.EPSILON){e.normalize();var s=Math.acos(Math.min(Math.max(n.dir.dot(r.dir),-1),1));r.up.applyMatrix4(it.makeRotationAxis(e,s))}r.right.crossVectors(r.dir,r.up).normalize(),r.dist=n.dist+i,r.widthScale=1,r.sharp=!1,this.count++},n._corner=function(t,n,r,i,e){if(r>0&&i>0){for(var s=function(t,n,r,i,e,s){var a=tt.subVectors(n,t),o=nt.subVectors(r,n),h=a.length(),u=o.length();a.normalize(),o.normalize();var l=Math.min(.999999*(e?h/2:h),i);s.v0.copy(n).sub(a.multiplyScalar(l)),s.v1.copy(n);var c=Math.min(u/2*.999999,i);return s.v2.copy(n).add(o.multiplyScalar(c)),s}(this.array[this.count-1].pos,t,n,r,this.count-1==0,et),a=s.getPoints(i),o=0;o<i;o++)this._sharpCorner(a[o],a[o+1],e,0===o?1:0);a[i].equals(n)||this._sharpCorner(a[i],n,e,2)}else this._sharpCorner(t,n,e,0,!0)},n._sharpCorner=function(t,n,r,i,e){void 0===i&&(i=0),void 0===e&&(e=!1);var s=this.array[this.count-1],a=this._getByIndex(this.count),o=tt.subVectors(t,s.pos),h=nt.subVectors(n,t),u=o.length();if(o.normalize(),h.normalize(),a.pos.copy(t),1===i?a.dir.copy(o):2===i?a.dir.copy(h):(a.dir.addVectors(o,h),a.dir.normalize()),r)1===a.dir.dot(r)?a.right.crossVectors(h,r).normalize():a.right.crossVectors(a.dir,r).normalize(),a.up.crossVectors(a.right,a.dir).normalize();else{a.up.copy(s.up);var l=rt.crossVectors(s.dir,a.dir);if(l.length()>Number.EPSILON){l.normalize();var c=Math.acos(Math.min(Math.max(s.dir.dot(a.dir),-1),1));a.up.applyMatrix4(it.makeRotationAxis(l,c))}a.right.crossVectors(a.dir,a.up).normalize()}a.dist=s.dist+u;var v=o.dot(h);a.widthScale=Math.min(1/Math.sqrt((1+v)/2),1.415)||1,a.sharp=Math.abs(v-1)>.05&&e,this.count++},t}(),at=new X(0,0,1);function ot(t,n){n=Object.assign({},{lineWidth:1,cornerRadius:0,cornerSplit:10},n);var r=t.map((function(t){var r=t.map((function(t){var n=t[0],r=t[1],i=t[2];return new X(n,r,i||0)})),i=new st;i.set(r,n.cornerRadius,n.cornerSplit,at);var e=function(t,n){var r=n.lineWidth||.1,i=1,e=r/2,s=r,a=t.distance(),o=i*a;if(0===a)return null;var h,u=e/s,l=0,c=[],v=[],f=[],p=[],x=0,d=new X,y=new X,g=new X,m=new X,z=new X,M=new X;function w(t){var n=0===c.length,r=t.sharp&&!n,i=t.dist/s,a=t.dir,o=t.up,h=t.right;if(d.copy(h).multiplyScalar(e*t.widthScale),y.copy(h).multiplyScalar(-e*t.widthScale),d.add(t.pos),y.add(t.pos),r){g.fromArray(c,c.length-6).sub(y),m.fromArray(c,c.length-3).sub(d);var w,b,A=g.length()-m.length();A>0?(w=g,b=y):(w=m,b=d),z.copy(w).setLength(Math.abs(A)).add(b);var P=M.copy(b).sub(z).normalize().dot(a)*M.copy(b).sub(z).length()*2;M.copy(a).setLength(P).add(z),A>0?(c.push(z.x,z.y,z.z,d.x,d.y,d.z,y.x,y.y,y.z,d.x,d.y,d.z,M.x,M.y,M.z,d.x,d.y,d.z),x+=6,p.push(x-6,x-8,x-7,x-6,x-7,x-5,x-4,x-6,x-5,x-2,x-4,x-1),l+=12):(c.push(y.x,y.y,y.z,z.x,z.y,z.z,y.x,y.y,y.z,d.x,d.y,d.z,y.x,y.y,y.z,M.x,M.y,M.z),x+=6,p.push(x-6,x-8,x-7,x-6,x-7,x-5,x-6,x-5,x-3,x-2,x-3,x-1),l+=12),v.push(o.x,o.y,o.z,o.x,o.y,o.z,o.x,o.y,o.z,o.x,o.y,o.z,o.x,o.y,o.z,o.x,o.y,o.z),f.push(i-u,0,i-u,1,i,0,i,1,i+u,0,i+u,1)}else c.push(y.x,y.y,y.z,d.x,d.y,d.z),v.push(o.x,o.y,o.z,o.x,o.y,o.z),f.push(i,0,i,1),x+=2,n||(p.push(x-2,x-4,x-3,x-2,x-3,x-1),l+=6)}if(o>0)for(var b=0;b<t.count;b++){var A=t.array[b];if(A.dist>o){var P=t.array[b-1];h=new G;var S=(o-P.dist)/(A.dist-P.dist);h.lerpPathPoints(P,A,S),w(h);break}w(A)}else h=t.array[0];return{points:c,normal:v,uvs:f,index:p,count:l}}(i,n);return e.line=t,e.position=new Float32Array(e.points),e.indices=new Uint32Array(e.index),e.uv=new Float32Array(e.uvs),e.normal=new Float32Array(e.normal),e})),i=E(r);return i.lines=t,i}var ht={x:0,y:0},ut={x:0,y:0};function lt(t,n,r,i){for(var e=t.length,s=0;s<e;s++){var a=t[s].data;n=t[s].center||n;for(var o=0,h=a.length;o<h;o++)for(var u=a[o],l=0,c=u.length;l<c;l++)t[s].data[o][l]=ct(u[l],n,r,i)}}function ct(t,n,r,i,e){for(var s,a=[],o=e?3:2,h=0,u=(s=r?new Float64Array(t):new Float32Array(t)).length;h<u;h+=o){var l=s[h],c=s[h+1],v=s[h+2];if(n&&r&&i){ht.x=l,ht.y=c;var f=wt(ht,ut);ht.x=f.x,ht.y=f.y,l=(f=bt(i,ht,r,ut)).x,c=f.y,l-=n[0],c-=n[1]}e?a.push([l,c,v]):a.push([l,c])}return a}function vt(t,n){void 0===n&&(n=1);for(var r=t.length,i=[],e=[],s=0,a=0;a<r;a++){var o=void 0;1===n?o=ft(t[a]):2===n?o=pt(t[a]):3===n&&(o=xt(t[a]));var h=t[a].bottomHeight||0,u=o.position;e.push(o);var l=u.length/3;i[a]={position:{middleZ:h+(t[a].height||0)/2,count:l,start:s,end:s+3*l},hide:!1},s+=3*l}var c=yt(e),v=c.position,f=c.normal,p=c.uv,x=c.indices;return{position:v.buffer,normal:f.buffer,uv:p.buffer,indices:x.buffer,geometriesAttributes:i}}function ft(t){var n=t.data,r=t.height,i=t.bottomHeight,e=R(n,{depth:r}),s=e.position,a=e.normal,o=e.uv,h=e.indices;return gt(s,i),{position:s,normal:a,uv:o,indices:h}}function pt(t){var n=t.data,r=t.height,i=t.width,e=t.bottomHeight,s=C(n,{lineWidth:i,depth:r}),a=s.position,o=s.normal,h=s.uv,u=s.indices;return gt(a,e),{position:a,normal:o,uv:h,indices:u}}function xt(t){var n=t.data,r=t.cornerRadius,i=t.width,e=t.bottomHeight,s=ot(n,{lineWidth:i,cornerRadius:r}),a=s.position,o=s.normal,h=s.uv,u=s.indices;return gt(a,e),{position:a,normal:o,uv:h,indices:u}}function dt(t,n){for(var r=new Float32Array(n),i=0,e=0;e<t.length;++e)r.set(t[e],i),i+=t[e].length;return r}function yt(t){for(var n={},r={},i=0;i<t.length;++i){var e=t[i];for(var s in e)void 0===n[s]&&(n[s]=[],r[s]=0),n[s].push(e[s]),r[s]+=e[s].length}var a={},o=0,h=[];for(var u in n)if("indices"===u)for(var l=n[u],c=0,v=l.length;c<v;c++){for(var f=l[c],p=0,x=f.length;p<x;p++)h.push(f[p]+o);o+=n.position[c].length/3}else{var d=dt(n[u],r[u]);if(!d)return null;a[u]=d}return a.indices=new Uint32Array(h),a}function gt(t,n){if(void 0!==n&&"number"==typeof n&&0!==n)for(var r=0,i=t.length;r<i;r+=3)t[r+2]+=n}function mt(t){for(var n=[],r=0,i=t.length;r<i;r+=7){var e=t[r],s=t[r+1],a=t[r+2],o=t[r+3],h=t[r+4],u=t[r+5];n.push({radialSegments:a,radius:o,height:h,altitude:u,center:[e,s]})}for(var l=n.length,c=[],v=[],f=0,p=0;p<l;p++){var x=Q(n[p].center||[0,0],n[p]),d=x.position;if(n[p].altitude)for(var y=n[p].altitude,g=0,m=d.length;g<m;g+=3)x[g+2]+=y;v.push(x);var z=d.length/3;c[p]={position:{middleZ:n[p].height/2,count:z,start:f,end:f+3*z},hide:!1},f+=3*z}var M=yt(v),w=M.position,b=M.normal,A=M.uv,P=M.indices;return{position:w.buffer,normal:b.buffer,uv:A.buffer,indices:P.buffer,geometriesAttributes:c}}var zt=Math.PI/180,Mt=6378137*Math.PI/180;function wt(t,n){var r,i=85.0511287798,e=t.x,s=Math.max(Math.min(i,t.y),-i);r=0===s?0:Math.log(Math.tan((90+s)*zt/2))/zt;var a=e*Mt,o=r*Mt;return n?(n.x=a,n.y=o,n):{x:a,y:o}}function bt(t,n,r,i){var e=t[0]*(n.x-t[2])/r,s=-t[1]*(n.y-t[3])/r;return i?(i.x=e,i.y=s,i):{x:e,y:s}}function At(t){void 0===t&&(t=[]);for(var n=t.length,r=new Float32Array(3*n),i=0;i<n;i++){var e=t[i],s=3*i;r[s]=e[0],r[s+1]=e[1],r[s+2]=e[2]||0}return r}function Pt(t){for(var n=new Float32Array(2*t.length-6),r=0,i=0,e=t.length/3;i<e;i++){var s=t[3*i],a=t[3*i+1],o=t[3*i+2];if(i>0&&i<e-1){var h=3*r;n[h]=s,n[h+1]=a,n[h+2]=o,r++}var u=3*r;n[u]=s,n[u+1]=a,n[u+2]=o,r++}return n}function St(t){var n=0,r=t.length;if(1===r)return t[0];for(var i=0;i<r;i++)n+=t[i].length;for(var e=new Float32Array(n),s=0,a=0;a<r;a++)e.set(t[a],s),s+=t[a].length;return e}t.initialize=function(){},t.onmessage=function(t,n){var r=t.data,i=r.type,e=r.datas,s=r.glRes,a=r.matrix,o=r.center;if("ExtrudePolygons"===i){lt(e,o,s,a);var h=vt(e);n(null,h,[h.position,h.normal,h.uv,h.indices])}else if("ExtrudeLines"===i||"Paths"===i){for(var u=0,l=e.length;u<l;u++)for(var c=0,v=e[u].data.length;c<v;c++)e[u].data[c]=ct(e[u].data[c],e[u].center||o,s,a,!0);var f=vt(e,"ExtrudeLines"===i?2:3);n(null,f,[f.position,f.normal,f.uv,f.indices])}else if("ExtrudePolygon"===i){var p=[],x=[];e.forEach((function(t){var n=[t];lt(n,o,s,a);var r=vt(n),i=r.position,e=r.normal,h=r.uv,u=r.indices;p.push({id:t.id,position:i,normal:e,uv:h,indices:u}),x.push(i,e,h,u)})),n(null,p,x)}else if("Line"===i||"FatLine"===i){for(var d=[],y=[],g=0,m=e.length;g<m;g++){for(var z=[],M=0,w=e[g].data.length;M<w;M++){e[g].data[M]=ct(e[g].data[M],e[g].center||o,s,a,!0);var b=At(e[g].data[M]);z.push(Pt(b))}var A=St(z);gt(A,e[g].bottomHeight),d.push({id:e[g].id,position:A.buffer}),y.push(A.buffer)}n(null,d,y)}else if("Lines"===i||"FatLines"===i){for(var P=0,S=[],V=[],Z=0,F=[],L=0,_=e.length;L<_;L++){for(var I=0,E=0,O=e[L].data.length;E<O;E++){e[L].data[E]=ct(e[L].data[E],e[L].center||o,s,a,!0);var U=At(e[L].data[E]);gt(U,e[L].bottomHeight),I+=U.length/3*2-2,F.push(Pt(U))}var q=I;S[L]=[P,P+q],P+=q,V[L]={position:{count:I,start:Z,end:Z+3*I},hide:!1},"FatLines"===i&&(V[L].instanceStart={count:I,start:Z,end:Z+3*I},V[L].instanceEnd={count:I,start:Z,end:Z+3*I}),Z+=3*I}var R=St(F);n(null,{id:e.id,position:R.buffer,geometriesAttributes:V,faceMap:S},[R.buffer])}else if("ExtrudeLine"===i||"Path"===i){for(var j=0,B=e.length;j<B;j++)for(var C=0,k=e[j].data.length;C<k;C++)e[j].data[C]=ct(e[j].data[C],e[j].center||o,s,a,!0);var H=[],N=[];e.forEach((function(t){var n=vt([t],"ExtrudeLine"===i?2:3),r=n.position,e=n.normal,s=n.uv,a=n.indices;H.push({id:t.id,position:r,normal:e,uv:s,indices:a}),N.push(r,e,s,a)})),n(null,H,N)}else if("Bar"===i){for(var T=[],W=[],D=(e=new Float32Array(e)).length/7,Q=0;Q<D;){var X=e.slice(7*Q,7*(Q+1)),G=mt(X),J=G.position,K=G.normal,Y=G.uv,$=G.indices;T.push({id:parseInt(X[6]),position:J,normal:K,uv:Y,indices:$}),W.push(J,K,Y,$),Q++}n(null,T,W)}else if("Bars"===i){var tt=mt(e=new Float32Array(e));n(null,tt,[tt.position,tt.normal,tt.uv,tt.indices])}else console.error("No processing logic found for type:"+i)},Object.defineProperty(t,"__esModule",{value:!0})})`;

    const options = {
        'renderer': 'gl',
        'doubleBuffer': false,
        'glOptions': null,
        'geometryEvents': true,
        'identifyCountOnEvent': 0,
        'forceRenderOnZooming': true,
        'loopRenderCount': 50
    };
    const RADIAN = Math.PI / 180;
    const LINEPRECISIONS = [
        [4000, 220],
        [2000, 100],
        [1000, 30],
        [500, 15],
        [100, 5],
        [50, 2],
        [10, 1],
        [5, 0.7],
        [2, 0.1],
        [1, 0.05],
        [0.5, 0.02],
        [0.4, 0.01],
        [0.1, 0.005],
        [0.05, 0.002],
        [0.01, 0.001]
    ];
    const EVENTS = [
        'mouseout',
        'mousemove',
        'click',
        'mousedown',
        'mouseup',
        'dblclick',
        'contextmenu',
        'touchstart',
        'touchmove',
        'touchend'
    ];
    const TEMP_COORD = new maptalks__namespace.Coordinate(0, 0);
    const TEMP_POINT = new maptalks__namespace.Point(0, 0);
    const TEMP_VECTOR3 = new THREE__namespace.Vector3();
    const heightCache = new Map();
    const KEY_FBO = '__webglFramebuffer';
    const TEMP_V4 = new THREE__namespace.Vector4();
    // const MATRIX4 = new THREE.Matrix4();
    /**
     * A Layer to render with THREE.JS (http://threejs.org), the most popular library for WebGL. <br>
     *
     * @classdesc
     * A layer to render with THREE.JS
     * @example
     *  var layer = new maptalks.ThreeLayer('three');
     *
     *  layer.prepareToDraw = function (gl, scene, camera) {
     *      var size = map.getSize();
     *      return [size.width, size.height]
     *  };
     *
     *  layer.draw = function (gl, view, scene, camera, width,height) {
     *      //...
     *  };
     *  layer.addTo(map);
     * @class
     * @category layer
     * @extends {maptalks.CanvasLayer}
     * @param {String|Number} id - layer's id
     * @param {Object} options - options defined in [options]{@link maptalks.ThreeLayer#options}
     */
    class ThreeLayer extends maptalks__namespace.CanvasLayer {
        constructor(id, options) {
            super(id, options);
            this._animationBaseObjectMap = {};
            this._needsUpdate = true;
            this._mousemoveTimeOut = 0;
            this._mousedownTime = 0;
            this._baseObjects = [];
            this._delayMeshes = [];
            this._meshes = [];
            this.type = 'ThreeLayer';
        }
        isMercator() {
            const map = this.getMap();
            if (!map) {
                return false;
            }
            const sp = map.getSpatialReference();
            const prj = sp._projection, res = sp._resolutions;
            if (prj && prj.code === 'EPSG:3857' && res && res.length && Math.floor(res[0]) === 156543 && map.getGLRes) {
                return true;
            }
            return false;
        }
        isRendering() {
            const map = this.getMap();
            if (!map) {
                return false;
            }
            return map.isInteracting() || map.isAnimating();
        }
        prepareToDraw(...args) {
        }
        /**
         * Draw method of ThreeLayer
         * In default, it calls renderScene, refresh the camera and the scene
         */
        draw(gl, view, scene, camera, timeStamp, context) {
            this.renderScene(context, this);
        }
        /**
         * Draw method of ThreeLayer when map is interacting
         * In default, it calls renderScene, refresh the camera and the scene
         */
        drawOnInteracting(gl, view, scene, camera, event, timeStamp, context) {
            this.renderScene(context, this);
        }
        /**
         * transform height to glpoint
         * @param enableHeight
         * @param height
         * @returns
         */
        _transformHeight(enableHeight, height) {
            if (!enableHeight) {
                return 0;
            }
            height = height || 0;
            if (height === 0) {
                return 0;
            }
            const v = this.altitudeToVector3(height, height, null, TEMP_VECTOR3);
            return v.x;
        }
        /**
         * Convert a geographic coordinate to THREE Vector3
         * @param  {maptalks.Coordinate} coordinate - coordinate
         * @param {Number} [z=0] z value
         * @return {THREE.Vector3}
         */
        coordinateToVector3(coordinate, z = 0, out) {
            const map = this.getMap();
            if (!map) {
                return null;
            }
            const isArray = Array.isArray(coordinate);
            if (isArray) {
                TEMP_COORD.x = coordinate[0];
                TEMP_COORD.y = coordinate[1];
            }
            else if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                coordinate = new maptalks__namespace.Coordinate(coordinate);
            }
            const res = getGLRes(map);
            const p = coordinateToPoint(map, isArray ? TEMP_COORD : coordinate, res, TEMP_POINT);
            if (out) {
                out.x = p.x;
                out.y = p.y;
                out.z = z;
            }
            return new THREE__namespace.Vector3(p.x, p.y, z);
        }
        coordinatiesToGLFloatArray(coordinaties, centerPt, hasHeight) {
            const map = this.getMap();
            if (!map) {
                return null;
            }
            const res = getGLRes(map);
            const len = coordinaties.length;
            const array = new Float32Array(len * 2);
            const array3d = new Float32Array(len * 3);
            heightCache.clear();
            for (let i = 0; i < len; i++) {
                let coordinate = coordinaties[i];
                const isArray = Array.isArray(coordinate);
                if (isArray) {
                    TEMP_COORD.x = coordinate[0];
                    TEMP_COORD.y = coordinate[1];
                }
                else if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                    coordinate = new maptalks__namespace.Coordinate(coordinate);
                }
                const p = coordinateToPoint(map, isArray ? TEMP_COORD : coordinate, res, TEMP_POINT);
                p.x -= centerPt.x;
                p.y -= centerPt.y;
                const idx = i * 2;
                array[idx] = p.x;
                array[idx + 1] = p.y;
                const coord = coordinate;
                let height = coord.z || coord[2] || 0;
                if (hasHeight && !heightCache.has(height)) {
                    const z = this._transformHeight(hasHeight, height);
                    heightCache.set(height, z);
                }
                let z = 0;
                if (hasHeight) {
                    z = heightCache.get(height) || 0;
                }
                const idx1 = i * 3;
                array3d[idx1] = p.x;
                array3d[idx1 + 1] = p.y;
                array3d[idx1 + 2] = z;
            }
            return {
                positions: array3d,
                positons2d: array
            };
        }
        coordinatiesToGLArray(coordinaties, centerPt) {
            const map = this.getMap();
            if (!map) {
                return null;
            }
            const res = getGLRes(map);
            const len = coordinaties.length;
            const array = new Array(len);
            for (let i = 0; i < len; i++) {
                let coordinate = coordinaties[i];
                const isArray = Array.isArray(coordinate);
                if (isArray) {
                    TEMP_COORD.x = coordinate[0];
                    TEMP_COORD.y = coordinate[1];
                }
                else if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                    coordinate = new maptalks__namespace.Coordinate(coordinate);
                }
                const p = coordinateToPoint(map, isArray ? TEMP_COORD : coordinate, res, TEMP_POINT);
                p.x -= centerPt.x;
                p.y -= centerPt.y;
                array[i] = [p.x, p.y];
            }
            return array;
        }
        /**
         * Convert geographic distance to THREE Vector3
         * @param  {Number} w - width
         * @param  {Number} h - height
         * @return {THREE.Vector3}
         */
        distanceToVector3(w, h, coord) {
            if ((w === 0 && h === 0) || (!maptalks__namespace.Util.isNumber(w) || !maptalks__namespace.Util.isNumber(h))) {
                return new THREE__namespace.Vector3(0, 0, 0);
            }
            const map = this.getMap();
            const res = getGLRes(map);
            let center = coord || map.getCenter();
            if (!(center instanceof maptalks__namespace.Coordinate)) {
                center = new maptalks__namespace.Coordinate(center);
            }
            const target = map.locate(center, w, h);
            const p0 = coordinateToPoint(map, center, res), p1 = coordinateToPoint(map, target, res);
            const x = Math.abs(p1.x - p0.x) * maptalks__namespace.Util.sign(w);
            const y = Math.abs(p1.y - p0.y) * maptalks__namespace.Util.sign(h);
            return new THREE__namespace.Vector3(x, y, 0);
        }
        altitudeToVector3(altitude, altitude1, coord, out) {
            if ((altitude === 0) || (!maptalks__namespace.Util.isNumber(altitude))) {
                return new THREE__namespace.Vector3(0, 0, 0);
            }
            const map = this.getMap();
            if (map.altitudeToPoint) {
                const res = getGLRes(map);
                let z = map.altitudeToPoint(altitude, res);
                if (altitude < 0 && z > 0) {
                    z = -z;
                }
                if (out) {
                    out.x = z;
                    out.y = z;
                    out.z = 0;
                    return out;
                }
                return new THREE__namespace.Vector3(z, z, 0);
            }
            return this.distanceToVector3(altitude, altitude, coord);
        }
        /**
         * Convert a Polygon or a MultiPolygon to THREE shape
         * @param  {maptalks.Polygon|maptalks.MultiPolygon} polygon - polygon or multipolygon
         * @return {THREE.Shape}
         */
        toShape(polygon) {
            if (!polygon) {
                return null;
            }
            if (polygon instanceof maptalks__namespace.MultiPolygon) {
                return polygon.getGeometries().map(c => this.toShape(c));
            }
            const center = polygon.getCenter();
            const centerPt = this.coordinateToVector3(center);
            const shell = polygon.getShell();
            const outer = shell.map(c => {
                const vector = this.coordinateToVector3(c).sub(centerPt);
                return new THREE__namespace.Vector2(vector.x, vector.y);
            });
            const shape = new THREE__namespace.Shape(outer);
            const holes = polygon.getHoles();
            if (holes && holes.length > 0) {
                shape.holes = holes.map(item => {
                    const pts = item.map(c => {
                        const vector = this.coordinateToVector3(c).sub(centerPt);
                        return new THREE__namespace.Vector2(vector.x, vector.y);
                    });
                    return new THREE__namespace.Shape(pts);
                });
            }
            return shape;
        }
        /**
         * todo   This should also be extracted as a component
         * @param {*} polygon
         * @param {*} altitude
         * @param {*} material
         * @param {*} height
         */
        toExtrudeMesh(polygon, altitude, material, height) {
            if (!polygon) {
                return null;
            }
            if (polygon instanceof maptalks__namespace.MultiPolygon) {
                return polygon.getGeometries().map(c => this.toExtrudeMesh(c, altitude, material, height));
            }
            const rings = polygon.getCoordinates();
            rings.forEach(ring => {
                const length = ring.length;
                for (let i = length - 1; i >= 1; i--) {
                    if (ring[i].equals(ring[i - 1])) {
                        ring.splice(i, 1);
                    }
                }
            });
            polygon.setCoordinates(rings);
            const shape = this.toShape(polygon);
            const center = this.coordinateToVector3(polygon.getCenter());
            height = maptalks__namespace.Util.isNumber(height) ? height : altitude;
            height = this.altitudeToVector3(height, height).x;
            const amount = this.altitudeToVector3(altitude, altitude).x;
            //{ amount: extrudeH, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
            const config = { 'bevelEnabled': false, 'bevelSize': 1 };
            const name = parseInt(THREE__namespace.REVISION) >= 93 ? 'depth' : 'amount';
            config[name] = height;
            const geom = new THREE__namespace.ExtrudeGeometry(shape, config);
            let buffGeom = geom;
            if (THREE__namespace.BufferGeometry.prototype.fromGeometry) {
                buffGeom = new THREE__namespace.BufferGeometry();
                buffGeom.fromGeometry(geom);
            }
            const mesh = new THREE__namespace.Mesh(buffGeom, material);
            mesh.position.set(center.x, center.y, amount - height);
            return mesh;
        }
        /**
         *
         * @param {maptalks.Polygon|maptalks.MultiPolygon} polygon
         * @param {Object} options
         * @param {THREE.Material} material
         */
        toExtrudePolygon(polygon, options, material) {
            return new ExtrudePolygon(polygon, options, material, this);
        }
        /**
         *
         * @param {maptalks.Coordinate} coordinate
         * @param {Object} options
         * @param {THREE.Material} material
         */
        toBar(coordinate, options, material) {
            return new Bar(coordinate, options, material, this);
        }
        /**
        *
        * @param {maptalks.LineString} lineString
        * @param {Object} options
        * @param {THREE.LineMaterial} material
        */
        toLine(lineString, options, material) {
            return new Line(lineString, options, material, this);
        }
        /**
         *
         * @param {maptalks.LineString} lineString
         * @param {Object} options
         * @param {THREE.Material} material
         */
        toExtrudeLine(lineString, options, material) {
            return new ExtrudeLine(lineString, options, material, this);
        }
        /**
         *
         * @param {THREE.Mesh|THREE.Group} model
         * @param {Object} options
         */
        toModel(model, options) {
            return new Model(model, options, this);
        }
        /**
         *
         * @param {maptalks.LineString} lineString
         * @param {*} options
         * @param {THREE.Material} material
         */
        toExtrudeLineTrail(lineString, options, material) {
            return new ExtrudeLineTrail(lineString, options, material, this);
        }
        /**
         *
         * @param {*} polygons
         * @param {*} options
         * @param {*} material
         */
        toExtrudePolygons(polygons, options, material) {
            return new ExtrudePolygons(polygons, options, material, this);
        }
        /**
         *
         * @param {maptalks.Coordinate} coordinate
         * @param {*} options
         * @param {*} material
         */
        toPoint(coordinate, options, material) {
            return new Point(coordinate, options, material, this);
        }
        /**
         *
         * @param {Array} points
         * @param {*} options
         * @param {*} material
         */
        toPoints(points, options, material) {
            return new Points(points, options, material, this);
        }
        /**
         *
         * @param {Array} points
         * @param {*} options
         * @param {*} material
         */
        toBars(points, options, material) {
            return new Bars(points, options, material, this);
        }
        /**
         *
         * @param {Array[maptalks.LineString]} lineStrings
         * @param {*} options
         * @param {*} material
         */
        toExtrudeLines(lineStrings, options, material) {
            return new ExtrudeLines(lineStrings, options, material, this);
        }
        /**
         *
         * @param {Array[maptalks.LineString]} lineStrings
         * @param {*} options
         * @param {*} material
         */
        toLines(lineStrings, options, material) {
            return new Lines(lineStrings, options, material, this);
        }
        /**
         *
         * @param {*} url
         * @param {*} options
         * @param {*} getMaterial
         * @param {*} worker
         */
        toThreeVectorTileLayer(url, options, getMaterial) {
            return new ThreeVectorTileLayer(url, options, getMaterial, this);
        }
        /**
         *
         * @param {*} extent
         * @param {*} options
         * @param {*} material
         */
        toTerrain(extent, options, material) {
            return new Terrain(extent, options, material, this);
        }
        /**
         *
         * @param {*} url
         * @param {*} options
         * @param {*} material
         */
        toTerrainVectorTileLayer(url, options, material) {
            return new TerrainVectorTileLayer(url, options, material, this);
        }
        /**
         *
         * @param {*} data
         * @param {*} options
         * @param {*} material
         */
        toHeatMap(data, options, material) {
            return new HeatMap(data, options, material, this);
        }
        /**
         *
         * @param {*} lineString
         * @param {*} options
         * @param {*} material
         */
        toFatLine(lineString, options, material) {
            return new FatLine(lineString, options, material, this);
        }
        /**
         *
         * @param {*} lineStrings
         * @param {*} options
         * @param {*} material
         */
        toFatLines(lineStrings, options, material) {
            return new FatLines(lineStrings, options, material, this);
        }
        /**
         *
         * @param {*} coorindate
         * @param {*} options
         * @param {*} material
         */
        toBox(coorindate, options, material) {
            return new Box(coorindate, options, material, this);
        }
        /**
         *
         * @param {*} points
         * @param {*} options
         * @param {*} material
         */
        toBoxs(points, options, material) {
            return new Boxs(points, options, material, this);
        }
        /**
         *
         * @param {maptalks.LineString} lineString
         * @param {Object} options
         * @param {THREE.Material} material
         */
        toPath(lineString, options, material) {
            return new Path(lineString, options, material, this);
        }
        toPaths(lineStrings, options, material) {
            return new Paths(lineStrings, options, material, this);
        }
        getBaseObjects() {
            return this.getMeshes().filter((mesh => {
                return mesh instanceof BaseObject;
            }));
        }
        getMeshes() {
            const scene = this.getScene();
            if (!scene) {
                return [];
            }
            const meshes = [];
            for (let i = 0, len = scene.children.length; i < len; i++) {
                const child = scene.children[i];
                if (child instanceof THREE__namespace.Object3D && !(child instanceof THREE__namespace.Camera)) {
                    meshes.push(child['__parent'] || child);
                }
            }
            return meshes;
        }
        /**
         * clear all object3ds
         * @returns
         */
        clear() {
            return this.clearMesh();
        }
        clearBaseObjects() {
            return this.removeMesh(this.getBaseObjects());
        }
        clearMesh() {
            const scene = this.getScene();
            if (!scene) {
                return this;
            }
            for (let i = scene.children.length - 1; i >= 0; i--) {
                const child = scene.children[i];
                if (child instanceof THREE__namespace.Object3D && !(child instanceof THREE__namespace.Camera)) {
                    scene.remove(child);
                    const parent = child['__parent'];
                    if (parent && parent instanceof BaseObject) {
                        parent.isAdd = false;
                        parent.options.layer = null;
                        parent._fire('remove', { target: parent });
                        delete this._animationBaseObjectMap[child.uuid];
                        parent._hideUI();
                    }
                }
            }
            this._meshes = [];
            return this;
        }
        lookAt(vector) {
            const renderer = this._getRenderer();
            if (renderer) {
                renderer.context.lookAt(vector);
            }
            return this;
        }
        getCamera() {
            const renderer = this._getRenderer();
            if (renderer) {
                return renderer.camera;
            }
            return null;
        }
        getScene() {
            const renderer = this._getRenderer();
            if (renderer) {
                return renderer.scene;
            }
            return null;
        }
        renderScene(context, layer) {
            const renderer = this._getRenderer();
            if (renderer) {
                renderer.clearCanvas();
                renderer.renderScene(context);
                //外部调用时，直接redraw
                if (!layer) {
                    renderer.setToRedraw();
                }
            }
            return this;
        }
        loop(render = false) {
            const delayMeshes = this._delayMeshes;
            if (!delayMeshes.length) {
                return;
            }
            const map = this.getMap();
            if (!map || map.isAnimating() || map.isInteracting()) {
                return;
            }
            const loopRenderCount = this.options.loopRenderCount || 50;
            const meshes = delayMeshes.slice(0, loopRenderCount);
            if (meshes) {
                this.addMesh(meshes, render);
            }
            delayMeshes.splice(0, loopRenderCount);
        }
        renderPickScene() {
            const renderer = this._getRenderer();
            if (renderer) {
                const pick = renderer.pick;
                if (pick) {
                    pick.pick(this._containerPoint);
                }
            }
            return this;
        }
        getThreeRenderer() {
            const renderer = this._getRenderer();
            if (renderer) {
                return renderer.context;
            }
            return null;
        }
        getPick() {
            const renderer = this._getRenderer();
            if (renderer) {
                return renderer.pick;
            }
            return null;
        }
        delayAddMesh(meshes) {
            if (!meshes)
                return this;
            if (!Array.isArray(meshes)) {
                meshes = [meshes];
            }
            for (let i = 0, len = meshes.length; i < len; i++) {
                this._delayMeshes.push(meshes[i]);
            }
            return this;
        }
        /**
         * add object3ds
         * @param {BaseObject} meshes
         */
        addMesh(meshes, render = true) {
            if (!meshes)
                return this;
            if (!Array.isArray(meshes)) {
                meshes = [meshes];
            }
            const scene = this.getScene();
            meshes.forEach(mesh => {
                if (mesh instanceof BaseObject) {
                    scene.add(mesh.getObject3d());
                    if (!mesh.isAdd) {
                        mesh.isAdd = true;
                        mesh.options.layer = this;
                        mesh._fire('add', { target: mesh });
                    }
                    if (mesh._animation && maptalks__namespace.Util.isFunction(mesh._animation)) {
                        this._animationBaseObjectMap[mesh.getObject3d().uuid] = mesh;
                    }
                }
                else if (mesh instanceof THREE__namespace.Object3D) {
                    scene.add(mesh);
                }
                const index = this._meshes.indexOf(mesh);
                if (index === -1) {
                    this._meshes.push(mesh);
                }
            });
            this._zoomend();
            if (render) {
                const renderer = this._getRenderer();
                if (renderer) {
                    renderer.setToRedraw();
                }
            }
            return this;
        }
        /**
         * remove object3ds
         * @param {BaseObject} meshes
         */
        removeMesh(meshes, render = true) {
            if (!meshes)
                return this;
            if (!Array.isArray(meshes)) {
                meshes = [meshes];
            }
            const scene = this.getScene();
            meshes.forEach(mesh => {
                if (mesh instanceof BaseObject) {
                    scene.remove(mesh.getObject3d());
                    if (mesh.isAdd) {
                        mesh.isAdd = false;
                        mesh.options.layer = null;
                        mesh._fire('remove', { target: mesh });
                        mesh._hideUI();
                    }
                    if (mesh._animation && maptalks__namespace.Util.isFunction(mesh._animation)) {
                        delete this._animationBaseObjectMap[mesh.getObject3d().uuid];
                    }
                    const delayMeshes = this._delayMeshes;
                    if (delayMeshes.length) {
                        for (let i = 0, len = delayMeshes.length; i < len; i++) {
                            if (delayMeshes[i] === mesh) {
                                delayMeshes.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
                else if (mesh instanceof THREE__namespace.Object3D) {
                    scene.remove(mesh);
                }
                for (let i = 0, len = this._meshes.length; i < len; i++) {
                    const object3d = this._meshes[i];
                    if (!object3d) {
                        continue;
                    }
                    if (object3d === mesh) {
                        this._meshes.splice(i, 1);
                    }
                }
            });
            if (render) {
                const renderer = this._getRenderer();
                if (renderer) {
                    renderer.setToRedraw();
                }
            }
            return this;
        }
        _initRaycaster() {
            if (!this._raycaster) {
                this._raycaster = new THREE__namespace.Raycaster();
                this._mouse = new THREE__namespace.Vector2();
            }
            return this;
        }
        getRaycaster() {
            return this._raycaster;
        }
        /**
         *
         * @param {Coordinate} coordinate
         * @param {Object} options
         * @return {Array}
         */
        identify(coordinate, options) {
            if (!coordinate) {
                console.error('coordinate is null,it should be Coordinate');
                return [];
            }
            if (Array.isArray(coordinate)) {
                coordinate = new maptalks__namespace.Coordinate(coordinate);
            }
            if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                console.error('coordinate type is error,it should be Coordinate');
                return [];
            }
            const p = this.getMap().coordToContainerPoint(coordinate);
            this._containerPoint = p;
            const { x, y } = p;
            this._initRaycaster();
            this.fire('identify', { coordinate, options });
            const raycaster = this._raycaster, mouse = this._mouse, camera = this.getCamera(), scene = this.getScene(), size = this.getMap().getSize();
            //fix Errors will be reported when the layer is not initialized
            if (!scene) {
                return [];
            }
            const width = size.width, height = size.height;
            mouse.x = (x / width) * 2 - 1;
            mouse.y = -(y / height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            if (raycaster.layers && raycaster.layers.enableAll) {
                raycaster.layers.enableAll();
            }
            //set linePrecision for THREE.Line
            setRaycasterLinePrecision(raycaster, this._getLinePrecision(this.getMap().getResolution()));
            const children = [], hasidentifyChildren = [];
            scene.children.forEach(mesh => {
                const parent = mesh['__parent'];
                if (parent && parent.getOptions) {
                    const baseObject = parent;
                    const interactive = baseObject.getOptions().interactive;
                    if (interactive && baseObject.isVisible()) {
                        //If baseobject has its own hit detection
                        if (baseObject.identify && maptalks__namespace.Util.isFunction(baseObject.identify)) {
                            hasidentifyChildren.push(baseObject);
                        }
                        else {
                            children.push(mesh);
                        }
                    }
                }
                else if (mesh instanceof THREE__namespace.Mesh || mesh instanceof THREE__namespace.Group) {
                    children.push(mesh);
                }
            });
            let baseObjects = [];
            const intersects = raycaster.intersectObjects(children, true);
            if (intersects && Array.isArray(intersects) && intersects.length) {
                baseObjects = intersects.map(intersect => {
                    let object = intersect.object;
                    const instanceId = intersect.instanceId;
                    object = this._recursionMesh(object) || {};
                    const baseObject = object['__parent'] || object;
                    baseObject.faceIndex = intersect.faceIndex;
                    baseObject.index = intersect.index;
                    baseObject.intersect = intersect;
                    if (maptalks__namespace.Util.isNumber(instanceId)) {
                        baseObject.instanceId = instanceId;
                    }
                    return baseObject;
                });
            }
            this.renderPickScene();
            if (hasidentifyChildren.length) {
                hasidentifyChildren.forEach(baseObject => {
                    // baseObject identify
                    if (baseObject.identify(coordinate)) {
                        baseObjects.push(baseObject);
                    }
                });
            }
            const len = baseObjects.length;
            for (let i = 0; i < len; i++) {
                if (baseObjects[i]) {
                    for (let j = i + 1; j < len; j++) {
                        if (baseObjects[i] === baseObjects[j]) {
                            baseObjects.splice(j, 1);
                        }
                    }
                }
            }
            let pickResult = baseObjects.filter(mesh => {
                return mesh instanceof BaseObject;
            });
            pickResult = pickResult.sort((a, b) => {
                return a['options'].pickWeight - b['options'].pickWeight;
            });
            baseObjects.forEach(mesh => {
                if (!(mesh instanceof BaseObject)) {
                    pickResult.push(mesh);
                }
            });
            options = maptalks__namespace.Util.extend({}, options);
            const count = options['count'];
            return (maptalks__namespace.Util.isNumber(count) && count > 0 ? pickResult.slice(0, count) : baseObjects);
        }
        identifyAtPoint(point, options = {}) {
            const map = this.getMap();
            if (!map) {
                return [];
            }
            const coordinate = map.containerPointToCoordinate(point);
            return this.identify(coordinate, options);
        }
        /**
        * Recursively finding the root node of mesh,Until it is scene node
        * @param {*} mesh
        */
        _recursionMesh(mesh) {
            while (mesh && ((mesh.parent !== this.getScene()))) {
                mesh = mesh.parent;
            }
            return mesh;
        }
        //get Line Precision by Resolution
        _getLinePrecision(res = 10) {
            for (let i = 0, len = LINEPRECISIONS.length; i < len; i++) {
                const [resLevel, precision] = LINEPRECISIONS[i];
                if (res > resLevel) {
                    return precision;
                }
            }
            return 0.01;
        }
        fireGeoEvent(baseObject, event, type) {
            if (!(baseObject instanceof BaseObject)) {
                return this;
            }
            type = type || event.type;
            const e = this._getEventParams(event);
            const { coordinate } = e;
            const map = this.getMap();
            function showInfoWindow(baseObject, eventType) {
                eventType = eventType || type;
                const infoWindow = baseObject.getInfoWindow();
                if (infoWindow && (!infoWindow._owner)) {
                    infoWindow.addTo(baseObject);
                }
                const infoOptions = infoWindow ? infoWindow.options : {};
                const autoOpenOn = infoOptions['autoOpenOn'] || 'click';
                if (autoOpenOn === eventType) {
                    if (!map.options.supportPluginEvent) {
                        baseObject.openInfoWindow(coordinate);
                    }
                    baseObject.fire('showinfowindow', { infoWindow });
                }
            }
            if (type === 'mousemove') {
                baseObject.fire(type, Object.assign({}, e, { target: baseObject, selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                // tooltip
                const tooltip = baseObject.getToolTip();
                if (tooltip && (!tooltip._owner)) {
                    tooltip.addTo(baseObject);
                }
                baseObject.openToolTip(coordinate);
                showInfoWindow(baseObject);
            }
            else if (type === 'mouseover') {
                if (!baseObject._mouseover) {
                    baseObject.fire('mouseover', Object.assign({}, e, { target: baseObject, type: 'mouseover', selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                    baseObject._mouseover = true;
                    showInfoWindow(baseObject, 'mouseover');
                }
            }
            else if (type === 'mouseout') {
                if (baseObject.getSelectMesh) {
                    if (!baseObject.isHide) {
                        baseObject._mouseover = false;
                        baseObject.fire('mouseout', Object.assign({}, e, { target: baseObject, type: 'mouseout', selectMesh: null }));
                        baseObject.closeToolTip();
                    }
                }
                else {
                    baseObject._mouseover = false;
                    baseObject.fire('mouseout', Object.assign({}, e, { target: baseObject, type: 'mouseout' }));
                    baseObject.closeToolTip();
                }
            }
            else {
                baseObject.fire(type, Object.assign({}, e, { target: baseObject, selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                showInfoWindow(baseObject);
            }
        }
        _emptyIdentify(options = {}) {
            const event = options.domEvent;
            const scene = this.getScene();
            if (!scene) {
                return this;
            }
            const map = this.map || this.getMap();
            if (!map) {
                return this;
            }
            const e = map._getEventParams ? map._getEventParams(event) : this._getEventParams(event);
            for (let i = 0, len = scene.children.length; i < len; i++) {
                const child = scene.children[i] || {};
                const parent = child['__parent'];
                if (parent) {
                    parent.fire('empty', Object.assign({}, e, { target: parent }));
                }
            }
        }
        /**
         * fire baseObject events
         * @param {*} e
         */
        _identifyBaseObjectEvents(event) {
            if (!this.options.geometryEvents) {
                return this;
            }
            const map = this.map || this.getMap();
            //When map interaction, do not carry out mouse movement detection, which can have better performance
            if (map.isInteracting() || !map.options.geometryEvents || map._ignoreEvent(event)) {
                return this;
            }
            const eventType = event.type;
            const e = map._getEventParams ? map._getEventParams(event) : this._getEventParams(event);
            e.type = eventType;
            const { type, coordinate } = e;
            const now = maptalks__namespace.Util.now();
            if (this._mousemoveTimeOut && type === 'mousemove') {
                if (now - this._mousemoveTimeOut < 64) {
                    return this;
                }
            }
            this._mousemoveTimeOut = now;
            // record mousedown/touchstart time
            if (type === 'mousedown' || type === 'touchstart') {
                this._mousedownTime = maptalks__namespace.Util.now();
            }
            let isClick = false;
            if (type === 'click' || type === 'touchend') {
                const clickTimeThreshold = map.options.clickTimeThreshold || 280;
                isClick = (maptalks__namespace.Util.now() - this._mousedownTime < clickTimeThreshold);
            }
            //ignore click event
            if (type === 'click' && !isClick) {
                return this;
            }
            // map.resetCursor('default');
            const identifyCountOnEvent = this.options['identifyCountOnEvent'];
            let count = Math.max(0, maptalks__namespace.Util.isNumber(identifyCountOnEvent) ? identifyCountOnEvent : 0);
            if (count === 0) {
                count = Infinity;
            }
            const outBaseObjectsFunc = (baseObjects) => {
                const outBaseObjects = [];
                if (this._baseObjects) {
                    this._baseObjects.forEach(baseObject => {
                        let isOut = true;
                        baseObjects.forEach(baseO => {
                            if (baseObject === baseO) {
                                isOut = false;
                            }
                        });
                        if (isOut) {
                            outBaseObjects.push(baseObject);
                        }
                    });
                }
                outBaseObjects.forEach(baseObject => {
                    if (baseObject && baseObject instanceof BaseObject) {
                        // reset _mouseover status
                        // Deal with the mergedmesh
                        if (baseObject.getSelectMesh) {
                            if (!baseObject.isHide) {
                                baseObject._mouseover = false;
                                baseObject.fire('mouseout', Object.assign({}, e, { target: baseObject, type: 'mouseout', selectMesh: null }));
                                baseObject.closeToolTip();
                            }
                        }
                        else {
                            baseObject._mouseover = false;
                            baseObject.fire('mouseout', Object.assign({}, e, { target: baseObject, type: 'mouseout' }));
                            baseObject.closeToolTip();
                        }
                    }
                });
            };
            if (type === 'mouseout') {
                outBaseObjectsFunc([]);
                this._baseObjects = [];
                return this;
            }
            const baseObjects = this.identify(coordinate, { count });
            const scene = this.getScene();
            if (baseObjects.length === 0 && scene) {
                for (let i = 0, len = scene.children.length; i < len; i++) {
                    const child = scene.children[i] || {};
                    const parent = child['__parent'];
                    if (parent) {
                        parent.fire('empty', Object.assign({}, e, { target: parent }));
                    }
                }
            }
            function showInfoWindow(baseObject, eventType) {
                eventType = eventType || type;
                const infoWindow = baseObject.getInfoWindow();
                if (infoWindow && (!infoWindow._owner)) {
                    infoWindow.addTo(baseObject);
                }
                const infoOptions = infoWindow ? infoWindow.options : {};
                const autoOpenOn = infoOptions['autoOpenOn'] || 'click';
                if (autoOpenOn === eventType) {
                    baseObject.openInfoWindow(coordinate);
                    baseObject.fire('showinfowindow', { infoWindow });
                }
            }
            if (type === 'mousemove') {
                // if (baseObjects.length) {
                //     map.setCursor('pointer');
                // }
                // mouseout objects
                outBaseObjectsFunc(baseObjects);
                baseObjects.forEach(baseObject => {
                    if (baseObject instanceof BaseObject) {
                        if (!baseObject._mouseover) {
                            baseObject.fire('mouseover', Object.assign({}, e, { target: baseObject, type: 'mouseover', selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                            baseObject._mouseover = true;
                            showInfoWindow(baseObject, 'mouseover');
                        }
                        baseObject.fire(type, Object.assign({}, e, { target: baseObject, selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                        // tooltip
                        const tooltip = baseObject.getToolTip();
                        if (tooltip && (!tooltip._owner)) {
                            tooltip.addTo(baseObject);
                        }
                        baseObject.openToolTip(coordinate);
                        showInfoWindow(baseObject);
                    }
                });
                this._baseObjects = baseObjects;
            }
            else {
                baseObjects.forEach(baseObject => {
                    if (baseObject instanceof BaseObject) {
                        baseObject.fire(type, Object.assign({}, e, { target: baseObject, selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                        showInfoWindow(baseObject);
                    }
                });
            }
            //simulation mouse click on mobile device
            if (type === 'touchend' && isClick) {
                const eventParam = maptalks__namespace.Util.extend({}, e, { domEvent: event });
                baseObjects.forEach(baseObject => {
                    if (baseObject instanceof BaseObject) {
                        baseObject.fire('click', Object.assign({}, eventParam, { target: baseObject, selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                        showInfoWindow(baseObject, 'click');
                    }
                });
            }
            return this;
        }
        _getEventParams(e) {
            const map = this.getMap();
            const eventParam = {
                domEvent: e
                // type: e.type
            };
            if (!map) {
                return eventParam;
            }
            const actual = e.touches && e.touches.length > 0 ? e.touches[0] : e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0] : e;
            if (actual) {
                const getEventContainerPoint = maptalks__namespace.DomUtil.getEventContainerPoint;
                const containerPoint = getEventContainerPoint(actual, map._containerDOM);
                eventParam['coordinate'] = map.containerPointToCoordinate(containerPoint);
                eventParam['containerPoint'] = containerPoint;
                eventParam['viewPoint'] = map.containerPointToViewPoint(containerPoint);
                eventParam['pont2d'] = map._containerPointToPoint(containerPoint);
            }
            return eventParam;
        }
        /**
         *map zoom event
         */
        _zoomend() {
            const scene = this.getScene();
            if (!scene) {
                return;
            }
            const zoom = this.getMap().getZoom();
            scene.children.forEach(mesh => {
                const parent = mesh['__parent'];
                if (parent && parent.getOptions) {
                    const baseObject = parent;
                    if (baseObject.zoomChange && maptalks__namespace.Util.isFunction(baseObject.zoomChange)) {
                        baseObject.zoomChange(zoom);
                    }
                    const minZoom = baseObject.getMinZoom(), maxZoom = baseObject.getMaxZoom();
                    if (zoom < minZoom || zoom > maxZoom) {
                        if (baseObject.isVisible()) {
                            baseObject.getObject3d().visible = false;
                        }
                        baseObject._zoomVisible = false;
                    }
                    else if (minZoom <= zoom && zoom <= maxZoom) {
                        if (baseObject._visible) {
                            baseObject.getObject3d().visible = true;
                        }
                        baseObject._zoomVisible = true;
                    }
                }
            });
        }
        _getGeometryEventMapPanel() {
            const map = this.map || this.getMap();
            const dom = map._panels.allLayers || map._containerDOM;
            return dom;
        }
        onAdd() {
            super.onAdd();
            const map = this.map || this.getMap();
            if (!map)
                return this;
            const dom = this._getGeometryEventMapPanel();
            if (!this._identifyBaseObjectEventsThis) {
                this._identifyBaseObjectEventsThis = this._identifyBaseObjectEvents.bind(this);
            }
            if (!this._zoomendThis) {
                this._zoomendThis = this._zoomend.bind(this);
            }
            if (!this._emptyIdentifyThis) {
                this._emptyIdentifyThis = this._emptyIdentify.bind(this);
            }
            if (!map.options.supportPluginEvent) {
                maptalks__namespace.DomUtil.on(dom, EVENTS.join(' '), this._identifyBaseObjectEventsThis, this);
            }
            else {
                // @ts-ignore
                this.on('identifyempty', this._emptyIdentifyThis);
            }
            this._needsUpdate = true;
            if (!this._animationBaseObjectMap) {
                this._animationBaseObjectMap = {};
            }
            map.on('zooming zoomend', this._zoomendThis, this);
            return this;
        }
        onRemove() {
            super.onRemove();
            const map = this.map || this.getMap();
            if (!map)
                return this;
            const dom = this._getGeometryEventMapPanel();
            if (!map.options.supportPluginEvent) {
                maptalks__namespace.DomUtil.off(dom, EVENTS.join(' '), this._identifyBaseObjectEventsThis, this);
            }
            else {
                // @ts-ignore
                this.off('identifyempty', this._emptyIdentifyThis);
            }
            map.off('zooming zoomend', this._zoomendThis, this);
            // this.clear();
            return this;
        }
        _addBaseObjectsWhenInit() {
            this.addMesh(this._meshes);
            return this;
        }
        _callbackBaseObjectAnimation() {
            const layer = this;
            if (layer._animationBaseObjectMap) {
                for (const uuid in layer._animationBaseObjectMap) {
                    const baseObject = layer._animationBaseObjectMap[uuid];
                    baseObject._animation();
                }
            }
            return this;
        }
        /**
         * To make map's 2d point's 1 pixel euqal with 1 pixel on XY plane in THREE's scene:
         * 1. fov is 90 and camera's z is height / 2 * scale,
         * 2. if fov is not 90, a ratio is caculated to transfer z to the equivalent when fov is 90
         * @return {Number} fov ratio on z axis
         */
        _getFovRatio() {
            const map = this.getMap();
            const fov = map.getFov();
            return Math.tan(fov / 2 * RADIAN);
        }
    }
    ThreeLayer.mergeOptions(options);
    const TEMPMESH = {
        bloom: true
    };
    class ThreeRenderer extends maptalks__namespace.renderer.CanvasLayerRenderer {
        constructor() {
            super(...arguments);
            this._renderTime = 0;
            this._renderTarget = null;
        }
        getPrepareParams() {
            return [this.scene, this.camera];
        }
        getDrawParams() {
            return [this.scene, this.camera];
        }
        _drawLayer() {
            super._drawLayer.apply(this, arguments);
            // this.renderScene();
        }
        hitDetect() {
            return false;
        }
        createCanvas() {
            super.createCanvas();
            this.createContext();
        }
        createContext() {
            if (this.canvas.gl && this.canvas.gl.wrap) {
                this.gl = this.canvas.gl.wrap();
            }
            else {
                const layer = this.layer;
                const attributes = layer.options.glOptions || {
                    alpha: true,
                    depth: true,
                    antialias: true,
                    stencil: true,
                    preserveDrawingBuffer: false
                };
                attributes.preserveDrawingBuffer = true;
                this.gl = this.gl || this._createGLContext(this.canvas, attributes);
            }
            this._initThreeRenderer();
            this.layer.onCanvasCreate(this.context, this.scene, this.camera);
        }
        _initThreeRenderer() {
            this.matrix4 = new THREE__namespace.Matrix4();
            const renderer = new THREE__namespace.WebGLRenderer({ 'context': this.gl, alpha: true });
            renderer.autoClear = false;
            renderer.setClearColor(new THREE__namespace.Color(1, 1, 1), 0);
            renderer.setSize(this.canvas.width, this.canvas.height);
            renderer.clear();
            // renderer.canvas = this.canvas;
            this.context = renderer;
            const scene = this.scene = new THREE__namespace.Scene();
            const map = this.layer.getMap();
            const fov = map.getFov() * Math.PI / 180;
            const camera = this.camera = new THREE__namespace.PerspectiveCamera(fov, map.width / map.height, map.cameraNear, map.cameraFar);
            camera.matrixAutoUpdate = false;
            this._syncCamera();
            scene.add(camera);
            this.pick = new GPUPick(this.layer);
            BaseObjectTaskManager.star();
            this.layer._addBaseObjectsWhenInit();
        }
        onCanvasCreate() {
            super.onCanvasCreate();
        }
        resizeCanvas(canvasSize) {
            if (!this.canvas) {
                return;
            }
            let size, map = this.getMap();
            if (!canvasSize) {
                size = map.getSize();
            }
            else {
                size = canvasSize;
            }
            // const r = maptalks.Browser.retina ? 2 : 1;
            const r = map.getDevicePixelRatio ? map.getDevicePixelRatio() : (maptalks__namespace.Browser.retina ? 2 : 1);
            const canvas = this.canvas;
            const { width, height, cssWidth, cssHeight } = maptalks__namespace.Util.calCanvasSize(size, r);
            if (this.layer._canvas && (canvas.style.width !== cssWidth || canvas.style.height !== cssHeight)) {
                canvas.style.width = cssWidth;
                canvas.style.height = cssHeight;
            }
            if (canvas.width === width && canvas.height === height) {
                return this;
            }
            //retina support
            canvas.width = width;
            canvas.height = height;
            this.context.setSize(canvas.width, canvas.height);
        }
        clearCanvas() {
            if (!this.canvas) {
                return;
            }
            this.context.clear();
        }
        prepareCanvas() {
            if (!this.canvas) {
                this.createCanvas();
            }
            else {
                this.clearCanvas();
            }
            this.layer.fire('renderstart', { 'context': this.context });
            return null;
        }
        renderScene(context) {
            // const time = maptalks.Util.now();
            // Make sure to execute only once in a frame
            // if (time - this._renderTime >= 16) {
            //     this.layer._callbackBaseObjectAnimation();
            //     this._renderTime = time;
            // }
            this.layer._callbackBaseObjectAnimation();
            this._syncCamera();
            // 把 WebglRenderTarget 中的 framebuffer 替换为 GroupGLLayer 中的 fbo
            // 参考: https://stackoverflow.com/questions/55082573/use-webgl-texture-as-a-three-js-texture-map
            // 实现有点 hacky，需要留意 three 版本变动 对它的影响
            if (context && context.renderTarget) {
                const { width, height } = context.renderTarget.fbo;
                if (!this._renderTarget) {
                    this._renderTarget = new THREE__namespace.WebGLRenderTarget(width, height, {
                        // depthTexture: new THREE.DepthTexture(width, height, THREE.UnsignedInt248Type)
                        depthBuffer: false
                    });
                    // 绘制一次以后，才会生成 framebuffer 对象
                    this.context.setRenderTarget(this._renderTarget);
                    this.context.render(this.scene, this.camera);
                }
                else {
                    // 这里不能setSize，因为setSize中会把原有的fbo dipose掉
                    // this._renderTarget.setSize(width, height);
                    this._renderTarget.viewport.set(0, 0, width, height);
                    this._renderTarget.scissor.set(0, 0, width, height);
                }
                const renderTargetProps = this.context.properties.get(this._renderTarget);
                const threeCreatedFBO = renderTargetProps[KEY_FBO];
                // 用GroupGLLayer的webgl fbo对象替换WebglRenderTarget的fbo对象
                renderTargetProps[KEY_FBO] = context.renderTarget.getFramebuffer(context.renderTarget.fbo);
                this.context.setRenderTarget(this._renderTarget);
                const bloomEnable = context.bloom === 1 && context.sceneFilter;
                const object3ds = this.scene.children || [];
                //是否是bloom渲染帧
                let isBloomFrame = false;
                if (bloomEnable) {
                    const sceneFilter = context.sceneFilter;
                    // test 是否是bloom渲染帧
                    isBloomFrame = sceneFilter(TEMPMESH);
                    for (let i = 0, len = object3ds.length; i < len; i++) {
                        if (!object3ds[i] || !object3ds[i].layers) {
                            continue;
                        }
                        const parent = object3ds[i]['__parent'];
                        object3ds[i]['bloom'] = false;
                        //判断当前ojbect3d是否开启bloom
                        if (parent) {
                            object3ds[i]['bloom'] = parent.bloom;
                        }
                        let layer = 0;
                        //当object3d找不到parent(baseobject)时，也加入当前渲染帧，这种情况的一般都是灯光对象
                        //sceneFilter 用来过滤符合当前模式的meshes
                        if (object3ds[i] && sceneFilter(object3ds[i]) || !parent) {
                            //当时bloom渲染帧时，将meshes分组到layer=1
                            if (isBloomFrame) {
                                layer = 1;
                            }
                        }
                        // object3ds[i].layers.set(layer);
                        if (object3ds[i].__layer !== layer) {
                            recursionObject3dLayer(object3ds[i], layer);
                            object3ds[i].__layer = layer;
                        }
                    }
                }
                else {
                    //reset all object3ds layers
                    for (let i = 0, len = object3ds.length; i < len; i++) {
                        if (!object3ds[i] || !object3ds[i].layers) {
                            continue;
                        }
                        // object3ds[i].layers.set(0);
                        if (object3ds[i].__layer !== 0) {
                            recursionObject3dLayer(object3ds[i], 0);
                            object3ds[i].__layer = 0;
                        }
                    }
                }
                this.camera.layers.set(isBloomFrame ? 1 : 0);
                this.context.render(this.scene, this.camera);
                renderTargetProps[KEY_FBO] = threeCreatedFBO;
            }
            else {
                const { width, height } = this.canvas;
                const viewport = this.context.getViewport(TEMP_V4);
                if (viewport.width !== width || viewport.height !== height) {
                    this.context.setViewport(0, 0, width, height);
                }
                this.context.render(this.scene, this.camera);
            }
            this.context.setRenderTarget(null);
            this.completeRender();
        }
        remove() {
            delete this._drawContext;
            if (this._renderTarget) {
                this._renderTarget.dispose();
                delete this._renderTarget;
            }
            super.remove();
        }
        _syncCamera() {
            const map = this.getMap();
            const camera = this.camera;
            camera.matrix.elements = map.cameraWorldMatrix;
            camera.projectionMatrix.elements = map.projMatrix;
            //https://github.com/mrdoob/three.js/commit/d52afdd2ceafd690ac9e20917d0c968ff2fa7661
            if (this.matrix4.invert) {
                camera.projectionMatrixInverse.elements = this.matrix4.copy(camera.projectionMatrix).invert().elements;
                //r95 no projectionMatrixInverse properties
            }
            else if (camera.projectionMatrixInverse) {
                camera.projectionMatrixInverse.elements = this.matrix4.getInverse(camera.projectionMatrix).elements;
            }
        }
        _createGLContext(canvas, options) {
            const names = ['webgl2', 'webgl', 'experimental-webgl'];
            let context = null;
            /* eslint-disable no-empty */
            for (let i = 0; i < names.length; ++i) {
                try {
                    context = canvas.getContext(names[i], options);
                }
                catch (e) { }
                if (context) {
                    break;
                }
            }
            return context;
            /* eslint-enable no-empty */
        }
    }
    ThreeLayer.registerRenderer('gl', ThreeRenderer);
    function recursionObject3dLayer(object3d, layer) {
        if (!object3d) {
            return;
        }
        if (object3d.layers) {
            object3d.layers.set(layer);
        }
        const children = object3d.children;
        if (children && children.length) {
            for (let i = 0, len = children.length; i < len; i++) {
                recursionObject3dLayer(children[i], layer);
            }
        }
    }
    function getGLRes(map) {
        return map.getGLRes ? map.getGLRes() : map.getGLZoom();
    }
    function coordinateToPoint(map, coordinate, res, out) {
        if (map.coordToPointAtRes) {
            return map.coordToPointAtRes(coordinate, res, out);
        }
        return map.coordinateToPoint(coordinate, res, out);
    }
    if (maptalks__namespace.registerWorkerAdapter) {
        maptalks__namespace.registerWorkerAdapter(getWorkerName(), workerCode);
        maptalks__namespace.registerWorkerAdapter(fetchDataWorkerKey, fetchDataWorkerCode);
    }

    exports.BaseObject = BaseObject;
    exports.BaseObjectTask = BaseObjectTask;
    exports.BaseObjectTaskManager = BaseObjectTaskManager;
    exports.ExtrudeUtil = ExtrudeUtil;
    exports.GeoJSONUtil = GeoJSONUtil;
    exports.GeoUtil = GeoUtil;
    exports.IdentifyUtil = IdentifyUtil;
    exports.LineMaterial = LineMaterial;
    exports.LineUtil = LineUtil;
    exports.MergeGeometryUtil = MergeGeometryUtil;
    exports.MergedMixin = MergedMixin;
    exports.ThreeLayer = ThreeLayer;
    exports.ThreeRenderer = ThreeRenderer;
    exports.geometryExtrude = main;
    exports.getFetchDataActor = getFetchDataActor;
    exports.polyextrude = polyExtrude$1;

    Object.defineProperty(exports, '__esModule', { value: true });

    typeof console !== 'undefined' && console.log('maptalks.three v0.39.0');

}));
//# sourceMappingURL=maptalks.three.js.map
