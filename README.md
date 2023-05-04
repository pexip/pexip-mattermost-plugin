# Mattermost Pexip Plugin

Start a video conference with several participants without leaving the Mattermost interface. You can share your screen and interact with the rest of your team.

To compile this plugin you will need **node v16** and npm v8. This is very important, if you use another version of node, you will find some compability problems between packages.

You can download and install nvm to manage your node versions by following the instructions [here](https://github.com/nvm-sh/nvm). Once you've setup the project simply run `nvm i` within the root folder to use the suggested version of node.

## Getting Started

Alternatively shallow clone the repository matching your plugin name:
```
git clone --depth 1 https://github.com/pexip/mattermost-plugin-pexip com.pexip.mattermost-plugin-pexip
```

Note that this project uses [Go modules](https://github.com/golang/go/wiki/Modules). Be sure to locate the project outside of `$GOPATH`.


Build your plugin:
```
make
```

This will produce a single plugin file (with support for multiple architectures) for upload to your Mattermost server:

```
dist/com.example.my-plugin.tar.gz
```

## Development

This plugin was developed using the template provided by Mattermost: https://github.com/mattermost/mattermost-plugin-starter-template

To learn more about plugins, see [Mattermost documentation](https://developers.mattermost.com/extend/plugins/).

To avoid having to manually install your plugin, build and deploy your plugin using one of the following options. In order for the below options to work, you must first enable plugin uploads via your config.json or API and restart Mattermost.

```json
    "PluginSettings" : {
        ...
        "EnableUploads" : true
    }
```

### Deploying with Local Mode

If your Mattermost server is running locally, you can enable [local mode](https://docs.mattermost.com/administration/mmctl-cli-tool.html#local-mode) to streamline deploying your plugin. Edit your server configuration as follows:

```json
{
    "ServiceSettings": {
        ...
        "EnableLocalMode": true,
        "LocalModeSocketLocation": "/var/tmp/mattermost_local.socket"
    },
}
```

and then deploy your plugin:
```
make deploy
```

You may also customize the Unix socket path:
```
export MM_LOCALSOCKETPATH=/var/tmp/alternate_local.socket
make deploy
```

If developing a plugin with a webapp, watch for changes and deploy those automatically:
```
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_TOKEN=j44acwd8obn78cdcx7koid4jkr
make watch
```

### Deploying with credentials

Alternatively, you can authenticate with the server's API with credentials:
```
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_USERNAME=admin
export MM_ADMIN_PASSWORD=password
make deploy
```

or with a [personal access token](https://docs.mattermost.com/developer/personal-access-tokens.html):
```
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_TOKEN=j44acwd8obn78cdcx7koid4jkr
make deploy
```

## Q&A

### How do I make a server-only or web app-only plugin?

Simply delete the `server` or `webapp` folders and remove the corresponding sections from `plugin.json`. The build scripts will skip the missing portions automatically.

### How do I include assets in the plugin bundle?

Place them into the `assets` directory. To use an asset at runtime, build the path to your asset and open as a regular file:

```go
bundlePath, err := p.API.GetBundlePath()
if err != nil {
    return errors.Wrap(err, "failed to get bundle path")
}

profileImage, err := ioutil.ReadFile(filepath.Join(bundlePath, "assets", "profile_image.png"))
if err != nil {
    return errors.Wrap(err, "failed to read profile image")
}

if appErr := p.API.SetProfileImage(userID, profileImage); appErr != nil {
    return errors.Wrap(err, "failed to set profile image")
}
```

### How do I build the plugin with unminified JavaScript?
Setting the `MM_DEBUG` environment variable will invoke the debug builds. The simplist way to do this is to simply include this variable in your calls to `make` (e.g. `make dist MM_DEBUG=1`).
