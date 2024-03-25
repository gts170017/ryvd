import express from 'express';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { google } from 'googleapis';

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Initialize the YouTube Data API client
const youtube = google.youtube({ version: 'v3', auth: 'AIzaSyDb312gEgoZT7XM2gazmiCtaKM55SPs8Sc' });

app.post('/download', async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ success: false, error: 'Invalid video URL' });
    }

    // Rest of the code...

  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ success: false, error: 'Failed to download video' });
  }
});
  const { videoUrl } = req.body;

  if (!ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ success: false, error: 'Invalid video URL' });
  }

  try {
    // Get video information using the YouTube Data API
    const videoInfo = await youtube.videos.list({
      part: 'snippet,contentDetails',
      id: ytdl.getVideoID(videoUrl),
    });

    const videoTitle = videoInfo.data.items[0].snippet.title.replace(/[/\\?%*:|"<>]/g, '-');
    const videoFileName = `${videoTitle}.mp4`;
    const downloadDir = path.join(__dirname, 'downloads');

    // Create the downloads directory if it doesn't exist
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const filePath = path.join(downloadDir, videoFileName);

    // Download the video
    const videoStream = ytdl(videoUrl, { quality: 'highest' });
    videoStream.pipe(fs.createWriteStream(filePath))
      .on('finish', () => {
        res.json({ success: true, message: 'Video downloaded successfully', filePath });
      })
      .on('error', error => {
        console.error('Error downloading video:', error);
        res.status(500).json({ success: false, error: 'Failed to download video' });
      });
  } catch (error) {
    console.error('Error getting video info:', error);
    res.status(500).json({ success: false, error: 'Failed to get video information' });
  }
});

const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});