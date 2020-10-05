const core = require('@actions/core');
const cp = require('child_process');
const path = require('path');
const styles = require('ansi-styles');

module.exports = function() {
    // await exec.exec('fastlane', ['spaceauth', '-u', core.getInput('apple_id')]);
    const outPath = path.join(process.cwd(), 'fastlane-out');
    // const cli = cp.spawn('script', ['-r', '-q', '/dev/null', `fastlane spaceauth -u ${core.getInput('apple_id')}`])
    const cli = cp.spawn('bundle', ['exec', 'fastlane', 'spaceauth', '-u', core.getInput('apple_id')], {
        env: {
            ...process.env,
            FASTLANE_PASSWORD: core.getInput('apple_password'),
        }
    });

    // cli.stdout.pipe(process.stdout, { end: false });
    // cli.stderr.pipe(process.stderr, { end: false });

    cli.stdout.on('data', (buf) => {
        const str = buf.toString();
        // if (!str.includes('FASTLANE_SESSION')) {
        // }
        // ---\n- !ruby/object
        if (str.startsWith('---\\n- !ruby/object')) {
            console.log(`${styles.cyanBright.open} FOUND THE KEY!!!`);
        }
        else {
            console.log('OUT >>', str);
        }
    });
    cli.stderr.on('data', (data) => {
        console.log('ERR: ', data.toString());
    })

    cli.on('exit', (code) => {
        core.log('Fastlane exited with code', code);
    });

    return cli;
}