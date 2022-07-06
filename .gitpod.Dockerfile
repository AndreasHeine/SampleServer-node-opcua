# hadolint ignore=DL3007
FROM gitpod/workspace-full:2022-06-20-19-54-55

# Install custom tools, runtimes, etc.
# For example "bastet", a command-line tetris clone:
RUN npm install -g npm@8.13.2
# More information: https://www.gitpod.io/docs/config-docker/