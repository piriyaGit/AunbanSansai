1.17.1 / 2014-01-22
==================

  * fix: expected messages in should.js (should.js#168)
  * fix: expect errno global in node versions < v0.9.11 (#1111)
  * fix: unreliable checkGlobals optimization (#1110)

1.17.0 / 2014-01-09
==================

  * add: able to require globals (describe, it, etc.) through mocha (#1077)
  * fix: abort previous run on --watch change (#1100)
  * fix: reset context for each --watch triggered run (#1099)
  * fix: error when cli can't resolve path or pattern (#799)
  * fix: canonicalize objects before stringifying and diffing them (#1079)
  * fix: make CR call behave like carriage return for non tty (#1087)


1.16.2 / 2013-12-23
==================

  * fix: couple issues with ie 8 (#1082, #1081)
  * fix: issue running the xunit reporter in browsers (#1068)
  * fix: issue with firefox < 3.5 (#725)


1.16.1 / 2013-12-19
==================

  * fix: recompiled for missed changes from the last release


1.16.0 / 2013-12-19
==================

  * add: Runnable.globals(arr) for per test global whitelist (#1046)
  * add: mocha.throwError(err) for assertion libs to call (#985)
  * remove: --watch's spinner (#806)
  * fix: duplicate test output for multi-line specs in spec reporter (#1006)
  * fix: gracefully exit on SIGINT (#1063)
  * fix expose the specified ui only in the browser (#984)
  * fix: ensure process exit code is preserved when using --no-exit (#1059)
  * fix: return true from window.onerror handler (#868)
  * fix: xunit reporter to use process.stdout.write (#1068)
  * fix: utils.clean(str) indentation (#761)
  * fix: xunit reporter returning test duration a NaN (#1039)

1.15.1 / 2013-12-03
==================

  * fix: recompiled for missed changes from the last release

1.15.0 / 2013-12-02
==================

  * add: `--no-exit` to prevent `process.exit()` (#1018)
  * fix: using inline diffs (#1044)
  * fix: show pending test details in xunit reporter (#1051)
  * fix: faster global leak detection (#1024)
  * fix: yui compression (#1035)
  * fix: wrapping long lines in test results (#1030, #1031)
  * fix: handle errors in hooks (#1043)

1.14.0 / 2013-11-02
==================

  * add: unified diff (#862)
  * add: set MOCHA_COLORS env var to use colors (#965)
  * add: able to override tests links in html reporters (#776)
  * remove: teamcity reporter (#954)
  * update: commander dependency to 2.0.0 (#1010)
  * fix: mocha --ui will try to require the ui if not built in, as --reporter does (#1022)
  * fix: send cursor commands only if isatty (#184, #1003)
  * fix: include assertion message in base reporter (#993, #991)
  * fix: consistent return of it, it.only, and describe, describe.only (#840)

1.13.0 / 2013-09-15
==================

  * add: sort test files with --sort (#813)
  * update: diff depedency to 1.0.7
  * update: glob dependency to 3.2.3 (#927)
  * fix: diffs show whitespace differences (#976)
  * fix: improve global leaks (#783)
  * fix: firefox window.getInterface leak
  * fix: accessing iframe via window[iframeIndex] leak
  * fix: faster global leak checking
  * fix: reporter pending css selector (#970)

1.12.1 / 2013-08-29
==================

 * remove test.js from .gitignore
 * update included version of ms.js

1.12.0 / 2013-07-01
==================

 * add: prevent diffs for differing types. Closes #900
 * add `Mocha.process` hack for phantomjs
 * fix: use compilers with requires
 * fix regexps in diffs. Closes #890
 * fix xunit NaN on failure. Closes #894
 * fix: strip tab indentation in `clean` utility method
 * fix: textmate bundle installation

1.11.0 / 2013-06-12
==================

 * add --prof support
 * add --harmony support
 * add --harmony-generators support
 * add "Uncaught " prefix to uncaught exceptions
 * add web workers support
 * add `suite.skip()`
 * change to output # of pending / passing even on failures. Closes #872
 * fix: prevent hooks from being called if we are bailing
 * fix `this.timeout(0)`

1.10.0 / 2013-05-21
==================

 * add add better globbing support for windows via `glob` module
 * add support to pass through flags suc���� H��M� 8W��9	�H���YWV y8�C�|$ ��@�FL��H �T$ ��� ��D$,�8^�_ha������4����(��ZY�0��7X$ (J��� g�� :I�!: :(@Z�@Z`�0�H��3"�@V�X,�:O H���LbO�P�PD$@H��V��T$P� 2'�`"(L�*PL �D$8L�D$ (E3��� r !�X[�AA-�{��샫 {|$(��B'�H��A��!5p`} b�i�� �9\$|��A [H��$�� �
΁L���$�; @�B�  �$�L$h��$d� n�!�n�#f+!`p���ZbN!D$Xb	U`T`��ל9��ġi��KSH������$�`�R I�@ ��_ �>$�@ k�K c*mG Wb_ @�#�>^�>P �?���x�����L���LC������;�W����hH��P.O/�����0J�/�/����}#0I� �.//�������\#�W�///q?</"�U�Y3�!�YfW� %H��J `; ����Z�p ,t 0�� "4q H�t���d�het�a�ix���� Qi���^�a�m�NH� ;H<t
� ���]�3�j���S�^�a�� ~ tH� �I8��9NPu
�q{pH��� �H�A�����i�Cp�T �;Q8s_H����N;@JsgHc0 ��|� |3C�F;Bs FHc�H���H�T��'@ �F�2�Ę ^�� �r��p�@8��1�����]�rE ��!1WVp��I#����� �Gp<�F�Xt�=�x�0H����\0H �Q0H�H��CH��u ��O� �g�0�	p�$Ґ'H���au�H���Qq��� a����%��0�U�WV�nh�nя�n@�`H���%(�%0&,BA ��Jp	H�Ѱ� @�BH��\$(�C<pl�0D$4�&8!	Qm@RA �a@ @H�4�
�0��H���4�(�*0W}L�B�(�9� �4� H��p|h�q������'���� 
Ф7���˨������I�9 ��������b@!� t �� �``H�l$�x���*��e�H�M�30 @�U���5M1`����10� �R�2�Fa��؋�	H�I�` 	�`�U��
��U���� H9,
t�� �� ���M H��U`O E�Qa��P��pEЁ��E�	�L�E��AB��b��0�$�^`�1
���0#�	��mpH�d2Q]�QpM �a�H��� *aQ��/�$�-D�V�Sd'X)�(Hp- H�������9���3讁����(�
�&3���� � �Ҁ�`��7P�;�F����ǻ  H���  ��]�H�M  H���o �E�H�@QH�U� `HH�� \E�`� L�E�L�E� L�E�E3�� �  ��H� e�^_]ù    ��]� �UWVH��0 H�i H�l$) �mp �e��C� dM � ,H �����H�L�0E:�M �	H�I R 	�� ku�H�"� <��:U�*FUdU� WV�US P(H�L N ��H��H��{�/:H�GH ��uH��� �6�� � �������t�jH��A��C ��X  ���|=�|k� �n݁|�H�C ;ps0Hc� H��H�t�!��}��H�H�� �([] ^_�3��Ń�dD   �D ��̅D��3�Åz���� H��H�~ 0 uH��@(B���܃f� N0E3��βɁF0   ^����Sh��|$(� � 3��H���X`H��3 �H�T$(f�W� �� B@�J�]@_�H�R@H�BH� \$(�C<�D$03�@4�D$8@}L�D$�@BA � N@ �@�lwހl�AAR����ہ0血X$(H��X2�8ɀX�) �$D\h\�7UAWAV AUATWVSH�쨀H��$F��@M��h���&�9�@���M�H���A�؀H����d ����]��@�t
�����&�3�訩 ���������| N�@@;�}�@������{� ��+�H�E �@8H�U+@BD;�~
C�S��ML�1I�` �Q0L�:I��G �]ݠ$]�
�[B�H��Dt!�~D���K���e�[^_ A\A]A^A_]H� �z�B ����,�������Hb���L�B�L�iE3��
�y8 ��@E�}E ;��`:Ic �H��I�t ��~ |y�K����2�� g5�]�I�e�I�TՀ��P�-$��@�XA�x��V��g�g�b��A;\$��@c�H� �I�|H��e�O!wY`�] A���;q8�[K"�À�2��`�M��u�@% �۶]���i�2!Aq3��E���  ;~sHc��H�D��x  �� "�`���]�#�eU"�je�}���`!�L�H���ho  iE�H��P "U�!�� ��T`C�H��xq!�M�`��hH�����D�C(��CJ��C=�H�h�ؠN�u�H�e�-�`���iH�".L��I���������)� �}���A;�0��� ��Iù� d ��]��	�̊o��(�ȭ!pE#-q!a����<�()TJ��y���@����|��@OƗAq%{�}���qI ���  � �|,H�V; BsRHc�H(��������T�� %�!�à�@G���H�B`Ot!��������`�� �� !�I�R�!��
�*�6���N�
� N ��(�ȄIH���9@�t��NrqHHpq���H��0�����9��@H�^H�.H��!sL�2 M�^0M��uR sِ#  LP�J�9	A� �؁�H �ND�A� ÙA��D��A�`�E;��H`Mc�B�HD�0E�w�N(;A <+1c� L��B9\��:�L�NLL�
�N`b<A��� L� 0 N�T�L�T�Q~�P
8U
��P
]�P
L�L$( I��L�pI�0�L��"�~@E���}IH�F0BN`f�D�B�P|$<A�
�`H�\$0�m�D@�JD;x�
�pF�L��L�D$<A 0�0>�@�D�@@E;��W�I c�L��H��v@`yRF��T��B�@�F@�B#� ��Dـ@��B1&�~@�FD��F<u H�m	u\�D�YFD;B`Μ `��`��P:b��(u�"X�"P�3�A \-B�������0��3�D� uE��~H@c��D�a� �D;��L��>I��s$"I��@%H�� ��!J����L�ГNѐF8D� P�q @(M��3�� �]�������3ۃ~�f|�  E�EA;�Z��VH``�fT�fz �tVH"HL�F�$��M�L��@#L$8�	M�U#:@!	' 	R#�I����#��"#%� .T$ ��;^H8|�s~<4s]Hc�u�I�L��0 E�� �A;�sBHc D��A!� �\�3�H��N(��3�� �NI���'�� ��=Xj�`�� ���N8�@�]���PD� ~�Q�`�� ^p}f���1p�����"q�X�t9	�"�T$X��u 
���'H���#t��L$X ��S0	�M�{�qر�FL�t ��He"���`"�@�yL�L� ���)�]��L��I�Ԑm� 	�� �0K`n�
��V��I��$�� �N�M����]���$mRH��*0-��	p1����z�VPA��~L�@�;��h�Ic �C�D��.;����-���t�� s��p�A���M� �F@Q2@M�@X@�������b�B`1Qz�7P�H��V2����d�d�cHp�PH@;�[�
��2�7@�D�c0;�~wљ���L�lp' �H�9 u
�Q�� ��IQ`�I����oE��w�1��pYP��� ІD�!oL$Pq#����"�(A�� �Lp��E;���MF�~<�v��%S%�� �.�$���� �+� �+��* �H��I��E� }����Qm�{���M��0��{L�;7I
@t?Ҡ&��`KՁb?D��A��?"K�mA���m����X�Z}�c�D��D�E�m�XH�K0peJ a��X@Mc�O���F9l�`n��HL�[�I\$bOT4E;�/��m@Nh�L��J0@�$�8a7�x���
x��H��LpL`JˢNZ� L��L�L$0 I��L��9	�HA���t JE��t
�    ��]� H�CD�l$ TD;h�� � L�t$@ J�|� ��� B�H��C< H��h[]^_ A\A]A^A_ �D�D$TL� T$@�  X� ��D$XH�KPD;A Km KF �D�E�� ������KD ��~(D�s@�H�S &r &F & Mc�O��B �T��S@� ɉKD�6�K8&;Ju� h�]���H� �E3��{�` �KA�ř� y���S8D@���S2H ��D;q .� .N�L�E�i�P;y � �|$\L c�B�L�L �L$(A�ID;L� J�L �H������l$(H�}<�ˁ��% �\;
i '}�Hc�D�t���|$Xd~^�貨�]���Q� �H��I��I�� HH��uH���� 詁����H���f �KH���!?S�R _�A���u�`���� WVH��(H�7 H���賩 S�H� �%B������N��� �]�3�H�V �B��~ L��;�sUL c�C�D�� �;��H� H�Q0H�PH�B@�1�1��+Ȁ��H�N Q��T��F@�-(^_����,AWAVAU@ATWVUS@.8A.��H��H� ��� H��~ �@BH�^ I.H���#L�2M�^0 M��u@Ul�E@US�#L��@�H ��9	A��؁��!H�F@=�D�@�� �A��A;��Ɠ c�D��|�E@���[XH�N�����I c�L�$�B9 \�ubL�n� ���J�D�H@�(�% $8$��� $= $I�,�D ���L��&�@�A���G8J�+ *@x��)@F��|�����f@1��� �N�*�)d)�@	e)�@��B jD�F<H �����]N8�� '�+I�JF�V2��ˁ�`L�9H�� ��]�L��@I��L��
a*�B��	�7tH�р*D�A8��@{a��`�;tv�N8���+^D`(� eL~�`(~�ȋ��T�H�;�H�RӀ転B�IKUAK�)��@|��]�j�(�/���d'h�g H�|$(§3� �H��aS`H��@f�T$(f�W��` �B�  H�J`WbR �eH�@\$(�C<�C03�4�D$8A�LL�D$@�AP � @`gBREw�@����ȡ*�H�tQ��2�H ��) �$�H���C��áB���H���3�HUB >���E!C��,�A!� �G�+��숂o�C/�F/�$�b �L��A��M ����  ��|	E�~�D;�}�`�� 軡]��A��+ˋE 8+ED;�~
����]�D �e8L�m3��E����� A�U�T$$ ;��Ώ @6|Hc�H� �M�D�A�x ���@D�K@D��$�`E�3�L�'XE9A9 BI�L�Iȃ��o  D�=M�Hb�P�o���(L@�PL�5��XB(B�ML$�p�*XA;��4 Hc�H� �I�|��(�]��#@ � ��2	 |��A�;�@{$�&`C�H����F�.�|D E�aX�9�  73�~8 ~x�Q.;j swLc��|J� T��z |50\°0oA1�H�RJ�QL$��H�O"�{˲#Q0�S H�@@�P -@Q2o`,X�
��@�;n8|� *�����]�3OH�n�����A������p(_�/�p�p�I��F��P��~�I��;�s:�nB�n��n�]�F8�3��̴]�tl�;F8�FD�F�� ^����u���Cz, �( #s,�H��H��H��B��0!Q��Г���"�p���Or��Hc�H���H�L� �"b�JQ`T$x� xfPPrb` �D$h��Lp �FHR�D$@L8$`HP�> /T$8�`��H�a2
����C7%�� � ��ı�G�� ~=�����q7h��������������0�����H��O��h6����"�04�6 �L$pag��I@	H�I�AH��#5�:?#5�D�B� �L$�h�
�6vEH��PQ�Ip��f(A�A s ����ox����+q H�44�4��4�� O�c���WVa�P#�C�0s`H���9|,���;Bs)Hc�f� M��g°m�bH ��� �[Ѣ+��蝐a6 ����( uB�کP�s���sD 	����s�H�O�0���� �N07��詢F(�C���<H #2�~����ԡP�LB��E� �9��2���DĬ��d������� �ɢ����� �X��H�����lB%�e� �N0���Y�F ���)������������ ����W����h����B��� �y���D  �A08+ADBh� H��A$i��u� ��)C� �H��� 9E����H��U#�A5���N��$�q  ��h� ��� ��   3� �H��H�� P���H�M� H��I�� H�]H��u 3��/L�3I ��Q0L�: M�_`M��u H�w�  ��]�L�� �9	A��� H��L��臈   ��@�ML�1
�h%FCFп
FH�$�`���L� 0�B�`����� � K �pD
D�D�U�H92H�U�� oE��E�PH�MȀt���U�������%�
��
�h ?L�@E�L��x�	�A��f �퓀��M���M�d  H����Q�H �e�[^_A^A_]���] ��UAWAVW VSH��(H� i H�l$ H��� �\H��,t��8�1�H(��(�)�  D  E3�H��� L��$WV�3�L�1�� ���+�  ��~ n�S�`��H��u *H�	H�zH� H�BxH��$u�zſ�z,�B]�	��t��� H�NH�����]�B%^_Ã��#L��3�@$.�CK$�+aO����3�C4?OA3@;�D�3@>�$� N� "H� w:���D�03��VB�>��<��*C*�H�G��H�h7 :�@	H@��O�G��%��@a��DzH��O���衂��dIE?��v@H|8$(�'E���� Z��� 3 ۃ~ ~PH �N;Y�� Hc�H��RH�Lс�@�D$��QH�T $8H��H�H H�T$(�P ��u
 C��@ ����;^�|��A� %���K �QW�� *B�Y� Os��,Ћ A;�}����U  �8i#!$�0��~�ׁ�$4�D����@� N�|$ �5BD@2(L��a7ɨ�u��D��0A7!	c �	 �#d!��� "!-��:@0@��K@0��9�ND�FLD���:��_�N #k!WVU$k� �A��I�� �}��D��!E�@��@F�@�N+�; �}
���N��D�� L���`�F�@([]>�U�D )L��b^{kV���"`b[��!�lJ&oo`�h��R�]��#��~� (��W��A��%g'��]�Bg'�@a'�;�	e'Е�~J�V +׉V;ڄ}+�\L��H ��8+�`Y 3Ҡ  (�;I��L �D$8D���D=�DVD �~>�f�Y�k�f v|$8�kً�;s*r�=�8� 
�S �ʉS;��K�0+��V�0D���$���C@3�L��f h�A  I�HH� t$8;Ps!Hc �v|��Ϸ��H��C��DP�S�
���ASCb ��AUAT�TX5a�����H ��H��������A��D`} 3KD;q���`Ic�%����t�Q|�RCXq,A\A]1j��E�~�P�A��D;{��y�1��?�I��I�u�PiA�F�D��A�G` P�H�C@=�@LD ;���~  Mc�O�@J(�D�1O 2O@LP�@L0EP�@@D;����Ic�H�H�|��_��E��E��A�A - D�CE+�H �KA���8�]�A+�Dx�s����`h�T �Y� �!s6��%�����q��  H9tH���z� �U�	�� ��a^0\�L$` D$PB��\ 11HH�O�G�&� RT$H1_0A�^ D�O@V� -� �Ѕ҂|@�����rPbh�gH��_%~����P$J�a	�s@��fT$Pq�8BfD�=q��t�wpefX��$�B�WHMA���]�t�DK��= p����X2�u��.��V�m�="��
p�K;�~��HR� !u��u�[D�[
 �m�.�[�V 6� N�.|�B���D�O���1H*P��T�(�D �IE��u
�
�3A�����EWtU�����"��$�q с}��9?��e�H�M#�`����p|Q�;hqv
�x@i?�胳�@H���"���~Ċ \��x�U��JH��a�2`]L�ME�A;�D},QH�I�%�!RD+�DQ�E3�q (D�>H$���4��M`H;�u]E2UM8��t���TE���T {dBU��R ������RJX>�A���5I��9�ć�����!��PI�� )i :}���cP�D ��躟�	y��B������E�@�05���tP�V �ȍU���|�P�֠3E� 2E��� �L�E�L�E���M�M�� ����u@���&��ŃA a�eB� aA^]�Rk蜉����� 9i0��� ?�C"M��� ��j�&�p��UK�@H�l`;b%�:q8�e��
���M� �0	�L�	$U  �ʙ�K
t�p� �� 蕱A΋�� I����oo�YE�@�CDE����M�xe�^@γ��F�m��[i�� � M 蘡� ��ŀ5�=0��W�Q��|I��0o�/�$��\S�];QPu��}�`!�c
  r)LP_ I��M��D�$Ko,N0,Ո�C;ps)HEt0|H���S�
b|�b8�C��>��
� �N�a ��N8;_0IR�p �`���|	�O8+� ��JQ��D��_�F��JJ�o���J����aDd+�g�4�s� WVH��XH� �H�|$(�    3��H ��H��H�� @�  �� teH���  H9tH� �H�� 8�y �]�H��� o�D$ @H�NH�L�$PH�O, $0(H�T (�T$ 8H�T$(D� OE3��g�  �H��X^0_ø�  ��� �(�K0H� IL�L$0E��I515(� '!WVUS 38H �ً�A��� �}� պ ��]��� � 	�K +�;�}
�	���h�p�  �í��� H�͋��   H�K�CE@�t$ 3Ҁe( ��E3�蒆 ]��uH��1�^8[]�e JWV7G ��
�/�3���fW����B��B �v(�D $0�I �4H�L$8�H��A �m( M(M �H�t$(H�{�_��XAH�H�� EPN[�D���G�'�#���J�#����O��# w�G��GHT�ڃH�H�H��A��	�	H�@R@EH����J!C
!0Eǋ1  �hAŋ� H���It  �^3�~  ~e;^tH��
�� �$~�A>�p@��@I��uB��@;i��H@c�H�R@r�
���zD$ H$�Q |T$@?�H�H�� �P���;n|�
(t
� �� �x�]����s�zBAVD8 �B8(K8���A��I����vs  � u�@��t%�!a��]��;P_r���� �|
��+������kAy� D��D+�A;H�~Sa�;Y "�Hc�"��"�wZ�"( "��bY@A�jA^���@
�e�� M��f �D�BH�2 !���� � L����AA�P��`����HhAW&&X���L� �I��H���Zr�BMD�Hy�E�D�~�H@�MD;y GQ�Ic��6�H�E�x�� t�I���|� M�H�I��`{X�!A_�A�R� }�#a@-a@}a@t	$�a�E Av�	A����|	 �P+�;��@q`H�K@q �;��}��bA8@rA�c7fA�c`AbA�]���;�|�A/`�A�=(D+��=MB0D  D� C3�M �B�g�H$�w(p  �<!⏧���H�u+>���A���a`��K�w�D�x�Ac�L�4R�J�L���b��bZ2����B���N@�����(gS �/]���/�H�� ��o E3���{ ��/�K�/���/D�j�dOP>��/C�/F�9�/�0�/�/�D`;{|��/ t�$�/B�A^�3�/�� ������ ������ 7�����(�H� A�@;�} &��t�����=���$v�)������� ��8�E��L�!I�~ 3�P (I1�3��:�~�]b��(!s���H A��D��$����N`�Aw�W�7�ND��L��@D����}c0#D5�U��l$PPH�e�c�AO��tЍ����]0t�� ������D�GD�x  �q (L��(D�� w��e�Pw]�&�i0H�l�o�mP���� 覰08�Q:���8��8����q�
�8"�&��}��ذ`EI�͌���� 虤m�;�*��IV�{�� ���"8Ж`(�b��T�d��Ϊ@�� A��krr�ismO��3`|3r>P��A�`r>@L�b6H�@@�dP ����c�a0@o|�r
2d���s�]����� �D�FE��~F �]� 3��F�F�p ^#�/LQ�G38��.� !,��%
�-��ذ�iL� |�f�5f�6�R �MA��E�Z�]�L�1L0�y ��D��L�ΰ贑_2��/��"C�"X#𿡥��l�j1^O`����rǠ(�TL��f��Q�P,�/ @H��5P��}؁
��e�H�M�%DU�
����`[@F �+�Y*
t�� � ���`�0��1���E h1�E�H�U��Pr�E �@��H�e��^_�8	�Di��lP��8�lÉ (���Б�򢑰 ���90���B#���S@�K;Qu�  ��H�����`�C �J �K;Ps!Hc�v�|��f�ap]�C�%p?����@��U�#E��L�E+��	`
 ��� ��1V�U ���%� �� ���� ��L�E I����Ao `�
E�&@�E�L��E���"�qK��mP �ğ�� �Ȑ�ś��%���
���;w'Ѵ��2�HyqI�L��G;p�s$Hc����p]��s0s| "��0cV ��i�H�i N��t�?��u�� H��u3�H��(�`�   ����WV SH�� H�� ��I��;{�r� ��  �x]�H�C ;xs!Hc �H�RH�| ��Ӟ 2�H ��C � [ ^_���]� ���H��A `w`4`G;�ps#Hc�` t�H���o�cH��b� _V��H�~  uH���A�����H� NE3���sIF�"^�̀D  3��	Q��A WH8 H���;~P}�����IwBV9zt@k��~J� �@�rD��W� �N��~L �F�L$ 3ɀ(I��L� �3�E3��v !�NH������ h8 � {@� >���3�&�}��]�	�=�7H�A(�@�,UhhH0��$�@@.H�}���3�� �H��H�e����H���0���H��R?���@H�� H��txH�� L��gB�9 	A������u'�&O�&�B�&�Q��H�e耎�]�C�q C���9��-��V <��q d�~�� JN���@������]� /H�E�H�M��#���t�FH�U��� �oE��E�@�H�M��D�U����� �B�f�<��u`�H���A|7�f��@�\(H� i H�l$ H���^M� �t ��B�E�o(�Hp� �������i� k��t]����u%�A��A��>� O��cA( F� mZp%�-#!�O ,��&�(�E���k�
��
/�
N�Md �j�q(����zc���	� ��b�J�2�����b��! ��,$q� ����K;Ɯu��� `��`��c���!�A$AWAVATWDVU��0H���I ��I��L��$� 9I��3� �n]�����`��a@�	I;���BpA8�xu��xA�������H�}�H9 ����L� ��NLc�I@������ �-s�B�@�H��� Y ���I��� L�����A�@��g�A�R`|� �"�3�H���L��̺`a����`
p���L��H���H��A��P ������0 []^_A\A^HA_���m����� �o�@��e� �8
��[bl��ʺ�?����v(L������TA���H@������]��A�O�H�M��`@����`�AG�X@d#��N*��ab؀�H���@�D 
��I L��@�%�L�œ@+ 4]u���(�H����   �gs  ���`������� 9���p�8�_�j@�y�H���F#� ���p��g
�F�k� �Y��蔱�u�h�� QJ�2��t �JH���� � ���q +��_P6�!P?x�b� ! J�U� C0H�l$0`h��H�M�QB�&؍zg�m�V�'�VX ]�#�Um`6M ��a�p0]���MP7;@���d� ^� 	��?��� �
��`��9	�i_�?>sU ����y�g �c">d| WV �v�(�>��|"�$]��F0��N�P���`�]C����t5�@P@r 諔�� �t$H���;A�A@�d�H`@{��3�J�?�" �g�"a�������
H� } k�	�N8�D@��A���NHH�T $(�:�ZH拐 `��0
c��0�P 4�Bf��^P�H� �tH���� _�H��u 	��D������8�E�1�0��	���AV
��0�`�H t0A�H����D�P8�`��
 Z @�= 6���Ȑ ̐���H� ��P$+�9	���N�$��r�����@��PR���a&� @P�;��@Q3�3�(E3��H�H�3��5��p1O���A���&pP�Qȡ�^ gt[��	 ����u,;�u&/.��+`��A�Ư�A	�m�M�h����ܰ?�1�?�B?轠#`\_?0�]����O  A!OO�#MMLC�����,� !�"PRt�  �7��0��!r6��a�]�����%ρ0�� m�%�0�P^QP�� HR*&�E���	;�ue,���~d�l,CB�B�d��~�4�4���U��`�3�3�		��~S�ȋ�H<,��2,���`?4�2�1;�֭!�q�P�������� `�NQ=���������A���o�Q�H�I8�� ?_�#�t�?�(ø�� �G��Ua�T��qf�����@�  ��I�ۍI������ Pr"`ac�}���W� ��H��H�N 9	萧]�P��upap	8�tt
3� H�e�^_]� �O���  @ ��� tP1���).t!�� ���  t���� �� 6���\��H�H�@x �P0H�H� U�H�2H�B* 
�
J 
M����;uSH�V����` �H�M�H� H;�t2 �H�U L�E��I�I�P* J�1H�A%�% tH����],`��u��
 AV WVUSH�� H ��� P菍] @�H� �H����V  H�O�{����^�H �OH�i�A�� |见��S��A��H L���� d�D�@(E �FM��H� �3���H ��L��H�H��� "��Hb ?�H�� H��`_�9 	H�� []^@_A^H��	`W�V�.(�.����@ ����H�N�H�͌]�� p(^_Â��:�i`�P���t NH ���Act�P?������ ^� �#,���!D   ��   t ��(��(t
A&��&(u�AF�@���/@$�#�� ��@���F6�A@B�@\�g��WV �;I��!�8�싀j�N��a�����:B;����'H�A�?�AK�H�IL � WB�VA�PH�Ȁ�I��[(E*� �P�VB��� 9Z	����?�$�W��@%�H M�b���H�`a'JB`8�VT V�H� Q抠$;��u
H�Ǡ)�A(H�Oa \���t+�O���P�fE f^_�# j�F��J�-��U@ H�l$P@�E �H�eЂI�H�����\Ã�H�P8H�E�edM�`�U�1�Qik�`�eH�= �;@c�A�t`�6Z A\�a sH�9H�Q`�t	aU� �@�P��	H�}�� ��u�H���"@�`#���" D�H� dC �i H�l$ H�mP�z�A��uU��ɉ�, &Ѕ�t@*��o�0ᭁ$�Qb!t� u  B*��9��#zځ�\�~ u- $�� 9����	s A�$�]��N����B���u!�H̋�C @8!?��;@�L�A"���@(���9�K���w��m��N���aO`j���NP���7_��H��t�QÔB @8�lU�  RW �E���� �� ��R頀@P`�H��2����a��T�A%aI�`&�3P`�\ 8B�
��8@ A`���t'ü�`G"I
�{0a�D$(H�T$ -'@)�(@�7 �H�1!�N0 
���x��!	@c7��8@��uC�!��VP�R �N8@�E�D�A��P  	E�' I"I�A �A�a�2� ,H"�S8�%?8,HR��0^T���P� o�H|�¤Ub��#�dI�i-��i�x��N!���1�2h�&��y ������ �1����#	�lY�b!)��Ѕ@$