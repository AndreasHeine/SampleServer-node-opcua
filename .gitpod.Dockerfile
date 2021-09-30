FROM gitpod/workspace-full:build-branch-master

# Install custom tools, runtimes, etc.
# For example "bastet", a command-line tetris clone:
RUN npm install -g npm@7.24.1
#
# More information: https://www.gitpod.io/docs/config-docker/