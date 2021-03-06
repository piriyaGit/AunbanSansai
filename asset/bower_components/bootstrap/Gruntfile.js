/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var fs = require('fs');
  var path = require('path');
  var generateGlyphiconsData = require('./grunt/bs-glyphicons-data-generator.js');
  var BsLessdocParser = require('./grunt/bs-lessdoc-parser.js');
  var getLessVarsData = function () {
    var filePath = path.join(__dirname, 'less/variables.less');
    var fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    var parser = new BsLessdocParser(fileContent);
    return { sections: parser.parseFile() };
  };
  var generateRawFiles = require('./grunt/bs-raw-files-generator.js');
  var generateCommonJSModule = require('./grunt/bs-commonjs-generator.js');
  var configBridge = grunt.file.readJSON('./grunt/configBridge.json', { encoding: 'utf8' });

  Object.keys(configBridge.paths).forEach(function (key) {
    configBridge.paths[key].forEach(function (val, i, arr) {
      arr[i] = path.join('./docs/assets', val);
    });
  });

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under the <%= pkg.license %> license\n' +
            ' */\n',
    jqueryCheck: configBridge.config.jqueryCheck.join('\n'),
    jqueryVersionCheck: configBridge.config.jqueryVersionCheck.join('\n'),

    // Task configuration.
    clean: {
      dist: 'dist',
      docs: 'docs/dist'
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      grunt: {
        options: {
          jshintrc: 'grunt/.jshintrc'
        },
        src: ['Gruntfile.js', 'package.js', 'grunt/*.js']
      },
      core: {
        src: 'js/*.js'
      },
      test: {
        options: {
          jshintrc: 'js/tests/unit/.jshintrc'
        },
        src: 'js/tests/unit/*.js'
      },
      assets: {
        src: ['docs/assets/js/src/*.js', 'docs/assets/js/*.js', '!docs/assets/js/*.min.js']
      }
    },

    jscs: {
      options: {
        config: 'js/.jscsrc'
      },
      grunt: {
        src: '<%= jshint.grunt.src %>'
      },
      core: {
        src: '<%= jshint.core.src %>'
      },
      test: {
        src: '<%= jshint.test.src %>'
      },
      assets: {
        options: {
          requireCamelCaseOrUpperCaseIdentifiers: null
        },
        src: '<%= jshint.assets.src %>'
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'js/transition.js',
          'js/alert.js',
          'js/button.js',
          'js/carousel.js',
          'js/collapse.js',
          'js/dropdown.js',
          'js/modal.js',
          'js/tooltip.js',
          'js/popover.js',
          'js/scrollspy.js',
          'js/tab.js',
          'js/affix.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: /^!|@preserve|@license|@cc_on/i
      },
      core: {
        src: '<%= concat.bootstrap.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      customize: {
        src: configBridge.paths.customizerJs,
        dest: 'docs/assets/js/customize.min.js'
      },
      docsJs: {
        src: configBridge.paths.docsJs,
        dest: 'docs/assets/js/docs.min.js'
      }
    },

    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: 'js/tests/index.html'
    },

    less: {
      compil:���`G!�J�M��Є��0��9	2��A^w*1�p{��}�bL��!h��WcV ����"`oU�4�@����aV�� #
%
L���V'
^_�	���5�812����j@��1M� ��� ��qXL��Y �/n��t��X��!0�T1Y��~1��� Ӭ�Ң 6w_���A&@L.����H� ���]� ���Ð  ��
 �� �2�I�� @�S�'H �T$x��}���Då ��أ @>�T$p���P	&	g	���C���ǃ�b4� ��I� ���� �S� ����؂��WAVA8UATw!��k�5"��wR��dmR/�2ř�0I�3��8'A$)p��n���P�E3������aMc�J�L��L�|�� ���uA�J�0FB!
