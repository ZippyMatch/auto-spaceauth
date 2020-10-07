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

    api(async (setStdin, stopListening) => {
      const url = await ngrok.connect(9090);
      core.info(`${styles.cyanBright.open}===> ngrok tunnel is ${url}`);

      try {
        await plugins(url);
      }
      catch (exc) {
        core.setFailed(exc);
        process.exit(1);
      }

      const spaceauth = cli(async (key) => {
        // Turn off our HTTP services...
        core.info(`${styles.cyanBright.open}===> Killing our ngrok tunnel`);
        stopListening();
        await ngrok.disconnect();
        await ngrok.kill();

        // Send our secret to GitHub...
        // TODO: also make this plug-innable
        secret(key);
      });
      setStdin(spaceauth.stdin);
    });
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
