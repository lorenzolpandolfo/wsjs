const prefixes = [
  "crazy",
  "maniac",
  "lovely",
  "super",
  "gaming",
  "epic",
  "creeper",
];

const sufixes = [
  "gamer",
  "captain",
  "killer",
  "crafter",
  "pvp",
  "herobrine",
  "lover",
  "ninja",
  "noob",
  "dragon",
  "zombie",
  "king",
  "queen",
  "wizard",
];

function generateNickname() {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const sufix = sufixes[Math.floor(Math.random() * sufixes.length)];

  const upperPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  const upperSufix = sufix.charAt(0).toUpperCase() + sufix.slice(1);

  return upperPrefix + upperSufix;
}

const defaultNickname = generateNickname();

document.addEventListener("DOMContentLoaded", () => {
  const messageButton = document.getElementById("sendMessageButton");
  const messageInput = document.getElementById("messageInput");
  const serverResponse = document.getElementById("serverResponse");
  const nicknameInput = document.getElementById("nickname");
  const confirmNicknameButton = document.getElementById("confirmNickname");
  const websocketServerInput = document.getElementById("websocket-server");

  const websocketServer = `ws://${window.location.href
    .toString()
    .replace("http://", "")
    .replace(":5500/", "")}:3000`;

  console.log(websocketServer);

  const socket = new WebSocket(websocketServer);

  const createUser = (id, ws) => {
    if (nicknameInput.value == "") {
      alert("Error: nickname must not be empty.");
      return;
    }

    return {
      nickname: nicknameInput.value,
    };
  };

  let user;

  const createMessage = (content, whisperId) => {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return {
      owner: user,
      time: formattedTime,
      content: content,
      whisper: whisperId,
    };
  };
  socket.onopen = () => {};

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    serverResponse.innerText +=
      `[${data.time}] ${data.owner.nickname}: ` + (data.content || "") + "\n";

    serverResponse.scrollTop = serverResponse.scrollHeight;
  };

  socket.onerror = (error) => {
    alert("Error: disconnected from the server.");
  };

  socket.onclose = () => {};

  messageButton.addEventListener("click", () => {
    if (user === undefined) {
      alert("Error: you need to choose a nickname.");
    }
    const msg = createMessage(messageInput.value);
    const jsonMsg = JSON.stringify(msg);
    socket.send(jsonMsg);
    messageInput.value = "";
  });

  confirmNicknameButton.addEventListener("click", () => {
    user = createUser();
    confirmNicknameButton.disabled = true;
  });

  nicknameInput.value = defaultNickname;
});
