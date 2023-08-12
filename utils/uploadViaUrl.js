const { Octokit } = require('@octokit/rest');
const axios = require('axios');
require('dotenv').config()

const owner = process.env.OWNER
const repo = process.env.REPO
const token = process.env.TOKEN
const tagName = process.env.TAG_NAME


const octokit = new Octokit({
  auth: token,
});

async function getReleaseIdByTagName(tagName) {
  try {
    const releases = await octokit.repos.listReleases({
      owner,
      repo,
    });

    const release = releases.data.find(release => release.tag_name === tagName);

    if (release) {
      return release.id;
    } else {
      throw new Error('Release not found.');
    }
  } catch (error) {
    console.error('Error getting release ID:', error.message);
  }
}

async function uploadReleaseAssetFromURL(url, fileName, releaseId) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const fileData = Buffer.from(response.data, 'binary');

    const release = await octokit.repos.getRelease({
      owner,
      repo,
      release_id: releaseId,
    });

    const uploadUrl = release.data.upload_url.replace('{?name,label}', `?name=${fileName}`);
    const headers = {
      'content-type': 'application/octet-stream',
      'content-length': fileData.length,
    };

    const uploadResponse = await octokit.request(uploadUrl, {
      method: 'POST',
      headers,
      data: fileData,
    });

    console.log('Asset uploaded successfully:', uploadResponse.data.name);
    const resultUrl = `https://github.com/${owner}/${repo}/releases/download/${tagName}/${fileName}`
    console.log(resultUrl)
    return resultUrl;
  } catch (error) {
    console.error('Error uploading asset:', error.message);
  }
}

exports.uploadViaUrl = async function (remoteFileUrl) {
  try {
    const releaseId = await getReleaseIdByTagName(tagName);

    // const remoteFileUrl = 'https://cdn.jsdelivr.net/gh/Siddwap/dulink-bot@main/instagram-authentication-main.zip';
    const extention = remoteFileUrl.split(".").slice(-1)
    const fileName = Date.now() + `.${extention}` 
    return await uploadReleaseAssetFromURL(remoteFileUrl, fileName, releaseId);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

