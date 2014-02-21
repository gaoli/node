!(function(S, $) {

    describe('style', function() {

        var tpl = [
            '<div id="J_Test">',
                '<a href="javascript:void(0);"></a>',
            '</div>'
        ].join('');

        var $a;

        beforeEach(function() {
            $('body').append(tpl);
            $a = $('#J_Test a');
        });

        afterEach(function() {
            $('#J_Test').remove();
        });

        it('css', function() {
            $('#J_Test').css('zIndex', 10);
            $('#J_Test').css('z-index').should.equal('10');
            $('#J_Test').css('z-index', 20);
            $('#J_Test').css('zIndex').should.equal('20');
        });

    });

})(KISSY, KISSY.all);