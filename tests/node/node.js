!(function(S, $) {

    describe('node', function() {

        var tpl = [
            '<div id="J_Test">',
                '<p id="J_TestP_1" class="J_TestP">',
                    '<span id="J_TestSpan_1" class="J_TestSpan">',
                        '<a href="javascript:void(0);" class="J_TestA"></a>',
                    '</span>',
                    '<span id="J_TestSpan_2" class="J_TestSpan">',
                        '<a href="javascript:void(0);" class="J_TestA"></a>',
                    '</span>',
                    '<span id="J_TestSpan_3" class="J_TestSpan">',
                        '<a href="javascript:void(0);" class="J_TestA"></a>',
                    '</span>',
                    '<span id="J_TestSpan_4" class="J_TestSpan">',
                        '<a href="javascript:void(0);" class="J_TestA"></a>',
                    '</span>',
                '</p>',
                '<p id="J_TestP_2" class="J_TestP">',
                    '<span id="J_TestSpan_5" class="J_TestSpan">',
                        '<a href="javascript:void(0);" class="J_TestA"></a>',
                    '</span>',
                    '<span id="J_TestSpan_6" class="J_TestSpan">',
                        '<a href="javascript:void(0);" class="J_TestA"></a>',
                    '</span>',
                    '<span id="J_TestSpan_7" class="J_TestSpan">',
                        '<a href="javascript:void(0);" class="J_TestA"></a>',
                    '</span>',
                    '<span id="J_TestSpan_8" class="J_TestSpan">',
                        '<a href="javascript:void(0);" class="J_TestA"></a>',
                    '</span>',
                '</p>',
                '<p id="J_TestP_3" class="J_TestP"></p>',
            '</div>'
        ].join('');

        var $a,
            $p,
            $span;

        beforeEach(function() {
            $('body').append(tpl);
            $a    = $('.J_TestA');
            $p    = $('.J_TestP');
            $span = $('.J_TestSpan');
        });

        afterEach(function() {
            $('#J_Test').remove();
        });

        it('isNode', function() {
            expect(S.Node.isNode($a)).to.equal(true);
        });

        describe('#one()', function() {

            it('should return correctly for no-exist', function() {
                expect($().one()).to.equal(null);
            });

        });

        describe('#end()', function() {

            it('should return correctly for all method', function() {
                expect($p.__parent).to.equal(undefined);
                $p.all('span').end().length.should.equal(3);
            });

            it('should return correctly for one method', function() {
                $p.one('span').end().length.should.equal(3);
            });

        });
    });

})(KISSY, KISSY.all);