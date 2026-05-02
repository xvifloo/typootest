/* ================================================
   XVITYPOO ADMIN — AUTH GUARD (Firebase Auth)
   xvi7admin/js/admin-auth.js
   Runs first on dashboard.html — redirects if not admin
================================================ */

(function adminAuthGuard() {
  /* Firebase must be initialized before this runs */
  /* dashboard.html loads Firebase SDKs → config.js → this script */

  function waitForFirebase(tries) {
    if (tries <= 0) { redirect(); return; }
    if (typeof firebase === 'undefined' || !firebase.apps) {
      setTimeout(function() { waitForFirebase(tries - 1); }, 100);
      return;
    }
    checkAuth();
  }

  function checkAuth() {
    if (!firebase.apps.length) {
      try { firebase.initializeApp(FIREBASE_CONFIG); }
      catch(e) { redirect(); return; }
    }

    var auth = firebase.auth();
    var db   = firebase.firestore();

    /* Timeout: if auth takes too long, redirect */
    var timeout = setTimeout(redirect, 8000);

    auth.onAuthStateChanged(async function(user) {
      clearTimeout(timeout);
      if (!user) { redirect(); return; }

      try {
        var doc = await db.collection('admin_meta').doc('config').get();
        if (doc.exists && doc.data().adminUids &&
            doc.data().adminUids.includes(user.uid)) {
          /* Admin verified — allow access */
          document.documentElement.style.visibility = 'visible';
          window._adminUser = user;
          window._adminDB   = db;
          window._adminAuth = auth;
          /* Fire custom event so dashboard.js knows auth is ready */
          document.dispatchEvent(new CustomEvent('adminReady', { detail: { user, db, auth } }));
        } else {
          auth.signOut();
          redirect();
        }
      } catch(e) {
        redirect();
      }
    });
  }

  function redirect() {
    window.location.replace('index.html');
  }

  /* Hide page until auth verified */
  document.documentElement.style.visibility = 'hidden';
  waitForFirebase(50);
})();

/* ================================================
   LOGOUT
================================================ */
function doLogout() {
  if (window._adminAuth) {
    window._adminAuth.signOut().then(function() {
      window.location.replace('index.html');
    });
  } else {
    window.location.replace('index.html');
  }
}

/* ================================================
   EXTEND SESSION — heartbeat every 30 min
================================================ */
setInterval(function() {
  var user = window._adminAuth?.currentUser;
  if (user) user.getIdToken(true).catch(function() { doLogout(); });
}, 30 * 60 * 1000);
