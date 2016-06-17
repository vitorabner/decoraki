;(function (decoraki) { // jshint ignore:line
    'use strict';

    var OrbitControl = decoraki.helpers.OrbitControl;
    var control = decoraki.control;

    //-
    //- Private
    //-

    var _sceneData = {};
    var _colliders = {};

    var _createCameraController = function () {
        _sceneData.cameraController = new OrbitControl(_sceneData.camera, _sceneData.container);
        _sceneData.cameraController.center.set(0, 1.5, 0);
    };

    var _initCamera = function () {
        var viewWidth = _sceneData.container.offsetWidth;
        var viewHeight = _sceneData.container.offsetHeight;

        _sceneData.camera = new THREE.PerspectiveCamera(35, viewWidth / viewHeight, 1, 70);
        _sceneData.camera.position.set(0, 12.940344, 20.31728);
        _createCameraController();
    };

    var _initRenderer = function () {
        var viewWidth = _sceneData.container.offsetWidth;
        var viewHeight = _sceneData.container.offsetHeight;

        _sceneData.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: false
        });

        _sceneData.renderer.setSize(viewWidth, viewHeight);
        _sceneData.container.appendChild(_sceneData.renderer.domElement);
    };

    var _initMobile = function () {
        _sceneData.camera.position.set(0, 2, 5);
        _sceneData.camera.fov = 12;
        _sceneData.cameraController.center.set(0, 0.3, 0);
        _sceneData.camera.updateProjectionMatrix();
    };

    var _initColliders = function () {
        _colliders.walls = [];
        _colliders.floor = [];
        _colliders.furnitures = [];
    };

    var _initScene = function () {
        _sceneData.scene = new THREE.Scene();
        _sceneData.animationFrame = false;
    };

    var _initSceneObjects = function () {
        _initColliders();
        _initRenderer();
        _initCamera();
    };

    var _init = function () {
        _sceneData.container = control.getContainer();

        if (control.checkWebGL()) {
            _sceneData.container.appendChild(control.getWebGLErrorMessage());
            return;
        }

        _initScene();
        _initSceneObjects();

        if (control.isMobile()) {
            _initMobile();
            return;
        }

        control.createEvent('canvas');
    };

    var _addObject = function (object) {
        _sceneData.scene.add(object);
    };

    var _deleteObject = function (object, modelId) {
        var newColliders = _colliders.furnitures.filter(function (mesh) {
            return mesh.modelId !== modelId;
        });

        _colliders.furnitures = newColliders;

        _sceneData.scene.remove(object);
    };

    var _renderScene = function () {
        if (_sceneData.animationFrame) return;
        _sceneData.cameraController.update();
        _sceneData.renderer.render(_sceneData.scene, _sceneData.camera);
    };

    var _animationFrame = function () {
        if (!_sceneData.animationFrame) return;
        requestAnimationFrame(_animationFrame);
        _sceneData.cameraController.update();
        _sceneData.renderer.render(_sceneData.scene, _sceneData.camera);
    };

    var _startAnimationFrame = function () {
        if (_sceneData.animationFrame) return;
        _sceneData.animationFrame = true;
        _animationFrame();
    };

    var _stopAnimationFrame = function () {
        _sceneData.animationFrame = false;
    };

    var _calculateMousePositionDomElement = function (x, y) {
        var offsetTop = _sceneData.container.parentNode.offsetTop;
        var offsetLeft = _sceneData.container.parentNode.offsetLeft;

        var position = {};

        position.x = ((x - offsetLeft) / _sceneData.renderer.domElement.clientWidth) * 2 - 1;
        position.y = -((y - offsetTop) / _sceneData.renderer.domElement.clientHeight) * 2 + 1;

        return position;
    };

    var _getObjects = function (fromPos, toPos) {
        var vectorPosition = new THREE.Vector3(fromPos.x, fromPos.y, 0.5);
        vectorPosition.unproject(_sceneData.camera);

        var unprojectOffset = vectorPosition.sub(_sceneData.camera.position).normalize();

        var ray = new THREE.Raycaster(_sceneData.camera.position, unprojectOffset);
        var intersected = {};

        if (toPos !== undefined) ray = new THREE.Raycaster(fromPos, toPos.normalize());

        intersected.walls = ray.intersectObjects(_colliders.walls)[0] || undefined;
        intersected.floor = ray.intersectObjects(_colliders.floor)[0] || undefined;
        intersected.furnitures = ray.intersectObjects(_colliders.furnitures)[0] || undefined;

        return intersected;
    };

    var _addColliders = function (mesh, meshType) {
        var add = {};

        add.walls = function () { _colliders.walls.push(mesh); };

        add.floor = function () { _colliders.floor.push(mesh); };

        add.furniture = function () { _colliders.furnitures.push(mesh); };

        if (add[meshType]) add[meshType]();
    };

    var _showObjects = function (objectType) {
        _colliders[objectType].forEach(function (element) {
            var object = element.parent.parent;
            object.visible = true;
        });
    };

    var _hideObjects = function (objectType, value) {
        var objToHide = _colliders[objectType].filter(function (element) {
            return element.parent.parent.placeName === value;
        });

        objToHide.forEach(function (element) {
            var object = element.parent.parent;
            object.visible = false;
        });
    };

    var _updateCamera = function (viewWidth, viewHeight) {
        _sceneData.camera.aspect = viewWidth / viewHeight;
        _sceneData.camera.updateProjectionMatrix();
        _sceneData.renderer.setSize(viewWidth, viewHeight);
    };

    var _resizeScene = function () {
        var canvas = _sceneData.container.childNodes[0];
        var windowWidth = window.innerWidth;

        var mainWidth = windowWidth * 0.96;
        var simulatorBorder = 1;

        var containerWidth = mainWidth;

        if (windowWidth >= 575 && !control.isMobile()) containerWidth = mainWidth * 0.6666;

        var viewWidth = containerWidth - simulatorBorder;
        var viewHeight = _sceneData.container.parentNode.offsetHeight;

        canvas.width = viewWidth;

        _updateCamera(viewWidth, viewHeight);
    };

    //-
    //- Public
    //-

    decoraki.scene = {
        init: function () {
            _init();
        },

        addObject: function (object) {
            _addObject(object);
        },

        deleteObject: function (object, modelId) {
            _deleteObject(object, modelId);
        },

        render: function () {
            _renderScene();
        },

        addColliders: function (mesh, meshType) {
            _addColliders(mesh, meshType);
        },

        hideObjects: function (objectType, value) {
            _hideObjects(objectType, value);
        },

        showObjects: function (objectType) {
            _showObjects(objectType);
        },

        getRenderer: function () {
            return _sceneData.renderer;
        },

        calculateMousePosition: function (x, y) {
            return _calculateMousePositionDomElement(x, y);
        },

        getObjects: function (fromPosition, toPosition) {
            return _getObjects(fromPosition, toPosition);
        },

        resizeScene: function () {
            _resizeScene();
        },

        getScene: function () {
            return _sceneData.scene;
        },

        startAnimationFrame: function () {
            _startAnimationFrame();
        },

        stopAnimationFrame: function () {
            _stopAnimationFrame();
        },

        getCameraPosition: function () {
            return _sceneData.camera.position;
        }
    };

})(window.decoraki = window.decoraki || {});
