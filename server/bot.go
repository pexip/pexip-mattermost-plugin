package main

import (
	"bufio"
	"io"
	"os"

	"github.com/mattermost/mattermost/server/public/model"
	"github.com/pkg/errors"
)

const (
	botUserName    = "pexip"
	botDisplayName = "Pexip Video Connect"
	botDescription = "A bot account created by the Pexip Video Connect plugin."
	iconFilePath   = "./plugins/com.pexip.pexip-video-connect/public/icon.png"
)

func (p *Plugin) initializeBot() error {
	botUserID, err := p.API.EnsureBotUser(&model.Bot{
		Username:    botUserName,
		DisplayName: botDisplayName,
		Description: botDescription,
	})
	if err != nil {
		return errors.Wrap(err, "failed to ensure bot account")
	}

	file, err := os.Open(iconFilePath)
	if err != nil {
		return errors.Wrap(err, "cannot access the bot profile image ("+iconFilePath+")")
	}
	defer file.Close()

	// Get the file size
	stat, err := file.Stat()

	if err != nil {
		return errors.Wrap(err, "failed getting the image metadata")
	}

	// Read the file into a byte slice
	bs := make([]byte, stat.Size())
	_, err = bufio.NewReader(file).Read(bs)

	if err != nil && err != io.EOF {
		return errors.Wrap(err, "failed reading the image file")
	}

	appErr := p.API.SetProfileImage(botUserID, bs)

	if appErr != nil {
		return errors.Wrap(err, "failed setting the profile image")
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
