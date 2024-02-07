
# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).
 
## [1.0.0] - 2024-01-19

### Changed

- Use the new structure of [Mattermost Plugin Starter Template](https://github.com/mattermost/mattermost-plugin-starter-template).
- Remove `react-scripts` dependency.
- Upgrade all the dependencies from the webapp.
- Change Mattermost backend library from `github.com/mattermost/mattermost-plugin-api` to `github.com/mattermost/mattermost/server/public`.
 
## [1.0.0-rc.4] - 2023-06-15

### Fixed

- Set the /express parameter when using Web App 3 for using the express joining flow.

## [1.0.0-rc.3] - 2023-06-13

- Set the SiteURL in Client4, this way the user info retrieval works when Mattermost is deployed with a subpath.

## [1.0.0-rc.2] - 2023-06-09

### Fixed

- Use the SiteURL to build the HTTP request to retrieve the plugin configuration. With this modification the plugin also works even if Mattermost is served from a subpath. e.g. [https://mydomain.com/mattermost](https://mydomain.com/mattermost).

## [1.0.0-rc.1] - 2023-05-19

### Added

- Print in the server logs when a user joins a conference.
- Define maintainer in the README.

### Fixed

- Issues with the agentPin format in the local policy inside the README.

## [0.1.0-rc.1] - 2023-05-19

### Added

- Video call for channels.
- Receive and share the screen.
- Selector between embedded video conference inside Mattermost or launch the Pexip Web App 3.
- Print in the chat when somebody joins a video conference.