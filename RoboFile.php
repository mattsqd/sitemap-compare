<?php

use Robo\Tasks;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * This is project's console commands configuration for Robo task runner.
 *
 * @see https://robo.li/
 */
class RoboFile extends Tasks
{
    /**
     * Get all URLs from a sitemap and store in file.
     *
     * @command compare:get-sitemap
     *
     * @arg string $url
     *   A sitemap URL.
     *
     * @return void
     *
     * @throws \Exception
     */
    public function getSitemap(InputInterface $input, OutputInterface $output, string $url): void
    {
        $get_xml = static function (string $url): SimpleXMLElement {
            $xml = simplexml_load_file($url);
            if (false === $xml) {
                throw new \Exception("Could not load valid XML from $url");
            }
            return $xml;
        };

        $urls = [];
        $get_urls = static function (SimpleXMLElement $xml, string $sitemap_url) use(&$get_urls, $get_xml, $urls):  array {
            if (!empty($xml->sitemap)) {
                foreach ($xml->sitemap as $sitemap) {
                    $urls = array_merge($urls, $get_urls($get_xml((string) $sitemap->loc), $sitemap_url));
                }
            } elseif (!empty($xml->url)) {
                foreach ($xml->url as $url) {
                    $urls[] = (string) $url->loc;
                }
            } else {
                throw new \Exception("Unable to find any additional sitemaps URLs or URLs in the $sitemap_url.");
            }
            return $urls;
        };
        $urls = array_unique($get_urls($get_xml($url), $url));
        $file = 'cypress/fixtures/urls.json';
        $flags =
            // Makes human readable by indenting and adding new lines.
            JSON_PRETTY_PRINT |
            // Slashes will get escaped but don't need to be.
            JSON_UNESCAPED_SLASHES;
        file_put_contents($file, json_encode($urls, $flags));
        $io = new SymfonyStyle($input, $output);
        $io->success(sprintf('Wrote %d URLs to %s from the sitemap %s', count($urls), $file, $url));
    }

}