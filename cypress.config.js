const { defineConfig } = require('cypress')
const getCompareSnapshotsPlugin = require('cypress-image-diff-js/plugin');

const fs = require('fs');

module.exports = defineConfig({
    e2e: {
        //supportFile: false,
        setupNodeEvents(on, config) {
            on('task', {
                writeLogs(logs) {
                    const file = './cypress/logs/log.txt';
                    fs.appendFileSync(file, logs.join('\n') + '\n');
                    return null;
                }
            });
            return getCompareSnapshotsPlugin(on, config);
        }
    },
})