-����k�A��EI��H��5��g��ul%BH ��|\� 8�� ;�}L��-L�Q� -� �A� H�D$ ��$L�l$ E��}M4�qX� �{��E;~ �K�@ C��D�J�T�@[�H��	P� A��A;��0d6Pc;�u��I��9	���rd"�\A]A�^A_k�i����94*�*e���֟AqpH�Հ�ց�SH��TF�K��us�wnP��.i���1�°��0��p1H�F�A��H��y���X�,�R'�;x0+aci�Lȡ�t�q�O��rx3ҰU��υ�}��ԝ= �E3��� !0�	P�����v	\�-�T���覒��
Y��vy��}�x�;X�
b�c@%�
Xz�NNA�P�@�aD��P� ��P�Vi�."0�+�s,3H������Ѕ�}������A�v�� 81���p�1����l(��� � �8 �U O��H��t*�H��H� � H9
tp�� ��   ��� ����H�@�(^_�3 �	 WVH��(H ��H��H� H�@H�P0� ���| $�L����;������WVUS AB8A�A��4 4��~5H�N H� �= H��M ���� ����D$ 3ɉL$ {�L� �D��3���&��� �8[]S ��WV^ ^3Z�>� �.,��ӃY@�P H; �u
�À [) �Á��;�pԸ�  ��HH�򃥺���k�V��%�	��	��H�d�' �H���.�	.��_��� I�؅��I��@ H ��� ���9�O� �L��9	�)}��c��I�*�G�(R�(L�ƀ��I9t��ϋ��̙��%AVDl�TB���A���@=�L��L� �I����v����H���ك ���?w�T�$p��@B`M��, �W nA^�D_DA�B�Y�,E�H����aB�E�nL�� Y��~�� (A���/��K�/@�/���/@�,x� ��,��I��HI�� -��Gw)��u�G����֮��E�*D��L��b9���N�0�;`h��F0��	��J�%H��$������t��EX���C�:fxl���h'o�Tm�'���aAB�E��WC��f�x�_`��|�EA�9WAVAT�P0�������m&�ap��b���]I ��9x�TUID ; �v� c�H�L���t$BN@ iQ����t.���z�L��t�D�Ǻ   E3�@wc�������� �������P �H��h���h`H"���� ��E3��������~ 5�A@�"���L��D;� tVI�� .s ��D��H���!�A;��`�$�@A�@`E����E�f ~��� c���Ic ̉D�A��? A;��� � �����!	�� )H��M&E�&3� i	'� �G�� �h��u$��E3���	@���͋Ձ�op�j��9 �����~@�B7���`H�ȉ|$* @D �(�o3�@.� ��}4�w�r��W�D��D+�!):D@�v�a�x@m�C�>x�� >�!��@A >u�L�y�P!ߋӠ�
x��0��\A^A<_Å�� ����� ����Ѓ��t�-#@X�Pr8!� ^����j
z�<E�	�j@'��H8 �j��}`<��Kj�U�i�PFÅ$p@%A;A��PY�6�2	�Fq^���j���{���� D  �A�#H�I�]P���m0#�`����: �q��0 9/���F1+����P
tk���EQ��3�3��Z��qr�&�py��$��" � ��0�K�" ��"C�L�����肟�A���Ŕ
���HL���h�2A� ;�~9_p�H��Q�!��i����Dj@!6R�&�p��k��&������C�=P  �s��
��ΰ�v'@{����D2� KWD�@���ļ*� ��� �kq �H�@
�� ��t�� ��,	6��20�PF�)1��C� ��Ʌ�t#0b����^_�v���'H��3'� 3�(� �_�G#� ��7O�_ɋ��=��t"�H;OaM��:� R$BC÷	�4�y�%��7#� >bC $�#0�+�aI�c��,&�	���Q�=��c�3����o"��p�����A �3ɋP� �~Lc�J9�t�u	������;��?�k��X�$��^��|IQ#���� ��҅�t5�Va���>�4�� P3���A���F��t��F�
�#�V��AVD���H����^������F�PZ�Q �6���|�4�� Ƴ��^ÏR�aB��)n�L����a� �$�A�$�0�$!�4�	��c�@4��@G@ �A��謐��� ��	D � ���*|�����q�R���?�L�d��������V4��t�����%��������Iba�lC��B4��4�|"-1@V��8��`�������/b][� l�����Y �@ H���� q��H��H� �tH�/ ��H�� ^H ��H��k��3�� ? T �P��.|� V H�� H���  H�NX�@�Q�FL�FPH�E�
d � @8�i>EN� X ���   �b �1�� �jWVSq�H� �I��H���x 2 H��L� �H�H�@@�P8��[^_
�>�?�H����;�~0 uE�x��: ��J=P� [��[K�貀
�C  ��CH�K�{���N0��>菁�N0��� DH�P 3 H���a  юIWVUh( � HA��:����� ÅII�I,-�I����IM��
T�E�IE�IM�IC�I���<fN�0��HH�{�`���([]^_�| JD  A��A9��o����P�AWAVATD- ��QD-��I-��@R�vA-DH-h@P-vQD-E�@RJ-� �tw�_��tp��B�k��cC P����3��~F�r 2!8 ��;� �L��L�~( Hc�L�d��I�N@d�����I����� �ϋ�M���@��;��aA���m@IA�\A^A��Óp�o@�|$(���3����|�I����$�  �n ���o� D$XH�O�H�L$h���� �3�9	�(A]���@
@	�
@7T�	 �T$8H�T$B( 	d  @��@H�K�P�Z8����@�PHi	g_BoH��D$�@��#pM�g��g�U��)?�2� ?|:�N!?J�m�Un�0?W�$?Ka-?�N  ��/AbV(�ZC3~��>�;H�T��H�J�;@�8��H�[ÀW��	�Vea%<A���s�]�_���a�^�sI�sI�����9�Zھ�~��g��N[a�s�-$3��`��u��AV!mq�I��!b���2G�a��8�a������aa�٠A�F��A�F6��  �0I����a�2�͈��!�A(a� {��aA��`(I �/I����#��~k��u�0yC(�0�@i�t�T)O)���L였X$r ��� A'rH��$���Ao�a�$��I�A�g�$�!D�r�D$xy�)�jbw�i`m�k"�x`a�`�xc�xP�`*T$`�o0�x �x>`�x�`"8H�L�`��H�	p�	�	8�	H�	�[�E�$�Q �	���
9�z���tq���P#����3�04�0L���&1t���?65�?��0nP�0�W���?� �&�t�&�|�y:=k�h�*�T	aZ	Q	�5iU	��W	�P_	�v��T	�� ^	i�z i�c��~Ӱ i� idi�"KQ��7iE� i�� 	i�aE6i��h �/�hGh�h�h��g9��h�``-�2dX�'��hs]�hDL$02�訸Lg��h�m�Xv+�hW��h�h�g��($	��(�3���͗�P�������� �i��Vi���iH Ts�i#�[I���?���E�[D�@'0�#�[��B�"�7P�[  ��[�2G�b�m5����y@f�� \5\�B�f�[���[�XH���X�X  �X �p��X��e�X�]\�X/0}�Xӳ B,�X�'�X��Z�Xx��X�d71΄��X�V��X̏� �X�q-�Xc�5����A��X_c���H����q���,  ��u�[��Q��'�@�3��o��h���a�0�!�����3ɺ0H�H�~ f�Vf�F,H�բ`à(� y vH�I"����9	���1�� ᖡ�o��c�G���0p�T�= ^��%83�H�D$&(A ���H�t#@H�y�0iD$��a����_uqƠ8 m��(PfW��J�(}� �!s)U ���֐�����x��A��1�.��⭄���@ ��;��}-��@�@�_	�7�0�tT��u03����=�bK�
�K�p\��uI��N� )[� 1"H�D�����`���>l"}��
H�~ t<��3	-H� �~H����   ��H�� A�   9	 �S^���� ����H�Ġ(^_�3 �  WVSH�� H ���H�~� tBH�N � �6����t3(H�^�b �@� �u
H�ˋ�`E3��qA��w[`��� p� [ q��V]� `  ��u*`H��tH� H�@xH� 0^H��H�����N( �y vH�dI �T��p~.��f �7� �a��H��3� e��H�� !�
!W(H��H�� ��A�Q[H�O�QsS@�<�� T3 .��h�����%-��H�����3ɺ�	H�H�~�f�Vf�F�u��� -jjJ�%�P9	�.襀'�l�g3���g׃ M! n�U  \^�@D  H�A���H9 Vt:H��t�H����+A	�7�@P�PT� f@�X��P8���F (^ �@� �O� �0  uEH�i� : �L, D��@H��d�J@H�O�>@�G�  �G#�@���'�N@0H��������H�������T����-I�����~�����+������@�����#��-����� DGQAA-���;�%��q�J'�����qõ�DV�'9��D�'�+@�'�'���'�˃��WVUx X x�����L~@�i%#�� #�J*�؀1��$#KH豠�C�1C5�1K�1��"�覎a ��CuH�D�� ��"2"��x2"�wH��8 #T�اXa;B	�`	eM�-�T�EcEaMbc�b��
a���PD���Ӏu� 3�[��([]O�! ��!���@ ��)A �/���C����/�����aX�F0d:�]y�\k��*�N��7ہ�+a�@�Dg��@l�;H�!�$^I��(�:���:���:���wa�;@@| &;��0;_��	;� +�bb	;0� ;T��;=����1a�&@K	;�Y;Í��JN�P�@U@�c!�n�w@ ��� ����H��� �H���`� 6� ¬ �̓�S<����䇜⩋AHĩ�K;VHu�B����{@P �VHe�'�`*/�'�b @f�ШD�F���e_CW"�a`�)�x�T� �u`�N�L�V���F�L�FLP ��o�s�
�`D�����nH�u��#cx jF(�xPw�(�@H@��t�
�L1���&�w�1��&��k&Z�x�HH�O��7`H���H�wt��TB��=� ���!sm�N�7��+� ��r���������)@�H�FXH�0 ��G�B ��T$@� H�Cvh��$�%�5�L1VXH�P ������EH���NpU�(@�ms5d	�*R�& b	L� NXI��D��E�I�LW�.G� 
�L���#�����'����+�q`�ƨd� ��  �$I�A�P��R�r>��a�i�- �E��UAy@�p~vdr�=�@�H��
`�0 I��H�tӟ��H@�D$ f�ЎH���T$ �@ H���D�F�����2�V[�k3 �<�P��-Ʌ���A����cP<���$0?: a�^_U��f$�Pv5 W��r ����iA�tk�%�o?�U	`�p �ā��@��V���W0T��#;c�1D���= ?oX����/9aP�O@r�������� ����C�(��ǉċ�P
���1C06'�`�f���Zw @ ���Q[� 4b��(�{�zHH�^(D�(*j"(�o#�o#m#� ����O��@��H�n�+��#�D��A��T�P`p�3�O<%�N�-�1���	��!�1�	�1R0$T2U�f�L�8�5������S�,�5#&	"��!z5@��u��f�5{5ϋp5������3"�
����� �X�
 `#[�p���m�
s&Y�,�D��P"���#p�m�\ �l`� dek���/ ����NP���,� U8 �K� ��^��H��*0c����BO�h����ˀL��3��:RΣ=�0*  uR. �P�����G����QD�NЦ��F� QBu���s@TW�  �I@�rP��w������]� 
v%��t� �1 �t��w�0�s �P���2 <�tֲ �t*� H����� �H� t H�w�H� ������D�� (��  �   �H��(^_�� D   H�A8&WV H��(H��H ��H��u
H �X�d�H� 9H�N8H�� E3���#�����t�H��_��NH� �t9	�_&N�& � �� �N��
�n 9	H�q` i�d ���  �� ҋ�H  �Rϲ�� �����2� x ^����!y!á!�!�!H��H��I@��u�b�A� �~�D$ f� f�HH�� �T$ H�K# 7oH����UAVWVS��0H� l$P3�H�E
Ѐ����<��������,�~�\� {.K�A ���r@ �� H�H�@p�`P8��u������P�@x�P0H��,�E jꁋ����d�[M�<9H�BY@�����{� M�A��E3���M� [�e�@[^_A^]BxA WAVAUATW�VUSH�� @�A.�|$0�6�3��@[H�ـH���O�@~H�0����� �H��ak�轀!H��E3���_����
��@5P��L ��I� t@I�w�@� gH�2H��$� I���++@
���#�D 8 �@L� ��o����$� 
H���$ ���$AMB�A@D$x��	�����B   L��3�I�T@$I�L$ Z����������H�t�$@�����=@#�
R  ���
�D |A 	��(�A� H�H�t$xI���H�x��IÓJI��$�>���HM���D;u� g  Ic�H �T�I�G(�H�J@ ���(A�Ɓb3@�H��b���A;� �����g��(/��� ��3� 7 ��`;� uxH�{0 uE���: �C�����!z�v誠�Faa��F`��$蓁�K P�袇b���saP��H�A�XH���%������'�u#
� F)t`��H9 t�d�O����(��D
*A"�H��۞G���N�����H�OB"�a�w0G��U@����	��	MH诠�ECE5AMB��B���aiA�H��"P o���Bc-�Y� �5V����H���"��5Q�h��AC@H��S@ @�&�5�5(!! ٝ�' �0 �����H�5�a&@a� ����`�x  ���Ʌ���� ���.���$֖b�d����.�q��.ea�.c�	�F��.�	�.8���.!��.a�/�8�KH�OHI�-���/�J��S�8`*8�� P ����`������Ō$���L$�p�2��3�@�"r`�H��@D$v`� LT����6T$$0��;ᰔ$z�����@�T$��X�i�%�H�XH��?�� ��H�GJT}�&Ң SPM���a�H��	^[]�_\A]A�^A_��Jp�lY�~�~���;N�^�#�| ~H�!l���e�40�G8|��8apD�P�D$@2�0?�T� P��� ���G�HcȀH����� ����� �L�ҀGIH�����D�S(���D�L$,���F���[�b��T4Dʋ��Jg�;��N�"��(Q0D��.�P��8e��rq��АAېx2:q����0�+H�nxA�x ��H��D�˩ �D)�p�8A���fW����%(� ��G�� �Æ@��8H����@����r0���!qD
�A�R���`�D$V8q^p 0q HPp0FH�/`ONL� 81à�C���|$ ���h�� �;�uCP0�0��t:�`��&�� 4i��1~5�_�bȠ!2*H��"@P��Ĝ �Ű�h$�(�P&� �A��D�FPbk�������tP��q(D�4AA  A `�L$��L��h΋��A�Є ���ᩎhF!���Na���y7Tt�p�	��?��H�VRr[Q;�w����F�?�3�Pp�A��@ �Q  � �0���RU�k��6�`�Eq��
� ��I��E�� ���u�
{��>���^LE 3�E3�A��"���A�0� A�Q q~�!��|
� r� ���� D�A��  �pX�	�_B� (D	!` $LD	��AF�@Q�t�P�	�p, ��Tp+�G8E�x�tB�"�B��BM�1H�A�7ѕű�����T�L�ϡ0�R߅R��Q�.\1P��CU6��cI�¤��}��F�'�e�`���a71
�s�� #�
6z�zA7��  )��� 3�H�E�U$) �(@!)@a'@ 0�E�0� ۅ�t�E��p�@P�}� u�e�]ÉD}��H��LH���Д�
