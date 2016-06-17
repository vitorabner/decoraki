;(function (decoraki) { // jshint ignore:line
    'use strict';

    var model = decoraki.model;
    var scene = decoraki.scene;
    var pointer = decoraki.pointer;
    var control = decoraki.control;
    var repository = decoraki.repository;
    var geometry = decoraki.geometry;

    //-
    //- Private
    //-

    var _controller = {};

    var _insertMaterial = function (data, callbacks) {
        var selectedObject = _controller.selectedObject;

        if (!selectedObject || selectedObject.parent.category !== 'room') {
            control.setMessageState('show', 'First you need to select a wall or floor');
            return;
        }

        var mesh = selectedObject.children[0];
        data.lightMap = mesh.material.lightMap;
        mesh.material = model.loadTextureMaterial(data, callbacks);
        scene.startAnimationFrame();
    };

    var _animateFurniture = function () {
        requestAnimationFrame(_animateFurniture);
        _controller.selectedObject.rotation.y += 0.012;
        scene.render();
    };

    var _insertModel = function (data, callbacks) {
        callbacks.addColliders = scene.addColliders;

        callbacks.ready = function (object) {
            scene.addObject(object);
            control.setMessageState('hide');
            _controller.selectedObject = object.children[0];

            if (_controller.isMobile) {
                control.showTip('This is a mobile version!');
                _animateFurniture();
                return;
            }

            if (_controller.selectedObject.category === 'room') {
                control.showTip();
                return;
            }
        };

        control.setMessageState('show', 'Loading 3D collada model');
        model.loadModel(data, callbacks);
    };

    var _insertObject = function (data, errorCallback) {
        var callbacks = {};

        if (errorCallback) callbacks.error = errorCallback;

        if (data.model) {
            _insertModel(data, callbacks);
            return;
        }

        _insertMaterial(data, callbacks);
    };

    var _initMobile = function () {
        var id = Math.floor((Math.random() * 3) + 1);
        var furniture = repository.getProductById(id);
        _insertObject(furniture);
    };

    var _initSimulatorController = function () {
        _controller.selectedObject = null;
        _controller.leftMouseButtonDown = false;
        _controller.offset = new THREE.Vector3();
        _controller.isMobile = control.isMobile();
        _controller.theSimsPointer = pointer.getTheSimsPointer();
        _controller.theSimsPointer.visible = false;
    };

    var _init = function () {
        if (control.checkWebGL()) return;

        _initSimulatorController();

        if (_controller.isMobile) {
            _initMobile();
            return;
        }

        scene.addObject(_controller.theSimsPointer);
        control.createEvent('simulator');

        scene.startAnimationFrame();

        _insertObject(repository.getRoomById(0));
    };

    var _getNewPosition = function (position, offset) {
        if (!position) return undefined;
        return position.sub(offset);
    };

    var _rotateObject = function (angle, origin) {
        var selected = _controller.selectedObject;

        if (origin === 'GUI') {
            if (selected.placeName === 'floor') {

                selected.rotation.y = angle;

                return;
            }

            selected.rotation.z = angle;

            return;
        }

        selected.rotation.y = angle - Math.PI;
    };

    var _hideTheSimsPointer = function () {
        _controller.theSimsPointer.visible = false;
    };

    //- Fix 3d pivot -- Needs refactoring
    var _forwardWallObject = function (point, degree) {
        var fix = 0.01;

        var angles = {
            180: function () { point.z = point.z + fix; },

            360: function () { point.z = point.z - fix; },

            90: function () { point.x = point.x - fix; },

            270: function () { point.x = point.x + fix; }
        };

        if (angles[degree]) angles[degree]();
    };

    var _typeMove = function (type, clickPosition) {
        var mousePosition = scene.calculateMousePosition(clickPosition.x, clickPosition.y);
        var objects = scene.getObjects(mousePosition);

        var move = {};

        move.wall = function () {
            if (!objects.walls) return;

            var walls = objects.walls;
            var degree = walls.object.parent.wallRotation;
            _forwardWallObject(walls.point, degree);

            _controller.selectedObject.position.copy(walls.point);
            _controller.selectedObject.placeName = walls.object.parent.name;
            _rotateObject(geometry.degreesToRadians(degree));
            control.setRangeValue(_controller.selectedObject.rotation.z);
        };

        move.floor = function () {
            if (!objects.floor) return;

            _controller.selectedObject.position.copy(
                _getNewPosition(objects.floor.point, _controller.offset)
            );

            _controller.selectedObject.position.y = 0;
            _controller.selectedObject.rotation.z = 0;
            _controller.selectedObject.placeName = 'floor';
            control.setRangeValue(_controller.selectedObject.rotation.y);
        };

        if (move[type]) move[type]();
    };

    var _moveObject = function (clickPosition) {
        if (!_controller.leftMouseButtonDown) return;

        _hideTheSimsPointer();

        if (_controller.selectedObject.moveType === 'both') {
            _typeMove('wall', clickPosition);
            _typeMove('floor', clickPosition);
            return;
        }

        _typeMove(_controller.selectedObject.moveType, clickPosition);
    };

    var _showTheSimsPointer = function (position) {
        var selected = _controller.selectedObject;
        var pointer = _controller.theSimsPointer;
        var box = new THREE.Box3().setFromObject(selected);

        pointer.position.copy(selected.position);
        if (position) pointer.position.copy(position);
        pointer.position.y = box.max.y;
        pointer.visible = true;
    };

    var _calculateOffset = function (fromPosition, toPosition) {
        _controller.offset.copy(_getNewPosition(fromPosition, toPosition));
    };

    var _typeSelect = function (type, objects) {
        var select = {};

        select.wall = function () {
            _controller.selectedObject = objects.walls.object.parent;
            _showTheSimsPointer(objects.walls.point);
        };

        select.floor = function () {
            _controller.selectedObject = objects.floor.object.parent;
            _showTheSimsPointer(objects.floor.point);
        };

        select.furniture = function () {
            _controller.selectedObject = objects.furnitures.object.parent.parent;
            _showTheSimsPointer();
            _controller.leftMouseButtonDown = true;
            var selectedObjectPos = _controller.selectedObject.position;
            if (objects.floor) _calculateOffset(objects.floor.point, selectedObjectPos);

            var radian = _controller.selectedObject.rotation.z;

            if (_controller.selectedObject.placeName === 'floor') {
                radian = _controller.selectedObject.rotation.y;
            }

            control.setRangeValue(radian);
            control.setMenuState('show');
        };

        if (select[type]) select[type]();
    };

    var _resetSelected = function () {
        _controller.selectedObject = null;
        _hideTheSimsPointer();
        control.setMenuState('hide');
    };

    var _selectObject = function (clickPosition) {
        if (clickPosition.button !== 0) return;

        var mousePosition = scene.calculateMousePosition(clickPosition.x, clickPosition.y);
        var objects = scene.getObjects(mousePosition);

        _resetSelected();

        if (objects.furnitures) {
            _typeSelect('furniture', objects);
            return;
        }

        if (objects.walls) _typeSelect('wall', objects);
        if (objects.floor) _typeSelect('floor', objects);
    };

    var _stopMoveObject = function () {
        if (!_controller.leftMouseButtonDown) return;

        _controller.leftMouseButtonDown = false;
        _showTheSimsPointer();
    };

    var _deleteObject = function () {
        var selectedObject = _controller.selectedObject;

        if (selectedObject.parent.category === 'room') return;
        scene.deleteObject(_controller.selectedObject.parent, selectedObject.modelId);
        _resetSelected();
    };

    var _hideWallObj = function (eventData) {
        if (eventData.button !== 2) return;

        var cameraPosition = scene.getCameraPosition();

        var fromPosition = new THREE.Vector3(0, 1.5, 0);
        var toPosition = new THREE.Vector3(cameraPosition.x, 1.5, cameraPosition.z);
        var objects = scene.getObjects(fromPosition, toPosition);
        var walls = objects.walls;

        scene.showObjects('furnitures');

        if (objects.walls) scene.hideObjects('furnitures', walls.object.parent.name);
    };

    //-
    //- Public
    //-

    decoraki.simulator = {
        init: function () {
            _init();
        },

        insertObject: function (data, errorCallback) {
            _insertObject(data, errorCallback);
        },

        rotateObject: function (angle) {
            _rotateObject(angle, 'GUI');
        },

        deleteObject: function () {
            if (!_controller.selectedObject) return;
            _deleteObject(_controller.selectedObject);
        },

        selectObject: function (event) {
            var clickPosition = {};
            clickPosition.button = event.button;
            clickPosition.x = event.clientX;
            clickPosition.y = event.clientY;
            _selectObject(clickPosition);
        },

        moveObject: function (event) {
            var clickPosition = {};
            clickPosition.x = event.clientX;
            clickPosition.y = event.clientY;
            _moveObject(clickPosition);
        },

        stopMoveObject: function () {
            _stopMoveObject();
        },

        getSelected: function () {
            return _controller.selectedObject;
        },

        hideWallObj: function (event) {
            var eventData = { button: event.button };
            _hideWallObj(eventData);
        },

        showPointer: function () {
            _showTheSimsPointer();
        },

        hidePointer: function () {
            _hideTheSimsPointer();
        }
    };

})(window.decoraki = window.decoraki || {});
