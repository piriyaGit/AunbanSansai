// -----
// The `timezoneJS.Date` object gives you full-blown timezone support, independent from the timezone set on the end-user's machine running the browser. It uses the Olson zoneinfo files for its timezone data.
//
// The constructor function and setter methods use proxy JavaScript Date objects behind the scenes, so you can use strings like '10/22/2006' with the constructor. You also get the same sensible wraparound behavior with numeric parameters (like setting a value of 14 for the month wraps around to the next March).
//
// The other significant difference from the built-in JavaScript Date is that `timezoneJS.Date` also has named properties that store the values of year, month, date, etc., so it can be directly serialized to JSON and used for data transfer.

/*
 * Copyright 2010 Matthew Eernisse (mde@fleegix.org)
 * and Open Source Applications Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Credits: Ideas included from incomplete JS implementation of Olson
 * parser, "XMLDAte" by Philippe Goetz (philippe.goetz@wanadoo.fr)
 *
 * Contributions:
 * Jan Niehusmann
 * Ricky Romero
 * Preston Hunt (prestonhunt@gmail.com)
 * Dov. B Katz (dov.katz@morganstanley.com)
 * Peter Bergström (pbergstr@mac.com)
 * Long Ho
 */
(function () {
  // Standard initialization stuff to make sure the library is
  // usable on both client and server (node) side.

  var root = this;

  var timezoneJS;
  if (typeof exports !== 'undefined') {
    timezoneJS = exports;
  } else {
    timezoneJS = root.timezoneJS = {};
  }

  timezoneJS.VERSION = '1.0.0';

  // Grab the ajax library from global context.
  // This can be jQuery, Zepto or fleegix.
  // You can also specify your own transport mechanism by declaring
  // `timezoneJS.timezone.transport` to a `function`. More details will follow
  var $ = root.$ || root.jQuery || root.Zepto
    , fleegix = root.fleegix
  // Declare constant list of days and months. Unfortunately this doesn't leave room for i18n due to the Olson data being in English itself
    , DAYS = timezoneJS.Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    , MONTHS = timezoneJS.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    , SHORT_MONTHS = {}
    , SHORT_DAYS = {}
    , EXACT_DATE_TIME = {}
    , TZ_REGEXP = new RegExp('^[a-zA-Z]+/');

  //`{ "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11 }`
  for (var i = 0; i < MONTHS.length; i++) {
    SHORT_MONTHS[MONTHS[i].substr(0, 3)] = i;
  }

  //`{ "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 }`
  for (i = 0; i < DAYS.length; i++) {
    SHORT_DAYS[DAYS[i].substr(0, 3)] = i;
  }


  //Handle array indexOf in IE
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (el) {
      for (var i = 0; i < this.length; i++ ) {
        if (el === this[i]) return i;
      }
      return -1;
    }
  }

  // Format a number to the length = digits. For ex:
  //
  // `_fixWidth(2, 2) = '02'`
  //
  // `_fixWidth(1998, 2) = '98'`
  //
  // This is used to pad numbers in converting date to string in ISO standard.
  var _fixWidth = function (number, digits) {
    if (typeof number !== "number") { throw "not a number: " + number; }
    var s = number.toString();
    if (number.length > digits) {
      return number.substr(number.length - digits, number.length);
    }
    while (s.length < digits) {
      s = '0' + s;
    }
    return s;
  };

  // Abstraction layer for different transport layers, including fleegix/jQuery/Zepto
  //
  // Object `opts` include
  //
  // - `url`: url to ajax query
  //
  // - `async`: true for asynchronous, false otherwise. If false, return value will be response from URL. This is true by default
  //
  // - `success`: success callback function
  //
  // - `error`: error callback function
  // Returns response from URL if async is false, otherwise the AJAX request object itself
  var _transport = function (opts) {
    if ((!fleegix || typeof fleegix.xhr === 'undefined') && (!$ || typeof $.ajax === 'undefined')) {
      throw new Error('Please use the Fleegix.js XHR module, jQuery ajax, Zepto ajax, or define your own transport mechanism for downloading zone files.');
    }
    if (!opts) return;
    if (!opts.url) throw new Error ('URL must be specified');
    if (!('async' in opts)) opts.async = true;
    if (!opts.async) {
      return fleegix && fleegix.xhr
      ? fleegix.xhr.doReq({ url: opts.url, async: false })
      : $.ajax({ url : opts.url, async : false }).responseText;
    }
    return fleegix && fleegix.xhr
    ? fleegix.xhr.send({
      url : opts.url,
      method : 'get',
      handleSuccess : opts.success,
      handleErr : opts.error
    })
    : $.ajax({
      url : opts.url,
      dataType: 'text',
      method : 'GET',
      error : opts.error,
      success : opts.success
    });
  };

  // Constructor, which is similar to that of the native Date object itself
  timezoneJS.Date = function () {
    var args = Array.prototype.slice.apply(arguments)
    , dt = null
    , tz = null
    , arr = [];


    //We support several different constructors, including all the ones from `Date` object
    // with a timezone string at the end.
    //
    //- `[tz]`: Returns object with time in `tz` specified.
    //
    // - `utcMillis`, `[tz]`: Return object with UTC time = `utcMillis`, in `tz`.
    //
    // - `Date`, `[tz]`: Returns object with UTC time = `Date.getTime()`, in `tz`.
    //
    // - `year, month, [date,] [hours,] [minutes,] [seconds,] [millis,] [tz]: Same as `Date` object
    // with tz.
    //
    // - `Array`: Can be any combo of the above.
    //
    //If 1st argument is an array, we can use it as a list of arguments itself
    if (Object.prototype.toString.call(args[0]) === '[object Array]') {
      args = args[0];
    }
    if (typeof args[args.length - 1] === 'string' && TZ_REGEXP.test(args[args.length - 1])) {
      tz = args.pop();
    }
    switch (args.length) {
      case 0:
        dt = new Date();
        break;
      case 1:
        dt = new Date(args[0]);
        break;
      default:
        for (var i = 0; i < 7; i++) {
          arr[i] = args[i] || 0;
        }
        dt = new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]);
        break;
    }

    this._useCache = false;
    this._tzInfo = {};
    this._day = 0;
    this.year = 0;
    this.month = 0;
    this.date = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
    this.timezone = tz || null;
    //Tricky part:
    // For the cases where there are 1/2 arguments: `timezoneJS.Date(millis, [tz])` and `timezoneJS.Date(Date, [tz])`. The
    // Date `dt` created should be in UTC. Thus the way I detect such cases is to determine if `arr` is not populated & `tz`
    // is specified. Because if `tz` is not specified, `dt` can be in local time.
    if (arr.length) {
       this.setFromDateObjProxy(dt);
    } else {
       this.setFromTimeProxy(dt.getTime(), tz);
    }
  };

  // Implements most of the native Date object
  timezoneJS.Date.prototype = {
    getDate: function () { return this.date; },
    getDay: function () { return this._day; },
    getFullYear: function () { return this.year; },
    getMonth: function () { return this.month; },
    getYear: function () { return this.year; },
    getHours: function () { return this.hours; },
    getMilliseconds: function () { return this.milliseconds; },
    getMinutes: function () { return this.minutes; },
    getSeconds: function () { return this.seconds; },
    getUTCDate: function () { return this.getUTCDateProxy().getUTCDate(); },
    getUTCDay: function () { return this.getUTCDateProxy().getUTCDay(); },
    getUTCFullYear: function () { return this.getUTCDateProxy().getUTCFullYear(); },
    getUTCHours: function () { return this.getUTCDateProxy().getUTCHours(); },
    getUTCMilliseconds: function () { return this.getUTCDateProxy().getUTCMilliseconds(); },
    getUTCMinutes: function () { return this.getUTCDateProxy().getUTCMinutes(); },
    getUTCMonth: function () { return this.getUTCDateProxy().getUTCMonth(); },
    getUTCSeconds: function () { return this.getUTCDateProxy().getUTCSeconds(); },
    // Time adjusted to user-specified timezone
    getTime: function () {
      return this._timeProxy + (this.getTimezoneOffset() * 60 * 1000);
    },
    getTimezone: function () { return this.timezone; },
    getTimezoneOffset: function () { return this.getTimezoneInfo().tzOffset; },
    getTimezoneAbbreviation: function () { return this.getTimezoneInfo().tzAbbr; },
    getTimezoneInfo: function () {
      if (this._useCache) return this._tzInfo;
      var res;
      // If timezone is specified, get the correct timezone info based on the Date given
      if (this.timezone) {
        res = this.timezone === 'Etc/UTC' || this.timezone === 'Etc/GMT'
          ? { tzOffset: 0, tzAbbr: 'UTC' }
          : timezoneJS.timezone.getTzInfo(this._timeProxy, this.timezone);
      }
      // If no timezone was specified, use the local browser offset
      else {
        res = { tzOffset: this.getLocalOffset(), tzAbbr: null };
      }
      this._tzInfo = res;
      this._useCache = true;
      return res
    },
    getUTCDateProxy: function () {
      var dt = new Date(this._timeProxy);
      dt.setUTCMinutes(dt.getUTCMinutes() + this.getTimezoneOffset());
      return dt;
    },
    setDate: function (n) { this.setAttribute('date', n); },
    setFullYear: function (n) { this.setAttribute('year', n); },
    setMonth: function (n) { this.setAttribute('month', n); },
    setYear: function (n) { this.setUTCAttribute('year', n); },
    setHours: function (n) { this.setAttribute('hours', n); },
    setMilliseconds: function (n) { this.setAttribute('milliseconds', n); },
    setMinutes: function (n) { this.setAttribute('minutes', n); },
    setSeconds: function (n) { this.setAttribute('seconds', n); },
    setTime: function (n) {
      if (isNaN(n)) { throw new Error('Units must be a number.'); }
      this.setFromTimeProxy(n, this.timezone);
    },
    setUTCDate: function (n) { this.setUTCAttribute('date', n); },
    setUTCFullYear: function (n) { this.setUTCAttribute('year', n); },
    setUTCHours: function (n) { this.setUTCAttribute('hours', n); },
    setUTCMilliseconds: function (n) { this.setUTCAttribute('milliseconds', n); },
    setUTCMinutes: function (n) { this.setUTCAttribute('minutes', n); },
    setUTCMonth: function (n) { this.setUTCAttribute('month', n); },
    setUTCSeconds: function (n) { this.setUTCAttribute('seconds', n); },
    setFromDateObjProxy: function (dt) {
      this.year = dt.getFullYear();
      this.month = dt.getMonth();
      this.date = dt.getDate();
      this.hours = dt.getHours();
      this.minutes = dt.getMinutes();
      this.seconds = dt.getSeconds();
      this.milliseconds = dt.getMilliseconds();
      this._day =  dt.getDay();
      this._dateProxy = dt;
      this._timeProxy = Date.UTC(this.year, this.month, this.date, this.hours, this.minutes, this.seconds, this.milliseconds);
      this._useCache = false;
    },
    setFromTimeProxy: function (utcMillis, tz) {
      var dt = new Date(utcMillis);
      var tzOffset;
      tzOffset = tz ? timezoneJS.timezone.getTzInfo(dt, tz).tzOffset : dt.getTimezoneOffset();
      dt.setTime(utcMillis + (dt.getTimezoneOffset() - tzOffset) * 60000);
      this.setFromDateObjProxy(dt);
    },
    setAttribute: function (unit, n) {
      if (isNaN(n)) { throw new Error('Units must be a number.'); }
      var dt = this._dateProxy;
      var meth = unit === 'year' ? 'FullYear' : unit.substr(0, 1)`��� �� 8�� &�sc�� `�n� ^`�`� �� f��� $	�� ��
`"] � �`��� v� �[�� �`��� ��6] � a`�p� �� `h�� �`���� "�� e`�A�  � ��0�� [� �`� �`a�� ^Š �� �`a��� [� �&] `� \� �``� G�l �`� �`��� �� �Z� �`��� �P� L��� �0� p`� 2 5�#@� �` a� !�� "� �`�� #� �aU� �` �`R�� {�%� $�� �`a &� �0'� ��� F(�>a|� �)� tH5] � �*��Y� �+`��� : ,� �A] @�� �-�  �`-� �` ���  /(� ��0� [0�� �`� �`a.�� �1� ���� a2``�p� m3� da�� Y6� �`� s7��� r:�  P�� �;���� �<`4��P)� a=�Pp� �>W��� ?��� }0B� ��� tC�� �c\ �� D�D`�� �`a4�� RF� ��� �`�Y� ,H��0� ��I�G`� �`b"� DKL`�� ��`� �� �M`��� NN�PnY � ʆd�� P�/`-� O`aP� �QQ�Y�q � �S�q "Rs0p ��Sp0q � �p  U� 4��q v� �C[ q 
�� �p #W� ��0q f� qpp  �X� ��q � qq Ys� p wZ� l0-q �� ��p b[�pq �� 0�Y* q δ �p �\���q ]�j p M0 �p�q eW� �q �� �p �^sq *_�0p \M`p.0q �� P�RY q ޴ �p `+b� �0q n'� �p vcp.�
q Ӱ �Y Yq d�� p t�e� |0q �� ��p Hf0&pq ^q� �r � �p рg� ,�q �h�p M0 �p �e0 �p �� �p ܴip�q �� q� j� ]0 �p]q y� q�q �� ��p lpC0q N� 1Pp �0 \�:q � �q mp7p p �n� ��0q ʰ ��p �Xo�q �� �q J�� �p �p0PΤq 7q�@p گ0 Tpq Ѱ q)q rsp �s��20q ʰ �,�p `�t� �pq ��� �Y q ��   u� �v� �<�q ư ��p �w� �pq .�� �0q ��  xp� (yp
0q k�� �Y pp �0 �1q �� 1q ߴ �p {0J��q b� 1pp �0 f�pq |3q 5� @p �}p^0q �߰ ��p ~0#(�q �� �UTY q � �p 'n��00q j� 1p�p �0 �pq �� +1q � �p <���0q � q�p B�0 D�q V�3q E� Pp �N���0q ��Y �p �0 �pq ð q4q ��  ��  ?�� D��q �� 1�p �0 ;1q ް 1q ��0p�p ��0)�-q ϰ ��p �@� �q V�3Jq G� Pp ��0b0q ݰ rp ��0Apq �p+�`Y q ?� @p DϏpa�q ʐ�t p t�pp]q �� �&q � ��p ��� �0q ΰ 2)p .�� �X�q \� q�q �� �p ߖs%�q "�s40p �0 fаq !�3q Ue� `p ���?q ��� � �� �0 ��q �� 1)q 1��N@p ✧��0q %��0p Z�0 �pq ڰ x�}Y �p ���ذ�p @���� q �j� 0[ pp ���3q а 80q �� 1 �� ��3q `� 1q ��� 1�p b���pp �0 ,E]Z q �� 1#�p !n��0q l� �p�p ��Kpq >� P�XY q j� p	p +��i�0�p V0 �q �� ��p j��3\ 
pp �0 \ �q �00q =� �@p �pI0p Bq0 ,�Y q �W� 1q Ҵ �p �0��p \�  ]�� ��Y ` p� 0��89�� lpTY c,p � � �� 0�Š  �e P�XY ��� Я� 8 F 5�� 4OY cp n��� � #� G�� �� � ;�� ���� � � G�� �UY �  ´� $���� � 
d���V�� 
��`��� �\#] ��� �.] ��Ḙ� ���$���
0�V�,E] -����M������ �������� �� &���P��`���Š P��� @�Y ��&�X� ���P�0[ `�ƾ� ̀�	�� ,�6�Y�e�(�T���H������� T��+��_���� ������ � J��  �-����/���Ř� x��E���P���� ��-����;��R��@ D�\��� ���J�� v������A������� �[��r����ҡ� ,������� �� F��-�������l� ��.��0��v���������2���^�e�`��������>�b� ���������l X�)�������f�� ������������� ]�� ����� ����� ���S�Š PRY ������`�� ������ �� B�� T��QX�� ad� �d��� ��� �`� ����7�Z ��  �� (��� }`�nY � ʸd�� d�`y`)� &�c0� J��`p�`I� �` a� ��d�� ��J`)� ��� ��@� �� ��� �Y � 
AdP� ��� ��`� ��c�� Da���� ȧa`� ��� �t�``� ���h�� r�`��5� �`\� �  ��0� � � ��`� ��bp��  �� d�Y�  �� cdp�� 5� �`� �`bO� �� p�� 	�+b4� 6d@� �� �`� ]�bC`� �� `��� :�bC� ndp� 4�L �`� ��>[ �� E� Р�� �`�� �d � ��� H�� �`a � �` ��� � +�_� AdP� ux� �`� `b� �` t��� �`a� + ��0� 9"� �`-� �`a�� �#@� 4�� >�$`��� ldp� `'� �`� �`b� i)� $��� �`aa� �d *�3,� J�`�� �-�,�� �/� ,�:� �`a� (0�50� �1� ��`� �2`��� ��3� �`(� N�` a� 4�9� u6`7`� 7c � 8� ػ�� X`a� �d�� �:� �� N;cP� `<� ��� >W`aq l� pp in>�0q ˰ ��p P?� D��q �� 1q �� ��p �B� x0)q :C�@p �D@� �q 짰 �?q  E�)0p �iF0/0q �� q��p $G� �p]q Z� qq �� ��p dI00q Ǳ �p�p �J�r�q \-K0��q Y� `p 9M� l�Zq �� q�p �M0 �pq N�p !O�  �Zq d� �pp ��0 1}q �� �l�p ��Q0�q xRpհ	�p �0 �pq �� �# S� �U�!�q �� ��p GV� �p]q �� qq д �p &XƲrq �� u��p �0 �iq Y�p RZ� �[0q �� ��p �!0 (�q *[�0p I\� T�pq �� �p �0 [�q � ��p 6�^�q �� ��p N�0 �q _� Up �0 ���p AP`� �� Pp ��0 � �p `ap7�pp kb�� �ppp �0 ���p �cp=�b�p Jd�3�p �W0 �	q ƴ �p ��e0M�q f�;q �8� @p �g�30-q ڰ ��p �hw0Mpq �� qq &itp �0 8��q Ij3>q w� 
�p �0 ,�Y Yq k�q B� P5p �0 |pq .l�3q Z� `p �0 f�0q -m3q Yմ `p �0 �qp �,n3q X� `p ��0 2p ,o4p *X� `p �0 �dq .p3q Zu� `p �0 �p -Vq3q Y� `p ��0 Ppq *r3q �V� `p �0 2p �*s4p V� `p ��0 �pq /t3�q [� `p �0 2Yp /u4p [� `5p �0 �qp 1v�3q ]� `p �0 f�1p 2w3q ^� `p x�  ��q J� �!q 
v� �p !y� v\0q Z� 1q �� �p >zpd0q ��� 1q �� �p ��{�60q |3&Uq =� @p �0  ���p k}0e� pp U~0� `Yp 9�r� @p Z��o00�p �0 �&] �p ��s��p Q����`p �;�3@p 
��zpp �0 4F]� q =��0P@p �*��pq m� 15:pp �0 �<p ݇�0Jpq  ��0p �j�� �p@p �m��i� q �� q��p f�� ��rpp r��S0q �� 2p ʍ�pq ���p �0 2�p =�s@p �0 ��q ��c+0�q B� Pp �w�D0q `� �q ��� �p 8�� �<]q n� 1q �� ��p *��Kq |� �K�q �� �p ��P[p�q .� q0p ��0 �0q H���oq t� �p ���a�  �����  )�� 4OY 0 8f�� � �p 8J�� $ P  ��@ �']  � H \� ��� l � .��, � u �nTY �� <��� � F� PPRY �� j�� ��
� lpY �� �Ơ Ts +��� c�� G #� #� `��� � �: �� �6] @�^�� 8
���@�Y ������ ������Y ����� ̀�P2�� �@�K��� ����������#-�ˀ�Ѐ䫘� \��'��#r0�F��_�����#���� �;��ˀ�#�ί@� <�ʰ�# �W��;����\�Z ������ ����>�� �P���  $�� *�� H���V��� ������e������s���������X�w�
����Է� �����)�� �T/]  ��d� ��������U�@�P��� $��2����^�`��� �,�\8��&���b�p��c��>����+�������Ⱦ(� ����{�(� ����%��� `>] 0�,������  ���� ,����V��P��� �P������.�����^��UY `��&��/��V����B�� ���P�L�� ��A�~�� ���	�x����A���� L��A� T�� t``U� �` �`�� ����}`� �`�t� P.�� a0�  ��`.`� \`�� J�d�� �`�	��t� R` �� |d�� ~������ �`aF� 	�c:
� q` ,�Y ]� �`a� �d��� �� ``� �|`�� �d�� `��� �`� �`a(�� 1�� ��� f`�� �d�� ]��  
t� �`�h� &v�c:� x`a� �ed�� 6�c� �W`a� �d�� a��� ��� �`+a� �d�� ��� �`� �`a.�� �d�� ���)Y� �c(� IdP5� �` `y� (�+�b� Rd`� o���P� �`a�� �d�� ��cY� M�c� yd��� ���}�� �`S�� 1�cI@� >v��� �`�/� �ed�� V�c(� �W`a(� �d�� fv�c� �`a� ��d�� ��b�� �l`a� �d�� Dh�`d� �`a1� �d ��� 5�� �`� ��`�� �d�� �V�d� �` b� ��d�� ��c� �=�c(� idp� ��` �S� �c� �2d@� �` ��-� �`a�� ���/� J�c.� �� 
�p �0 ,E] -q � q
�p u�@� q �� 1/�p �0 �q ���# p F0 q-q p� q�p ��X� �pq ϰ ��[ �p D�Ơ q {�  C[ �p ��w�'pq ˰ �p ��0pq �� ��p �0 �pq ��py0S p �0 P,q �� 8 1Z  �� &�0 q
q P� q
`p `� p�q c�� �upp �0 �pq �� � �  s�  -q �� ��p e�� `pq �� r�p B� �pq �� q�p 3Ǡ 0q l� +�q �� �p G	�� x0q �� q+q д �p .
�l �0q ^� q`p �0 �>q 8�V �q b� pp �m0 ��q հ ��p q� (�q Ӱ �q �� � � ?�0]q ° �q �  �� �0 �0q � �	q  � %� 0p ��bq 9�3�p �!0 0�\ q !+�q K� Pp ���q g� �pp گ0 �pq ݰ �	�p �� �q � p `� |pq a� rp �� �H�q 
��p �3q հ ���p bsq �� eq�p �!sq �˰ q�p �#�q $�p �%� ���q &s p  �'� X-q ʰ q�p �(�� �p�p �0 �ܰ  )� P0 �� q *� ���p �0 ,� q (D+ǲ�Pp �,�pp�p i-�� �pp b.� �� �p 1/� �9��p �2� �pq 0�3� �6q  4%� p �5�)q 6� �TY q 5� @p m�8�&q Ӱ ��p�q 9� � �p s;� �0�q ٰ qq <3 p .=p]q �� 1&q �� ��p ?� �0q ��� 1q �� �p �A00q }� 1�q �� �q B��Ȳ�p 3C3q a� pp ,D0]q d� q(q �� �9p �F�0q G@� �Y q W�� `p H��]p f0 qq �� ��p �I� @0q �J�q E� Pp � Ksq V� qq ʄ� �p �Lsq �Msq 5� @p ��0 �q FN3q t� �p �P� �0q 6Q� V\��q v� �p �vR�q �� �q %
S30p `T� �$q ɰ �q ��  U� vVsq w� qq �� �p �Y� �spq Z�,0�q N� Pp �0 <�q  [3q �� t�-p�\00 1�p �0 �q ^�T t�p �0 4���p �_p+Ap `� �0 ȥ� �p �a�5�p ,�b�&p�p �c!0 �p �d(� D� �p �f'�9� p �gp40]d �p vh�p�Ap ki� İ pYp [j0D� `p V k� z� `k� �l�@ <� pr m� D�) 8bnXp `o(� h �p Vp(� � ,` jq� �. dr�@ �p ?Bs F<] P *t0 �uP�  v� *Bw @] 0 ��x� � S�  ��Y � ay@� H �� lpY �� 
{�  ޴M ;P B� ,�Y �! �XY |�Y� ��}� 6t�/��� ~h� ������!�4OY � � �0���Ǡ !������� ����Y����6�@����� ����0��G�w@����,"�I��S�u���ކ�� l��2���Bƀ0�\ �!������K�P�`��� ����C��,�� x� t�Y����Y��%������2#2�8���7�X� �����̨UY �����Dޏ�~$�!*��0�]� ̩t�u��������� �S��G��P��!� L��$�+�;�N�P����� L��
��j��� ����������lm������J�a�S�� ���W��������0�� ���*��0�?�� X�%������
������� �T��<��
@�f� ,E] -����������_��Q��`���� �)�5��5��_d`� B��� ��`a�� Ϥ�Y� 3�cX� adp�� Ŧ�� !��:0� �` �� �+�� /d0� �[�� �`��� �f��� ��� 1ed@� ���� �`a �� �` ��� �`�#� �d� �� ��� �Z�d%� o��� N�`�2� �c�� e��� �`���� S��A� �` +�� �d�� ��3�� *�d%� ?���� �`�A� �d��� 5��� �`e��� #��� uW`�� �d�� �6��� �`a ��� ��� s`+�� �d�� �[�� a`ap� �g` �,� E��;� oedp� R��� ��`a�� ���� �C�c+� qd�� L���� 1�c%@�� �` �� ���� ?d@� "��-� �`��� �ͳ�� ��� Ad2P� ���� �u�� �` �� �`�,� �c�  ��� &)� *�c0� <����� �``Y* � �d�� O��� �`� �`b�� c���'� ��`��� ���� a`�p� �` ��� E�c� od�p� s�� �0q �4p R�Ǡ ,(q �� +1\q � �p ��S�q ���p ҆�q 0�� ��q `� pp R�� -p �0 1�p ��� p C�� p q� ��p ��� |�	)q �s p I��� �pq �� 1,�q � �p ��s)q J�Pp _�sq ð �q � � �� U�sq ��� 1�p C�s7]q �� � q �� ��p ��sq �4�p /�sq �� q�q �� �p ���_�q ,��0p V0 [�_q �� q�p ��s
q A��Pp ��0 �0hq %�� �q O� Pp }���)q �� rp `&�� �pq T˰ q
`p ��p-q �� ��p ]�@� $*q �� 1 �p 	� �dpq f� �pp `*� �pq �W� 0�q �� �p 9v�q �� �p Zv�q �� �q �� �p �� +q � ձ p �0 �pq �G	� qq u� ��p %� �0eq �� @���p �� (,q  \� �Y �q �� �p Vs-q İ q�p ��� qq �� qq �%30p �s�q 2� q@p ̙sq sq 
@� Pp �� ���	q p��p `O� �pq �W� qq �� �p i��q � q�p ���r � ��p ,(�00p �Ѱ-q � �� � �0 �pq #� 0�Y* q b� pp ![sq �� q�p ov"sq �� qq �� �p F$0�q �� q�p L%Ƞ X.q �� +qq �� �p &'[�q �� ��p ,v(�q d� �q �� �p �)� �S��p Q*s%`p �0 �6q 5+� �9�q _� `p �,��q -4)p �0 ��q �� �q .s� p �/�0q �� �1 0� �0 q4Yq 1sq B� P�p �2�q &3s:0p �0 �q B4+�q r� �p 66[�,q �� q�p �v7�,q װ �q �8�,p �9�q �4:s@p ;�]q g� �q �� ��p I=�!q �� �!r�p �>��,q ا� �!q ?�p L�@�q 0A�0@�p B�q H� ��q x� �p )D�-q �� q�p E��q �� �q � r�p VG00)q �˰ ��p \Hs%q ��� �q ´ �p l6J�q �� ���p <K�q t� ��q �� �p Ms%�q a� �pp �0 3q%q EN�$p   0U� U` �``� �` �`�� �O �`�� !O�  ��� �` aR�� �� 5�` �@� �` ���� /O 4a� �d�� JOT t�P� �` ��b�� �O ���� (O |V��� hdp� �U` ���� �` �`�� ?	O �U`@� �` �`�-� �` ��� �
�O �Z �� ��O ,� �p �AO�APp �0 
�p�p -O ��� 0p �0 �qp �0 �  Od [0  �pRp �U0 � �p �0 �C�'O $0 � �0p g0 40pp �;O p� @p *�0 �� �p 6XO �qp s0 �U� �p �0 �� �ip up�p �0  � �p O Pqp cO �x� pp �� � p �O �� ʐp �0 P�0p �(0� 0p �0 �|� �p �0 �� � O *0 �� �0p �p� �p ��0 �Y �p 
�0 �p O ��O �'p �0 �� q 7 O �t@q 0 X�Y pp 8!O P�Z @p �0 8U� �p �0 P�  P"O 80 `� @�p �0 �� q � ��8q 	#O � q �.� q S� q x� :�p �0 r�p ~)�p0q �� �p ��0 4�Z �p `@*O D� q ᕰ `� �p +pU�  p �0 а �ep �0 �S��p �A0 pY �p 'P,O �00p ,`-O �0/p ��0 `� �p �0 ��p �� q �.021Up �0 �� �p �0 �� �p /��  p �0pqp �1O 0Pp 2�0 l�pp 2(O ��  p 3XO �� p Y0 ��� `p 64��0Up b0 ,� pp �U0 H� �p �0 \�� �p 50Pp�Up �0 pp�p �0 ��  6O &U0 �� 0p :0 XV���p �0 �17�O 0 tp^p �*� 0n0p G� pZPp Z� p`p w�0 �p�p �0 �p �0 �q�p �0 ���8O '0 ��0p �0 �p+p *�0 8� �p �9�O H� p  =��� q �� � �p *�0 �� �p �>�W��op �?O j@� �p �0 1 P@O �0 �p�Ap �AO �� �Yp Bp@p� p ^PCO �p`p �
Dp��EEO A0 @��p �FO T� q ;GO *�� @p �0 ���p H0G��p *z0 @p�p >I+0� @p R0 d��0Mp �0 �p�p 2�0 ��0>p ?JѰT�Z q i� q��pp �PO Lp�q � �� Qp`0 ���0#p i0 ذ jpp �0 �� q �RO q p �0 l,�pp �0 ��Yp S0pp �U0 `� �p �0 ��� �p 3T0�Up g0 �ppp ە0 ԰ �p )U�A00p �XO ൰ �p �0 qٰp �0 �pYO 
�0 $� ZO ��0 �� �p �0 �9�p �0 �pq ɰ u1�p �0 qq ��� q [�,0 ��Z p )0 q0p Q�0 �p`p p0 ��q �� qq �� ���p �0 qq ɰ q�p 1bO �pq j� 0�Y Uq ��  oN� lpY p p�O� �%8!P� ���Y 0 � ��$Q�/,0 OSȠ �.�  @�Y � �U@� /H�V� h�Y 
x� �X� � #�Y� \�Z � ![Ƞ (0� P�nY ��� a^� � # _� �6]   �`� L1�� � `Uc� � Jdk��e�2�� f���5�
8�@��g� ����\h� �q`�i� 43�v��UY* �����Uk;��̀����l;�����m� � ��n�L |�/�eo�;p��Np� ��������̈́Ѐ �q� D4Y�*r��V�,hE] ������9��s�S��Jt��P��� ���Du�XY �H%�P�w�k5Z����8����x� �����S�q�8y�Y@�[�{� 6����� |� �}� ���C� �Y P�';�D�����~���D����D���  �� ؂� �7�i��S��c��>����PPRY ��� B��7�� ��(�� ����Ƞ �8�q�+�������؋S��������f���!����T�`���� ������G�� D2���9�r���΀�œ���)���q �ɕ@� :�/ʖ� @� җ`�)� 8��@� ���� ��� �`a��� ��k;-� ``�p� ���� �`� ��� v�� ��� ��`��� y�`1�<� �`��J� d �� R��� H`� �`ar�� 2��G�� �W`aX� �d�� In��=`� �`�5�� ��� P=:� �`�5� ��/ � �� �S`� X�c%`� `��� >� .�`�Y� �d ��� ӫ� �`)� '�c0� N�@�  ?� ��`0�Y � �d��� ��� ``Y� $��;`:0� �0�� ��� ��@� 81Z � �d�� �� th@� �`���� &�`WA� B�`�Y � ��d �� ~��)[`� �`�,�� ����B� �`�a4� ��D�5� ̩��,�  ��� ��` �,� L�c+� 
|d�� /�� �T�� �`��� \��`��� �`4(OY � �d �� ���YC� �`a �� ��` ��� �`�+`� ?d@� ��� �`� �`a�� ��`XD�� �`�� 
��r� j���`� ��`a�� T�`4�]� �`aR� �d��� ��`1E� �@�cmP� v` a�-� �`a�� �ј� x�� %���0� V` �� �`��� �� �[�� r`a@�� *���2F� u`V|`q �� �p �0�� �pq U�%s`p V�p:G:q � �#q ���Y�$ p Mݳq �Ű q�p �߳Yq R��q �� ��p ����q �� �� �� &0 1-q P� 1`p �㧰T�q &�s
0p B�0 LHq �˰ 1\�p ��0�p)q D��Pp q�@� Iq �� qq ��  ��� )�� X0q �l� �	pp �0 �	-q �� �	�p %�p4p�q �� ��p ��� q�q e� +�q �� �p �q A�!p �0 ��q %�3�q O� rPp ���p
q $�t"p �0  Jrq &�p0;q R� `p ��080q �E��Pp ��pq b� �?q �� ��p ��q u� e��p >��q �W� �q �� �p I���q �� ��p �n��q ° �q J� �p h��TK�q ԰ ��p ���pq  �V �q @� Pp ��� �0q ð ��p 4� ��pq h� �q �� ��p �  0-q �� ��p R@� $Lq �W� �q � �p �� \0q `� ձpp �0 �pq �3q 7� @p ؕ	��q � �� 
� �0 �!q .հ q%q ��  �� x3q � ��p �� ܳpq "sq N� 2Pp ��q 40p�@p � �Mq h� ��p �� �p �-q �� q�p L�� L�q �� ��q ܴ �p X�-q İ ��p �;�q � �q e� p ��q 
3p  � v�pq d� �q �� �p � �[0q Z� q`p ئ3q D3Pp � sq x� 1q ʤ� �p ("�q �� 1�p f#ɠ Nq ʰ K�q ��  $�%��xp �0 ��p `�&� T�q 8�'�p=q d� pp L�(�q T)3`�p R*� ��q ��� qq � �p lE,�&q �� q��p 3-�rLq �� +�&q �� �p (/[sq �� ��p dv0�q Ȱ qq ���  1�2�xp ��0 ��p �3sYq 4�q <� @�p �5�q $6�:0p �0 q.q b7+�q �� �p 9[�q t� q�p <v:sq �� 1q �e� �p H<�q �˰ ��p |=�q N� �q >3�p �?�q �� �� @� �0 lpFYq 4A�q `� p�p �B�q TC0e�9`p $Dsq �W� qq �� �q E ɥ�  �K�E�  3F� ��Y @ 8� �N
8� ,�XY YG � , ��H�   �� Av I� � �M(J^�T` �Kv,DL # wP M�� � wf w��� O;-� w� RP@� $L�W ;�� E�R� �%� ;��3Sɠ �$���PlpY ����ـU��a��:p����EV�� ��o�p�L�W��!X�w0������Y���/�0��Z�-���;��s[��Y�ŀ�;��
��]��Ol-�ɀ�Ѐ|^�� �%] ��`@_� |���W��M�����7�`� ���g���UY p��� ���Ha�/U�r����� (h����� b� �� ��:����/�c��b� ,�Z�������d��P��+������eX� 8��F�4�OY P�+f�������������og� ��]������� �h� �� �������&����� si� 4Q]����������cj�����������Sk�,������������Bl� �#��x�������D0m�M��eW��� �d�� $�n� �`� Z`+a� �d�� o�c� J`a� vd��� p� ��]� <`a� hdp�� �` R� \-q�b`�� Yd`5� �` L`� 5r�c� adp� �` f�`� 5sd� a�dp� 	t`�`� �T`�� �d�� �lu�#S�e� �` �>� �d v� Z�` H`� �`PRY �� Sx�� ��� �`�� �d y� Wz@� T� �`�h� {� a� � �` p`�� `�|� ��5� V}�� 9d@� �!` �� !~�`I�\0� .c� ��`�� �d�� �s���`� �`�2�� ���� ���� 9d@� �` 3�� !��� .���� �` �� �d��� s��� �` ��� |�� �`]� �`a"� �d�a� v�� a�� �`a� �d ��� N` a�� z`aj�� �` ��� *�c � �` Ud� 7��� eudp� �` a
� �K`a
�� ��`�t� �`�� ��d �� R` �-� ~`a�� (��`��� ^`��� �d�� �` ��� 
�c1� �` v|`� �`a� ��c � �` H�Y� 0��� \d`�� �0 �q 8�pF+�oq b� pp c��� T�q �� �q � �p d��l �0q �� ��5p �0 �pq $�u�0p ~0 qq �� ��p �� v�p|q K� qq wu� �p �0 1q V�sq G� Pp v�0 ,E] q �� q"�p �� ,��Y q F� �q 
r� �p �� Є�q O� 1Uq {� �p �0 ��pq ��;p �0 �<Vq 9��	Uq e� pp �0 �S0q �3 p n�0 1q �� q�p N�0 �#q �3 �p �0 1q �� 1��p |�� 1q Nٰ qq ���p ^0 �q �� 1r�p ,��o�	q \˰ 1`p S��ep]q �� 1 q ״ �p ��� DW�q (��q T� �`p d�� �0�q � �q �4�p H�� �0q ��� �q ݴ �p �f�s@q �� �q J� �p �0�X�q J�� 1Y�q ~� �p �s]q X� qq �� ��p �0 �q 
�4�p ^0 2p �0 2ap L�� q7q �W� qq ̴ �p Vv�sq �� qq ҅� �p .�� �-q Z� q`p ڮpRpq d�� h��Y q �� �p `a�� �0q �K� ��p O�0Y�q �� q�p ���q h� �q ʒ� �p ��0n��q ���lC[ q 
ɴ �p ��� P Zq ܰ �nY �p #��� �pq � qq ʳ� �p F�3q ��� 1q ´ �p 쌺�q � 1q ��tp �0 �Yq U��5q �� �p �� �Y� q Q� �q {� r�p 
�pj0�q \W� 1q �� �p ��p��q i� +1q �� �p *��sq |� 1q �� �p ���[�q �3r � @p `1�� x0q e�� 1pp �0 �p�q ĳp �0 ;�]q � qq �us^ p n0 1&q �˰ ��p \�sq ��� qq ܴ �p �AǳTq v� 1q ʢ� �p 6�3q ��� 1q �� �p  {�� \�p ���#��q � ��p Q˳]q �� �q �� �9p ��0pq v��� p�p k�0ep�q ϰ r�p YҰh]q �� q��p �p0q u� eq�p ճq YW� �q �� �p �N��50#q H�3P�p �0 ��q ,��Uq V� `p �0 �s�q ٰ�q 3� @p ۰�0q �� �	�p ���  @q �+3 q 5� @p x��pa^q �� ��@  �� � 0�^p�� P4OY 8?X@ �� ��
w,�Y �� �� � v*� � .� �@� �_{� �UY ��� ��� � #YZ� _ ;` ��� �f ��� ,t����Y$ � �� w�=� #XY ip L�ɠ �]���Y����� @��;�7􃃁e��p�L�����3������7�+��e�p�����w���M�Y ��Ѐ�w�&���
T�`���� �x`�y��5����� � a� � PPRY �T�`��4ʂ݁���;���� �k�J�����J�)��0��� l��~� @���	� b�j
� P�nY ������� ���z��J��)�� ���_���
������ �c��#��,��� ���Xk�ª������&� ��� � \�Z b �K��ʋ��#����)�� �K;���� ���3�� ��K";���� ���&@� �d���'�#��|)�������r,ʠ xe����� -� �.�)�@/�P��3@� f�9B5�6] @�8�  g��9����;� ���:<� P�C[ � vd�� �?� ThR� �@c�� �`B� i`� �!` �Y � 3C� a@� )F�l �`� �`�/  G� �H�Gj�� `I�� �d��� �L� �`)� SM�M`� KO@� dk� �W`�M� �d�� �NQ``� yR�#�� �S� `l:� �`�� )T%�G0� V��Z� ga�Mp� nvWcd� �`aU� �d X� YYʠ x�� �`�5�� GZ� �(�� �`lpTY � �d�� d�^� �l� W_�,`� }aʠ pm� �`Sa4� #b�50� nNe``� ;fc%@� 	h� �n�� k`a�� �d�� Ik�8o-� �`a�� Imw`y�� �` �� �d�� p� hp� �`a��� 8q�}�� �`+a%� �d�� �s�,� �a�, tʜ �` a�� ]u`+��� �d�� �w��� 1x``@� ��` ��� <yc�� hdp� D{�[�;� �a`�� �f|�;� }c� 9ed@� b�� �g`b%� ���� �`�� �� � lB�c� �`a��� x�c� �`a� �d �� |0�� ��� o�%�;p� s�`q:� �`aa� �� � �� �[`� �`��� n��� �r� N�`�!q ��c�p ���!q _��e�`p ���!q X�� �!q G� P�p ���Hsq �Q��p <�pp]q �� 18q �� Йp �q q����p (��q |� +�q �� �p �����q � 0�p ���q M�0p%q y� �p ���� ԰	q �0��p ��� �Wdq ��Bq =� @p j��  [�?q �� ��p `�� ,�p�p FW0 1q r� �p ٦�sCq 5�s@p ��0 qCq ��wpC�q C� Pp ®�P�t�]p �� p ��0 �pq ���q /� 0p ��s-q � 1�p O��ps�r � q ��zA0 |u�p <V�sq l� pp �"���q ��p �0 t��q �p�q K� �Pp u��r � rp�� �0 �q ��� 1q +�s0p ��� pq g� ��pp n�sq Ͱ �q ��  �� D��py\q O��p�Pp lŰo�q Ӱ �*q ��3 p ��s�q Gȴp uʴ�q 0 �˰0 �p ��0 �p +̰0r0p ���bpq PJ�3`p ���)ߤq �sp Bb0 ,�q �� 1�p ��� �8vq h�tC�p :��Dpq �� +�;q ´ �p [ַpC0q Ѱ ��p D��08�q �� �q $���p  ��� hw)q ��s
�p ��w��pq � �q f��p ��4Gp _�߳`p ��4Gp ��4Gp G� Pp ����ppq [���`p )�spq �� +�Nq �� �p ��0� $x0p q�s�p :�� ��pq �� 1q Ǵ ��p ��� �0)q ��s��p ��p%yq �� �q δ �p ���Sp+q �sp v�s+q m� qq �e� �p ��s+q �˰ 1�p �s+q �s� 1q �� �p L��3Vq Q�s`�p �3Vq \� qq �� �p d�[r�q Ǳ �2�p ���r�q -0� �q Y� `p 4�-q �� ��p �;�q �� qq )�s0p Z�2Vq �� ��p 	˻2Vq 6� �q b� jpp �0 ���q V
3q C� Pp z��q �� ��p �!�q V� �q ʂ� �p ��q �� � � aw0 �_q �� �q �� �p �� P�zq ��r��p ^�  {tq Ͱ �}q �r�p a�l �0q �� r� X�|�q �� �p�q � r�p H�0p l�  �� ��Y � p6� (�8� XlpTY �,� K�� �|  � @�Y   �!� �}6"� ��Y jp `y$� � F� � %� �&@� �~�'�  < � @ u)� d*w �- � � �n�Y  + � � 
  � �]�� �XY � ,� *-@�  ��m+��Mp�р,��Y �.�M��
