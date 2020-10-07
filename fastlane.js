const core = require('@actions/core');
const cp = require('child_process');
const styles = require('ansi-styles');

const re = /---\\n- !.*/g;

module.exports = function(keyFound) {
    core.info(`${styles.cyanBright.open}===> Starting Fastlane!! This can take a couple minutes...`);
    const cli = cp.spawn('bundle', ['exec', 'fastlane', 'spaceauth', '-u', core.getInput('apple_id')], {
        env: {
            ...process.env,
            FASTLANE_PASSWORD: core.getInput('apple_password'),
            SPACESHIP_2FA_SMS_DEFAULT_PHONE_NUMBER: core.getInput('tfa_phone_number'),
        }
    });

    const onData = (buf) => {
        const str = buf.toString();
        const match = re.exec(str);
        if (match) {
            keyFound(match[0]);
            // Remove our listener!
            core.info(`${styles.blueBright.open}===> Removing our stdout listener...`);
            cli.stdout.removeListener('data', onData);
        }
        else {
            console.log('OUT >>', str);
        }
    };

    cli.stdout.on('data', onData);
    cli.stderr.on('data', (data) => {
        console.log('ERR: ', data.toString());
    })

    cli.on('exit', (code) => {
        core.info(`${styles.blueBright.open}===> Fastlane exited with code ${code}`);
    });

    return cli;
}