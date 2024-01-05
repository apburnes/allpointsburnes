#! /bin/bash

set -x

wrangler pages deploy ./dist --project-name all-points-burnes-site
