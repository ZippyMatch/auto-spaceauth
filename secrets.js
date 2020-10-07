const core = require('@actions/core');
const github = require('@actions/github');
const styles = require('ansi-styles');
const sodium = require('tweetsodium');

/**
 * Set a secret for an organization.
 * 
 * @param {string} pat Personal access token to use
 * @param {string} secret_name Name of the secret to save
 * @param {string} key Fastlane session data
 */
async function setOrgSecret(pat, secret_name, key) {
    const { context, getOctokit } = github;
    const octokit = getOctokit(pat);

    const { data: { key_id, key: publicKey } } = await octokit.actions.getOrgPublicKey({
        owner: context.repo.owner,
    });

    const secretBytes = Buffer.from(key);
    const keyBytes = Buffer.from(publicKey, 'base64');

    const encryptedBytes = sodium.seal(secretBytes, keyBytes);
    const encrypted_value = Buffer.from(encryptedBytes).toString('base64');

    await octokit.actions.createOrUpdateOrgSecret({
        owner: context.repo.owner,
        secret_name,
        encrypted_value,
        key_id,
    })
}

/**
 * Set a secret on the repository running our Action.
 * 
 * @param {string} secret_name Name of the secret we're saving
 * @param {string} key The Fastlane session
 */
async function setRepositorySecret(pat, secret_name, key) {
    const octokit = github.getOctokit(pat);
    const { context } = github;
    core.info(`${styles.cyanBright.open}===> Getting repository public key...`);

    const { data: publicKey } = await octokit.actions.getRepoPublicKey(context.repo);

    const secretBytes = Buffer.from(key);
    const keyBytes = Buffer.from(publicKey.key, 'base64');

    const encryptedBytes = sodium.seal(secretBytes, keyBytes);
    const encrypted_value = Buffer.from(encryptedBytes).toString('base64');

    await octokit.actions.createOrUpdateRepoSecret({
        ...context.repo,
        secret_name,
        encrypted_value,
        key_id: publicKey.key_id,
    });

    core.info(`${styles.green.open}===> Created repository secret!`);
}

/**
 * Set the Github Secret as per the Action inputs
 * 
 * @param {string} key The Fastlane session
 */
module.exports = async function(key) {
    //
    console.log("We have a key that starts with: ", key.substring(0, 10));
    console.log("We have a key that ends with: ", key.substring(key.length - 10));

    const secret = core.getInput('github_pat');

    if (!secret) {
        core.warning(`${styles.yellow.open} WARNING: No Github Token provided. Skipping setting your secret...`);
        return;
    }

    const repoSecretName = core.getInput('repo_secret_name');
    if (repoSecretName) {
        setRepositorySecret(secret, repoSecretName, key);
    }

    const orgSecretName = core.getInput('org_secret_name');
    if (orgSecretName) {
        setOrgSecret(secret, orgSecretName, key);
    }
}
