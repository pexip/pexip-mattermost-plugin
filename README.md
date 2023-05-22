# Pexip Video Connect Plugin for Mattermost

Start a video conference from any channel with several participants without leaving Mattermost. You will be able to join also from SIP devices and share your screen.

For more information and get all the possibilities, visit https://pexip.com.

## Requirements/Prerequisites

For using this plugin you need to comply with the following requirements:

- Mattermost server v6.2.1 or higher.
- Pexip Infinity Management node v31 or higher.
- At least one Pexip Infinity Conferencing node v32 or higher.
- A valid Pexip License.

## Configuration

In this section you will learn how to make a proper configuration. The configuration that you have to make is divided in two different steps.

First you will need to define the configuration in the Pexip Infinity Management node. Here you will define how to treat the incoming conferences.

In the second step, you will define the configuration of the Pexip Plugin inside Mattermost. This configuration should match the one that you defined in the previous step.

### Step 1: Configure Pexip Infinity

We will start by defining our configuration in the Pexip Infinity Management node:

- Open the Pexip Infinity Management node web interface. 

- Go to **Call Control > Policy Profiles**.

- Click on **Add Policy profile**.

- Define a name for the new profile.

- In **Service configuration policy** check the box **Apply local policy**.

- Copy the following script, but not forget to modify the `prefix` and `agentPin` with the values that you want for your deployment:

  ```jinja
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
- Go to **Platform > Locations**.
- Select the location that you want to use for Mattermost.
- In the section **Policy profile** select the policy that you have created before.

### Step 2: Configure the Mattermost Plugin

Now we will enable the plugin and set the configuration:

- Open the admin web page: `https://<mattermost-domain>/admin_console`

- Go to the left menu and under the **Plugins** section you should see **Pexip Video Connect**. Click on that plugin to show the plugins menu.

- Configure the following parameters:

  - **Enable Plugin:** `true`

  - **Pexip Infinity Server:** Domain or IP of your Conferencing Node (e.g. `pexipdemo.com` or `192.168.1.100`).

  - **VMR prefix:** It will attach a prefix to the Mattermost Channel name. For example, if the channel name is `Town Square` and the prefix `matt-`, the system will use the VMR `matt-town-square`. You will need to use the same prefix that you used for the **Pexip Infinity configuration**.

    > **Warning**
    > You will need to use the same prefix that you used for the **Pexip Infinity configuration**.

  - **Host PIN:** This PIN is used for all the VMR for connecting as an host.

    > **Warning**
    > You will need to use the same host pin that you used for the **Pexip Infinity configuration**.

  - **Embedded Experience:** Set it to `true` if you want the integrated experience and the video conference will be displayed inside the Mattermost interface. If you set it to `false` a new window with the **Pexip Web App 3** will be opened.

## Using the Plugin

Once the plugin is installed, enabled and properly configured, all user will see a new button on the top-right of the interface.

The behavior of this button will depend on the configuration that you have defined in Plugin configuration. In case you have the **Embedded Experience** disabled, you will open the Pexip Web App 3 in another browser window when you push the button. In case it's enabled, you will see a panel.

  > **Warning**
  > The plugin only works for conferences inside channels. This means that it won't be available for one-to-one calls or for bots.


## Frequently Asked Questions

### Do I need a Pexip license to use this plugin?

You don't need a license to install the plugin in your Mattermost environment. However, you will need a Pexip license to use a Pexip Infinity deployment that the plugin will use to connect to the conference.

## Development

This plugin contains both a server and web app portion. If you want information about how to compile the plugin and test it in a development environment, visit the [developer guide](docs/DEVELOPMENT.md).

https://github.com/mattermost/mattermost-plugin-github/blob/master/README.md