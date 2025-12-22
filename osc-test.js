import { Client } from 'node-osc';

const oscHost = '127.0.0.1';
const oscPort = 3000;

const oscClient = new Client(oscHost, oscPort);

function sendOscMessage(target, args = 0) {
  oscClient.send(target, args, onOscSendError);

  function onOscSendError(error) {
    if (error) {
      console.error(`${error} (sending message '${target}' to hub)`);
    }
  }
}

sendOscMessage('start_scene', 2);
//sendOscMessage('start_clip', 0, 3);
//sendOscMessage('stop_all');
