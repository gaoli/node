!(function(S, $) {

    describe('attr', function() {

        var tpl = [
            '<div id="J_Test">',
                '<a href="javascript:void(0);" style="border: 1px solid #DDD;background: #F7F7F7;"></a>',
                '<div id="J_TestDiv"></div>',
                '<input type="text" id="J_TestInput" readonly value="test-input-value" />',
                '<input type="radio" id="J_TestRadio" />',
                '<input type="radio" id="J_TestRadio_2" checked />',
                '<input type="checkbox" id="J_TestCheckbox" />',
                '<input type="checkbox" id="J_TestCheckbox_2" checked="checked" />',
                '<textarea id="J_TestTextarea">test-textarea-value</textarea>',
                '<select id="J_TestSelect">',
                    '<option>1</option>',
                    '<option>2</option>',
                    '<option>3</option>',
                '</select>',
                '<select id="J_TestSelect_2" multiple>',
                    '<option>1</option>',
                    '<option>2</option>',
                    '<option>3</option>',
                '</select>',
            '</div>'
        ].join('');

        var $a,
            $div,
            $input,
            $radio,
            $radio2,
            $checkbox,
            $checkbox2,
            $textarea,
            $select,
            $select2;

        beforeEach(function() {
            $('body').append(tpl);
            $a         = $('#J_Test a');
            $div       = $('#J_TestDiv');
            $input     = $('#J_TestInput');
            $radio     = $('#J_TestRadio');
            $radio2    = $('#J_TestRadio_2');
            $checkbox  = $('#J_TestCheckbox');
            $checkbox2 = $('#J_TestCheckbox_2');
            $textarea  = $('#J_TestTextarea');
            $select    = $('#J_TestSelect');
            $select2   = $('#J_TestSelect_2');
        });

        afterEach(function() {
            $('#J_Test').remove();
        });

        describe('#attr()', function() {

            it('should return correctly for placeholder', function() {
                $input.attr('placeholder', 'test-placeholder-value');
                $input.attr('placeholder').should.equal('test-placeholder-value');
                $input.attr('placeholder', '');
                $input.attr('placeholder').should.equal('');
            });

            it('should return correctly for readonly', function() {
                $input.attr('readonly').should.equal('readonly');
            });

            it('should return correctly for radio', function() {
                ($radio.attr('radio') + 0).should.be.NaN;
            });

            it('should return correctly for style', function() {
                $a.attr('style').should.be.type('string')
            });

            it('should return undefined when get no-exist attribute', function() {
                ($input.attr('no-exist') + 0).should.be.NaN;
            });

        });

        describe('#val()', function() {

            it('should return correctly for input', function() {
                $input.val().should.be.equal('test-input-value');
            });

            it('should return correctly for textarea', function() {
                $textarea.val().should.be.equal('test-textarea-value');
            });

            it('should return correctly for radio', function() {
                $radio.val().should.be.equal('on');
                $radio2.val().should.be.equal('on');
            });

            it('should return correctly for select', function() {
                $select.val('3');
                $select.val().should.be.equal('3');
                $select2.val(['1', '3']);
                $select2.val().should.be.eql(['1', '3']);
            });

        });

        describe('#text()', function() {

            it('should set correctly', function() {
                $div.text('test-div-value');
                $div.text().should.be.equal('test-div-value');
            });

            it('should get correctly', function() {
                $div.html('<p>test</p><p>-div-</p><p>value</p>');
                $div.text().should.be.equal('test-div-value');
            });

        });

        describe('#prop()', function() {

            it('should set correctly', function() {
                $checkbox.prop('checked', true);
                $checkbox.prop('checked').should.be.true;
            });

            it('should get correctly', function() {
                $checkbox2.prop('checked').should.be.true;
                ($checkbox2.prop('no-exist') + 0).should.be.NaN;
                $checkbox2.hasProp('checked').should.be.true;
                $checkbox2.hasProp('no-exist').should.be.false;
            });

            it('should remove correctly', function() {
                $checkbox2.removeProp('checked');
                ($checkbox2.prop('checked') + 0).should.be.NaN;
            });

        });

    });

})(KISSY, KISSY.all);