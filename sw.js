
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

/* إعداد Firebase */
firebase.initializeApp({
  apiKey: "AIzaSyCzDel9E7mhPENKqP5w-E36GEnnBXrPG38",
  authDomain: "sawwag-road.firebaseapp.com",
  projectId: "sawwag-road",
  storageBucket: "sawwag-road.firebasestorage.app",
  messagingSenderId: "619531268752",
  appId: "1:619531268752:web:2a326aeca559aa9988de15"
});

/* تهيئة استقبال الإشعارات */
const messaging = firebase.messaging();

/* استقبال إشعارات الخلفية */
messaging.onBackgroundMessage(payload => {

  /* إشعارات Firebase التي تحتوي على notification
     يعرضها Firebase تلقائياً */
  if (payload.notification) return;

  const data = payload.data || {};

  const title = data.title || "سواق الطريق";

  const options = {
    body: data.body || "يوجد بلاغ جديد بالقرب منك",
    icon: "icon-192.png",
    badge: "icon-192.png",
    vibrate: [300, 150, 300, 150, 300],
    data: {
      url: data.url || "./"
    }
  };

  return self.registration.showNotification(title, options);
});

/* عند الضغط على الإشعار */
self.addEventListener("notificationclick", event => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "./",
    self.location.origin
  ).href;

  event.waitUntil(
    self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(clients => {

      for (const client of clients) {
        if (client.url.startsWith(self.location.origin)) {
          return client.focus();
        }
      }

      return self.clients.openWindow(targetUrl);
    })
  );
});

/* تثبيت وتفعيل Service Worker */
self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});
