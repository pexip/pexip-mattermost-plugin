// See https://developers.mattermost.com/extend/plugins/server/reference/
package main

import (
	"fmt"
	"sync"

	"github.com/gorilla/mux"
	pluginapi "github.com/mattermost/mattermost-plugin-api"
	"github.com/mattermost/mattermost-server/v6/plugin"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin
	client *pluginapi.Client

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration

	// router for the REST API
	router *mux.Router

	// botUserID of the created bot account.
	botUserID string
}

func (p *Plugin) OnActivate() error {
	p.client = pluginapi.NewClient(p.API, p.Driver)
	// p.client = pluginapi.NewClient(p.API, p.Driver)
	fmt.Println("On Activate")
	p.initializeRouter()
	fmt.Println("Router initialized")
	err := p.initializeBot()
	fmt.Println("Bot initialized")
	fmt.Println(err)
	return err
}
