module github.com/pexip/mattermost-plugin-pexip

go 1.16

require (
	github.com/gorilla/mux v1.8.0
	github.com/mattermost/mattermost-plugin-api v0.1.3
	// mmgoget: github.com/mattermost/mattermost-server/v6@v7.4.0 is replaced by -> github.com/mattermost/mattermost-server/v6@8cb6718a9b
	github.com/mattermost/mattermost-server/v6 v6.0.0-20221012175353-8cb6718a9bcc
	github.com/pkg/errors v0.9.1
)
