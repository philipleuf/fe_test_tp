import express from "express";
import cors from "cors";

const app = express();

const SIMULATE_DELAY_MS = 100;
const FAILURE_RATE = 0.6;

app.use(cors({
  origin: 'localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

const usernameAvailability = {};

const isAvailable = (username) => {
  if (!usernameAvailability[username]) {
    usernameAvailability[username] = Math.random() < FAILURE_RATE;
  }

  return usernameAvailability[username];
};

app.get("/check-username", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send({ error: "Missing username" });
  }

  setTimeout(() => {
    if (Math.random() < FAILURE_RATE) {
      return res.status(503).send({ error: "Service Unavailable" });
    }

    const available = isAvailable(username);
    return res.status(200).send({ available });
  }, SIMULATE_DELAY_MS);
});

app.post("/register", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).send({ error: "Missing username" });
  }

  setTimeout(() => {
    if (Math.random() < FAILURE_RATE) {
      return res.status(503).send({ error: "Service Unavailable" });
    }

    const available = isAvailable(username);

    if (!available) {
      return res.status(400).send({ error: "Username is taken" });
    }

    usernameAvailability[username] = false;
    return res
      .status(200)
      .send({ success: true, message: "User registered successfully" });
  }, SIMULATE_DELAY_MS);
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
