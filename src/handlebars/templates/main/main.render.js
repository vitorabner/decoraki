;(function (decoraki) { // jshint ignore:line
    'use strict';

    var data = { products: decoraki.repository.getAllProducts() };
    var template = decoraki.templates.main;
    var output = template(data);
    document.getElementById('main').innerHTML = output;

})(window.decoraki = window.decoraki || {});
