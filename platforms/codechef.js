import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Missing CodeChef username" });
  }

  console.log("fetching data for ", username );

  try {
    const response = await fetch(`https://codechef-api.vercel.app/handle/${username}`,{
        method:"GET"
    });

    console.log(response)
    const { data } = await response.json();
    console.log(data);

    return res.json({
      data
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch CodeChef Stats", err });
  }
});

export default router;
