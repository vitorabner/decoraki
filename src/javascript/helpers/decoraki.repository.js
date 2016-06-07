;(function (decoraki) { // jshint ignore:line
    'use strict';

    //-
    //- Private
    //-

    var rooms = [];
    var products = [];

    //- Room
    rooms.push({
        model: 'Env0002.dae',
        lightMap: 'Env0002_LM.jpg',
        folderName: 'room',
        moveType: 'none',
        descriptionName: 'Retangular Room',
        category: 'room',
        rotations: {
            walls1: 270,
            walls2: 180,
            walls3: 90,
            walls4: 360
        }
    });

    //- Products
    products.push({
        model: 'Sofa01.dae',
        lightMap: 'Sofa01_LM.jpg',
        folderName: 'Sofa01',
        moveType: 'floor',
        descriptionName: 'Kael The Invoker',
        descriptionImage: 'invoker.jpg',
        category: 'furniture'
    });

    products.push({
        model: '1.dae',
        lightMap: '1_LM.jpg',
        folderName: '1',
        moveType: 'floor',
        descriptionName: 'y=cos(x^2)',
        descriptionImage: 'ycosx2.jpg',
        category: 'furniture'
    });

    products.push({
        model: '6.dae',
        lightMap: '6_LM.jpg',
        folderName: '6',
        moveType: 'floor',
        descriptionName: 'Gimli The Dwarf',
        descriptionImage: 'gimli.jpg',
        category: 'furniture'
    });

    products.push({
        model: '7.dae',
        lightMap: '7_LM.jpg',
        folderName: '7',
        moveType: 'floor',
        descriptionName: 'Team Cap FTW',
        descriptionImage: 'teamcap.jpg',
        category: 'furniture'
    });

    products.push({
        model: 'Quadro.dae',
        folderName: 'Quadro',
        moveType: 'both',
        descriptionName: 'Monkey D. Luffy',
        descriptionImage: 'photo.jpg',
        category: 'furniture'
    });

    products.push({
        texture: '#864038',
        descriptionName: 'Deadpool',
        descriptionImage: 'deadpool.svg',
        category: 'paint'
    });

    products.push({
        texture: 'Pastilha03.jpg',
        descriptionName: 'RG9uJ3Rkb3VidG1l',
        descriptionImage: 'RG9uJ3Rkb3VidG1l.jpg',
        category: 'texture'
    });

    products.push({
        texture: 'Por0008.jpg',
        descriptionName: 'Silver Surfer',
        descriptionImage: 'silversurfer.jpg',
        category: 'texture'
    });

    //-
    //- Public
    //-

    decoraki.repository = {
        getRoomById: function (id) {
            return rooms[id];
        },

        getAllRooms: function () {
            return rooms;
        },

        getAllProducts: function () {
            return products;
        },

        getProductById: function (id) {
            return products[id];
        }
    };

})(window.decoraki = window.decoraki || {});
