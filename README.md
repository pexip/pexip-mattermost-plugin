# Pexip Video Connect Plugin for Mattermost

Start a video conference from any channel with several participants without leaving Mattermost. You will be able to join also from SIP devices and share your screen.

For more information and get all the possibilities, visit https://pexip.com.

## Requirements

For using this plugin you need to comply with the following requirements:

- Mattermost server with the plugin installed.
- Pexip Infinity Management node.
- At least one Pexip Infinity Conferencing node.
- A valid Pexip License.

## How to compile the plugin

Start by cloning the repository:

```
git clone --depth 1 https://github.com/pexip/pexip-matermost-plugin com.pexip.pexip-video-connect
```

To compile this plugin you will need **node v18** and **npm v8**. This is important, because if you use another version of node, you will find some compatibility problems between packages.

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


## How to upload the plugin

For testing the plugin, you can launch mattermost in a docker container:

```bash
$ docker run --name mattermost-preview -d --publish 8065:8065 mattermost/mattermost-preview
```

For now on, we will suppose that you are using the docker container and the app is accessible from https://localhost:8065:

- Launch mattermost in a web browser: https://localhost:8065

- Introduce all the mandatory info: username, password, organization, url, etc.

- Open the admin web page: https://localhost:8065/admin_console

- In the left menu go to the `Plugins` section and there select `Plugin Management`.

- In the section `Upload Plugi` click on `Choose File` and select the file `dist/com.pexip.pexip-video-connect-0.1.0.tar.gz`.

- Click on `Upload`.


## How to configure the Mattermost plugin

Now we will enable the plugin and set the configuration:

- Open the admin web page: https://localhost:8065/admin_console

- Go to the left menu and under the `Plugins` section you should see `Pexip Video Connect`. Click on that plugin to show the plugins menu.

- Configure the following parameters:

  - **Enable Plugin:** `true`

  - **Pexip Infinity Server:** Domain or IP of your Conferencing Node.

  - **VMR prefix:** It will attach a prefix to the Mattermost Channel name. For example, if the channel name is `Town Square` and the prefix `matt-`, the system will use the VMR `matt-town-square`. You will need to use the same prefix later in the **Pexip Infinity configuration**.

  - **Host PIN:** This PIN is used for all the VMR for connecting as an host. You will need to use the same prefix later in the **Pexip Infinity configuration**.

  - **Embedded Experience:** Set it to `true` if you want the integrated experience and the video conference will be displayed inside the Mattermost interface. If you set it to `false` a new window with the **Pexip Web App 3** will be opened.


## How to configure Pexip Infinity

You have installed the Pexip Video Connect plugin in Mattermost and almost configured it with the proper configuration. Now is the turn to 

- Open the Pexip Infinity Management node web interface. 

- Go to `Call Control > Policy Profiles`.

- Click on `Add Policy profile`.

- Define a name for the new profile.

- In `Service configuration policy` check the box `Apply local policy`.

- Copy the following script, but not forget to modify the `prefix` and `agentPin` for the onw that you defined in the plugin configuration:

```
{% set prefix = "matt-" %}
{% set agentPin = "1234" %}
{% if call_info.local_alias.startswith(prefix) %}
  {
    "action": "continue",
    "result": {
      "service_type": "conference",
      "name":  {{'"'}}{{call_info.local_alias | pex_regex_replace("^" + prefix, "") }}{{'"'}},
      "service_tag": "Mattermost",
      "pin": agentPin,
      "allow_guests": true,
      "crypto_mode": "besteffort",
      "view": "five_mains_seven_pips",
      "enable_overlay_text": true
    }
  }
{% elif service_config %}
  {
    "action" : "continue",
    "result" : {{service_config|pex_to_json}}
  }
{% else %}
  {
    "action" : "reject",
    "result" : {}
  }
{% endif %}
```
- Click on "Save" and you will have your new policy in the system.

The last step is to assign the new policy to a Location:

- Open the Pexip Infinity Management node web interface.
- Go to `Platform > Locations`.
- Select the location that you want to use for Mattermost.
- In the section `Policy profile` select the policy that you have created before.

## Q&A

### Do I need a Pexip license to use this plugin?

You don't need a license to install the plugin in your Mattermost environment. However, you will need a Pexip license to use a Pexip Infinity deployment that the plugin will use to connect to the conference.

