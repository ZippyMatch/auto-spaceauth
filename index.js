const core = require('@actions/core');
const exec = require('@actions/exec');
const ngrok = require('ngrok');
const styles = require('ansi-styles');

const api = require('./rest');
const cli = require('./fastlane');

// most @actions toolkit packages have async methods
async function run() {
  try {
    // Install Fastlane...
    core.info(`${styles.blue.open}===> Installing Fastlane!`);
    await exec.exec('bundle install');

    // Run "fastlane spaceauth -u email"
    const fastlane = `fastlane spaceauth -u ${core.getInput('apple_id')}`;
    console.log(fastlane);

    api(async (setStdin) => {
      const url = await ngrok.connect(9090);
      core.info(`${styles.blue.open}===> ngrok tunnel is ${url}`);

      const spaceauth = cli();
      setStdin(spaceauth.stdin);
    });
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
