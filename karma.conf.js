module.exports = function(config) {
    config.set({

        client: {
            captureConsole: false
        },

        plugins: [
            'karma-chai',
            'karma-sinon',
            'karma-mocha',
            'karma-chrome-launcher'
        ],

        frameworks: ['mocha', 'sinon', 'chai'],

        files: [
            //- lib
            "lib/three.js/build/three.js",
            "lib/ColladaLoader/index.js",
            "lib/isMobile/isMobile.min.js",
            "lib/detector/index.js",

            //- app
            "src/javascript/helpers/*.js",
            "src/javascript/control/*.js",
            "src/javascript/models/*.js",
            "src/javascript/scene/*.js",
            "src/javascript/simulator/*.js",

            //- test
            'test/utils/**/*.js',
            'test/unit/**/*.js'
        ],

        reporters: ['progress'],
        browsers: ['Chrome'],

        singleRun: false
    });
}
