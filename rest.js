const express = require('express');
const bodyParser = require('body-parser');

/**
 * Start the API to receive our 2FA code from Apple via ngrok tunnel.
 * 
 * @param {apiCallback} callback 
 */
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

    /**
     * Set the standard in this API will use when data is received.
     * 
     * @param {internal.Writable} stdin A pipe to write to
     */
    const setStdIn = (stdin) => {
        stdIn = stdin;
    }

    const server = api.listen(9090, () => callback(setStdIn, () => {
        server.close();
    }));
}

/**
 * This callback is displayed as a global member.
 * 
 * @callback apiCallback
 * @param {setStdIn} setStdIn A method which will set our stand
 * @param {onDone} onDone A method which, when called, will close this API.
 */

 /**
  * Set the stdin that the API will write to when it receives a code.
  * @callback setStdIn
  * @param {internal.Writable} stdin The stdin pipe to write to when a code is received.
  */

  /**
   * Method to call when API needs to be torn down.
   * @callback onDone
   */