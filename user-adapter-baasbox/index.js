'use strict';var _createClass=function(){function a(b,c){for(var e,d=0;d<c.length;d++)e=c[d],e.enumerable=e.enumerable||!1,e.configurable=!0,'value'in e&&(e.writable=!0),Object.defineProperty(b,e.key,e)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),_baasbox=require('baasbox'),_baasbox2=_interopRequireDefault(_baasbox);Object.defineProperty(exports,'__esModule',{value:!0});function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}var BassBoxEndPoint=void 0,BassBoxAppCode=void 0,BassBoxCollection=void 0,User=function(){function a(b,c,d,e,f,g){_classCallCheck(this,a),this.$q=c,this._=f,this.$window=d,this.$interval=e,this.$notification=g,BassBoxEndPoint=b('USER-ADAPTER-BAASBOX-ENDPOINT'),BassBoxAppCode=b('USER-ADAPTER-BAASBOX-APP-CODE'),BassBoxCollection=b('USER-ADAPTER-BAASBOX-COLLECTION'),_baasbox2.default.setEndPoint(BassBoxEndPoint),_baasbox2.default.appcode=BassBoxAppCode,this.loading=!0,this.current=null,this.data={},this.checkAuth()}return _createClass(a,[{key:'login',value:function login(b){var c=this,d=this.$q.defer();return _baasbox2.default.login(b.email,b.password).done(function(){c.checkAuth().then(function(){d.resolve(c.current)},function(){d.reject('Kombination aus Email und Passwort sind falsch.')})}).fail(function(){d.reject('Kombination aus Email und Passwort sind falsch.')}),d.promise}},{key:'logout',value:function logout(){var b=this;_baasbox2.default.logout().done(function(){b.current=null,b.$window.location.reload()}).fail(function(c){b.$notification.create('Fehler beim ausloggen.'),console.log('Fehler beim Logout: ',c)})}},{key:'register',value:function register(b){var c=this.$q.defer();return this.current=b,c.resolve(this.current),c.promise}},{key:'checkAuth',value:function checkAuth(){var b=this,c=this.$q.defer();return this.current?(c.resolve(!0),c.promise):(_baasbox2.default.fetchCurrentUser().then(function(d){var e={};e.id=d.data.id,e.name=d.data.user.name,_baasbox2.default.loadCollectionWithParams(BassBoxCollection,{where:'user=\''+e.id+'\''}).then(function(f){0<f.length?(b.data=f[0],b.current=e,c.resolve(!0),b.loading=!1):_baasbox2.default.save({user:e.id},BassBoxCollection).then(function(g){b.data=g,b.current=e,c.resolve(!0),b.loading=!1}).fail(function(){c.reject(null),b.loading=!1})}).fail(function(){c.reject(null),b.loading=!1})}).fail(function(){c.reject(null),b.loading=!1}),c.promise)}},{key:'checkAuthSync',value:function checkAuthSync(){return!!this.current}},{key:'getData',value:function getData(b){var c=this.$q.defer();return this.data.hasOwnProperty(b)?c.resolve(this._.clone(this.data[b])):c.resolve(null),c.promise}},{key:'setData',value:function setData(b,c){var d=this,e=this.$q.defer();return null==this.data&&(this.data={}),this.data[b]=this._.clone(c),_baasbox2.default.save(this.data,BassBoxCollection).then(function(f){d.data=f,e.resolve(null)},function(f){console.error('$user.setData() Error: ',f),e.reject(null)}),e.promise}},{key:'wait',value:function wait(){var b=this,c=this.$q.defer(),d=this.$interval(function(){b.checkAuthSync()&&(b.$interval.cancel(d),c.resolve(b.current))},20);return c.promise}}]),a}();User.$inject=['od.env.service','$q','$window','$interval','lodash','od.notification.service'],exports.default=User;