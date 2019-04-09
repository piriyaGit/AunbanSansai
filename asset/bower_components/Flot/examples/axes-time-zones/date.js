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
 * Peter BergstrÃ¶m (pbergstr@mac.com)
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
      var meth = unit === 'year' ? 'FullYear' : unit.substr(0, 1)`áĞà ãÅ 8»á &Åsc‘à `àná ^`á`à ËÅ f„àá $	äà ‡¢
`"] á Ê`áĞà vÅ Ü[àá ß`áàà ¢à6] á a`ápà ¢Å `h¼á å`áğÙà "ãá e`âAà  Å ¬à0Áà [Å ¸`á ­`a°à ^Å  ½á °`aÀà [Å ø&] `à \Å ”``à GÅl ¼`á –`á à Å ¾Zá á`áğà ™PÅ Là à ï0Å p`á 2 5ã#@à ı` a© !€Å "Å Ô`‚à #Å üaUà Ó` œ`Ràà {€%Å $¿á ú`a &Å ¶0'Å ˆàá F(à>a|à ÷)Å tH5] á ‡*ãYà +`àà : ,Å ÀA] @à -Å  À`-à á` áğà  /(Å ˜à0à [0ØÅ È`á `a. à ”1Å ÁÈ à a2``‚pà m3Å daÁà Y6Å Œ`á s7ã€à r:Å  PÂá Œ;¥ãà ã<`4ÃàP)à a=ãPpà õ>Wààâ ?ã€à }0BÅ ààá tC€Å Ğc\ €à D”D`Äá ×`a4àà RFÅ ĞÅá Ñ`âYà ,Hàà0à ªîIàG`á í`b"à DKL`Æá ³Ë`á Àà íM`à‰á NNàPnY á Ê†dà Pà/`-á O`aPà ‰QQàYÇq ê° ¬S°q "Rs0p  îSp0q ã° òp  UÅ 4È…q v° ØC[ q 
²´ Àp #WÅ ¶¤0q f° qpp  †XÅ Éq ç° qq Ys‚ p wZÅ l0-q º° ±Àp b[°pq ° 0ŒY* q Î´ Ğp Ü\‘°Êq ]ój p M0 Ìp‹q eW° ñ‰q ´ p ç¦^sq *_³0p \M`p.0q ª° P¨RY q Ş´ àp `+bÅ Ä0q n'° òp vcp.Ë
q Ó° ¤Y Yq dğ° p t°eÅ |0q ·° å±Àp Hf0&pq ^q° ±r ´ °p Ñ€gÅ ,Ìq ìhôp M0 òp ®e0 òp ´ p Ü´ip°q ÷° q  jÅ ]0 Ìp]q y° q q §´ °¹p lpC0q N° 1Pp È0 \Í:q ê° ±q mp7p p ‡nÅ ¶ 0q Ê° ±Ğp ìXoóq ° ñq J¼´ Àp ôp0PÎ¤q 7qó@p Ú¯0 Tpq Ñ° q)q rsp ‡s·ğ20q Ê° ñ,Ğp `‹tÅ èpq ¸¡° ƒY q ÷´   uÅ ƒvÅ Ğ<Ïq Æ° ²Áp ’wÅ œpq .¿° ±0q ş´  xpÅ (yp
0q k¡± åY pp 0 »1q µ° 1q ß´ àp {0JĞ­q b° 1pp ß0 f˜pq |3q 5å´ @p œ}p^0q –ß° ±àp ~0#(Ñq ·° ÌUTY q ç´ ğp 'n€°00q j° 1pµp ¦0 Àpq ¾° +1q è´ ğp <‚·ğ0q ° q€p Bï0 DÒq Vƒ3q E´ Pp ÔN„ğƒ0q …óY µp ¡0 ôpq Ã° q4q ÷´  †Å  ?‡Å DÓ­q ‚° 1p Æ0 ;1q Ş° 1q ˆË0pÊp Œ‰0)°-q Ï° ±Ğp éŠ@Å Ôq V‹3Jq G´ Pp šîŒ0b0q İ° rp œá0Apq p+¨`Y q ?´ @p DÏpaÕq Êót p t‘pp]q ¢° ñ&q â´ ğÁp ‹“Å ô0q Î° 2)p .•Å ĞXÖq \° q•q œ´  p ß–s%©q "—s40p ÿ0 fĞ°q !˜3q Ue´ `p »™³?q şƒ° ± šÅ Û0 Ğ×q ı° 1)q 1›³N@p âœ§ğ‰0q %ó0p Z§0 Ôpq Ú° x}Y àp ğğæØ°±p @Ÿ°¢° q ‚j° 0[ pp ¬€ 3q Ğ° 80q ú° 1 ¡Å ì¢3q `° 1q –Š° 1p b£ğ°pp –0 ,E]Z q À° 1#Ğp !n¥ğ§0q l° ±p¹p ¦°Kpq >° PğXY q j´ p	p +§°iÙ0İp V0 ñq €° ñp j¨°3\ 
pp İ0 \ ¹q ©00q =´ ²@p ªpI0p Bq0 ,ÊY q ¦W° 1q Ò´ àp ¬0’ğp \»  ]¬Å ğåY ` pç 0ÄÙ89­Å lpTY c,p « ğ Œ° 0®Å   Úe PğXY ‘ Á Ğ¯Å 8 F 5°Å 4OY cp n±Åì  #Í G‚ù ²Å ‡ ;›Ù ›³Õ§ ¨ Ü G‚Ø ÌUY à  Â´Å $Û©µƒ ƒ 
d€€V¶Å 
€€`€·Å  \#] €´€ à.] À€á¸˜Å ¤€$¹ƒ›
0€V€,E] -€€M€¸ºØÅ ü€û€³à »Å &€P€`€¨¼Å  PÜë€ @›Y ğ€&½XÅ ¬€P€0[ `€Æ¾Å Ì€	¿Å ,À6€Y€e€(İT€H€Á€ØÀÅ T€+Á„_ÀÌÂÅ ¦¸ÀÁÃÃ À JÄÅ  Ş-ÁÀÁ/ÀéÅ˜Å xÀÁEÆÃ‚PÀ¦ÇÅ ÜÀ-ÁùÀÂ;ÈÀRÉÅ@ Dß\À¸À ÁÀÀJÊÅ v¨ÀÁœÀÁAÁÆÄĞÀÌÅ Ô[ÀÁrÀÁ€ÀÒ¡À ,àÁşÀÁŒ ÍÅ FÎÃ-Á¢ÀÁ°ÀÏlÅ ÁÁ.ÀÁ0ÙÀvĞÃÁÒÀÁ²àÀ2ÑÃÁ^ÀeÁ`À¦ÒÃÁêÓÃ>ÀbÀ ÁÁÀÁÀÕÅl XÀ)Á”ÀÁ ÁÀfÖÅ ÈÀÁ®¼ÀÁÅÁêÄğÀ ]ÙÅ á¡ÁÚÅ ÁƒÀ÷À ÀÁSÛÅ  PRY Á‡Ä‚À`İÅ ØÀÁğÀÁ ŞÅ BùÀ TâÁQXßÅ adá dÁà İáÅ  `á „¡âà7­Z °à  äÅ (ã…á }`¬nY á Ê¸dÀà dç`y`)á &èc0à Jéí`pä`Ià ¦` aá ÊÚdàà íàJ`)á îãà ›ï@Å åá €ğÅ ƒY á 
AdPà ×òÅ ¦Œ`á »ócÀà Daõàæá È§a`á öãà œtù``á ¢úãh°à rü`—ç5á İ`\à á  ıã0à ¬ Æ ¸£`á ÚÆbpàà  µÆ dèYá  ãá cdpÁà 5Æ ä`á ×`bOà ®Æ péá 	Æ+b4á 6d@à ”Æ ´`á ]ÆbC`à ØÆ `ˆêá :ÆbCá ndpà 4ÆL Ä`á à>[ à EÆ Ğ ëá ³`á‰á ód Æ ˆ€Æ Hìá ş`a Æ Á` ¸àá Æ +á_á AdPà uxÆ ô`â `bÆ «` tíá ÿ`aá + ã‚0à 9"Æ ¬`-á ¼`aÀà è#@Æ 4îá >®$`àËá ldpà `'Æ „`á °`bà i)Æ $èïá Ç`aaá ÷d *à3,Æ J€`äà ±-ã,Àà š/Æ ,ğ:á ø`aá (0ã50à ò1Æ ”³`á ‚2`àìà Àˆ3Æ ñ`(à NŞ` aá 4ã9à u6`7`á 7c à 8Æ Ø»àá X`aá †dà É:Æ ò¤á N;cPà `<Æ ˜àá >W`aq l´ pp in>ğ0q Ë° ±Ğp P?Æ Dóºq …° 1q ±´ ‚Àp ‹BÆ x0)q :C³@p ©D@Æ ôq ì§° ±?q  Eó)0p ÜiF0/0q ¬° q‚°p $GÆ Èp]q Z° qq †´ ¹p dI00q Ç± ÅpĞp ÎJÆr…q \-K0ğ‰q Y´ `p 9MÆ lõZq •° q p ÙM0 Ôpq N³p !OÆ  öZq d° ñpp –·0 1}q À° ±lĞp œüQ0ğq xRpÕ°	€p Î0 Ğpq ş° ñ# SÆ ¢U°!÷q ›° ƒòp GVÆ Œp]q ¤° qq Ğ´ à±p &XÆ²rq ‚° u±p â0 ±iq Y´p RZÆ Ğ[0q ®° ñ°p ş!0 (øq *[ó0p I\Æ T»pq Œ° òp ¶0 [±q à° ±ğp 6¶^óq ’° ñ p Nò0 ñq _ó Up ‚0 ¨ğp AP`Æ ¼° Pp »•0 à° Àp `ap7·pp kbÆÔ üppp ã0 ±œğp ³cp=ùbÀp JdÆ3†p œW0 ±	q Æ´ Ğp ¹Îe0Mğq fó;q Ê8´ @p —g°30-q Ú° ±àp hw0Mpq ú° qq &itp ü0 8ú²q Ij3>q w´ 
€p á0 ,ÊY Yq k³q B´ P5p ø0 |pq .l«3q Z´ `p ÷0 f´0q -m3q YÕ´ `p ø0 èqp ¬,n3q X´ `p Îø0 2p ,o4p *X´ `p ø0 ûdq .p3q Zu´ `p ÷0 òp -Vq3q Y´ `p õÍ0 Ppq *r3q êV´ `p õ0 2p ¬*s4p V´ `p šù0 „pq /t3Õq [´ `p ù0 2Yp /u4p [´ `5p ù0 ¸qp 1v«3q ]´ `p ù0 fì1p 2w3q ^´ `p xÆ  èüq J° ±!q 
v´ €p !yÆ v\0q Z° 1q †å´ p >zpd0q ®‰° 1q µ´ Àp œ°{°60q |3&Uq =´ @p ˆ0  ıp k}0e° pp U~0° `Yp 9°r° @p Z€°o00Åp Ù0 &] àp ¦s²°p Q‚°°Ò`p ”;ƒ3@p 
„ğzpp ú0 4F]² q =…°0P@p Ü*†ğpq m° 15:pp ã0 ²<p İ‡§0Jpq  ˆ³0p Àj‰Æ şp@p ÜmŠ°i° q °° q‚Àp f‹Æ ¤ğrpp rŒğS0q µç° 2p Êğpq Ôóp ú0 2©p =s@p Æ0 ÿq °c+0òq B´ Pp ‘wğD0q `° ñq Œ…´ p 8’Æ ±<]q n° 1q š´  Ùp *“³Kq |° ±K•q ¦´ °p ”ğP[pÄq .° q0p ôÍ0 „0q H•ğ°oq t´ €p û•Æa»  Àÿû•Æ  )–Æ 4OY 0 8f—Æ ø ¸p 8J˜Æ $ P  ™Æ@ ¬']  Ê H \Ğ …šÆ l  .œÆ,  u ¬nTY ­° <°Æ ì F© PPRY İà jŸÆ ¨ß
¼ lpY æğ ¡Æ  Ts +¿¡° c¢· G #‘ #  `÷£Æ è : ¤Æ À6] @€^¥Æ 8
¡€@›Y ‚°€¨¦Æ „€ë€ğåY ğÁ€ï§Æ Ì€P2¨Æ @€K€©Æ –€€ˆªƒ#-Ë€Ğ€ä«˜Æ \€'¬ƒ#r0€F­€_€‰€‚#€ˆ®Æ ô;€Ë€‚#€Î¯@Æ <Ê°ƒ# €W±€;€š€\­Z  Á€û²Æ ĞÀÁ¬>³À ÀPÀÿÀ  $´Æ *ÎÀ HÀĞÀVµØÆ À†Á¨ÀÁe•ÁÒÄàÀs¶ÀƒËÀÁ©ÀğXÀwÀ
ÕÄàÀÔ·Æ æ ÀÁ¸Ä)ÁÀ ÀT/]  ¹ÀdÀ ÊèÀÀÀºÀÀUÁ@ÄPÀüÀ $ÈÁ2»ÃÁê^Ä`ÀæÀ Á,Á\8¼À&À’ÁbÄp¹Àc½À>ÀÁ¹À+Á‰ÁçÄğÀÈ¾(Æ ¤ÀĞÀ{¿(Æ ÈÀ€À%À€Æ `>] 0À,ÁÀ¶ÀÀÂ€Æ  À‚ÀÀ ,·ĞÀìVÃÄPÀ¨À ÂPÀÊÒÄàÀ.ÄÀ¡ÀÁ^ÀÌUY `¹À&ÅÀ/ÀÁVÀƒÂÀBÆÆ ´À‚PÀLÇÆ ØÁAÀ~ÈÆ üÀ€	ÀxÉÀò€AÀ ÊÆ LÀ°Aà TËÆ t``Uà Å` ”`Ğà îÌà}`á ú`átá P.ÍÆ a0à  îÎ`.`á \`áá Jd à Ï`‹	»àtà R` áá |d€à ~Ğà†Úá İ`aFá 	Ñc:
à q` ,ÊY ]á ¦`aá ÒdàÁà ÓÆ ``á ®|`áá ´dÀà `˜ÔÆ ¸`á È`a(Ğà 1ÕÆ »áá f`áá ’d à ]ØÆ  
tá `âhà &vÙc:á x`aá ¢ed°à 6Úcá ˆW`aá ²dÀà a°ÛÆ ˜àá š`+aá ÊdĞà İØÆ Ô`á ‹`a.•á ¿dÀà ¾Şã)Yá ßc(á IdP5à Ö` `yá (à+ãbá Rd`à oâÑàPá ³`a•á çdğà îãcYá Mäcá yd€¹à ›åà}àá ú`Sáá 1æcI@à >vçãá `á/á ÉedĞà Vèc(á ¨W`a(á Òdàà fvécá ¸`aá âådğà ëàbàá ®l`aá ˜d à Dhì`dá À`a1á ğd íÆÀ 5îÆ Œ`á ®œ`á†á ÊdĞà ìVïdà ¨` bà ÊÒdàà Şğcá ¬=ñc(á idpà ÎÑ` áSá òcá ª2d@à ”` èà-á Ä`aĞà ëó³ã/á Jôc.á ´ 
p ¶0 ,E] -q à° q
ğp u÷@Æ q µë° 1/Àp æ0 ñq Ôøó# p F0 q-q p° q€p ›ùXÆ °pq Ï° ÌÙ[ Ğp DúÆ  q {°  C[ €p —ûw°'pq Ë° òp Ğü0pq ıÆ Õñp ã0 àpq ¬şpy0S p ¼0 P,q ÷° 8 1Z  ÿÆ &·0 q
q P° q
`p `Ç pğq c«° ±upp Ê0 Ôpq ø° ± Ç  sÇ  -q ¶° ñÀp eØÇ `pq ¸° rÁp BÇ Ğpq …° qp 3Ç  0q l° +±q œ´  p G	ØÇ x0q ¤° q+q Ğ´ àp .
Çl ¼0q ^° q`p æ0 ñ>q 8ÇV ñq b´ pp ©m0 ø°q Õ° ñàp qÇ (ºq Ó° ±q ı´ À Ç ?ğ0]q Â° ñq ğ´  ĞÇ ¶0 ¸0q ğ° ±	q  Ç %± 0p åğbq 9Ç3•p Æ!0 0„\ q !+óq K´ Pp ·°°q g° ±pp Ú¯0 Üpq İ° ±	àp ¿Ç ¤q ³ p `Ç |pq a° rp ÇÇ ˜Hùq 
óÙp ’3q Õ° ñ²àp bsq ¥° eq°p !sq âË° qğp ³#óq $ôp Á%Ç ¦ìğq &s p  ‡'Ç X-q Ê° qĞp ’(¨Ç ¸p p ù0 ‚Ü°  )Ç P0 ô° q *Ç Öğ‰p ÿ0 ,° q (D+Ç²ÀPp ‰,Ëppp i-°° ‚pp b.Ç À± p 1/Ç È9ğ³Áp É2Ç èpq 0È3Ç ±6q  4%³ p Ÿ5ğ)q 6Ç ¤TY q 5´ @p m¢8ğ&q Ó° †¬pÄq 9Ç ± ‚p s;Ç  0q Ù° qq <3 p .=p]q ° 1&q ¿´ ÀÁp ?Ç „0q ®ƒ° 1q ³´ Àp ÜA00q }° 1•q ­´ °q BÇòÈ²Ìp 3C3q a´ pp ,D0]q d° q(q ’´  9p ±Fğ0q G@Ç ƒY q W¥´ `p H°ğ¹]p f0 qq ”´  Áp °IÇ @0q ¬Jóq E´ Pp ì Ksq V° qq Ê„´ p  Lsq ¬Msq 5´ @p šğ0 °q FN3q t´ €p ÈPÇ ”0q 6QÇ V\°Æq v´ €p vR³q ÷° ñq %
S30p `TÇ Ğ$q É° ±q ù´  UÇ vVsq w° qq ¥´ °p —YÇ €spq Zğ,0àq N´ Pp ä0 <²q  [3q ı° tø-pÊ\00 1”p °0 ±q ^ÇT t°p ë0 4ığp ï_p+Ap `Ç ×0 È¥° àp ¹aó5Àp ,´bğ&pÀp ãc!0 ğp Òd(Ç D° àp ×f'°9± p †gp40]d p vhğp€Ap kiÇ Ä° pYp [j0D° `p V kÇ zº `kÇ ‹lÇ@ < pr mÇ D€) 8bnXp `o(Ç h Œp Vp(Ç  ,` jqÇ ¸. drÇ@ ğp ?Bs F<] P *t0 ÿuPÇ  v¦ *Bw @] 0 ƒ°xÇ ä Sß  ğåY à ay@Ç H ³¡ lpY İà 
{Ç  Ş´M ;P B± ,ÊY æ! ğXY |€Y€ € }Ç 6t€/ó€ ~hÇ ¥€à€ò!€4OY  Ç 0€ €Ç  !ı€¡‚Ç ²€€€Y‚ƒ6„@Á€ºƒÇ À€¬0„€G€w@€õ€,"I…ƒSu„€€Ş†ÇÌ l€2‡„€BÆ€0„\ !®ˆ€€•K„P€` ‰Ç ĞÀÁôCÀÂ,ŠÇ xÀ t¼YÂÁÀÁYÁë%ÄğÀÀŒÀ2#2Á8ÄÀ7XÇ ¬ÀÁÀÌ¨UY ÁÀÄĞÀDŞÀ~$Á!*Ã0À]À Ì©tÁuÀÁÁŸÄ Àë‘Ç ìSÀÁG’ÃPÀÒ!À LªÁ$“+Ã;ÁNÄPÀ­”˜Ç LÀÁ
•ÃjÀ“À °ÀÁå§ÀÁÁ–ÃÀlm—ÃÁÊÀÁJĞaÀS˜Ç ÁÁ¥WÀÁÁÏÄĞÀ²0šÇ ÜÀÁ*›Ã0À?œÇ Xè%Á£ÀÁ’Á
ÑÄàÀùÇ TøÁ<Ã
@ÀfÀ ,E] -ÁÀÁ ÀõŸ§À_ÀÁQ Ã`ÀÎãÀ Á)Á5¡Ã5ÁÊ_d`à B£ãá –º`aÀà Ï¤ãYá 3¥cXá adp™à Å¦ãá !§ã:0à ³` áá ¨+ãá /d0à ª[ãá Š`áà Ÿf«ãá ¬ãá 1ed@à •­ãá ñƒ`a ®Ç ƒ` »áá Õ`á#á ÿdÀ ¯Ç â°ãá ÌZ±d%à o²ãá NÓ`á2á ³cÙà e´ãá Á`á²Ğà SµäAà ¥` +áá ÏdĞà ²·3ãá *¸d%à ?¹»ãá £`âAà Ñd²àà 5»ãá ‘`eá à #¼ãá uW`áá Ÿd à ‚6¾ãá ú`a ¿°Ç Àãá s`+áá ¡d°à Â[ãá a`apà óg` á,á EÃã;á oedpà RÅãá ÊË`aĞà ßÆãá ¬CÇc+á qd€à LÕÈãá 1Éc%@à Ã` áá Êã•á ?d@à "Ìã-á š`á à ¯Í³ãá Îãá Ad2Pà ¥Ïãá Ğuãà “` áá å§`á,á Ñcà  ÖÒÇ &)á *Óc0à <Ôàààá –``Y* á Ñdàà OÖØÇ è`á ’`b‰à c×à'á –¦`á°à Ùã­á a`ápà ó` ³áá EÚcá od‚pà sÜÇ ¤0q İ4p RŞÇ  ,(q °° +1\q à´ ğp óàS³q ˆá³p Ò†â³q 0ãÇ ±•q `´ pp Råô -p Ê0 1Ğp ßæ³ô p Cçô p q´ ‚€p ÑèÇ |°	)q és p IêØÇ Øpq ·° 1,•q å´ ğp Òìs)q Jí³Pp _î»sq Ã° ±q ñ´ À ïÇ Uğsq –±° 1Àp Cñs7]q •° ñ q ¿´ À™p ¢ósq ô4Ùp /õsq “° q•q Á´ Ğp éöó_©q ,÷³0p V0 [ñ_q €° qp å¦øs
q AùóPp šÓ0 °0hq %úó •q O´ Pp }û°è)q À° rp `&üÇ „pq TË° q
`p ş°p-q ° ñ p ]ÿ@Ç $*q ° 1 p 	È ¶dpq f° ñpp `*È Ìpq ‚W± 0ƒq ²´ Àp 9v³q –° ²p Zv³q ²± °q â´ ğp ¦È +q È Õ± p ú0 €pq °G	È qq u´ ‚€p %È À0eq ‚° @›ğŒp é€È (,q  \È ¤Y •q ´  p Vs-q Ä° qĞp ªìÈ qq ÷° qq ”%30p Õs¡q 2È q@p Ì™sq sq 
@´ Pp ùÈ ¦Œ°	q p³€p `OÈ øpq ˆW° qq ¸´ Àp i¶³q à° qğp ¼¿³r ° ±øp ,(ğ00p °Ñ°-q ó± °  È Û0 ¤pq #È 0ŒY* q b´ pp ![sq ° q p ov"sq ¨° qq Øå´ àp F$0ğq £° q°p L%È  X.q „° +qq ²´ Àp &'[³q ƒ° ±p ,v(³q d° ±q ’´  p õ)È ¬S±–p Q*s%`p ã‡0 ±6q 5+È ±9•q _´ `p µ,³Ùq -4)p £0 ±q õ° ±q .s² p ™/³0q ö° Á1 0È º0 q4Yq 1sq B´ P™p É2³q &3s:0p ê0 ±q B4+³q r´ €p 66[ó,q ¤° q°p Šv7ó,q ×° ±q Ê8ó,p Æ9³q ”4:s@p ;³]q g° ±q •´  Ùp I=³!q À° ±!rĞp Ÿ>°ğ,q Ø§° ±!q ?óp L¹@³q 0A³0@Ùp B³q H° ±•q x´ €p )D³-q  ° q°p E»³q ¸° ±q è´ rğp VG00)q ³Ë° ±Àp \Hs%q ®”° ñq Â´ Ğp l6J³q “° ± Ùp <K³q t° ±•q ¢´ °p Ms%­q a° ±pp ó0 3q%q EN³$p   0Uà U` €``à ­` ˜`°à ÔO À`àà !OØ  èàà ` aR à ãà 5«` á@à †` à‚à /O 4aà ÏdĞà JOT tàPà ‹` ¸àbà ãO ˜àğà (O |Véàà hdpà ’U` ¤à à í` ´`ğà ?	O ÔU`@à ˜` ì` -à ï` áğà ¬
€O êZ °à  ëO ,° ğp ¨AOòAPp 0 
Œpp -O ªœ° 0p …0 Èqp ü0 ä°  Od [0  ëpRp ÁU0 ° Ğp ô0 ÂC°'O $0 ± ª0p g0 40pp  ;O p° @p *ë0 ´° ğp 6XO Øqp s0 èU° €p Ö0 ô° àip upì°p â0  ° ğp O Pqp cO Êx° pp °° ‚ p †O ø° Êp ¦0 Pí0p ¬(0° 0p ‘0 ª|°  p ÿ0 ˜°   O *0 °° ²0p p° p ‚¤0 ì¶Y °p 
÷0 øp O À±O î°'p ş0 ø° q 7 O ñt@q 0 X¨Y pp 8!O PïZ @p ·0 8U° Àp ó0 P°  P"O 80 `° @µp ¿0 €° q ä° Ãñ8q 	#O ± q ¶.´ q S´ q x´ :€p 0 r‘p ~)·p0q ¯° ñ¡°p ‚Ó0 4ñZ àp `@*O D° q á•° `° ğp +pU°  p ˆ0 Ğ° ep  0 üSğ‰p ¾A0 pY Àp 'P,O ì00p ,`-O ò0/p ‹Õ0 `° p  0 ²Íp °´ q †.021Up «0  ° °p ä•0 ¼° ğp /ğå°  p æ0pqp  1O 0Pp 2Ğ0 lópp 2(O ˆ°  p 3XO ¤± p Y0 ¸¥° `p 64°ô0Up b0 ,° pp —U0 H°  p å0 \¥° ğp 50Pp£Up Š0 ppp ı0 œ°  6O &U0 ¸° 0p :0 XV†°±p û0 Ä17ÈO 0 tp^p Ö*± 0n0p G± pZPp Z± p`p wÕ0 ˆp€p ‰0 ò°­p š0 ñq p ÿ0 Âğñ8O '0 ñÊ0p ¸0 õp+p *è0 8° ğp ğ9˜O H± p  =ğ«° q ‘° ì°  p *Ö0 ü° àp >°Wö°op î?O j@° ğp ú0 1 P@O Ê0 ŒpĞAp šAO ´°  Yp Bp@p£ p ^PCO ôp`p ş
Dp÷°EEO A0 @ùğ•p  FO T° q ;GO *Œ° @p à0 úÓğp H0Gˆ°p *z0 @p€p >I+0° @p R0 d—«0Mp 0 øp p 2¯0 °0>p ?JÑ°TûZ q i° q‚‚pp ²PO LpÍq ó° ñÂ Qp`0 ¬Àü0#p i0 Ø° jpp ë0 ô° q ¨RO q p †0 l,ıpp ™0 ± Yp S0pp šU0 `°  p í0 €¥° ğp 3T0°Up g0 ¬ppp Û•0 Ô° àp )UğA00p ’XO àµ°  p ¦0 qÙ°p ü0 şpYO 
ö0 $± ZO Õ0 „° p  0 ²9µp À0  pq É° u1Ğp ğ0 qq ù³° q [ğ,0 °ğZ p )0 q0p QÕ0 Àp`p p0 ñİq ° qq ™° ñº p À0 qq É° qĞp 1bO Ğpq j° 0ŒY Uq £»  oNÈ lpY p pÅOÈ ¬%8!PÈ  ğåY 0 ³ °$Q¼/,0 OSÈ  .Ç  @›Y Ğ ÀU@È /H€VÈ hªY 
x€ àXÈ ˆ #›YÈ \­Z   ![È  (0‡ P¬nY ¿ÀÁ a^È ” # _È À6]   †`È L1´Æ Ğ `UcÈ È Jdk€¸e€2ä f€ƒ€5
8„@€ågÈ †¼€\hÈ q`€iÈ 43v€ÌUY* ¦„°€Uk;ƒÌ€‚€l;ƒæ€mÈ  €÷nÈL |€/eoƒ;pÁ€NpÈ ü€®€Í„Ğ€ çqÈ D4Y*r„é€V€,hE] Á€ÀÁ€9ÀîsÀSÀÁJtÕÃPÀæÀ ôÀÁDuÀXY ÁH%ÄPÀwÀk5ZÁ–ÀÁ8 Àš°xÈ ¨ÀÁıÀSÁqÁ8yÃY@À[€{È 6ÁõÀÁ€ |È °}È ¤ÀÁCÀ ƒY PÀ';ÃDÁ•ÀÂÀ~€»ÃDÁÍÀÁDÁıÄ  È Ø‚È 7ÁiƒÄS¹Àc„À>ÀÁ¿ÀPPRY ÁóÄ B…À7‡È èÀ(ÁÀ ÁğÀ‰È  „8ÁqÀ+Á¹Á¤Ä°ÀØ‹SÃÁ˜ŒÃ ÀÆfÃÁ!ÃÈÁTÄ`À‚È ÜÀÁúÀÂG‘È D2’À­9ÁrËÁÀÎ€ÀÅ“À›À)Á”Ãq ÀÉ•@È :Á/Ê–Ã @à Ò—`à)á 8˜ã@à “™ØÈ ìàá ß`a‚àà ›àk;-á ``ápà ¥œãá ğ`á ÈÀ vÈ  àá –É`áĞà yŸ`1¨<á Ä`ğàJâ d  È R¡ØÈ H`á ®`ar°à 2¢àGàá „W`aXá ®d°à In¤à=`á À`á5Ğà ”¥È P=:á ì`á5á ¦ã/ à á§È œS`á X¨c%`à `€©È >á .Ã`áYá şd ª€È Ó«È €`)á '¬c0à N­@È  ?á ¬¡`0ŒY á ëd‚ğà Š°È ``Yá $±à;`:0à æ0²È øàá ‚³@È 81Z á ºdÀà ·È th@á Ö`áà‰à &º`WAá BË`¤Y á ÿd »È ~¼à)[`á Ò`á,àà ‹¢½àBá Ö`³a4á ¾àDà5à Ì©¿ã,á  Àäà Îô` á,á LÁc+á 
|d€à /ÃÈ ¶Tàá `á à \€Ä` àá Í`4(OY á ûd ÅÈ ‚ÆàYCá ù`a ÇÈ š»` €àá È`¬+`á ?d@à ÊØÈ Ä`á ¡`a°à €Ë`XDá Ù`áá 
Ìãrà jÍàİ`á ÇË`aĞà TÎ`4à]á ¦`aRá Ğdà‰à ıÏ`1Eá Ô@ĞcmPà v` a²-á  `a°à âÑ˜È xàá %Òãº0à V` áá €`áà ÔÈ Ğ[àá r`a@€à *¢Õà2Fá u`V|`q ¡´ °p İ0×È Œpq UØ%s`p VÚp:G:q â° ñ#q ÛËğY°$ p Mİ³q –Å° qĞp Æß³Yq Ràóq †´ ¹p ·áğğq ú° Áñ âÈ &0 1-q P° 1`p Éã§°Tğq &äs
0p B–0 LHq ÊË° 1\Ğp ¼æ0†p)q DçóPp qè@È Iq Ç° qq ş´  éÈÀ )êÈ X0q Öl° ±	pp –0 ±	-q À° ±	Ğp %ì·p4p”q ° ñp °íÈ q”q e° +ñq ´ p åî³³q Aï´!p Ó0 ³±q %ğ3˜q O´ rPp Èñğp
q $òt"p Ò0  Jrq &óp0;q Rå´ `p éô080q ”Eõ³Pp öğ’»pq b° ±?q ´ ²p ø³q u° eñ€p >ù³q ’W° ±q ¾´ Àp I¶û³q ¥° ±°p ìnü³q Â° ±q Jî´ ğp hş°TK´q Ô° ±àp °ÿğpq  ÉV ±q @´ Pp €°É ¤0q Ã° ±Ğp 4É ü»pq h° ±q ”´ ‚ p É  0-q „° ±p R@É $Lq ¶W° ±q â´ ğp °É \0q `° Õ±pp Õ0 ´pq ¬3q 7´ @p Ø•	Éò¹q ñ° ±à 
É ƒ0 ±!q .Õ° q%q ÿ´  °É x3q ä° ±ğp ¾É Ü³pq "sq N´ 2Pp È³q 40pÁ@p É ĞMq h° ²•p ”´  p ³-q „° qp LØÉ L°q °° ±•q Ü´ àp X³-q Ä° ±Ğp Œ;³q ğ° ±q eó p ˜³q 
3p  É v„pq d° ±q ´  p É ¼[0q Z° q`p Ø¦3q D3Pp ì sq x° 1q Ê¤´ °p ("³q ”° 1 p f#É  Nq Ê° K±q ö´  $°%µ³xp ä0 ±ğp `Ô&É T°q 8®'ğp=q d´ pp Lè(³q T)3`Áp R*É Œ°q ®¶° qq â´ ğp lE,ó&q ¡° q°±p 3-ÉrLq …° +ñ&q ¯´ °p (/[sq ”° ± p dv0³q È° qq ô©´  1ğ2³xp –ä0 ±ğp ¬3sYq 4óq <´ @™p ¸5³q $6ó:0p ş0 q.q b7+³q ´ p 9[³q t° q€p <v:sq  ° 1q Ìe´ Ğp H<³q ´Ë° ±Àp |=³q Nà° ±q >3Ùp ˆ?³q ô° ±  @É Ğ0 lpFYq 4Aóq `´ p™p èB³q TC0e°9`p $Dsq ˆW° qq ´´ Àq E É¥º  ¤KğEÉ  3FÉ ğåY @ 8£ ÄN
8Ù ,ğXY YG Œ , ˆ°HÉ   ìô Av IÉ Ä ÈM(J^ÊT` ØKv,DL # wP MØÉ ì wf w•’  O;-„ w RP@É $L¶W ;âğ E€RÉ ¬%¡ ;°€3SÉ  °$…€PlpY ¯„°Ù€Uƒa€:p€ó€EV¬É o„p€LÅWƒ!Xƒw0€³€Yƒ•/„0€…Zƒ-á€;ğ€s[»ƒYÅ€;ï„
ğ]€‰Ol-€É€Ğ€|^€É ¨%] €€`@_É |ÀÁWÀÁMÁÉÄĞÀ7°`É ÀÀÁgÀ ÌUY pÀöÀ ÿÁHaÃ/UÁrÄ€ÀÎÀ (høÁúÀÁ bÉ ŠÀ ¨ß:ÁÜÀÁ/ÁcÃÀbÀ ,àZÁÀÁÀ¢dÀ€PÁÀ+ÁÁ©Ä°ÀeXÉ 8ÀÁFÀ4OY PÀ+fÀ»ÀÁŠÀÁÁ¸Ä‚ÀÀogÉ ¸À]ÁÎÀÁÁüÄ ĞhÉ ‚À üÀÁ®¸ÀÁ&ÁäÄğÀ siÉ 4Q]Á§ÀÁÁÓÄàÙÀcjÃÁ—ÀÁ•ÁÃÄĞÀSkÀ,»ÀÁ‰ÀÁÁµÄÂÀÀBlÉ Á#Á®xÀÁÁ¤Ä°ÀD0mÀMÚÁeWÀÁá ‘d à $°nÉ ¤`á Z`+aá †dà o»cá J`aá vd‚€à pÉ Üà]á <`aá hdp…à ô` Rá \-qàb`‹á Yd`5à í` L`á 5r«cá adpà ü` fŒ`á 5sdà aådpà 	t`“`á ®T`áá €dà ´luà#Sàeà Î` â>à ÿd vÉ Z­` H`á ä`PRY ğà SxÉì ˜àá »`áá òd yÉ Wz@É Tá á‡`áhá {É aª à ¢` p`°à `®|É à5á V}ãá 9d@à ó!` ¨á !~Ë`Ià\0à .cá ®`áá ¹dÀà Üs€à€`á ¡`á2°à ®äà ‚«äà 9d@à ó` 3âà !ƒäà .„»äà ` âà ¹d²Àà s…äà ¡` ƒâà |†É Œ`]á ¶`a"á ædğaà v‡É aá È`aá òd ˆÉÜ N` aá z`aj€à â` Øàá *‰c à ÿ` Udá 7Šãá eudpà ¾` a
á êK`a
ğà œ‹`¬tá Ò`áá şÁd ŒÉ R` á˜-á ~`a€à (Ñ`¯úá ^`áÕá Šdà Ş` á©á 
c1à ¸` v|`á î`aá ªc à Ü` Hà³Yá 0ãá \d`à æ0 ñq 8‘pF+°oq b´ pp c’ØÉ Tğq ¹° ñq ç´ ğp d“Él œ0q ”° ± 5p ö0 Ğpq $”u³0p ~0 qq ª° ñ°p •É v´p|q K° qq wu´ €p å0 1q V–sq G´ Pp v¡0 ,E] q  ° q"°p —É ,èÊY q F° ñq 
r´ €p ˜É Ğ„ûq O° 1Uq {´ €p ã0 ü³pq ™ô;p Ü0 <Vq 9š³	Uq e´ pp ç0 €S0q ›3 p n·0 1q š° q p Nò0 ñ#q œ3 İp ƒ0 1q ³° 1ÂÀp |É 1q NÙ° qq ³İp ^0 ±q Š° 1rp ,Ÿ°o°	q \Ë° 1`p S ğep]q ©° 1 q ×´ àp ·¡É DW²q (¢³q T´ ‚`p d£É ˆ0q â° ñq ¤4Áp H¥É à0q ®¯° ±q İ´ àp ìf¦s@q ¸° ñq Jâ´ ğp î§0€X„q J¨É 1Y•q ~´ €p ©s]q X° qq ‚´ p Ş0 ±q 
ª4İp ^0 2p Š0 2ap L«É q7q  W° qq Ì´ Ğp Vv¬sq ¨° qq Ò…´ àp .­É ñ-q Z° q`p Ú®pRpq d¯É h¨ªY q —´  p `a°É ô0q •K° ± p O±0Y´q ƒ° qp ì²óq h° ñq Ê’´  p À´0n°‰q ’µ°lC[ q 
É´ Ğp ¤¶É P Zq Ü° ¬nY àp #¸Éì €pq ° qq Ê³´ Àp F¹3q ®˜° 1q Â´ Ğp ìŒº³q à° 1q ¬»tp ÿ0 à°Yq U¼ó5q ƒ´ p ½É ¼Yº q Q° ±q {´ r€p 
¾pj0ªq \W° 1q †´ p ¢¿p…Ùq i° +1q “´  p *À»sq |° 1q ¦´ °p §Á°[¹q Â3r ´ @p `1ÃÉ x0q e«° 1pp ë0 Ôp©q Ä³p –0 ;±]q è° qq Åus^ p n0 1&q šË° ñ p \Æsq ®°° qq Ü´ àp ìAÇ³Tq v° 1q Ê¢´ °p 6È3q ®ˆ° 1q ²´ Àp  {ÉÉ \€p ªÊğ#Şq í° òÎp QË³]q †° ±q ²´ À9p íÍ0pq vÎËğ på€p kĞ0epq Ï° rĞp YÒ°h]q µ° qÀ¹p Ôp0q u° eq€p Õ³q YW° ±q ƒ´ p ìNÖğ50#q H×3Pp Ú0 ñÎq ,ØóUq V´ `p Ñ0 ”sğq Ù°ğ°q 3å´ @p Û°Ø0q €° ±	p  ÜÉ  @q İ+3 q 5´ @p xßÑpa^q ÷° °íº@  àÉ » 0¼^páÉ P4OY 8?X@ ãÉ ğô
w,åY €Á æÉ ô v*¨ ğ .° è@É _{¡ ÌUY «‚° ÛêÉ ü #YZë _ ;` €ìÉ ®f ”  ,tî×åY$ à Şï wÚ=ğ #XY ip LòÉ  À]°€YÀ€ĞóÉ @³€;7ôƒƒe„²p€Lö„€°€3‚€Ğ÷„€7ø+„€e„p€›ú³ƒwû€M€Y €ÎĞ€w&üƒ
T„`€óşÉ x`yÿ€5›€¿€³ Ê a Ê PPRY T„`±€4Ê‚İ—€; €Ê kÀJÁıÀğÀJÁ)ÀÀ0À×Ê lÀÁ~Ê @ÁÀù	Ê bÁj
Ê P¬nY Á¢Ä°ÁÀÊ „ÀÁzÀÁJ€À)Êì äÀÁ_ÀÁÁ
‹ÄÀÊ cÁÀ#ÕÀ,ÀóÀ ¤ÀÁXkÊÂªÁœÄ ÁÀ&Ê ôÀÁ Ê \­Z b ÀKÊÂ›ÁÊ‹ÀÁ#ĞÀ¬ÊÂƒ)ÁÃ ÀK;ÄÀÊÀ ÂÀ¬3ÄÀ ÄÀK";ÄÀÊÀ ÂÀ„&@Ê ´dÁ—Ê'Ã# À|)ÃÁàÀÁğÀr,Ê  xeÁøÀÁ -Ê Ü.Ã)Á@/ÃPÀè3@Ê fÁ9B5À6] @ÀÂ€8Ê  gÁÅ9ÃĞÀÇ;Ê ÈÀÁ:<Ê PØC[ á vd€à ×?Ê ThRá ·@cÀà „`BÊ i`à ÷!` ƒY á 3CÊ a@à )FÊl ”`á ú`á/  GÊ öHàGj²á `Iãá œd‚ à ‚LÊ ¸`)á SMãM`à KO@Ê dká ±W`áMá édğà öNQ``á yRã#€à ¥SÊ `l:á û`á‰á )T%ãG0à VàôZá gaàMpà nvWcdá Í`aUá ùd XÊ YYÊ  xŞá µ`á5Àà GZÊ Ä(Ùá ™`lpTY á ÃdĞà d€^Ê °lá W_ã,`à }aÊ  pmá ç`Sa4á #bã50à nNe``á ;fc%@à 	hÊ ¤nºá k`a‚á Ÿd à Ikà8o-á ï`ağà Imw`yáà §` á¶á ×dàà pÊ hpá `a¹à 8qà}àá Œ`+a%á ¸dÀà ”sã,á ÷aà, tÊœ ş` a‘á ]u`+àá ‰dà ²w³ãá 1x``@à šè` „àá <yc•á hdpà D{à[à;á §a`°à ®f|ã;á }cá 9ed@à bãá ág`b%à ˜€ãá ì§`áá ã à lBƒcá Á`aĞÙà x„cá Ì`aá ød …Ê |0ˆÊ ¼àá o‰%ã;pà s‹`q:á Ù`aaá Œã° à Ê ø[`á İ`á¶àà n€‘Ê  rá NĞ`±!q ’³c™p ¹”³!q _•°e°`p ¹–³!q X—Ê ±!q G´ P‰p ¯™°Hsq ÌQš´p <›pp]q ’° 18q À´ Ğ™p ò³q q³²€p (Ÿ³q |° +±q ¨´ °p „¡·ğğq ç± 0ğp Ìî¢óq M£0p%q y´ €p ù¥ÊÌ Ô°	q ¦0°€p ¨§Ê àWdq ¨³Bq =´ @p j©Ê  [°?q ­° ñ°p `ªÊ ,Êp”p FW0 1q r´ €p Ù¦«sCq 5¬s@p ÎÇ0 qCq ­ğwpC•q C´ Pp Â®ğP¦t°]p ¯³ p š³0 Èpq °³•q /´ 0p ‰±s-q å° 1ğp O´Ÿps°r ° q µ°zA0 |uäp <V¶sq l´ pp •"¸°ìq ¹ôp Ë0 tí¹q ºpğq K´ òPp u¼³r ° rp½Ê «0 ±q ÿ§° 1q +¾s0p ÜÀ° pq g± °²pp nÁsq Í° ±q ù´  ÂÊ DëÃpy\q O–Äp°Pp lÅ°oèq Ó° ±*q ”Æ3 p äÇs™q GÈ´p uÊ´÷q 0 ²Ë°0 ²p Îÿ0 ²p +Ì°0r0p ÃÍğbpq PJÎ3`p ¦Ïğ)ß¤q Ğsp Bb0 ,àq ° 1p éÒÊ 8vq hÓtC¹p :ÔğDpq ’° +ñ;q Â´ Ğp [Ö·pC0q Ñ° ñàp D¤×08ÿq øç° ±q $Øğñp  õÙÊ hw)q …Ús
p ‹Ûw°‹pq á° ñq fÜôp ¹Ş4Gp _Êß³`p ¹à4Gp ¬á4Gp G´ Pp œäğppq [åó²`p )çspq ‹° +±Nq ¿´ Àp õé0Ê $x0p qês€p :ëÊ ¨»pq ™° 1q Ç´ ‚Ğp ¤ïÊ ì0)q ´ğs—Àp óÑp%yq ° ñ•q Î´ Ğp ¤õ°Sp+q ösp v÷s+q m° qq ™e´  p ‹ùs+q ïË° 1ğp ûs+q ®s° 1q ¡´ °p LÒı3Vq Qşs`Ùp ÿ3Vq \° qq ˆ´ p dË[rÄq Ç± ğ2Ğp ÎÌËrÄq -0ğ •q Y´ `p 4³-q —± ° p ;³q ı° qq )Ås0p ZË2Vq ° ñ p 	Ë»2Vq 6° ±q b´ jpp á0 ”°Şq V
3q C´ Pp z¶óq ½° ñÀp ì!óq V° ñq Ê‚´ p º³q ı° ± Ë aw0 ñ_q –° ±q Â´ Ğp ¤Ë Pˆzq „ËrÊp ^Ë  {tq Í° ñ}q ËrÖp aËl „0q û° rË Xğ|µq ¿° Ìp÷q ï´ rğp H°0p l»  ¤Ë ğåY ° p6Ë (ÿ8ˆ XlpTY ²,À K€Ë è|  Ë @›Y   Ë!Ë ˆ}6"Ë ¤¨Y jp `y$Ë ø Fù î %Ë ³&@Ë €~ª'  < ø @ u)Ë d*w Æ- „ ş ¬n°Y  + Ç Ü 
  ‘ ”]…Ç ğXY ó ,Ë *-@Ë  Şm+€Mp€Ñ€,ÊäY .€M€
