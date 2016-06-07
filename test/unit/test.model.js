(function () {
    'use strict';

    var expect = chai.expect;
    var stub = sinon.stub;

    describe('decoraki.model', function () {

        var model = decoraki.model;
        var repository = test.repository;
        var collada = test.collada;

        var loader = new THREE.ColladaLoader();
        var container;

        before(function () {
            stub(loader, 'load', function (filename, callback) {
                loader.parse(collada.getFile(filename), callback);
            });

            model.init(loader);
        });

        after(function () {
            loader.load.restore();
        });

        describe('load objects', function () {
            var data = {};

            it('should load a room', function () {
                var data = repository.getRoomById(0);
                var callbacks = {};

                callbacks.ready = function (object) {
                    var room = object.children[0];
                    expect(room).to.have.property('visible', true);
                    expect(room).to.have.property('moveType', 'none');
                    expect(room).to.have.property('category', 'room');
                    expect(room).to.have.property('placeName', 'floor');
                    expect(room).to.have.property('type', 'Object3D');
                };

                model.loadModel(data, callbacks);
            });

            it('should load a furniture', function () {
                var data = repository.getProductById(0);
                var callbacks = {};

                callbacks.ready = function (object) {
                    var furniture = object.children[0];
                    expect(furniture).to.have.property('visible', true);
                    expect(furniture).to.have.property('moveType', 'floor');
                    expect(furniture).to.have.property('category', 'furniture');
                    expect(furniture).to.have.property('placeName', 'floor');
                    expect(furniture).to.have.property('type', 'Object3D');
                };

                model.loadModel(data, callbacks);
            });

            it('should load a material', function () {
                var data = repository.getProductById(1);
                var material = model.loadTextureMaterial(data);
                var color = new THREE.Color('#864038');

                expect(material).to.have.property('type', 'MeshPhongMaterial');
                expect(material).to.have.property('transparent', false);
                expect(material).to.have.property('emissive').that.deep.equals(color);
            });

        });

    });

}());
