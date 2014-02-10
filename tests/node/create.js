!(function(S, $) {

    describe('create', function() {

        var tpl = [
            '<div id="J_Test">',
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

    });

})(KISSY, KISSY.all);