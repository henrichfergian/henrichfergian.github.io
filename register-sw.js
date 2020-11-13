const PUBLIC_KEY = "BMGkTKrPU72-7K2EnYlESTluz2HAgaNTzHa5IHTNI1vICffbtwnVKGInqCAmB5cQqD7rdroaymijKrqr3x02qvQ";
const PRIVATE_KEY = "PmnXyzBBq3X_MyykyEzraMK7iVcLR8Djh97jnwSidqg";

const registerSW = () => {
  return navigator.serviceWorker.register("/service-worker.js").then((registration) => {
    console.log("serviceWorker registration success !");
    return registration;
  }).catch((error) => {
    console.error("serviceWorker registration falied", error);
  });
};

const urlBase64ToUint8Array = (base64Str) => {
  const padding = "=".repeat((4 - base64Str.length % 4) % 4);
  const base64 = (base64Str + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const requestNotifPermission = () => {
  Notification.requestPermission().then((result) => {
    if (result === "denied") {
      console.log("Notification feature is not allowed");
      return;
    } else if (result === "default") {
      console.log("the user closes the request permission pop up");
      return;
    }
    console.log("Notification feature allowed");

    navigator.serviceWorker.ready.then(() => {
      if ("PushManager" in window) {
        navigator.serviceWorker.getRegistration().then((registration) => {
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY)
          }).then((subscribe) => {
            console.log("subscribing success, endpoint:", subscribe.endpoint);
            console.log("subscribing success, p256dh:", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("p256dh")))));
            console.log("subscribing success, auth:", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("auth")))));
          }).catch((error) => {
            console.error("Error: can't subscribe ", error.message);
          });
        });
      } else {
        console.error("your browser doesn't support push API");
      }
    })
  });
};

if (!("serviceWorker" in navigator)) {
  console.error("your browser doesn't support serviceWorker");
} else {
  registerSW();
}

if (!("Notification" in window)) {
  console.error("your browser doesn't support notification API");
} else {
  requestNotifPermission();
}