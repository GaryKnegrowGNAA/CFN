const { solveCaptcha } = require('./captchaforniggers'); // whatever path cfn.js is served in

const url = 'https://www.example.com'; // promptable 
const projectId = 'your-project-id'; // required
const credentialsPath = 'path/to/your/credentials.json'; // also required

solveCaptcha(url, projectId, credentialsPath) 
  .then(() => { // callback is customizable
    console.log('✔️  Captcha solved successfully');
  })
  .catch(error => {
    console.error('❌  Error solving captcha:', error);
  });