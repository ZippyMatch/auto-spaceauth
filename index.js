const core = require('@actions/core');
const exec = require('@actions/exec');

// most @actions toolkit packages have async methods
async function run() {
  try {
    // const ms = core.getInput('milliseconds');
    // core.info(`Waiting ${ms} milliseconds ...`);

    // core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    // await wait(parseInt(ms));
    // core.info((new Date()).toTimeString());

    // core.setOutput('time', new Date().toTimeString());

    // Install Fastlane...
    await exec.exec('bundle install');

    // Run "fastlane spaceauth -u email"
    const fastlane = `fastlane spaceauth -u ${core.getInput('apple_id')}`;
    console.log(fastlane);

    // await exec.exec('fastlane', ['spaceauth', '-u', core.getInput('apple_id')]);
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
