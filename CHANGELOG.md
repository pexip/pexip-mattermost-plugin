# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to
[Semantic Versioning](http://semver.org/).

## [1.1.0] 2024-06-28

### Added

- Add unit tests to verify functionality.
- Change the user state inside Mattermost when they are on call. Now we display a calendar icon with the message "In a
  video conference".
- Dialog to change the microphone, camera and speaker (if the browser supports it) and save this value in the
  `localStorage`.
- Add effects to change the video background: blur and background replacement.
- Possibility to pop-up the screen sharing video to a new window.
- Support for calls between users instead of only supporting calls on channels.
- Add state in the participant list: audio muted, video muted and presenting.
- Add button in the participant list to admit users that are in the waiting room.

### Changed

- Remove PexRTC library and use the npm packages instead (`@pexip/infinity`, `@pexip/components`,
  `@pexip/media-components` and `@pexip/media-processor`).
- Unify state under `ConferenceContext`.
- Rename app from `Pexip Video Connect` to `Pexip`.
- Change id from `com.pexip.pexip-video-connect` to `com.pexip.pexip-app`.
- Separate the `localStream` into `localVideoStream` and `localAudioStream`.
- Stop tracks when the `audio` or `video` is muted. This will be reflected on the tab and in the camera led.

### Fixed

- Screen sharing in the Desktop App.
- Improve support for Firefox and Safari.

## [1.0.0] - 2024-01-19

### Changed

- Use the new structure of
  [Mattermost Plugin Starter Template](https://github.com/mattermost/mattermost-plugin-starter-template).
- Remove `react-scripts` dependency.
- Upgrade all the dependencies from the webapp.
- Change Mattermost backend library from `github.com/mattermost/mattermost-plugin-api` to
  `github.com/mattermost/mattermost/server/public`.

## [1.0.0-rc.4] - 2023-06-15

### Fixed

- Set the /express parameter when using Web App 3 for using the express joining flow.

## [1.0.0-rc.3] - 2023-06-13

- Set the SiteURL in Client4, this way the user info retrieval works when Mattermost is deployed with a subpath.

## [1.0.0-rc.2] - 2023-06-09

### Fixed

- Use the SiteURL to build the HTTP request to retrieve the plugin configuration. With this modification the plugin also
  works even if Mattermost is served from a subpath. e.g.
  [https://mydomain.com/mattermost](https://mydomain.com/mattermost).

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
