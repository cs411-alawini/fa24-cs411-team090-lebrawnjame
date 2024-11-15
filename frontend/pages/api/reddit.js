// pages/api/reddit.js

export default async function handler(req, res) {
    try {
      // Step 1: Get an access token from Reddit
      const authResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_SECRET}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "password",
          username: process.env.REDDIT_USERNAME,
          password: process.env.REDDIT_PASSWORD,
        }),
      });
  
      const authData = await authResponse.json();
  
      if (!authData.access_token) {
        return res.status(500).json({ error: "Failed to authenticate with Reddit" });
      }
  
      // Step 2: Fetch posts from the LE SSERAFIM subreddit (or a related K-pop subreddit)
      const subreddit = "lesserafim"; // You can change this to a specific LE SSERAFIM subreddit if available
      const fetchResponse = await fetch(`https://oauth.reddit.com/r/${subreddit}/search?q=LE+SSERAFIM&restrict_sr=1&sort=new&limit=10`, {
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
          "User-Agent": process.env.REDDIT_USER_AGENT,
        },
      });
  
      const data = await fetchResponse.json();
  
      // Filter posts to include only those with media
      const mediaPosts = data.data.children.filter(post => post.data.post_hint === "image" || post.data.is_video);
  
      const results = mediaPosts.map(post => {
        const { title, url, post_hint, media } = post.data;
        return {
          title,
          url,  // Image URL for post_hint="image"
          video_url: media ? media.reddit_video.fallback_url : null, // Video URL if available
          type: post_hint === "image" ? "image" : "video",
        };
      });
  
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching Reddit data" });
    }
  }
  