;(function (decoraki) { // jshint ignore:line
    'use strict';

    //-
    //- Private
    //-

    var _degreesToRadians = function (angle) {
        return angle * (Math.PI / 180);
    };

    var _radiansToDegrees = function (angle) {
        return (angle * 180) / Math.PI;
    };

    //-
    //- Public
    //-

    decoraki.geometry = {
        degreesToRadians: function (angle) {
            return _degreesToRadians(angle);
        },

        radiansToDegrees: function (angle) {
            return _radiansToDegrees(angle);
        }
    };

})(window.decoraki = window.decoraki || {});
