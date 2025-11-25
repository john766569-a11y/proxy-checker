const fs = require("fs");
const axios = require("axios");

async function checkProxy(proxy) {
  const parts = proxy.split(":");
  const host = parts[0];
  const port = parts[1];
  const user = parts[2];
  const pass = parts[3];

  const httpsAgent = require("https-proxy-agent");
  const agent = new httpsAgent(`http://${user}:${pass}@${host}:${port}`);

  try {
    const r = await axios.get("https://api.ipify.org?format=json", { httpsAgent: agent, timeout: 5000 });
    return { proxy, live: true };
  } catch {
    return { proxy, live: false };
  }
}

(async () => {
  const proxies = fs.readFileSync("proxies.txt", "utf8").trim().split("\n");
  let live = [];
  let dead = [];

  for (let p of proxies) {
    console.log("Checking:", p);
    const result = await checkProxy(p);
    if (result.live) live.push(p);
    else dead.push(p);
  }

  fs.writeFileSync("live.txt", live.join("\n"));
  fs.writeFileSync("dead.txt", dead.join("\n"));

  console.log("Done!");
})();
