;(function (decoraki) { // jshint ignore:line
    'use strict';

    var repository = decoraki.repository;
    var geometry = decoraki.geometry;

    //-
    //- Private
    //-

    var _el = {};
    var _isMobile = false;

    var _initElements = function () {
        _el.productList = document.querySelector('.product-list');
        _el.container = document.querySelector('.scene__canvas');
        _el.menu = document.querySelector('.scene__menu-action');
        _el.messages = document.querySelector('.scene__menu-message');
        _el.range = _el.menu.querySelector('input[type="range"]');
    };

    var _initMobile = function () {
        var products = document.querySelector('.simulator__products');
        products.classList.add('simulator__products--hide');
    };

    var _checkMobile = function () {
        _isMobile = isMobile.any;
    };

    var _setMenuState = function (state) {
        if (state === 'hide') {
            _el.menu.classList.add('menu--hide');
            return;
        }

        _el.menu.classList.remove('menu--hide');
    };

    var _setMessageState = function (state, msg) {
        if (state === 'hide') {
            _el.messages.classList.add('menu--hide');
            return;
        }

        _el.messages.classList.remove('menu--hide');
        _el.messages.firstChild.nextSibling.innerHTML = msg;
    };

    var _createEvent = function (origin) {
        var events = {};

        events.canvas = function () {
            var $canvas = _el.container.querySelector('canvas');

            $canvas.addEventListener('dragover', function (event) {
                event.preventDefault();
            });

            $canvas.addEventListener('drop', function (event) {
                event.preventDefault();
                event.stopPropagation();

                var id = event.dataTransfer.getData('text');
                var product = repository.getProductById(id);

                event.dataTransfer.clearData();
                decoraki.simulator.insertObject(product);
            });
        };

        events.messages = function () {
            _el.messages.addEventListener('click', function (event) {
                var $target = event.target;
                var text = $target.textContent.toLowerCase();
                if (text === 'close') _setMessageState('hide');
            });
        };

        events.menu = function () {
            _el.range.addEventListener('input', function (event) {
                var $target = event.target;
                var angleRad = geometry.degreesToRadians($target.value);

                decoraki.simulator.rotateObject(angleRad);
            });

            //- IE
            _el.range.addEventListener('change', function (event) {
                var $target = event.target;
                var angleRad = geometry.degreesToRadians($target.value);

                decoraki.simulator.rotateObject(angleRad);
            });

            _el.menu.addEventListener('click', function (event) {
                var $target = event.target;
                var text = $target.textContent.toLowerCase();

                if (text === 'delete') decoraki.simulator.deleteObject();
                if (text === 'close') {
                    _setMenuState('hide');
                    decoraki.simulator.hidePointer();
                }
            });
        };

        events.productList = function () {
            _el.productList.addEventListener('dragstart', function (event) {
                var $target = event.target;

                if ($target.classList.contains('product__img')) {
                    var id = $target.parentNode.parentNode.dataset.productId;
                    event.dataTransfer.setData('text', id);
                }
            });

            _el.productList.addEventListener('click', function (event) {
                var $target = event.target;

                if (event.target.classList.contains('btn')) {
                    var id = $target.parentNode.dataset.productId;
                    var product = repository.getProductById(id);

                    decoraki.simulator.insertObject(product);
                }
            });
        };

        events.simulator = function () {
            _el.container.addEventListener('mousedown', decoraki.simulator.selectObject);
            _el.container.addEventListener('mousemove', decoraki.simulator.moveObject);
            _el.container.addEventListener('mouseup', decoraki.simulator.stopMoveObject);
            _el.container.addEventListener('mousemove', decoraki.simulator.hideWallObj);
        };

        events.scene = function () {
            window.addEventListener('resize', decoraki.scene.resizeScene);
        };

        if (events[origin]) events[origin]();
    };

    var _initEvents = function () {
        _createEvent('messages');
        _createEvent('scene');

        if (_isMobile) return;

        _createEvent('productList');
        _createEvent('menu');
    };

    var _init = function () {
        _checkMobile();
        _initElements();
        _initEvents();
        if (_isMobile) _initMobile();
    };

    var _setRangeValue = function (value) {
        var rotationDegree = geometry.radiansToDegrees(value);
        _el.range.value = rotationDegree;
    };

    var _showTip = function (tipMessage) {
        var tip = tipMessage || '<div><b>Right mouse button</b>: Camera controls</div>' +
                                '<div><b>Left mouse button</b>: Select and drag</div>';

        _setMessageState('show', tip);
    };

    //-
    //- Public
    //-

    decoraki.control = {
        init: function () {
            _init();
        },

        createEvent: function (origin) {
            _createEvent(origin);
        },

        setMenuState: function (state) {
            _setMenuState(state);
        },

        setMessageState: function (state, msg) {
            _setMessageState(state, msg);
        },

        setRangeValue: function (value) {
            _setRangeValue(value);
        },

        getContainer: function () {
            return _el.container;
        },

        isMobile: function () {
            return _isMobile;
        },

        checkWebGL: function () {
            return !Detector.webgl || !Detector.canvas;
        },

        getWebGLErrorMessage: function () {
            return Detector.getWebGLErrorMessage();
        },

        showTip: function (tipMessage) {
            _showTip(tipMessage);
        }
    };

})(window.decoraki = window.decoraki || {});
