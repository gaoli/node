!(function(S, $) {

    describe('create', function() {

        var tpl = [
            '<div id="J_Test">',
                '<p id="J_TestP_1" class="J_TestP"></p>',
                '<p id="J_TestP_2" class="J_TestP"></p>',
                '<p id="J_TestP_3" class="J_TestP"></p>',
            '</div>'
        ].join('');

        beforeEach(function() {
            $('body').append(tpl);
        });

        afterEach(function() {
            $('#J_Test').remove();
        });

        describe('#create()', function() {

            it('should return correctly for empty', function() {
                S.node.create().length.should.equal(0);
                S.node.create('').length.should.equal(0);
            });

        });

        describe('#clone()', function() {

            it('should return correctly for default', function() {
                $('.J_TestP', $('#J_Test').clone()).length.should.equal(0);
            });

            it('should return correctly for deep', function() {
                $('.J_TestP', $('#J_Test').clone(true)).length.should.equal(3);
            });

        });

    });

})(KISSY, KISSY.all);