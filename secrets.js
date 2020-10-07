const core = require('@actions/core');
const github = require('@actions/github');
const styles = require('ansi-styles');
const sodium = require('tweetsodium');

module.exports = async function(key) {
    //
    console.log("We have a key that starts with: ", key.substring(0, 10));
    console.log("We have a key that ends with: ", key.substring(key.length - 10));

    const secret = core.getInput('github_pat');

    if (!secret) {
        core.warning(`${styles.yellow.open} WARNING: No Github Token provided. Skipping setting your secret...`);
        return;
    }

    const octokit = github.getOctokit(secret);
    const { context } = github;

    core.info(`${styles.blueBright.open}===> Getting repository public key...`);

    const { data: publicKey } = await octokit.actions.getRepoPublicKey(context.repo);
    console.log('Public key:');
    console.log(publicKey);

    const secretBytes = Buffer.from(key);
    const keyBytes = Buffer.from(publicKey, 'base64');
    console.log('Key bytes');
    console.log(keyBytes);

    const encryptedBytes = sodium.seal(secretBytes, keyBytes);

    await octokit.actions.createOrUpdateRepoSecret({
        ...context.repo,
        secret_name: 'FASTLANE_SESSION',
        encrypted_value: encryptedBytes,
    });

    core.info(`${styles.blueBright.open}===> Created repository secret!`);
}
