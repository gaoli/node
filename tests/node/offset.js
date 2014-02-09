!(function(S, $) {

    describe('traversal', function() {

        var tpl = [
            '<div id="J_Test">',
                '<div id="J_TestDiv" style="width:100px; height:100px; overflow:scroll;">',
                    '<p id="J_TestP_1" class="J_TestP" style="width:300px; height:100px;">',
                    '</p>',
                    '<p id="J_TestP_2" class="J_TestP" style="width:300px; height:100px;">',
                    '</p>',
                    '<p id="J_TestP_3" class="J_TestP" style="width:300px; height:100px;">',
                    '</p>',
                '</div>',
            '</div>'
        ].join('');

        var $p,
            $div,
            $win;

        beforeEach(function() {
            $('body').append(tpl);
            $p   = $('.J_TestP');
            $div = $('#J_TestDiv');
            $win = $(window);
        });

        afterEach(function() {
            $('#J_Test').remove();
        });

        it('scrollTop', function() {
            $div.scrollTop(100);
            $div.scrollTop().should.equal(100);
        });

        it('scrollLeft', function() {
            $div.scrollLeft(100);
            $div.scrollLeft().should.equal(100);
        });

    });

})(KISSY, KISSY.all);