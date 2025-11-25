const express = require("express");
const fetch = require("node-fetch");
const HttpsProxyAgent = require("https-proxy-agent");

const app = express();
app.use(express.json());

app.post("/check", async (req, res) => {
    const proxy = req.body.proxy;
    if (!proxy) return res.json({ message: "No proxy provided" });

    try {
        const agent = new HttpsProxyAgent("http://" + proxy);

        const response = await fetch("https://api.ipify.org?format=json", {
            agent,
            timeout: 5000
        });

        if (!response.ok) throw new Error("Failed");

        const data = await response.json();
        return res.json({ message: "LIVE ✔ IP via proxy: " + data.ip });

    } catch (e) {
        return res.json({ message: "DEAD ✘ Proxy not working" });
    }
});

app.use(express.static(".")); // index.html serve
app.listen(10000, () => console.log("Server running"));
