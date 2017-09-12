import BaasBox from 'baasbox';

let BassBoxEndPoint;
let BassBoxAppCode;
let BassBoxCollection;

export default class User {

  static $inject = ['od.env.service', '$q', '$window', '$interval', 'lodash', 'od.notification.service'];

  constructor($env, $q, $window, $interval, _, $notification) {

    // Dependencies werden zugänglich gemacht.
    this.$q = $q;
    this._ = _;
    this.$window = $window;
    this.$interval = $interval;
    this.$notification = $notification;

    BassBoxEndPoint = $env('USER-ADAPTER-BAASBOX-ENDPOINT');
    BassBoxAppCode = $env('USER-ADAPTER-BAASBOX-APP-CODE');
    BassBoxCollection = $env('USER-ADAPTER-BAASBOX-COLLECTION');

    // BaasBox Setup
    BaasBox.setEndPoint(BassBoxEndPoint);
    BaasBox.appcode = BassBoxAppCode;

    this.loading = true;

    // Hier wird der aktuelle Nutzer gespeichert:
    this.current = null;
    this.data = {};

    // Die Login Status wird geprüft:
    this.checkAuth()

  }

  login(credentials) {
    // Promise erstellen
    const deferred = this.$q.defer();

    // BaasBox Login:
    BaasBox.login(credentials.email, credentials.password).done(response => {
      
      // Login wird geprüft und Nutzerdaten werden geladen:
      this.checkAuth().then(auth => { deferred.resolve(this.current) }, err => { deferred.reject("Kombination aus Email und Passwort sind falsch.") });
    })
    .fail(error => {
      
      deferred.reject("Kombination aus Email und Passwort sind falsch.");
    });

    // Erstelltes Promise zurückgeben
    return deferred.promise;
  }

  logout() {
    
    // Logout aus der BaasBox
    BaasBox.logout()
      .done(res => {
        
        // Muss nicht, kann aber..
        this.current = null;

        // Wichtig um den state von Angular komplett zu leeren!
        this.$window.location.reload();
      })
      .fail(error => {

        // Keine Ahnung ob dieser Fall überhaupt eintreten kann..
        this.$notification.create("Fehler beim ausloggen.");
        console.log("Fehler beim Logout: ", error);
      })
  }

  register(credentials) {
    // Promise erstellen
    const deferred = this.$q.defer();

    // Hier eine Dummy Implementierung
    this.current = credentials;
    deferred.resolve(this.current);

    // Erstelltes Promise zurückgeben
    return deferred.promise;
  }

  checkAuth() {
    // Promise erstellen
    const deferred = this.$q.defer();

    // Prüfen ob der Nutzer bereits eingeloggt ist, ohne HTTP Request:
    if(this.current) {
      deferred.resolve(true);
      return deferred.promise;
    }

    // Login Status über BaasBox abfragen:
    // Callback Hell incoming in 3.. 2.. 1..
    // TODO: Ggf. Kompatibilität zwischen jQuery Deffered und $q.defer() testen
    BaasBox.fetchCurrentUser().then(response => {

      let current = {};
      
      current.id = response.data.id;
      current.name = response.data.user.name;
      
      BaasBox.loadCollectionWithParams(BassBoxCollection, { where: "user='" + current.id + "'"}).then(response => {
        
        if(response.length > 0) {
          
          this.data = response[0];
          this.current = current;
          
          deferred.resolve(true);
          // ...
          this.loading = false;
          
        } else {
          BaasBox.save({ user: current.id }, BassBoxCollection).then(response => {
            
            this.data = response;
            this.current = current;
            
            deferred.resolve(true);
            // ...
            this.loading = false;

          })
          .fail(error => {
            
            deferred.reject(null);
            // ...
            this.loading = false;
          });
        }
      })
      .fail(error => {
        
        deferred.reject(null);
        // ...
        this.loading = false;
      });
      
    })
    .fail(error => {
      
      deferred.reject(null);
      // ...
      this.loading = false;
    });

    // Erstelltes Promise zurückgeben
    return deferred.promise;
  }

  checkAuthSync() {
    return (this.current) ? true : false;
  }

  getData(key) {
    // Promise erstellen
    const deferred = this.$q.defer();

    // Falls der Key existiert, wird er zurück gegeben.
    if(this.data.hasOwnProperty(key)) {
      deferred.resolve(this._.clone(this.data[key]));
    } else {
      deferred.resolve(null);
    }

    // Erstelltes Promise zurückgeben
    return deferred.promise;
  }

  setData(key, value) {
    // Promise erstellen
    const deferred = this.$q.defer();

    // Hier eine Dummy Implementierung
    if(this.data == null) this.data = {};

    this.data[key] = this._.clone(value);

    BaasBox.save(this.data, BassBoxCollection).then(

      response => {
      
        this.data = response;
        deferred.resolve(null);
      },

      err => {
        
        console.error("$user.setData() Error: ", err);
        deferred.reject(null);
      }
    );

    // Erstelltes Promise zurückgeben
    return deferred.promise;
  }

  wait() {
    // Promise erstellen
    const deferred = this.$q.defer();

    // Hier eine Dummy Implementierung
    let interval = this.$interval(() => {

      if(this.checkAuthSync()) {

        this.$interval.cancel(interval);
        deferred.resolve(this.current);
      }

    }, 20);

    // Erstelltes Promise zurückgeben
    return deferred.promise;
  }
}