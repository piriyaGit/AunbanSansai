/* Flot plugin for selecting regions of a plot.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin supports these options:

selection: {
	mode: null or "x" or "y" or "xy",
	color: color,
	shape: "round" or "miter" or "bevel",
	minSize: number of pixels
}

Selection support is enabled by setting the mode to one of "x", "y" or "xy".
In "x" mode, the user will only be able to specify the x range, similarly for
"y" mode. For "xy", the selection becomes a rectangle where both ranges can be
specified. "color" is color of the selection (if you need to change the color
later on, you can get to it with plot.getOptions().selection.color). "shape"
is the shape of the corners of the selection.

"minSize" is the minimum size a selection can be in pixels. This value can
be customized to determine the smallest size a selection can be and still
have the selection rectangle be displayed. When customizing this value, the
fact that it refers to pixels, not axis units must be taken into account.
Thus, for example, if there is a bar graph in time mode with BarWidth set to 1
minute, setting "minSize" to 1 will not make the minimum selection size 1
minute, but rather 1 pixel. Note also that setting "minSize" to 0 will prevent
"plotunselected" events from being fired when the user clicks the mouse without
dragging.

When selection support is enabled, a "plotselected" event will be emitted on
the DOM element you passed into the plot function. The event handler gets a
parameter with the ranges selected on the axes, like this:

	placeholder.bind( "plotselected", function( event, ranges ) {
		alert("You selected " + ranges.xaxis.from + " to " + ranges.xaxis.to)
		// similar for yaxis - with multiple axes, the extra ones are in
		// x2axis, x3axis, ...
	});

The "plotselected" event is only fired when the user has finished making the
selection. A "plotselecting" event is fired during the process with the same
parameters as the "plotselected" event, in case you want to know what's
happening while it's happening,

A "plotunselected" event with no arguments is emitted when the user clicks the
mouse to remove the selection. As stated above, setting "minSize" to 0 will
destroy this behavior.

The plugin allso adds the following methods to the plot object:

- setSelection( ranges, preventEvent )

  Set the selection rectangle. The passed in ranges is on the same form as
  returned in the "plotselected" event. If the selection mode is "x", you
  should put in either an xaxis range, if the mode is "y" you need to put in
  an yaxis range and both xaxis and yaxis if the selection mode is "xy", like
  this:

	setSelection({ xaxis: { from: 0, to: 10 }, yaxis: { from: 40, to: 60 } });

  setSelection will trigger the "plotselected" event when called. If you don't
  want that to happen, e.g. if you're inside a "plotselected" handler, pass
  true as the second parameter. If you are using multiple axes, you can
  specify the ranges on any of those, e.g. as x2axis/x3axis/... instead of
  xaxis, the plugin picks the first one it sees.

- clearSelection( preventEvent )

  Clear the selection rectangle. Pass in true to avoid getting a
  "plotunselected" event.

- getSelection()

  Returns the current selection in the same format as the "plotselected"
  event. If there's currently no selection, the function returns null.

*/

