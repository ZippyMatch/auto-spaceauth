const core = require('@actions/core');
const exec = require('@actions/exec');
const ngrok = require('ngrok');
const styles = require('ansi-styles');

const api = require('./rest');
const cli = require('./fastlane');
const secret = require('./secrets');
const plugins = require('./plugins');

// most @actions toolkit packages have async methods
async function run() {
  try {
    // Install Fastlane...
    core.info(`${styles.cyanBright.open}===> Installing Fastlane!`);
    await exec.exec('bundle install');

    // Run "fastlane spaceauth -u email"
    const fastlane = `fastlane spaceauth -u ${core.getInput('apple_id')}`;
    console.log(fastlane);

    api(async (setStdin) => {
      const url = await ngrok.connect(9090);
      core.info(`${styles.cyanBright.open}===> ngrok tunnel is ${url}`);

      try {
        await plugins(url);
      }
      catch (exc) {
        core.setFailed(exc);
        process.exit(1);
      }

      const spaceauth = cli(secret);
      setStdin(spaceauth.stdin);
    });
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
