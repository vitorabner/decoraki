(function () {
    'use strict';

    var expect = chai.expect;

    describe('decoraki.geometry', function () {

        var geometry = decoraki.geometry;

        describe('conversions', function () {

            it('should convert degrees to radians', function () {
                var radian = geometry.degreesToRadians(180);

                expect(radian).to.equal(Math.PI);
            });

            it('should convert radians to degrees', function () {
                var degree = geometry.radiansToDegrees(Math.PI);

                expect(degree).to.equal(180);
            });

        });

    });

}());
