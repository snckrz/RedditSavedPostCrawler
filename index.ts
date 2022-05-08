const snoowrap = require('snoowrap');
import https from 'https'; // or 'https' for https:// URLs
import http from 'http'; // or 'https' for https:// URLs
import fs from 'fs';

require('dotenv').config()

const config = {
  username: process.env.username,
  password: process.env.password,
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
}

const r = new snoowrap({
  userAgent: 'Whatever',
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  username: config.username,
  password: config.password,
})
const savedPostsTxtFile = 'urlsArray.txt';

// delete file if it already exists
try {
  
  if (fs.existsSync(savedPostsTxtFile)) {
    fs.unlinkSync(savedPostsTxtFile);
  }
} catch(err) {
  console.error(err)
}

console.log("Start fetching, this might take some time ⏳")
r.getUser('snckrz').getSavedContent().fetchAll().map((post: { url: any; }) => post.url).then(
  response => {
      response.forEach((element, index) => crawler(element, response, index));
  }
);

function crawler(element: any, response: any, index: any) {
  console.log(element);
  
  // Create file and write URL to it
  fs.writeFileSync(savedPostsTxtFile, element, { flag: 'a+' });
  fs.writeFileSync(savedPostsTxtFile, '\n', { flag: 'a+' });
  
  // check if saved Post isnt deleted
  if(!element) {
    return
  }
  // Refactor URL, because reddit&imgur save filename at the end of URL
  let filenameToSave = element.split("/").reverse()[0];
  console.log(filenameToSave);
  if( filenameToSave == "" || !(filenameToSave.includes('.'))){
    // skip if URL does not contain file ending
    return;
  }
  if(filenameToSave.length > 50){
    filenameToSave = index;
  }
  const file = fs.createWriteStream(`images/${filenameToSave}`);
  function requestCallback(response) {
    response.pipe(file);

    // after download completed close filestream
    file.on("finish", () => {
        file.close();
        console.log(`✅ Completed download of ${filenameToSave}`); 
    });
  }
  if(element.includes("https")){
    const request = https.get(element, requestCallback);
  } else {
    const request = http.get(element, requestCallback);
  }
}
