;(function (decoraki) { // jshint ignore:line
    'use strict';

    var model = decoraki.model;
    var simulator = decoraki.simulator;
    var scene = decoraki.scene;
    var control = decoraki.control;

    //- There are two options for loading 3D: Collada or JSON
    //- JSON isn't implemented yet :(
    var loader = new THREE.ColladaLoader();

    //- Set URL for textures and models(3D)
    var assetsURL = {
        models: 'http://ec2-52-67-128-55.sa-east-1.compute.amazonaws.com/assets/models',
        textures: 'http://ec2-52-67-128-55.sa-east-1.compute.amazonaws.com/assets/textures'
    };

    //- Initializers
    control.init();
    model.init(loader, assetsURL);
    scene.init();
    simulator.init();

})(window.decoraki);
