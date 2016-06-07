;(function () {
    'use strict';

    var expect = chai.expect;
    var stub = sinon.stub;
    var sandbox = sinon.sandbox;

    describe('decoraki.scene', function () {
        var scene = decoraki.scene;
        var control = decoraki.control;
        var container;
        var cube;

        before(function () {
            var geometry = new THREE.BoxGeometry(200, 200, 200);
            var material = new THREE.MeshNormalMaterial();
            cube = new THREE.Mesh(geometry, material);
            cube.name = 'cube';

            stub(control, 'createEvent');
            stub(control, 'getContainer', function () {
                container =  document.createElement('div');
                container.style.cssText = 'width:1438px;height:741px';
                document.body.appendChild(container);
                return container;
            });

            stub(control, 'checkWebGL');

            scene.init();
        });

        after(function () {
            control.createEvent.restore();
            control.getContainer.restore();
        });

        describe('add and delete', function () {

            it('should add a cube', function () {
                scene.addObject(cube);
                var sceneObject = scene.getScene();
                var object = sceneObject.getObjectByName('cube') || '';

                expect(object.name).to.equal('cube');
            });

            it('should delete a cube', function () {
                scene.deleteObject(cube);
                var sceneObject = scene.getScene();
                var object = sceneObject.getObjectByName('cube') || '';

                expect(object.name).to.be.not.ok;
            });

        });

        describe('mouse calcs', function () {

            it('should calculate mouse position in container', function () {
                var position = scene.calculateMousePosition(954, 440);

                expect(position).to.have.property('x', 0.32684283727399155);
                expect(position).to.have.property('y', -0.18758434547908243);
            });

        });

    });

}());
