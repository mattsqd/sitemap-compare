const urls = require('../fixtures/urls.json');

describe(`Comparing sitemap URLs`, () => {
    after(() => {
        // This causes an extra JSON report to be created if run via CLI.
        cy.task('generateJsonReport');
    })
    urls.forEach((url) => {
        const sizes = [
            [1920, 1080],
            [360, 800],
            [768, 1024]
        ];
        sizes.forEach(size => {
            it(`Capturing screenshot of ${url} ${size[0]}x${size[1]}`, () => {
                cy.viewport(size[0], size[1]);
                cy.visit(url);
                // Wait until the page has loaded.
                cy.waitUntil(() => cy.window().then(win => win.document.readyState === 'complete'));
                // Wait until all images have loaded.
                // https://stackoverflow.com/questions/78216692/how-to-wait-until-all-images-have-loaded-before-running-cypress-test.
                cy.get('img').each(($img) => {
                    cy.wrap($img)
                        .scrollIntoView()
                        .then(($el) => {
                            const imgEl = $el[0];

                            // Return a Cypress Promise to control behavior
                            return new Cypress.Promise((resolve) => {
                                setTimeout(() => {
                                    const width = imgEl.naturalWidth;

                                    if (width === 0) {
                                        Cypress.log({
                                            name: 'Image Load Warning',
                                            message: `Image did not load: ${imgEl.src} on ${url}`,
                                            consoleProps: () => ({ width }),
                                        });
                                    }

                                    resolve(); // continue test no matter what
                                }, 500); // Wait .5 second max
                            });
                        });
                });
                // Hide things that should not show.
                cy.get('.cookiesjsr-btn.important.allowAll').click();
                // Find the element you want to hide
                cy.get('header')
                    .then((element) => {
                        // Hide the element
                        element.hide();
                    });
                // Only compare a portion of the page so that similar portions don't cause 100% errors.
                const selector = 'main';
                // If true, this will the name of the screenshot will be a combination of all the options
                // that change how the screenshot is taken.
                const screenshotNameChangesByOptions = false;
                // Configuration the compareSnapshot command.
                // https://cypress.visual-image-diff.dev/getting-started/cy.comparesnapshot-command.
                // https://cypress.visual-image-diff.dev/getting-started/custom-config-file.
                let compareOptions = {
                    testThreshold: 0.01
                }
                // Everything that can change how the screenshot is taken should be put in this.
                let changesName = compareOptions;
                changesName.url = url.replace(/\//g, '_');
                changesName.size = `${size[0]}x${size[1]}`;
                if (screenshotNameChangesByOptions) {
                    if (selector) {
                        changesName.selector = selector.replace(/[\s>]/g, '-');
                    }

                    // Function to convert object to a string separated by `—`.
                    function objectToString(obj) {
                        return Object.entries(obj)
                            .map(([key, value]) => `${key}=${value}`)
                            .join('—');
                    }

                    compareOptions.name = objectToString(changesName);
                } else {
                    compareOptions.name = changesName.url + '--' + changesName.size;
                }

                if (selector.length > 0) {
                    // If this selector does not exist, the test will error but no 'comparison' screenshot will be created. This is bad
                    // because the report will look like everything passed.
                    cy.get(selector).compareSnapshot(compareOptions);
                } else {
                    cy.compareSnapshot(compareOptions);
                }
            });
            after(() => {
                // This causes an extra JSON report to be created if run via CLI.
                cy.task('generateJsonReport');
            })
        });
    });
});
