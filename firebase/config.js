/* ================================================
   XVITYPOO — FIREBASE CONFIG
   firebase/config.js
================================================ */
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAWLhPTfCDRPNh-P4OTMo6nVlBevhPL7K4",
  authDomain:        "xvitypoo.firebaseapp.com",
  projectId:         "xvitypoo",
  storageBucket:     "xvitypoo.firebasestorage.app",
  messagingSenderId: "268528948470",
  appId:             "1:268528948470:web:475b756114dc07ab2d88d7",
  measurementId:     "G-CVWBE0LK65"
};

const TRACKING = {
  enabled:    true,
  visitors:   true,
  sessions:   true,
  dailyStats: true,
};

const ADMIN_PATH = 'xvi7admin';

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}
