const LS_KEY = 'opendash-user-adapter-local-data';

export default class User {

  static $inject = ['$q', 'lodash', 'od.notification.service'];

  constructor($q, $lodash, $notification) {

    // Dependencies werden zugänglich gemacht.
    this.$q = $q;
    this.$notification = $notification;
    this.$lodash = $lodash;
    
    this.loading = false;

    // Hier wird der aktuelle Nutzer gespeichert:
    this.current = {};

    this.data = JSON.parse(localStorage.getItem(LS_KEY)) || {};
  }

  login(credentials) {
    // Promise erstellen
    const deferred = this.$q.defer();

    // Hier eine Dummy Implementierung
    deferred.resolve(this.current);

    // Erstelltes Promise zurückgeben
    return deferred.promise;
  }

  logout() {
    this.$notification.create("Ausloggen wird nicht unterstützt.");
  }

  register(credentials) {
    // Promise erstellen
    const deferred = this.$q.defer();

    // Hier eine Dummy Implementierung
    deferred.resolve(this.current);

    // Erstelltes Promise zurückgeben
    return deferred.promise;
  }

  checkAuth() {
    // Promise erstellen
    const deferred = this.$q.defer();

    // Nutzer ist im LS Adapter immer eingeloggt.
    deferred.resolve(true);

    // Erstelltes Promise zurückgeben
    return deferred.promise;
  }

  checkAuthSync() {
    return true; // Nutzer ist im LS Adapter immer eingeloggt.
  }

  getData(key) {
    // Promise erstellen
    const deferred = this.$q.defer();

    // Falls der Key existiert, wird er zurück gegeben.
    if(this.data.hasOwnProperty(key)) {
      deferred.resolve(this.$lodash.cloneDeep(this.data[key]));
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
    this.data[key] = this.$lodash.cloneDeep(value);

    localStorage.setItem(LS_KEY, JSON.stringify(this.data));

    deferred.resolve(null);

    // Erstelltes Promise zurückgeben
    return deferred.promise;
  }

  wait() {
    // Promise erstellen
    const deferred = this.$q.defer();

    // Hier eine Dummy Implementierung
    deferred.resolve(this.current);

    // Erstelltes Promise zurückgeben
    return deferred.promise;
  }
}