(function (root) {
  'use strict';
  async function isAdministrator(user) {
    if (!user || typeof user.getIdTokenResult !== 'function') return false;
    try {
      var token = await user.getIdTokenResult();
      return !!token && !!token.claims && token.claims.admin === true;
    } catch (_) { return false; }
  }
  var api = { isAdministrator: isAdministrator };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.adminAccess = api;
})(typeof window !== 'undefined' ? window : globalThis);
