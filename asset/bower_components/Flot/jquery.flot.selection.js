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
            if (selecÃD€#4é3  è
Á Ì AWAV AUATWVUS HƒìHH‰L$ @H‹éH‹ÚI ‹øA‹ñL‹´D$¸†Œ$° + ÎDyA‹Ï ‹ÑÁêÑD ‹âAÑüE…ä ~'D‰|$ ‰t$(L 0H‹ ÍH‹ÓL‹ÇE ‹ÌèÖıÿÿAÿÌ ÙAƒÿœ€%Fd>€ÎôtcD‹C€A;ğƒ– HcÎ ÓËE;àƒ… McÄ J‹DÃH‰D ËJ‰T€…ÿ t.‹W;òs gL‹lÏD;(âs] rÇÀNÏ‹ Öèíd‡ÿH‹ ÏA‹ÔM‹Åè"ß@AÿÏ(A¹1À† è2Á(Á&dK@I PH
PèŠ ÌÌ×KòI‹ØE‹ĞñD‹¼JHÀÁM€JA+ÎDKÑúF$2DÀG D‰d$(IÖL‹ÃÀL‹ÏèÀ°ƒ’|Œöd$@Û‹nE;åƒ(@2IcÌH‹D@…‰D$8E=Ac(€E‹çE;ôÂ¹AÿÆ@E;õƒêÀZI´cÖ _ÖQ“8@´dyÆÅ|ÔAqA¾§Ãe€\@°‹ÏÀ$Á
&UÉ
 }o taxMcÆB
Â&ÀÁA‰ÂL€ÌcÌL‰Á*ÀÀ€<D;ssi€
Ã{ÁöcsVÀ@‘@}‹ËAÀvcÁvÅ€ÔA(0èà 8Œ4à6b<¨Îè€:  A‹Æ:0¹b‡ÿæ`úaL‹ ùH‹êM‹ğAL‹ùÀaá`‹œ¢bL‹¤$À@!;÷€/‹Î+ÏD iAƒı†* „c`¡ u4‰ÃC‰£jIA'ÕM‹ÆM‹`ÌH`HDÿà ukÁk^ÿÀ(ÉèÙ,  Eo
À ‹Îä‰œâQ‰Œ	 @ L‰¤‹DÀÈøÿBÿ…Ûu5—¤(ŠÿË¡^LbÆ èXÀD‹è0EM	†è& AuÿÑÀ/ş¯Ãâuo›+au`9D€9  7Aƒ0ş}Fá¥‹NèÈ[@°ĞÑâªL@y¨ÀL ,0 ±@(AT>ÿ  H‹w¡"‹Íè™|'Š¯ã†€Jì…há«`L‹ñH‹c´éD HĞ€á…Øà á‡àà E…ÿu6~D 0‚ F ÑEÍm 7G  h	•ÀED ‹íA‹ÄÀ\‹ ÈA+ÍÑùF )D‰lÁ‡T$XAÙ H€¬%—Á‹aà‹D$\à«y«  X  ÁÈ\"VAF‹ ;Ğ8ƒ¬ ]¢â@|ëAÿÅÀLL‹L$P`LD;èÄƒ‰@IcÕfÀÎPM‹ÁÀÇˆÄë
@\ÿÈà\D \D;L$PLƒJÀD`\¸McÁ’EÀ^1HP 4áÁáˆ±;è}tMcÅ¡cÈH‹²HÕ@©OcÈ¶HOiEq
"á`IcÍÀËL @A;Àƒ6ËP!	LÒƒ”IÕèLw^’I`\L€@œèf  ÿÈ`	2~9PY‹È+ÍĞiA+Õ;Ê5¥p	ğ H&(!L0™è'%ŠÿA0‹íë=1ğLé‚´À.E;ì}(#¡d¯‹ÃE@)ì$ŠÿD‹àA;0ìŒ¥Pn-#ÃèL®]¯PQWVa €I‹ğ‹|$`°– t[D‹BĞfÈs[Iñ”DÊA; øsNLcÇN‹$TÂ@TÊ@zDÂ`‰ö@zVD;Ê s/H‹\Î;ús&ÔÎA‹ÑèG`H‹Î‹×pè:À q‹ [^ğ_ÃèĞ ñ3ô;‚(23ø‹œ$€à‹¬$!;İ„zá V;êƒ"}  Lcõ@ö ;ÚsqLcûJ(‹Tş°™É!Ï	–!~H0şJ‹LöĞ
LşN‰Dö ÿt/D‹GÀˆØs4J‹t¢ÿÀès*°÷’…Óè“\1Ï‹Õ`L‹Æè†À 1(s8!?èc £R UAV#PHl$ pH‰eÈH‰M6Ø0 ğú ƒ –D‹uà’E8H…Àtèâ;U8H@;Âu	èÔÑ ‰$E82Šºå{è‰`IH‹ˆp   ¶I…ÉtDH‹Mà	H‹Q!€H‹BÀu H– ÜèŸ0	B‡p8H À/aD‹ÎèĞ"pŠÿëO?ğ2R1[0AL6ÿ@0pOMsÇD$0R 0H‹øxğHeàA^]Ã6€¥ipl$8HmpÁètVQĞÎ#—@‹òH‹ñeoÿèœZQøH‹ Rkoÿ¹	  èÀ2Èè™1‹Ğ A1š:‘HÏèrĞÌÌ´$8|3ÀĞ¤P–Ğ àX2‚€»èu"`ëgPfâ ‘H‹H‹€Yÿ„ÀH„ÒBA@R  H‹@`ÿPªœÏroÿbº Q èU"q“Eqà L‹À
3(ÒèA²N`H ‹K÷Á°M uë ‰`ÿèà(Y‡ÿÓº¡è	L!×è;UMáÈt [Åu¥@ Îà´à RØ6è¢ èÀÂH0‹×ègÒ pºĞèRl0ë!!B Hb‹€ÎèoÕ ×dèI‚E àC²ÅÃÁ.VHƒì0$%P¨Îè;2 ±#á¤{ Sq0^òWN(@$ÒXø 3ÉH‰OÇGb!ÇGa ñëóRÑ%èÈÒ6 BÂ5Á@ D  ’9ò ÇARaıH¬‹I 2	G£Q HƒÂÒbÇ (CôPàÑ‹A€âŒÇ ;A0ù€  8;$B€¸àæÀH@@Ht°P‹ ûH¥èïğèêıBÃ ’NcV ò  ‹Q;Â}ÿ À‰A;Âœ À¶ÀÃ3ÀÃWV`&ñA0Š´W‡ÿÇFñâ‰~ˆòø)ô/xH ˆ°Ä¹á3Àó«°QP9ÙsVH;÷u¸' 
xNÃH…ö(tH€‰à3ƒÄ©D‹3) = NğŠH9
t3ÒÀH…Ò„ WÀAxÛ‚MÿH`‹U ÷Âa	!2a¹H‹’ÿ  H9 tH‹ÊH‹Ö èbW‡ÿHƒÆ óoó D$XH‹NH ‰L$hH‹M  ÷Á   u ëH‹‰ì‹UX ÷Â(  ×<è   ˜ œ@H†‹” PHƒÇfB(H‹Of8 H‹ËHT$@LD$ H‹ @@ÿP ¶À HƒÄx[]^_Ã¹ „è1‡ÿ3Ì  WVH ƒìHH‹ñH |$(¹ &3À`ó«H‹ÎÁ {ù H‹òH…öu	8H€%H‹H‹ I0H‹	H‹d‹ÆH9t¡ …Àtf	Š9t§V§÷€h§€sÏs €¥qœ( pIo 0o	n€AWAVW¸VUS€r€Ë„rˆr ‹ÙH‹úI‹ğ€A‹Á+„$°€ hE‹ñD;@õ|nD‹ JË E;÷stIcÖHR@ ×€ggL‹BL‰¸D$P€ƒ€'VÀeXT$8+ee„ÀtA€HƒÄXfA^A_ÃAÿbÎ@}–¸‚‡Ièp…T‡ÿD2ƒè3éì¬Â33}?3F˜3æÆN3¸S3€4È3J(Aœ ¢‹N@—9À™‰èDÀH‹Ğ H‹ÚH…Ût H‹²doÿH@9tèpÂØÀv`oÿèP;Ãu+ • 	èØR€–ÁêH9u" ÁÛÎè<ÂèH€‹Åéˆ  ÀÔ@H…ÉuÀ€C èÑ‚ÈèÉ‚ÈH‹Ó$H‹ €à`Eÿ :Y Üpÿè
§Ê`tH‹‚aÈèĞ1è½MDÂH493Ã­B@ÃéVù@v!{‹ày€áRÿ€P(„À„@‡…æĞaPH‹ (à_ #!;Å…í@ìƒx  †­"P H‹êH…ít H‹mc(M - (*Bá	h€èÓ@Q‡ÿL‹ğ`qjoÿºá–è÷b øI‹ÏL‹Å3ÒèïàI‹ÎI ‹×I‹H‹€.È¢@9€%Õ%·€%z€"9†%èb„%£ÂèL“%Ö€B‚%Ì‰"¨Ã%"”ãèÅ+AÈèM@	ƒÀûHcè€Hƒı‡tá m¡ÿ‹ ©H€ıÿÿ HÈÿá Á¬ÓP„ÆAÉüÂaÀÓèéK$l:Ù‹BÂ%ÂÇáwÂ YçaéÂ½€Bã@ vÖ!Â		JÂš7'Bëv 
R(¡
ËOí 9©
ôÂ¢
áJ$úH…Tÿt`[7c[ÑBøpH‹Çë@C`×çlåÊàliè1à»r(¤è~@€…@ WZVA¹0A… ­ñÀtè–9âà
@‚uA@ÎŠÿH‹ Ï‰ uè  H‹Ã`Å0[à×	¤ Hƒì È‹ÂÇD$ €3 L‹I iQL‹AàcÈè¬?‡:ÿ‚Ãòr“úHğ/òpÿ9 	Aÿ„ÀuUgN`V`F`ÏèeeıD  ´ÿûÜGÿjìújÿ `û•geÿÿHÿõLÏÿB\ôâÿşÎÿóÿì( …w0$fpÿ‹’hP è£UÈHp’¡‘„pÿI=RÄL$ ĞèøÀ?¹£øø`9³@@H‹øHOâˆÄÁâ ÎL"u Q0Ğè©¢Ç`%(Wô)%
p
Å…ÿ „Š 3Ûƒ ~ ~GP¢; Yƒ€@Hc ÓHÁâHLÁ…Â…@ÇH‹„Hq„ ÿP &
€ƒÄb,ÿÃ;à^|¹¸Q+§-ô# QWÀò* BòYWh ¡ÿò,Ğ‹A ;Â}‹ĞèxŠj-¡2 õ5‹@ñ‹~‹×Ğ?:Põ’B 5N‰€|$ E3ÀD¡ L‹Ã3ÒE3ÉØè½ 1?/6Ìó :ñ@„š •-À`è@ÄDK ×èQâ N D‹FL‹ËéPçHC/ î;ğ²A‹úA‹ØI‹€é…ÿ}¹ Qº@ èJ$‡ÿT…Û &7 ‹ N+Ï;Ë}
$¹Qd&N ‹×D‹ÃL‹Í„ès0ƒFáH4:ò(D€L‹Ê3Ò c{@›Hÿàïörğ[û÷â
i¼
#¾
‹ ¼
¸‚%¸
è2<‡ÿ„
íÿÌøÀ~Ë@óp¾ñ‹ÚA‹ø‚·ñá·û"‡¢ÿñË;Ïµ(ğ …ÿ~J‹V+€×‰V;Ú}0—
NÀOÁá88+Ó‰ T$ 3ÒP ( ;I‹ÈL‹D $8D‹Ëè…¤VD‹Çèn[ğ´@³ó	Pó4@H@'ÀÊÙ‹ò;s4rTòa	S€ÿÊ‰S;òñJK÷ÖøV÷ÎèòC‹S$3ÉñÓ@f€3óA  Ht$@ ;PsHcÒÃ9|è›I(¥ƒC’!PA
èà‡ "õñ¬AUAT4Ç=—ÕP
•Õ1Ç¡—„ ™	 E3öëAÿ`³s}7€H‹KD;qpA^ˆ°AÇ~AÀ.ÅuA(‘rAtÀD |ÒABHá*A\A]ÂÅE ~é¤ÀAÿPÇD;{y&m×ŸGuÀ^ AFD‹àA¬G` @¢C ;Ğ0J D;ùƒÖ  McÇIÁàĞJD ‘L ’L Ğ‚t ;ñƒ²00IcÆH0 çèJĞH¥E‹ôˆE‹ı
ŒUP*€D‹CE+ÆÑA@öU!P'CAÀ+ÆD‰sÔ‹;ò\8ã"PÒë‹Î è%Šÿº6H ‹H;p¤ÿt@