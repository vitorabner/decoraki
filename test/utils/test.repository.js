;(function (test) {
    'use strict';

    //-
    //- Private
    //-

    var rooms = [];
    var products = [];

    //- Room
    rooms.push({
        model: 'Env0002.dae',
        moveType: 'none',
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
        moveType: 'floor',
        category: 'furniture'
    });

    products.push({
        texture: '#864038',
        category: 'paint'
    });

    //-
    //- Public
    //-

    test.repository = {
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

})(window.test = window.test || {});
