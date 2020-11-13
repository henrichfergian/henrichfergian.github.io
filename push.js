const webPush = require('web-push');

const vapidKeys = {
  publicKey: "BMGkTKrPU72-7K2EnYlESTluz2HAgaNTzHa5IHTNI1vICffbtwnVKGInqCAmB5cQqD7rdroaymijKrqr3x02qvQ",
  privateKey: "PmnXyzBBq3X_MyykyEzraMK7iVcLR8Djh97jnwSidqg"
};

webPush.setVapidDetails(
  'mailto:henrichfergian1@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const pushSubscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/dA1iuMNTmJ8:APA91bGNyJ4I9lgNAHfAW31gb1-TruYMkUmVwhCh3kj31qDYt92_It5wcQI-oT-u5y0w8I10MmH1cnlHzD19xiyO-vA73r3F9ZwkKOsnqrAaYREDpNwFu_hl7s1NPUmw6-IuIgH5ZdR1",
  keys: {
    p256dh: "BJ5hpc+53n4aD/LbUPO21CP0A6wmDVytFpWEcE6p7vY7pvpFg4+fgkXq6trIp4ERuCBk+6reBaH1oMf0N2Dv+ZA=",
    auth: "JPEdnwsyEUiSp7lDOeLqfA=="
  }
};

const payload = "Congrats... now your application can receive push notification"

const options = {
  gcmAPIKey: "864943993971",
  TTL: 60
};

webPush.sendNotification(
  pushSubscription,
  payload,
  options
);