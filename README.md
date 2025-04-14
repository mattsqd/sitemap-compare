# Sitemap Compare

The purpose of this package is to run [visual regression testing](https://www.npmjs.com/package/cypress-image-diff-js/v/1.22.0) on a site based a list or URLs to use.

By default, the package comes with a command to retrieve the list of URLs from the XML Sitemap of an arbitrary domain.

## Where are the tests?

They are located in `./cypress/e2e`.

## Where are the logs?

The results of `Cypress.log()` is sent to `./cypress/logs/log.txt`. This is handy to review after the tests have run.

The log file also will log when an image 404s, you can populate the URLs into a text file by running `./find_missing_images_in_logs.sh` then reviewing `missing-images.txt`.

## Getting started

Tested with Node 22

`npm install`

This will give you all the [Cypress](https://www.cypress.io/) dependencies.

Tested with PHP 8.3

`composer install`

This will get you all the [Robo](https://robo.li/) dependencies to run the following command.

`vendor/bin/robo compare:get-sitemap https://wwww.mysite.com/sitemap.xml`

This will save all the URLs found into `cypress/fixtures/urls.json`.

> :bulb: You don't technically need to run this command, you just need to create the above file which is just a JSON array of absolute URLs that you can populate however you would like. The tests will run visual comparison on each URL. 

You MUST see the configuration section below before you run the tests. These 3 settings will break your tests unless yours match exactly:

* `.cookiesjsr-btn.important.allowAll` This clicks on the GDPR allow all button. You may want to do something similar or just comment it out.
* `cy.get('header')` This completely hides the header because it was being absolutely positioned over the main content.
* `const selector = 'main';` This is the element that will be screenshotted. Your tag may be different or you can comment it out.

`npx cypress open`

> :bulb: It's highly recommended that one runs this via the GUI instead of CLI so that the supplied mobile, desktop, and tablet resolution screenshots will be taken correctly. One should also fully expand the Cypress testing window.

The `compare` test will go through every URL in `cypress/fixtures/urls.json` and get a baseline image. Running it again will compare this run to the previous run.

Therefore the recommended workflow, is to put your site in an initial state, run the tests to get the baseline, then do the upgrades / changes to your site and run the tests again to compare against the baseline.

## Commands

There are many commands that are available:

```
npm run clear`
```
Clear all reports and the baseline images.

```
npm run generate-report
```

Create a report based on the last run. Do this after your second run when you have a baseline to compare against.

```
npm run display-report
```

Start a server with the report.

## Configuration

The test `./cypress/e2e/compare.cy.js` has a few places where you can modify it easily to suit your environment.

Look for `// Loop through all of these resolutions.` if you want to take screenshots at different resolutions.

Look for `// Wait until the page has loaded.` if you are having issues with the page not loading before the screenshot is taken.

Look for `// Wait until all images have loaded.` if you are having issues with images.

Look for `// Hide things that should not show.` if you want to do some interacting with the page to hide elements before the screenshot is taken.

Look for `// Find the element you want to hide` if you want to hide some elements.

Look for `// Only compare a portion of the page so that similar portions don't cause 100% errors.` if you want to only take a screenshot of the portion of the page that actually changes and ignore things like headers, footers, and sidebars.

Look for `// If true, this will the name of the screenshot will be a combination of all the options that change how the screenshot is taken.` if you want to have very unique screenshot names.

Look for `// Configuration the compareSnapshot command.` if you want to pass options to the visual regression software.
