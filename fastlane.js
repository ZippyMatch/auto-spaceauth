const core = require('@actions/core');
const cp = require('child_process');
const path = require('path');

module.exports = function() {
    // await exec.exec('fastlane', ['spaceauth', '-u', core.getInput('apple_id')]);
    const outPath = path.join(process.cwd(), 'fastlane-out');
    // const cli = cp.spawn('script', ['-r', '-q', '/dev/null', `fastlane spaceauth -u ${core.getInput('apple_id')}`])
    const cli = cp.spawn('fastlane', ['spaceauth', '-u', core.getInput('apple_id')], {
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
        console.log('OUT >>>>>>>>>>>>>>>>>>>>>', str, '<<<<<<<<<<<<<<<');
        // }
    });
    cli.stderr.on('data', (data) => {
        console.log('ERR: ', data.toString());
    })

    return cli;
}