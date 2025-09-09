const User = require("../Model/User");
const axios = require("axios");

async function connectGithub(req, res) {
    try {
        const { github } = req.body;

        if (!github) {
            return res.status(400).json({ error: "GitHub username cannot be null" });
        }

        const url = `https://api.github.com/users/${github}`;

        let response;
        try {
            response = await axios.get(url, {
                headers: { "User-Agent": "internship-app" },
            });
        } catch (err) {
            if (err.response && err.response.status === 404) {
                return res.status(404).json({ error: "GitHub username not found" });
            }
            console.error("GitHub API error:", err.message);
            return res.status(500).json({ error: "Error contacting GitHub" });
        }

        const userData = response.data;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const githubUrl = userData.html_url;
        if (!user.resume.socialLinks.includes(githubUrl)) {
            user.resume.socialLinks.push(githubUrl);
        }

        await user.save();

        return res.status(200).json({
            message: "GitHub user linked successfully",
            github: userData.login,
            profileUrl: githubUrl,
            avatar: userData.avatar_url,
        });
    } catch (err) {
        console.error("github conn issue", err);
        return res.status(500).json({ error: "Github Connection Error" });
    }
}


async function fetchGithubProjects(req, res) {
    try {
        const user = req.user;

        if (!user.resume.socialLinks.includes(githubUrl)) {
            user.resume.socialLinks.push(githubUrl);
        }
    } catch (err) {
        console.error("github fetching issue", err);
        return res.status(500).json({ error: "Github Data Fetching Error" });
    }
}