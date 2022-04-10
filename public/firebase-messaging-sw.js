importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyC39bXdJAlAjLapfKqL3nrKPNzUXkg95xs",
  authDomain: "jamusic-5fd24.firebaseapp.com",
  projectId: "jamusic-5fd24",
  storageBucket: "jamusic-5fd24.appspot.com",
  messagingSenderId: "603123320217",
  appId: "1:603123320217:web:ae3f3c0753e9d59af53f08",
  measurementId: "G-5S74EZ7PD9",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  if(payload.data) {
    const command = payload.data.COMMAND;
    if(command === 'USER_BLOCKED') localStorage.removeItem('token');
  }
});
