//    /$$$$$$  /$$   /$$  /$$$$$$   /$$$$$$ 
//   /$$__  $$| $$$ | $$ /$$__  $$ /$$__  $$
//  | $$  \__/| $$$$| $$| $$  \ $$| $$  \ $$
//  | $$ /$$$$| $$ $$ $$| $$$$$$$$| $$$$$$$$
//  | $$|_  $$| $$  $$$$| $$__  $$| $$__  $$
//  | $$  \ $$| $$\  $$$| $$  | $$| $$  | $$
//  |  $$$$$$/| $$ \  $$| $$  | $$| $$  | $$
//   \______/ |__/  \__/|__/  |__/|__/  |__/ International
// [ GAY NIGGER ASSOCIATION OF AMERICA ]
// Making the internet safer for homosexual black men since 2022.

// lolforge () gnaa intl
//=======================================================================================
// CaptchaForNiggers - a brand new captcha autosolving framework using audio recognition.
// authors: agentz (alan j kaming), 0x45 (demetrius sukanighadik) and incog (darnell nega)
// credits: ev (gary knegrow) for the idea. 
const puppeteer = require('puppeteer');
const axios = require('axios');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');

const solveCaptcha = async (url, projectId, credentialsPath) => {
  const client = new speech.SpeechClient({
    projectId: projectId,
    keyFilename: credentialsPath,
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const captchaFrames = await page.frames().filter(frame => {
    return frame.url().includes('api.arkoselabs.com/fc/gc');
  });

  if (captchaFrames.length > 0) {
    if (!fs.existsSync('audio_captchas')) {
      fs.mkdirSync('audio_captchas');
    }

    for (let i = 0; i < captchaFrames.length; i++) {
      const captchaFrame = captchaFrames[i];
      const audioUrl = await captchaFrame.$eval('audio source', source => source.src);
      const captchaId = new URLSearchParams(captchaFrame.url()).get('b');
      const audioPath = path.join('audio_captchas', `captcha_${captchaId}.mp3`);

      const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(audioPath, audioResponse.data, 'binary');

      const audio = {
        content: fs.readFileSync(audioPath).toString('base64'),
      };
      const config = {
        encoding: 'mp3',
        sampleRateHertz: 44100,
        languageCode: 'en-US',
      };
      const request = {
        audio: audio,
        config: config,
      };
      const [result] = await client.recognize(request);
      const transcription = result.results[0].alternatives[0].transcript;

      await captchaFrame.type('#audio-response', transcription);
      await captchaFrame.click('#audio-submit');
      await page.waitForNavigation();
    }
  }

  await browser.close();
};

module.exports = {
  solveCaptcha,
};