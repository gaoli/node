!(function(S, $) {

    describe('selector', function() {

        var tpl = [
            '<div id="J_Test">',
                '<p id="J_TestP">',
                    '<span class="J_TestSpan">',
                        '<a href="javascript:void(0);"></a>',
                    '</span>',
                    '<span class="J_TestSpan">',
                        '<a href="javascript:void(0);"></a>',
                    '</span>',
                    '<a class="J_TestA" href="javascript:void(0);"></a>',
                    '<em class="J_TestEm"></em>',
                '</p>',
            '</div>'
        ].join('');

        var doc = document;

        beforeEach(function() {
            $('body').append(tpl);
        });

        afterEach(function() {
            $('#J_Test').remove();
        });

        describe('#query()', function() {

            it('should return correctly for #id', function() {
                S.query('#J_TestP', doc)[0].id.should.be.equal('J_TestP');
                S.query('#J_TestP', doc).length.should.be.equal(1);
            });

            it('should return correctly for .cls', function() {
                S.query('.J_TestSpan', doc)[0].className.should.be.equal('J_TestSpan');
                S.query('.J_TestSpan', doc).length.should.be.equal(2);
            });

            it('should return correctly for tag', function() {
                S.query('a', doc.getElementById('J_Test'))[0].nodeName.should.be.equal('A');
                S.query('a', doc.getElementById('J_Test')).length.should.be.equal(3);
            });

            it('should return correctly for tag.cls', function() {
                S.query('a.J_TestA', doc)[0].nodeName.should.be.equal('A');
                S.query('a.J_TestA', doc).length.should.be.equal(1);
            });

            it('should return correctly for #id .cls', function() {
                S.query('#J_TestP .J_TestSpan', doc)[0].className.should.be.equal('J_TestSpan');
                S.query('#J_TestP .J_TestSpan', doc).length.should.be.equal(2);
            });

            it('should return correctly for #id tag', function() {
                S.query('#J_TestP a', doc)[0].nodeName.should.be.equal('A');
                S.query('#J_TestP a', doc).length.should.be.equal(3);
            });

            it('should return correctly for #id tag.cls', function() {
                S.query('#J_TestP a.J_TestA', doc)[0].nodeName.should.be.equal('A');
                S.query('#J_TestP a.J_TestA', doc).length.should.be.equal(1);
            });

            it('should return empty when context is null', function() {
                S.query('J_TestSelector', null).length.should.be.equal(0);
            });

        });

        describe('#all()', function() {

            it('should return correctly for fragment', function() {
                var $node = $('<div><p id="J_TestP"><span></span></p><div>');
                $node.all('#J_TestP').length.should.be.equal(1);
                $node.all('span').length.should.be.equal(1);
            });

            it('should return correctly for NodeList', function() {
                var $p = $('#J_TestP');
                $($p[0].children).length.should.be.equal(4);
            });

            it('should return correctly for comma', function() {
                $('.J_TestSpan, .J_TestSpan a', doc).length.should.be.equal(4);
                $('#J_TestP a, .J_TestSpan a', doc).length.should.be.equal(3);
                $('a, em', $('#J_TestP, .J_TestSpan')).length.should.be.equal(4);
            });

        });

        describe('#one()', function() {

            it('should return correctly for fragment', function() {
                var $node = $('<div><p id="J_TestP"><span id="J_TestSpan"></span></p><p><span></span></p><div>');
                $node.one('p')[0].id.should.be.equal('J_TestP');
                $node.one('span')[0].id.should.be.equal('J_TestSpan');
            });

        });

    });

})(KISSY, KISSY.all);