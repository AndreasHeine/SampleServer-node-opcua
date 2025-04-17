#!/bin/bash

# Get the current directory
REPO_DIR=$(pwd)
echo "$REPO_DIR"

# Run the Docker container with the specified environment variables and volume mount
docker run \
	-e FILTER_REGEX_EXCLUDE="UA-Nodeset/*" \
	-e IGNORE_GITIGNORED_FILES=true \
	-e LOG_LEVEL=INFO \
	-e DEFAULT_BRANCH=origin/develop \
	-e VALIDATE_ALL_CODEBASE=true \
	-e VALIDATE_CHECKOV=false \
	-e VALIDATE_GITLEAKS=false \
	-e VALIDATE_JAVASCRIPT_STANDARD=false \
	-e VALIDATE_TYPESCRIPT_STANDARD=false \
	-e VALIDATE_XML=false \
    -e TYPESCRIPT_ES_CONFIG_FILE=../../../tmp/lint/.github/linters/.eslintrc.js \
	-e JAVASCRIPT_ES_CONFIG_FILE=../../../tmp/lint/.github/linters/.eslintrc.js \
    -e RUN_LOCAL=true \
	-v "$REPO_DIR:/tmp/lint" -it --rm ghcr.io/super-linter/super-linter:latest
