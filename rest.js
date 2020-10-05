const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(callback) {
    const api = express();
    let stdIn = undefined;

    api.use(bodyParser.json());

    api.post('/', (req, res) => {
        try {
            const { code } = req.body;
            if (code) {
                // TODO: more security
                //
                // For now, let's make sure code is just a 6 digit number
                if (code.length === 6 && /^\d+$/.test(code)) {
                    stdIn.write(code + '\n');
                    res.status(204).send();
                }
                else {
                    res.status(400).send({'error': 'Only accepts 6-digit codes.'});
                }
            }
            else {
                res.status(400).send({'error': 'No code provided.'});
            }
        }
        catch (exc) {
            console.error(exc);
            res.status(500).send(exc);
        }
    });

    const setStdIn = (stdin) => {
        stdIn = stdin;
    }

    api.listen(9090, () => callback(setStdIn));
}