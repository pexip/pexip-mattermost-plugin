# Development

## How to compile the plugin

Start by cloning the repository:

```
git clone --depth 1 https://github.com/pexip/pexip-matermost-plugin com.pexip.pexip-video-connect
```

To compile you will need **node v18** and **npm v8**. This is important, because if you use another version of node, you will find some compatibility problems between packages.

You can download and install nvm to manage your node versions by following the instructions [here](https://github.com/nvm-sh/nvm). Once you've setup the project simply run `nvm i` within the root folder to use the suggested version of node.

For compiling the server part you will need to have **Go** installed in your system. You can check how install it in the [Go docs](https://go.dev/doc/install).

Build the plugin, you only have to run the following command:

```bash
make
```

This will produce a single plugin file (with support for amd64 architecture) for upload to your Mattermost server:

```bash
dist/com.pexip.pexip-video-connect-<version>.tar.gz
```

This plugin was developed using the template provided by Mattermost: https://github.com/mattermost/mattermost-plugin-starter-template.

To learn more about plugins, see [Mattermost documentation](https://developers.mattermost.com/extend/plugins/).


## How to launch a Mattermost in Docker

For testing the plugin, you can launch mattermost in a docker container:

```bash
$ docker run --name mattermost-preview -d --publish 8065:8065 mattermost/mattermost-preview
```

For now on, we will suppose that you are using the docker container and the app is accessible from https://localhost:8065:

- Launch mattermost in a web browser: https://localhost:8065

- Introduce all the mandatory info: username, password, organization, url, etc.

## How to upload the plugin

- Open the admin web page: https://localhost:8065/admin_console

- In the left menu go to the **Plugins** section and there select **Plugin Management**.

- In the section **Upload Plugin** click on **Choose File** and select the file `dist/com.pexip.pexip-video-connect-<version>.tar.gz`.

- Click on **Upload**.

## Configuration

For the configuration you can follow the same steps that is explained in the project [README](../README.md).