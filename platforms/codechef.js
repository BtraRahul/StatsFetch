import express from "express";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const router = express.Router();

const fetchCodeChefProfile = async (username) => {
  try {
    const response = await fetch(`https://www.codechef.com/users/${username}`);
    
    if (response.status !== 200) {
      return { success: false, status: response.status };
    }

    const htmlData = await response.text();
    const dom = new JSDOM(htmlData);
    const document = dom.window.document;

    // Extract heatmap data
    const heatMapDataStart = htmlData.search("var userDailySubmissionsStats =") + "var userDailySubmissionsStats =".length;
    const heatMapDataEnd = htmlData.search("'#js-heatmap") - 34;
    let heatMapData = [];
    
    if (heatMapDataStart > 0 && heatMapDataEnd > heatMapDataStart) {
      const heatDataString = htmlData.substring(heatMapDataStart, heatMapDataEnd);
      try {
        heatMapData = JSON.parse(heatDataString);
      } catch (e) {
        console.log("Error parsing heatmap data:", e);
      }
    }

    // Extract rating data
    const allRatingStart = htmlData.search("var all_rating = ") + "var all_rating = ".length;
    const allRatingEnd = htmlData.search("var current_user_rating =") - 6;
    let ratingData = [];
    
    if (allRatingStart > 0 && allRatingEnd > allRatingStart) {
      try {
        ratingData = JSON.parse(htmlData.substring(allRatingStart, allRatingEnd));
      } catch (e) {
        console.log("Error parsing rating data:", e);
      }
    }

    // Extract profile information
    const userDetailsContainer = document.querySelector(".user-details-container");
    const ratingElement = document.querySelector(".rating-number");
    const ratingRanks = document.querySelector(".rating-ranks");
    const userCountryFlag = document.querySelector(".user-country-flag");
    const userCountryName = document.querySelector(".user-country-name");
    const ratingStars = document.querySelector(".rating");

    const profileData = {
      success: true,
      status: response.status,
      profile: userDetailsContainer?.children[0]?.children[0]?.src || null,
      name: userDetailsContainer?.children[0]?.children[1]?.textContent || username,
      currentRating: ratingElement ? parseInt(ratingElement.textContent) : null,
      highestRating: ratingElement?.parentNode?.children[4]?.textContent 
        ? parseInt(ratingElement.parentNode.children[4].textContent.split("Rating")[1]) 
        : null,
      countryFlag: userCountryFlag?.src || null,
      countryName: userCountryName?.textContent || null,
      globalRank: ratingRanks?.children[0]?.children[0]?.children[0]?.children[0]?.innerHTML 
        ? parseInt(ratingRanks.children[0].children[0].children[0].children[0].innerHTML) 
        : null,
      countryRank: ratingRanks?.children[0]?.children[1]?.children[0]?.children[0]?.innerHTML 
        ? parseInt(ratingRanks.children[0].children[1].children[0].children[0].innerHTML) 
        : null,
      stars: ratingStars?.textContent || "unrated",
      heatMap: heatMapData,
      ratingData: ratingData,
    };

    return profileData;

  } catch (error) {
    console.log("Error fetching CodeChef profile:", error);
    return { success: false, status: 404, error: error.message };
  }
};

router.post("/", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Missing CodeChef username" });
  }

  console.log("Fetching CodeChef data for:", username);

  try {
    let profileData = await fetchCodeChefProfile(username);
    
    // Handle rate limiting (status 429)
    while (profileData.status === 429) {
      console.log("Rate limited, waiting before retry...");
      // Wait for a short period before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
      profileData = await fetchCodeChefProfile(username);
    }

    if (!profileData.success) {
      return res.status(profileData.status).json({ error: "User not found or other error", profileData });
    }

    return res.json({
      data: profileData
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch CodeChef Stats", err });
  }
});

export default router;
