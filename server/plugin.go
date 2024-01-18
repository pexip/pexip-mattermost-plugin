// See https://developers.mattermost.com/extend/plugins/server/reference/
package main

import (
	"sync"

	"github.com/gorilla/mux"
	"github.com/mattermost/mattermost/server/public/plugin"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin

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
	p.initializeRouter()
	err := p.initializeBot()
	return err
}
