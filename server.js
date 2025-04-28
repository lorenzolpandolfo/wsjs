const { WebSocket } = require("ws");
const { v4: uuidv4 } = require("uuid");
const { default: generateNickname } = require("./nicknames");

const wss = new WebSocket.Server({ port: 3000 });

let peers = [];

const createMessage = (content) => {
  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return {
    owner: { nickname: "Server" },
    time: formattedTime,
    content: content,
  };
};

wss.on("connection", (ws) => {
  peers.push(ws);

  sendMessageToAll(
    JSON.stringify(createMessage(`a new user has connected to the server.`))
  );

  ws.on("message", (msg) => {
    console.log("[~] Message recieved: ", msg.toString());
    sendMessageToAll(msg);
  });

  ws.on("close", () => {
    sendMessageToAll(
      JSON.stringify(createMessage(`a user disconnected from the server.`))
    );
    peers = peers.filter((client) => client !== ws);
  });
});

const sendMessageToAll = (msg) => {
  peers.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const jsonMsg = JSON.parse(msg);
      client.send(JSON.stringify(jsonMsg));
    }
  });
};

console.log("[Server] Running on port 3000");
