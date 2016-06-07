;(function (decoraki) { // jshint ignore:line
    'use strict';

    //-
    //- Private
    //-

    var _createGeometry = function () {
        var geo = new THREE.CylinderGeometry(0, 1.5, 1.5, 4, false);

        return geo;
    };

    var _setColor = function (geo, baseColor) { //14

        var changeVertexColor = function (faceIdx, vertexIdx, colorIdx) {
            if (!colorIdx) colorIdx = vertexIdx;
            var color = new THREE.Color(baseColor[colorIdx]);
            geo.faces[faceIdx].vertexColors[vertexIdx] = color;
        };

        for (var i = 0, len = geo.faces.length; i < len; i++) {
            changeVertexColor(i, 0);
            changeVertexColor(i, 1);
            changeVertexColor(i, 2);

            if (!(geo.faces[i] instanceof THREE.Face4)) continue;

            if ((i % 2) !== 0) return;
            changeVertexColor(i, 1, 0);
            changeVertexColor(i, 2, 1);
        }

        return geo;
    };

    var _createMaterial = function () {
        var material = new THREE.MeshBasicMaterial({
            vertexColors:THREE.VertexColors,
            side:THREE.DoubleSide
        });

        return material;
    };

    var _createMesh = function (geo, material) {
        var mesh = new THREE.Mesh(geo, material);

        return mesh;
    };

    var _createTheSimsFormat = function (bottom, top) {
        bottom.rotation.z = -Math.PI;
        top.position.set(0, 2, 0);
        top.scale.set(0.5, 0.5, 0.5);
        bottom.position.set(0, 1.25, 0);
        bottom.scale.set(0.5, 0.5, 0.5);

        var theSimsSymbol = new THREE.Mesh();
        theSimsSymbol.add(top);
        theSimsSymbol.add(bottom);

        return theSimsSymbol;
    };

    var _createTheSimsPointer = function () {
        var geometry = _createGeometry();
        geometry = _setColor(geometry, ['#47AC78', '#47AC48', '#25B618']);
        var material = _createMaterial();

        var pyramidMeshTop = _createMesh(geometry, material);
        var pyramidMeshBottom = _createMesh(geometry, material);

        var theSimsSymbol = _createTheSimsFormat(pyramidMeshTop, pyramidMeshBottom);
        theSimsSymbol.position.set(0, 0, 0);
        theSimsSymbol.scale.set(0.2, 0.4, 0.2);

        return theSimsSymbol;
    };

    //-
    //- Public
    //-

    decoraki.pointer = {
        getTheSimsPointer: function () {
            return _createTheSimsPointer();
        }
    };

})(window.decoraki = window.decoraki || {});
