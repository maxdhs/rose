import { setTimeout as wait } from "timers/promises";

const {
  POLL_ID = "15596808",
  ANSWER_ID = "68828637", // Rose Lynch
  MIN_DELAY_MS = "1000", // 1s
  MAX_DELAY_MS = "5000", // 5s
} = process.env;

const BASE_URL = "https://polls.polldaddy.com/vote-js.php";
let running = true;

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n📴 Stopping...");
  running = false;
});

function buildUrl() {
  const params = new URLSearchParams({
    p: POLL_ID,
    b: "0",
    a: `${ANSWER_ID},`,
    o: "",
    va: "16",
    cookie: "0",
    tags: `${POLL_ID}-src:poll-embed`,
    url: "https://www.usatodaynetworkservice.com/tangstatic/html/papp/sf-q1a2z3584c02f3.min.html",
    n: `${Date.now()}${Math.floor(Math.random() * 1000)}`, // fresh each time
  });
  return `${BASE_URL}?${params}`;
}

async function voteLoop() {
  while (running) {
    const url = buildUrl();
    const start = new Date();
    try {
      const res = await fetch(url, {
        headers: {
          // mimic a browser UA
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          Accept: "*/*",
        },
      });
      console.log(`${start.toISOString()} → ${res.status} ${res.statusText}`);
    } catch (err) {
      console.error(`${start.toISOString()} ✖`, err.message);
    }

    // random delay between MIN_DELAY_MS and MAX_DELAY_MS
    const min = Number(MIN_DELAY_MS);
    const max = Number(MAX_DELAY_MS);
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`⏱ Next vote in ${delay} ms\n`);
    await wait(delay);
  }
  console.log("👋 Bye.");
}

voteLoop();
