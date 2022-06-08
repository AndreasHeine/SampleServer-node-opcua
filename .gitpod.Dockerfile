# hadolint ignore=DL3007
FROM gitpod/workspace-full:latest

# Install custom tools, runtimes, etc.
# For example "bastet", a command-line tetris clone:
RUN npm install -g npm@8.12.1
# More information: https://www.gitpod.io/docs/config-docker/