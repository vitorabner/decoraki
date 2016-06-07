;(function (decoraki) { // jshint ignore:line
    'use strict';

    //-
    //- Private
    //-

    var _modelSettings = {};

    var _getTextureUrl = function (texture) {
        if (!_modelSettings.urlTextures) return texture;

        return _modelSettings.urlTextures + '/' + texture;
    };

    var _getLightMapUrl = function (folderName, lightMap) {
        var folderUrl = _modelSettings.urlModels + '/' + folderName;

        return folderUrl + '/' + lightMap;
    };

    var _getModelUrl = function (folderName, model) {
        var folderUrl = _modelSettings.urlModels + '/' + folderName;
        var modelUrl = folderUrl + '/' + model;
        if (!_modelSettings.urlModels) modelUrl = model;

        return modelUrl;
    };

    var _loadTexture = function (url, onLoadCallback, errorCallback) {
        return THREE.ImageUtils.loadTexture(url, {}, onLoadCallback, errorCallback);
    };

    var _loadModelMaterial = function (mesh, data, callbacks) {
        var texData = { map: mesh.material.map, transparent: false, emissive: '#FFF' };
        var category = {};
        var onLoadCallback = callbacks.onLoad;

        category.room = function () {
            if (data.lmUrl) {
                _loadTexture(data.lmUrl, function (lmTexture) {
                    texData.lightMap =  lmTexture;
                    mesh.material = new THREE.MeshPhongMaterial(texData);
                });

                if (onLoadCallback) onLoadCallback();
            }
        };

        category.furniture = function () {
            var materialName = mesh.material.name.toLowerCase();
            var uvs = mesh.geometry.faceVertexUvs;

            //- Sombra(pt-br) = Shadow(en)
            if (materialName.search('sombra') !== -1) {
                mesh.material.transparent = true;
                mesh.position.y = 0.01;

                return;
            }

            if (uvs.length > 1 && data.lmUrl) {
                texData.lightMap = _loadTexture(data.lmUrl, callbacks.onLoad);
            }

            //- Vidro(pt-br) = Glass(en)
            if (materialName.search('vidro') !== -1) texData.transparent = true;
            mesh.material = new THREE.MeshPhongMaterial(texData);
        };

        if (category[data.category]) category[data.category]();
    };

    var _loadTextureMaterial = function (data, callbacks) {
        var category = data.category;
        var phongMaterial = {};
        var material = {};
        var textureType = {};

        material.lightMap = data.lightMap || '';
        material.transparent = false;

        textureType.paint = function () {
            material.map = null;
            material.emissive = data.texture;
            phongMaterial = new THREE.MeshPhongMaterial(material);

        };

        textureType.texture = function () {
            if (!callbacks) callbacks = {};
            var url = _getTextureUrl(data.texture);
            material.map = _loadTexture(url, callbacks.onLoad, callbacks.error);
            material.emissive = '#fff';
            phongMaterial = new THREE.MeshPhongMaterial(material);
        };

        if (textureType[category]) textureType[category]();

        return phongMaterial;
    };

    var _setWallRotation = function (mesh, rotations) {
        var rotation = rotations[mesh.parent.name];

        if (rotation === undefined) return;

        mesh.parent.wallRotation = rotation;
    };

    var _setModelInitialState = function (object, data) {
        object.children[0].moveType = data.moveType;
        object.children[0].placeName = 'floor';
        object.children[0].category = data.category;
        object.children[0].modelId = _modelSettings.modelId;
    };

    var _initModel = function (object, data, callbacks) {
        _setModelInitialState(object, data);

        object.traverse(function (mesh) {
            if (!(mesh instanceof THREE.Mesh)) return;

            mesh.modelId = _modelSettings.modelId;

            if (data.category === 'furniture') {
                if (callbacks.addColliders) callbacks.addColliders(mesh, 'furniture');
                return;
            }

            //- meshType can be floor or walls
            var meshType = mesh.parent.name.substring(0, 5);

            if (callbacks.addColliders) callbacks.addColliders(mesh, meshType);
            _setWallRotation(mesh, data.rotations);
        });
    };

    var _loadModel = function (data, callbacks) {
        var loader = _modelSettings.loaderOption;
        loader.options.convertUpAxis = true;

        data.modelUrl = _getModelUrl(data.folderName, data.model);

        if (data.lightMap) {
            data.lmUrl = _getLightMapUrl(data.folderName, data.lightMap);
        }

        if (!callbacks) callbacks = {};

        loader.load(data.modelUrl, function (loadResult) {
            var object = loadResult.scene;

            object.traverse(function (mesh) {
                if (!(mesh instanceof THREE.Mesh)) return;
                _loadModelMaterial(mesh, data, callbacks);
            });

            _initModel(object, data, callbacks);
            _modelSettings.modelId++;

            callbacks.ready(object);
        }, callbacks.onLoad, callbacks.error);
    };

    //- Fix images with anonymous crossOrigin
    var _setImageCrossOrigin = function () {
        THREE.TextureLoader.prototype.crossOrigin = 'anonymous';
        THREE.ImageLoader.prototype.crossOrigin = 'anonymous';
        THREE.ImageUtils.crossOrigin = 'anonymous';
    };

    var _init = function (loader, assetsUrl) {
        if (!assetsUrl) {
            assetsUrl = {};
            assetsUrl.models = '';
            assetsUrl.textures = '';
        }

        _setImageCrossOrigin();
        _modelSettings.urlModels = assetsUrl.models;
        _modelSettings.urlTextures = assetsUrl.textures;
        _modelSettings.modelId = 0;
        _modelSettings.loaderOption = loader;
    };

    //-
    //- Public
    //-

    decoraki.model = {
        init: function (loader, assetsUrl) {
            _init(loader, assetsUrl);
        },

        loadModel: function (data, callbacks) {
            _loadModel(data, callbacks);
        },

        loadTextureMaterial: function (data, callbacks) {
            return _loadTextureMaterial(data, callbacks);
        }
    };

})(window.decoraki = window.decoraki || {});