(function ($) {
    function init(plot) {
        var selection = {
                first: { x: -1, y: -1}, second: { x: -1, y: -1},
                show: false,
                active: false
            };

        // FIXME: The drag handling implemented here should be
        // abstracted out, there's some similar code from a library in
        // the navigation plugin, this should be massaged a bit to fit
        // the Flot cases here better and reused. Doing this would
        // make this plugin much slimmer.
        var savedhandlers = {};

        var mouseUpHandler = null;
        
        function onMouseMove(e) {
            if (selection.active) {
                updateSelection(e);
                
                plot.getPlaceholder().trigger("plotselecting", [ getSelection() ]);
            }
        }

        function onMouseDown(e) {
            if (e.which != 1)  // only accept left-click
                return;
            
            // cancel out any text selections
            document.body.focus();

            // prevent text selection and drag in old-school browsers
            if (document.onselectstart !== undefined && savedhandlers.onselectstart == null) {
                savedhandlers.onselectstart = document.onselectstart;
                document.onselectstart = function () { return false; };
            }
            if (document.ondrag !== undefined && savedhandlers.ondrag == null) {
                savedhandlers.ondrag = document.ondrag;
                document.ondrag = function () { return false; };
            }

            setSelectionPos(selection.first, e);

            selection.active = true;

            // this is a bit silly, but we have to use a closure to be
            // able to whack the same handler again
            mouseUpHandler = function (e) { onMouseUp(e); };
            
            $(document).one("mouseup", mouseUpHandler);
        }

        function onMouseUp(e) {
            mouseUpHandler = null;
            
            // revert drag stuff for old-school browsers
            if (document.onselectstart !== undefined)
                document.onselectstart = savedhandlers.onselectstart;
            if (document.ondrag !== undefined)
                document.ondrag = savedhandlers.ondrag;

            // no more dragging
            selection.active = false;
            updateSelection(e);

            if (selectionIsSane())
                triggerSelectedEvent();
            else {
                // this counts as a clear
                plot.getPlaceholder().trigger("plotunselected", [ ]);
                plot.getPlaceholder().trigger("plotselecting", [ null ]);
            }

            return false;
        }

        function getSelection() {
            if (!selectionIsSane())
                return null;
            
            if (!selection.show) return null;

            var r = {}, c1 = selection.first, c2 = selection.second;
            $.each(plot.getAxes(), function (name, axis) {
                if (axis.used) {
                    var p1 = axis.c2p(c1[axis.direction]), p2 = axis.c2p(c2[axis.direction]); 
                    r[name] = { from: Math.min(p1, p2), to: Math.max(p1, p2) };
                }
            });
            return r;
        }

        function triggerSelectedEvent() {
            var r = getSelection();

            plot.getPlaceholder().trigger("plotselected", [ r ]);

            // backwards-compat stuff, to be removed in future
            if (r.xaxis && r.yaxis)
                plot.getPlaceholder().trigger("selected", [ { x1: r.xaxis.from, y1: r.yaxis.from, x2: r.xaxis.to, y2: r.yaxis.to } ]);
        }

        function clamp(min, value, max) {
            return value < min ? min: (value > max ? max: value);
        }

        function setSelectionPos(pos, e) {
            var o = plot.getOptions();
            var offset = plot.getPlaceholder().offset();
            var plotOffset = plot.getPlotOffset();
            pos.x = clamp(0, e.pageX - offset.left - plotOffset.left, plot.width());
            pos.y = clamp(0, e.pageY - offset.top - plotOffset.top, plot.height());

            if (o.selection.mode == "y")
                pos.x = pos == selection.first ? 0 : plot.width();

            if (o.selection.mode == "x")
                pos.y = pos == selection.first ? 0 : plot.height();
        }

        function updateSelection(pos) {
            if (pos.pageX == null)
                return;

            setSelectionPos(selection.second, pos);
            if (selectionIsSane()) {
                selection.show = true;
                plot.triggerRedrawOverlay();
            }
            else
                clearSelection(true);
        }

        function clearSelection(preventEvent) {
            if (selec�D�#4�3  �
� � AWAV AUATWVUS H��HH�L$ @H��H��I ��A��L��D$���$� + �D�yA�� �����D ��A��E�� ~'D�|$ �t$(L 0H� �H��L��E �������A�� �A�����%F�d>���tcD�C�A;��� Hc� ��E;��� Mc� J�D�H�D �J�T��� t.�W;�s gL�l�D;(�s] r��Nϋ ���d��H� �A��M���"�@A��(A�1�� �2�(�&�dK@I PH
P� ���K�I��E���D��JH��M�JA+�DK��F�$2D�G D�d$(I�L���L�������|���d$@�ہ�nE;��(@2Ic�H�D@��D$8E=Ac(�E��E;�¹A��@E;����ZI�c� _ցQ��8@�dy��|�AqA���e�\@����$�
&U�
 }o taxMc�B
�&��A��L��c�L��*���<D;ssi�
�{��csV�@�@}��A�vc�vŀ�A(0���8�4�6b<���:  A��:0�b���`�aL� �H��M��AL���a�`���bL��$�@!;���/��+�D �iA����* �c`� u4��C��jIA'�M��M�`�H�`HD�� uk�k�^���(���,  Eo
� ��䉜�Q��	 �@��L���D�����B����u5��(��ˡ^Lb� �X�D����0E�M	��& A�u���/������uo�+au`9D�9��7A�0�}F᥋N��[@����L@y��L�,0 �@(A�T>�  H��w�"���|'��ㆁ�J�h��`L��H�c��D HЀ��� ��� E��u6~D 0��F� �E�m�7G �h	��ED ��A���\� �A+���F� )D�l��T$�XA� H��%����a��D$\��y�� X  ��\"VAF��;�8���]��@|�A���LL�L$P`LD;�ă�@Ic�f��ΐPM����Ǎ���
@\���\D \D;L$PL�J�D`\�Mc��E�^1HP 4������;�}tMcšc�H��H�@�OcȶHOiEq
"�`Ic���L @A;��6�P!	L҃�I��Lw^�I`\L�@��f  ��`	2~9PY��+��iA+�;�5�p	� H&(!L0��'%��A0���=1�L邴�.E;�}(#�d���E@)�$��D��A;0���Pn-#��L�]�PQWVa� �I���|$`�� t[D�B�f�s[I�D�A; �sNLc�N�$T�@T�@zD�`��@zVD;� s/H�\�;�s&��A���G`H�΋�p�:� q� [^�_��� �3�;�(23���$����$!;��z� V;��"}� Lc�@� ;�sqLc�J(�T���ɐ!�	�!~H0�J�L��
L�N�D� �t/D�G���s4J�t����s*������\1ϋ�`L���� 1(s8!?�c �R UAV#PH�l$ pH�e�H�M6�0 �� � �D�u��E8H��t��;U8H@;�u	��� �$E82���{�`IH��p   �I��tDH�M�	H�Q!�H�B��u H�� ��0	B�p8H��/aD����"p���O?�2R1[0A�L6�@0pOMs�D$0R 0H��x��H�e��A^]�6��ipl$8H�mp��tVQ���#�@��H��eo��ZQ�H� Rko��	  ��2���1�� A1�:�H��r��̴$8|3�ФP�� �X2����u"`�gPf� �H�H���Y���H��BA@R  H�@`�P����ro�b��Q �U"q�Eq� L��
3(��A�N`H �K���M u� �`���(Y������	�L!��;UM��t [�u�@ �����Rؐ6蝢 ���H0���g� p���Rl0�!!B� Hb����o� �d�I�E �C����.VH��0$%P���;2 �#��{ Sq0^�WN(@$�X� 3�H�O�Gb!�Ga ���R�%�Ȑ�6 B�5�@ D  �9� �ARa�H��I��2	�G�Q�H���b� (C�P�ыA��� ;A0���  8;$B�����H@�@H�t�P� �H�������B� �NcV �� �Q;�}� ��A;�� ����3�ÐWV`&�A�0��W���F���~���)�/xH ���Ĺ�3��QP9�sVH;�u�'�
xN�H��(tH���3�ĩD�3) = N��H9
t3��H��� W�AxۂM�H`�U ��a	!2a�H���  H9 tH��H�� �bW��H�� �o� D$XH�NH �L$hH�M  ��   u �H���UX ��(���<� � � ��@H��� �PH��fB(H�Of8 H��H�T$@L�D$ H� @@�P �� H��x[]^_ù ��1��3�  WVH ��HH��H� |$(� &3�`�H��� {� H��H��u	8H�%H�H� I0H�	H��d��H9t� ��tf	���9t�V���h��sρs ��q�(� pIo�0o	n�AWAVW�VUS�r�˄r�r ��H��I���A��+�$�� �hE��D;@�|nD� J� E;�stIc֐H�R@ ��ggL�BL��D$P���'V�eXT$8+ee��tA�H��XfA^A_�A�b�@}����I�p�T��D2��3����33}?3F�3�ƁN3�S3�4�3J(A� ���N@�9�����D�H�� H��H��t H��do�H@9t�p�؁�v`o���P;�u+ � 	��R����H9u" ����<��H����  ��@H��u���C �т��ɂ�H��$H� ��`E� :Y �p��
��`tH��a���1�MD�H493��B@��V�@v!{��y��R��P(���@����aPH� (�_�#!;���@��x  ��"P H��H��t H�mc�(M -�(*B�	h���@Q��L��`q�jo�����b �I��L��3����I��I ��I�H��.Ȣ@9�%Ր%���%z�"9�%�b���%���L�%րB�%̉"���%"����+A��M@	���Hc�H���t� �m��� �H������H��� ���P��A���a����K$l:ًB�%���w� Y�a�����B�@ v�!�	�	J��7'B�v�
R(�
�O� 9�
���
�J$�H�T�t`[7c[�B�pH���@C`��l���li�1��r(��~@��@ WZVA�0A� ���t�9��
@�uA@���H� ω�u� �H��`�0[��	� H�쁠ȋ��D$ �3 L�I�iQL�A�c��?�:����r��H�/��p�9 	A���uUgN`V`F`��ee�D � ����G�j��j� `��ge���H��L��B\���������(��w0$fp���hP �U�Hp����p��I=R�L$ ����?����`9�@@H��H�O���� �L�"u�Q0�詢�`%(W�)%
p
��� �� 3ۃ ~ ~GP�; Y��@Hc �H��H�L��@�H��Hq� �P &
���b,��;�^|��Q+�-�# QW��* B�YWh ���,ЋA ;�}���x�j-�2 �5�@�~���?:P��B 5N��|$ E3�D� L��3�E3��� 1?/6����:�@�� �-��`�@�D�K ��Q� N D�FL���P�HC/ �;���A��A��I����}� Q�@ �J$��T�� &7 � N+�;�}
$�Qd&N ��D��L�̈́�s0�F��H4:�(D�L��3� c{@�H����r�[���
i�
�#�
� �
��%�
�2<���
�����~�@��p���A��������"�����;ϵ(� ��~J�V+�׉V;�}0�
N�O��88+Ӊ T$ 3�P (� ;I��L�D $8D����VD���n[��@��	P�4@H@'��ً�;s4rT�a	S��ʉS;��JK���V����C�S$3���@f�3�A  H�t$@ ;PsHcҁ�9|�I(��C�!PA
����"��AUAT4�=��P
��1ǡ�� �	 E3��A�`�s}7�H�KD;qpA^��A�~A�.�uA(�rAt�D |�ABH�*A\A]��E �~��A�P�D;{y&mןGu�^ A�FD��A��G` @�C ;�0J D;���  Mc�I���J�D �L �L�Ђt ;���00Ic�H0 ��J�H�E��E��
�UP*�D�CE+��A@�U!P'CA�+�D�s��;�\8�"P��� �%����6H �H;p��t@