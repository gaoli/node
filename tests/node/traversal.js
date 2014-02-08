!(function(S, $) {

    describe('traversal', function() {

        var tpl = [
            '<div id="J_Test">',
                '<div id="J_TestDiv">',
                    '<p id="J_TestP_1" class="J_TestP">',
                        '�����ı�',
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
                        '�����ı�',
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
                '</div>',
            '</div>'
        ].join('');

        var $a,
            $p,
            $div,
            $span,
            $span1,
            $span8;

        beforeEach(function() {
            $('body').append(tpl);
            $a     = $('.J_TestA');
            $p     = $('.J_TestP');
            $div   = $('#J_TestDiv');
            $span  = $('.J_TestSpan');
            $span1 = $('#J_TestSpan_1');
            $span8 = $('#J_TestSpan_8');
        });

        afterEach(function() {
            $('#J_Test').remove();
        });

        it('first', function() {
            $p.first()[0].id.should.be.equal('J_TestSpan_1');
            $p.first('#J_TestSpan_4')[0].id.should.be.equal('J_TestSpan_4');
        });

        it('last', function() {
            $p.last()[0].id.should.be.equal('J_TestSpan_4');
            $p.last('#J_TestSpan_1')[0].id.should.be.equal('J_TestSpan_1');
        });

        it('parent', function() {
            $a.parent().length.should.be.equal(1);
            $a.parent()[0].id.should.be.equal('J_TestSpan_1');

            $a.parent('p').length.should.be.equal(1);
            $a.parent('p')[0].id.should.be.equal('J_TestP_1');

            $a.parent('.J_TestSpan').length.should.be.equal(1);
            $a.parent('.J_TestSpan')[0].id.should.be.equal('J_TestSpan_1');

            $a.parent('p.J_TestP span').length.should.be.equal(1);
            $a.parent('p.J_TestP span')[0].id.should.be.equal('J_TestSpan_1');

            $a.parent([]).length.should.be.equal(6);
            $a.parent(['div']).length.should.be.equal(2);
            $a.parent(['div', 'p']).length.should.be.equal(3);
            $a.parent(['div', '#J_TestDiv']).length.should.be.equal(2);

            $('body').parent().length.should.be.equal(1);
            $('body').parent()[0].should.be.equal(document.documentElement);

            $a.parent('no-exist').should.be.eql([]);
        });

        it('next', function() {
            $span1.next().length.should.be.equal(1);
            $span1.next()[0].id.should.be.equal('J_TestSpan_2');

            $span1.next('#J_TestSpan_4').length.should.be.equal(1);
            $span1.next('#J_TestSpan_4')[0].id.should.be.equal('J_TestSpan_4');
        });

        it('prev', function() {
            $span8.prev().length.should.be.equal(1);
            $span8.prev()[0].id.should.be.equal('J_TestSpan_7');

            $span8.prev('#J_TestSpan_5').length.should.be.equal(1);
            $span8.prev('#J_TestSpan_5')[0].id.should.be.equal('J_TestSpan_5');
        });

        it('children', function() {
            $p.children().length.should.be.equal(4);
            $p.item(2).children().length.should.be.equal(0);
        });

        it('siblings', function() {
            $span.siblings().length.should.be.equal(3);
            $div.siblings().length.should.be.equal(0);
        });

        it('contents', function() {
            $p.contents().length.should.be.equal(6);
            $p.item(2).contents().length.should.be.equal(0);
        });
    });

})(KISSY, KISSY.all);