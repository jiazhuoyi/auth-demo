const socket = require('socket.io');

export default (server) => {
  const io = socket(server);
}
