const core = require('@actions/core');
const exec = require('@actions/exec');
const api = require('./rest');
const cli = require('./fastlane');

// most @actions toolkit packages have async methods
async function run() {
  try {
    // Install Fastlane...
    await exec.exec('bundle install');

    // Run "fastlane spaceauth -u email"
    const fastlane = `fastlane spaceauth -u ${core.getInput('apple_id')}`;
    console.log(fastlane);

    api((setStdin) => {
      const spaceauth = cli();
      setStdin(spaceauth.stdin);
    });
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