2„@€û/Ë ¦ì€5b0ƒ_p€ á2Ë \€){3ƒ€€[4XË ô€€PRY €…7Ë  Te8!€­Z p€­9€›€é€ØC[ ğ€Û;Ë ´H\?<ƒ/@‰€\=€#BÃ€4OY ñ„ >Ë r?Ë  dtÁÏÀÁ;ĞÀc@Ë È»ÀÁµÀÁ€ÁßÄ²àÀ
BÃJÁMÀêğÀPÀ±À ÁJÁÎæÀÁYÁCÀ&ÀM² ÀJDÃÁÀêğÀÀñÀ ÁÁ¬&EÃÁRÄ`À óFË p‚YÁ`GÀÀpÀÒ!À ØTÁ HTË Á;À–À 0è„\ ÁñÀÁ2ÁPIË Á À¤ÑÁ QÁÚÀÁ,)ÁJÃ ÀlK@Ë DßÁÈÀÁ,ĞÀ)MË vxÀŒÁ…ÀÂ2À°OË ØÀ)Á^ÀÁ`ÀçPË 0¨ƒÂQÃ/@À æRË <2] )Á/SÃ0ÀÕT§ÀÔÀÁUÃ ÀLÅVÃÁWÃÀÏÀ €-] ĞYÀ¦XÀéÀ°Àä€YË „Á”0ZÃ@ÀÃ[ÀASàá (\ã0à N]ààá ^ã‰à V_àn…á –¢`á°à W``:(] `à =aËT ˜`@à ú` ¼A` bË §`  `°à 1cË Hè á ƒ`a1á 
­d°à qdË Ğ¸ìá Å`á2á ñd eË z°fË ààá Ö`%áàà ”gà†ºá Ì`áAá údÀ hË qi`7`-á Í`aĞà |j@Ë $á ²W`áá Şdàà ÷0lË Ô`á €m%ã#à Ñn`v‡²á 8oãPá fd‚pà äpË ¼`)á Qqc`à rÑàˆá Z`á•á †dà æs`vS`á BtcPà §m` Ààá Õ`áà9à Êv`àá 'wã0à w` \‰
á §`ÌUY ‚°à 2yË Œà-á ¨`a"°à kzwà•àá ¿`aá ëedğà Ú|cá 7ê}c@à ‡` aá –·`aÀà B`ahŠá ¸`aÀÁà {€Ë œàá .Ï`aá ûd pË E…àS`á — †Ë À6]  à õˆË ¨‹²á c‰ãá £d°à JŒ`OŒYá àDà×à  î`
àá |`a²á 
°dÀà ÀË ,á %‘ã³‚0à @’Ë ¬à…á Æ` [ á Òõd “àÛ–`"`R€à —cà  "™`á 
šQ`C[ á FdP‰à $œ`ôá ‡aa¦à Ë ĞÚá í`a%¹á àá­à z` Ğ0á ”`a² à RŸ`Äà`p ` Ë |° q ùƒ° ± ¡Ë I0 ¶Ğpq u° ±€p D¡¢ğ}Ûq äK° ñğp £ğE´] q @° q=Pp lq¤óq ´° ñÀ5p æ0 ,ğq ¥4Yp t¦Ë üª´q Ğ° ñàp  d§Ë `«]q ¶° ñq à´ ğ¹p P©°0q ­° %±°p &ª°Zq V° q(`p ´f«³q ¬p° İp ¤0 ±q ö° ±)q  ­s
0p ]®Ñğ)q  ° ²Áp ¯Ë „pq –4° ñ8@p ”°³Íq ğ° ñ ±°0 u±„p Ö0 ±q  
²³p w³Ë ¶ ğq Ô° ±àp  f´Ë ‘]q ¸° ±q â´ ğÙp ¶óq T° ±º`p †0 ñq °° e±Àp ¸s
q pË° ñ€p ¹óq ®V° ñq €´ p \àº°lğr »ó@µp ‘0 œpq ¿° %1Àp Ù¼p(ø2q ½ôp t¾[3q Ğ° 1àp dv¿3q ¶° 1q à´ ğp $ÂË Ì[°q ° ± p p¢Ä0Y#q è° ¥qğp äÅ0’ğq¹p =Æ°ğPq m´ pp ~ÇË  $´q Á° ±Ğp Bı0 Ì©q VÈóq ?´ @p ”6É³q ğ° ± Êïp0 rp Ö0 ±q Ì Ëtp àÌ3q ”XÍó`p TÎ3]q ­° ñ,q İ´ à9p ßÏ°Epq "ĞÕ³0p O0 ôpq –v° q€p PÒ³q È° 2p ÄÓ³Yq Ôóq M´ PÙp  Ö³q ˜° ±² p ”×³q í° Sq
q Øs p @¢Ùğ‰“q ƒ° u±p ½0 ±q Õ° q
q ÿ´  ÚË8 bÜğ °q İå3p SŞğpq –¯° 1°p ïßpS°Eq KàóPp ›m0 Ğpq Ç° ±NĞ‰p  â0b”q V|° q€p Ú0 ˜pq ã°OY ²p 1ä³6q t° »òp ¦0 ±6q Ğ° ±àp ¤æË ÄSpq 4çóh@p .¢è0§•q †° PhªY q ¶´ À9p ê°–0q -ë%³0p tìğÏ–Âq íË ±q 
J´ Pp İîË ¦t0q Sïs`p `&ğË äpq |W° q:q ª´ °p €òË $—q Îp° 2p óğƒp]q `° 1q Š´ ™p Ïôóq +õsº0p {0 ñq §° eñ°p Ñöóq ê÷ó p F0 ñq –p° ±€p ùğ•¶—°	p £0 ±	°p D?ú0˜q oË° q(pp ìûğp©q büópp å0 fÌpq ı´*p t¶ştIp Ğ0 ñàp ìdÿtIp ¶0 ñq 
à´ ğq Ì Ğ™lp â0 ±‚ğp §Ì xpq û° ±q 'Ì
 ± 0p Ì ¶¸0q ° ±p  šÌ 8šq ç° ñq ÌrĞ p 	Ì „[0q ¤° 1û°p Ú 
Ìğº  ›Ú
Ì  =Ì ¬nYpxX€ 8ºÌ, x Œı ,ğå€Y  Ì ^ Ô \ ÌUY  ÒÌ œÌ Õ^  … ` .µ ^À HÌ, ” ¿ @›Y À >Ì ü r PRY € úÌ ÀH!p_€ 5Ì ,"
‰ ğXY µÀ éÌ  XI,;0€V€,E]Ê €€lp€e€ âÌ @©>ƒ@€“€ €Á€4OY Ğ€Ì Ğ[€T€}`€O€Ì (®¥€}Õ„à€l!ƒd€p¹€6€¿€j€ƒp€– Ì ¼[€Ù€à€n!€ƒ€e0€e@€W"Ì D4Zš€ €Æ7À Á>ÁğÀÁ # Ì W$Ì Ÿ;ÀÀ³À ÂeÀ(%ØÌ hÀÁ\ÀÁ#²`À†&Ã#ÁÉÀuÁĞÀöÀ ÁÁ ('Ì Á0Àş(˜Ì œÀÁ[)ÃV`À*À ]Á¢ÀÁVÁÖÄà…Á,À†ª4ÀÀ Â2À$-Ì Ğ`«ÁvÀÁÁ Ä°Àp/Ì, TÀÁÍÀ\­Z ĞÀ­0Ì ØÀÁ1Ì ¤¨Y ÁCÄPÀ 3Ì 0¡-Á~ÀÁD€À‡4'ÀÎÀÁ5ÀGªY* ÁDÄPÀq6ÑÀÛÁ´ÀÁ,:ÀÀæÀ ÁGÁ7eÃG Àt8Ã8ÁĞËÀÁàÀd9Ã8Á®¶ÀÁ8ÁàÄğÀl;Ã¹Á\ÀÁ`İÀ†À ÁÁ°ÀÁrÀà ®=`àá &>`^`p0à 6?Ì  €¢á “`+a"á ÇdĞà ù@³cá <Addà f` [aá `a à •0CÌ à`
á D%ãà mEà£ºá Æ`adá ödÀ FÌ GH`L`á Ï`b7à =JÌ  d¤á !K@Ì C[ á [d`à (MÌ ä[`á `a7 à ¬€NÌ p¥á  HOÌ È…Y •á yd€à Qà[`á ‚`aà Q€RÌ 4¦á BÀ`0[ á êdğà LTÌ t[`á ©`a1°à 6ÚUà‘`+à ˆ` á#•á ²dÀà òV`ÈEá 5Wd+à îf` b+à ` b+à `+YÌ Ü`á ¡`bà kZÌ Pè§á Á`ajá Êïdğà ?\à°`-á “`a à ]ØÌ øàá d`aá dà ÷^Ì  $¨á S_uã`à ä` áqá 6V`c[á `dpà ‡¶aã’á Ê`áĞà ÌùbäJà <cdà îf` bà ` bà ÀeÌ  `sà Vd` ápà ö` ³à,á Hfcá rd‚€à ÜgÌ à©á hc à Â` vìàá û`aRá +(iÌ a0à mkm`»©àVà è` aCğÁà mÌ ´àá ¬)nã‰á ]d`à  eoÌ <ª­á ¨`a°à Ï` Ğô’á ö`a  pÌ ª` ˆà‚°à éqÌ °`Yá 4rä#à Á` HÈ á sãá J=d@à ıt`O«¤á ruó>€p œƒv0 pq w°-+pmq P´ `p §x70&0q ú° 1 yÌ y0 @¬]q Â°