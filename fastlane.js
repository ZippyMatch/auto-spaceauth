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
        }
    });

    cli.stdout.on('data', (buf) => {
        const str = buf.toString();
        const match = re.exec(str);
        if (match) {
            keyFound(match[0]);
        }
        else {
            console.log('OUT >>', str);
        }
    });
    cli.stderr.on('data', (data) => {
        console.log('ERR: ', data.toString());
    })

    cli.on('exit', (code) => {
        core.info('Fastlane exited with code ' + code);
        process.exit(code);
    });

    return cli;
}