# Pexip Mattermost Plugin

Mattermost is a chat webapp that has plugins and apps. From the user point of view the UX is very similar to Slack.

## Deploy the server locally (Manual)

We can run a docker container directly with the following command:

```bash
$ docker run --name mattermost-preview -d --publish 8065:8065 mattermost/mattermost-preview
```

## Generate plugin bundle

1. Install npm dependencies:

```bash
$ npm run install
```

2. Create javascript file for production:

```bash
$ npm run build
```

3. Create bundle (tgz for uploading to mattermost)

```bash
$ npm run bundle
```

## Upload plugin to mattermost platform

For testing the plugin we will need to launch mattermost in a web browser

1. Launch mattermost in a web browser: http://localhost:8065

2. Introduce all the mandatory info: username, password, organization, url, etc.

3. Open the admin web page: http://localhost:8065/admin_console

4. In the left menu go to the "Plugins" section and there select "Plugin Management".

5. In the section "Upload Plugin" click on "Choose File" and select the file "com.mattermost.webapp-hello-world.gz".

6. Click on "Upload".

7. Go to the left menu and under the "Plugins" section you should see "Pexip VMR connector". Click on that plugin to show the plugins menu.

8. In the "Enable Plugin" section select "true".



