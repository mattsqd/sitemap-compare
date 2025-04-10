#!/usr/bin/env bash

set -e
grep '^\[Image Load Warning\]' cypress/logs/log.txt | sort | uniq > missing-images.txt