2�@��/� ��5�b0�_p� �2� \�)�{3���[4X� ����PRY ���7�  T��e8!��Z p��9������C[ ���;� �H\�?<�/@��\=�#�BÀ4OY ��� >� r?ˠ dt����;��c@� Ȼ������������
B�J�M�����P��� �J�����Y�C�&�M� �JD����������� ���&E��R�`� �F� p�Y�`G��p��!� �T� HT� �;��� 0�\ ����2�PI� � ���� Q����,)�J� �lK@� D�����,��)M� vx������2��O� ��)�^��`��P� 0���Q�/@� �R� <2] )�/S�0��T�����U� �L�V��W���� �-] �Y��X������Y� ���0Z�@��[�AS�� (\�0� �N]��� ^��� V_�n�� ��`��� W``:(] `� =a�T �`@� �` �A` b� �`  `�� 1c� H� � �`a1� 
�d�� qd� и�� �`�2� �d e� z�f� ��� �`%��� �g���� �`�A� �d� h� qi`7`-� �`a�� |j@� $� �W`�� �d�� �0l� �`� �m%�#�� �n`v��� 8o�P� fd�p� �p� �`)� Qqc`� r���� Z`��� �d�� �s`vS`� BtcP� �m` ��� �`��9� �v`�� 'w�0� w` \�
� �`�UY ��� 2y� ��-� �`a"�� kzw���� �`a� �ed�� �|c� 7�}c@� �` a� ��`a�� B`ah�� �`a��� {�� ��� .�`a� �d �p� E��S`� � �� �6] �� ��� ���� c��� �d�� J�`O�Y� ��D���  �`
�� |`a�� 
�d�� ��� �,�� %�㳂0� @�� ���� �`�[ � ��d ��ۖ`"`R�� ��c�� �"�`�� 
�Q`C[ � FdP�� $�`�� �aa�� ��� А�� �`a%�� ���� z` �0�� �`a��� R�`��`p `��� |� q ��� � �� I0 ��pq u� ��p D���}�q �K� ��p ��E�] q @� q=Pp lq��q �� ��5p �0 ,�q �4Yp t�� ���q а ��p  d�� `�]q �� �q � �p P��0q �� %��p &���Zq V� q(`p �f��q �p� �p �0 �q �� �)q  �s
0p ]���)q �� ��p �� �pq �4� �8@p ����q � � ��0 u��p �0 �q  
��p w�� ���q ԰ ��p  f�� �]q �� �q � ��p ��q T� ��`p �0 �q �� e��p �s
q p˰ ��p ��q �V� �q �� �p \ະl�r ��@�p �0 �pq �� %1�p ټp(�2q ��p t�[3q а 1�p dv�3q �� 1q �� �p $�� �[�q �� ��p p��0Y#q � �q�p ��0��q�p =ư�Pq m� pp ~��  $�q �� ��p B�0 ̩q V��q ?� @p �6ɳq � � ��p0 rp �0 �q � �tp ��3q �X��`p T�3]q �� �,q ݴ �9p �ϰEpq "�ճ0p O0 �pq �v� q�p Pҳ�q Ȱ 2p �ӳYq ��q M� P�p  ֳq �� ���p �׳q � Sq
q �s p @�����q �� u��p �0 �q �� q
q ��  ��8 b�� �q ��3p S���pq ��� 1�p ��pS�Eq K��Pp �m0 �pq ǰ �NЉp  �0b�q V|� q�p �0 �pq �OY �p 1�6q t� ��p �0 �6q а ��p ��� �Spq 4��h@p .��0��q �� Ph�Y q �� �9p �갖0q -�%�0p t��ϖ�q �� �q 
J� Pp ��� �t0q S�s`p `&�� �pq |W� q:q �� �p ��� $�q �p� 2p ���p]q `� 1q �� ��p ���q +�s�0p {0 �q �� e��p ���q ��� p F0 �q �p� ��p �𕶗�	p �0 �	�p D?�0�q o˰ q(pp ���p�q b��pp �0 f�pq ��*p t��tIp �0 ��p �d�tIp �0 �q 
� �q � Йlp �0 ���p �� xpq �� �q '�
 � 0p � ��0q �� ��p  �� 8�q � �q �r� p 	� �[0q �� 1��p � 
��  ��
�  =� �nYpxX� 8��, x �� ,��Y  � ^ � \� �UY � �� �� �^  � ` .� ^� H�, � � @�Y � >� � r PRY � �� �H!p_� 5� ,"
� �XY �� ��  XI,;0�V�,E]� ���lp�e� �� @���>�@��������4OY Ѐ� �[��T��}`�O�� (������}�Մ��l!��d��p��6����j���p�� � �[��ـ���n!���e�0��e@�W"� D4Z�������7� �>���� # � W$� �;���� �e�(%�� h��\��#�`��&�#���u����� �� ('� �0��(�� ���[)�V`�*��]����V������,���4��� �2�$-� �`��v�������p/�, T����\�Z ���0� ���1� ��Y �C�P� 3� 0�-�~��D���4'����5�G�Y* �D�P�q6�������,:���� �G�7e�G �t8�8�������d9�8�����8�����l;ù�\��`���� �����r�� �=`�� &>`^`p0� 6?̠ ��� �`+a"� �d�� �@�c� <Add� f` [a� �`a�� �0C� �`
� D%�� mE���� �`ad� �d� F� GH`L`� �`b7� =J�  d�� !K@� C[ � [d`� (M� �[`� �`a7�� ��N� p��  HO� ȅY �� yd�� Q�[`� �`a�� Q�R� 4�� B�`0[ � �d�� LT� t[`� �`a1�� 6�U��`+� �` �#�� �d�� �V`�E� 5Wd+� �f` b+� �` b+� `+Y� �`� �`b� kZ� P�� �`aj� ��d�� ?\�`-� �`a�� ]�� ��� d`a� �d�� �^�  $�� S_u�`� �` �q� 6V`c[� `dp� ��a�� �`��� ��b�J� <cd� �f` b� �` b� �e� ��`s� Vd` �p� �` ��,� Hfc� rd��� �g� ���� hc � �` v��� �`aR� +(i� a0� mkm`���V� �` aC��� �m� ��� �)n�� ]d`�  eo� <��� �`a�� �` ���� �`a� p� �` ����� �q� �`Y� 4r�#� �` H� � s�� J=d@� �t`O��� ru�>�p ��v0 pq w�-+pmq P� `p �x70&0q �� 1 y� y0 @�]q °