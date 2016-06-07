;(function () {
    'use strict';

    var expect = chai.expect;
    var sandbox = sinon.sandbox;

    describe('decoraki.simulator', function () {

        var simulator = decoraki.simulator;
        var model = decoraki.model;
        var scene = decoraki.scene;
        var control = decoraki.control;

        var collada = test.collada;
        var repository = test.repository;

        var controlSandbox = sinon.sandbox.create();
        var colladaSandbox = sinon.sandbox.create();

        before(function () {
            var loader = new THREE.ColladaLoader();

            controlSandbox.stub(control, 'createEvent');
            controlSandbox.stub(control, 'setMenuState');
            controlSandbox.stub(control, 'setMessageState');
            controlSandbox.stub(control, 'showTip');
            controlSandbox.stub(control, 'setRangeValue');

            controlSandbox.stub(control, 'getContainer', function () {
                var container =  document.createElement('div');
                container.classList.add('scene__canvas');
                container.style.cssText = 'width:1438px;height:741px';
                document.body.appendChild(container);
                return container;
            });

            colladaSandbox.stub(loader, 'load', function (filename, callback) {
                loader.parse(collada.getFile(filename), callback);
            });

            model.init(loader);
            scene.init();
            simulator.init();
        });

        after(function () {
            controlSandbox.restore();
            colladaSandbox.restore();
        });

        describe('insert an object', function () {

            it('should insert a room', function () {
                simulator.insertObject(repository.getRoomById(0));
                var newRoom = simulator.getSelected();

                expect(newRoom).to.be.ok;
            });

            it('should insert a furniture', function () {
                simulator.insertObject(repository.getProductById(0));
                var newFurniture = simulator.getSelected();

                expect(newFurniture).to.be.ok;
            });
        });

        describe('select', function () {

            it('should select a wall', function () {
                simulator.selectObject({ button: 0, clientX: 702, clientY: 349 });

                expect(simulator.getSelected().name).to.equal('walls02_180');
            });

            it('should select a floor', function () {
                simulator.selectObject({ button: 0, clientX: 702, clientY: 509 });

                expect(simulator.getSelected().name).to.equal('floor');
            });

            it('should select a sofa', function () {
                simulator.selectObject({ button: 0, clientX: 734, clientY: 428 });

                expect(simulator.getSelected().name).to.equal('Sofa01');
            });
        });

        describe('move', function () {

            it('should move the sofa', function () {
                simulator.selectObject({ button: 0, clientX: 734, clientY: 428 });
                simulator.moveObject({ clientX: 765, clientY: 378 });
                simulator.stopMoveObject();
                simulator.selectObject({ button: 0, clientX: 765, clientY: 378 });

                expect(simulator.getSelected().name).to.equal('Sofa01');
            });
        });

        describe('rotate', function () {

            it('should rotate the sofa', function () {
                simulator.selectObject({ button: 0, clientX: 765, clientY: 378 });
                simulator.rotateObject(Math.PI);

                expect(simulator.getSelected().rotation._y).to.equal(Math.PI);
            });
        });

        describe('delete', function () {

            it('should delete the sofa', function () {
                simulator.selectObject({ button: 0, clientX: 765, clientY: 378 });
                simulator.deleteObject();
                simulator.selectObject({ button: 0, clientX: 765, clientY: 378 });

                expect(simulator.getSelected().name).to.equal('floor');
            });
        });

    });

}());
