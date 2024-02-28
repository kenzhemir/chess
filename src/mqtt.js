import mqtt from "https://unpkg.com/mqtt@5.3.6/dist/mqtt.esm.js"; // import namespace "mqtt"
const client = mqtt.connect("mqtt://test.mosquitto.org:8081");
window.client = client;

function getTopic(roomId) {
  return `custom-chess-topic-4401929331-${roomId}`;
}

export function subscribeToGameSnapshots(roomId, cb) {
  console.log("trying to subscribe", client);
  client.subscribe(getTopic(roomId), (err) => {
    if (!err) console.log("subscribed");
  });

  const unsub2 = client.on("message", (topic, message) => {
    if (topic === getTopic(roomId)) {
      cb(message.toString());
    }
  });

  return () => {
    unsub();
    unsub2();
    client.unsubscribe(getTopic(roomId));
  };
}

export function pushMessage(roomId, message) {
  client.publish(getTopic(roomId), message);
}
