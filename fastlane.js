const cp = require('child_process');

module.exports = function() {
    // await exec.exec('fastlane', ['spaceauth', '-u', core.getInput('apple_id')]);
    const cli = cp.spawn('script', ['-r', '-q', ])

    cli.stdout.pipe(process.stdout, { end: false });
    cli.stderr.pipe(process.stderr, { end: false });

    cli.stdout.on('data', (data) => {
        console.log('OUT', data.toString());
    });
    cli.stderr.on('data', (data) => {
        console.log('ERR: ', data.toString());
    })

    return cli;
}