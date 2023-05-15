package main

import (
	pluginapi "github.com/mattermost/mattermost-plugin-api"
	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/pkg/errors"
)

const (
	botUserName    = "pexip"
	botDisplayName = "Pexip Video Connect" // TODO: Seems not to work
	botDescription = "A bot account created by the Pexip Video Connect plugin."
)

func (p *Plugin) initializeBot() error {
	botUserID, err := p.client.Bot.EnsureBot(&model.Bot{
		Username:    botUserName,
		DisplayName: botDisplayName,
		Description: botDescription,
	}, pluginapi.ProfileImagePath("/assets/icon.png"))
	if err != nil {
		return errors.Wrap(err, "failed to ensure bot account")
	}
	p.botUserID = botUserID

	return nil
}

func (p *Plugin) postMessage(channelID string, message string) error {
	post := &model.Post{
		UserId:    p.botUserID,
		ChannelId: channelID,
		Message:   message,
	}
	_, err := p.API.CreatePost(post)
	if err != nil {
		return errors.Wrap(err, "failed to create post")
	}
	return nil
}
