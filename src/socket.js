import { io } from "socket.io-client";

const gameserver = "https://games.uhno.de";

export const socket = io(gameserver, {
  transports: ["websocket"],
  autoConnect: false,
});
