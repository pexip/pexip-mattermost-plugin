package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"runtime/debug"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/mattermost/mattermost-server/v6/plugin"
	"github.com/pkg/errors"
)

const (
	routeAPI                     = "/api"
	routeAPISettings             = "/settings"
	routeAPINotifyJoinConference = "/notify_join_conference"
)

type InNotifyJoinConference struct {
	ChannelID string `json:"channelId"`
}

func (p *Plugin) initializeRouter() {
	p.router = mux.NewRouter()
	p.router.Use(p.withRecovery)
	apiRouter := p.router.PathPrefix(routeAPI).Subrouter()
	apiRouter.HandleFunc(routeAPISettings, p.checkAuth(p.handleResponse(p.httpGetSettings))).Methods(http.MethodGet)
	apiRouter.HandleFunc(routeAPINotifyJoinConference, p.checkAuth(p.handleResponse(p.httpNotifyJoinConference))).Methods(http.MethodPost)
}

func (p *Plugin) httpGetSettings(w http.ResponseWriter, _ *http.Request) (int, error) {
	conf := p.getConfiguration()
	return respondJSON(w, struct {
		Node            string `json:"node"`
		Prefix          string `json:"prefix"`
		Pin             int    `json:"pin"`
		DisplayNameType string `json:"displayNameType"`
		Embedded        bool   `json:"embedded"`
	}{
		Node:            conf.Node,
		Prefix:          conf.Prefix,
		Pin:             conf.Pin,
		DisplayNameType: conf.DisplayNameType,
		Embedded:        conf.Embedded,
	})
}

func (p *Plugin) httpNotifyJoinConference(w http.ResponseWriter, r *http.Request) (int, error) {
	in := InNotifyJoinConference{}
	err := json.NewDecoder(r.Body).Decode(&in)
	if err != nil {
		return respondErr(w, http.StatusBadRequest,
			errors.WithMessage(err, "failed to decode incoming request"))
	}
	userID := r.Header.Get("Mattermost-User-Id")

	user, err := p.client.User.Get(userID)
	if err != nil {
		return respondErr(w, http.StatusInternalServerError,
			errors.WithMessage(err, "cannot retrieve user info"))
	}

	channel, err := p.client.Channel.Get(in.ChannelID)
	if err != nil {
		return respondErr(w, http.StatusInternalServerError,
			errors.WithMessage(err, "cannot retrieve channel info"))
	}

	fmt.Printf("%v has joined the video conference for the channel \"%v\"", user.Username, channel.DisplayName)
	err = p.postMessage(in.ChannelID, "@"+user.Username+" has joined the channel video conference.")
	if err != nil {
		return respondErr(w, http.StatusInternalServerError,
			errors.WithMessage(err, "cannot post message in the channel"))
	}

	return 200, err
}

func (p *Plugin) ServeHTTP(_ *plugin.Context, w http.ResponseWriter, r *http.Request) {
	p.router.ServeHTTP(w, r)
}

func (p *Plugin) withRecovery(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if x := recover(); x != nil {
				p.client.Log.Warn("Recovered from a panic",
					"url", r.URL.String(),
					"error", x,
					"stack", string(debug.Stack()))
			}
		}()

		next.ServeHTTP(w, r)
	})
}

func (p *Plugin) checkAuth(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Header.Get("Mattermost-User-ID")
		if userID == "" {
			http.Error(w, "Not authorized", http.StatusUnauthorized)
			return
		}
		handler(w, r)
	}
}

func (p *Plugin) handleResponse(fn func(w http.ResponseWriter, r *http.Request) (int, error)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		status, err := fn(w, r)

		p.logResponse(r, status, err)
	}
}

func (p *Plugin) logResponse(r *http.Request, status int, err error) {
	if status == 0 || status == http.StatusOK {
		return
	}
	if err != nil {
		p.client.Log.Warn("ERROR: ", "Status", strconv.Itoa(status), "Error", err.Error(), "Path", r.URL.Path, "Method", r.Method, "query", r.URL.Query().Encode())
	}

	if status != http.StatusOK {
		p.client.Log.Debug("unexpected plugin response", "Status", strconv.Itoa(status), "Path", r.URL.Path, "Method", r.Method, "query", r.URL.Query().Encode())
	}
}

func respondJSON(w http.ResponseWriter, obj interface{}) (int, error) {
	data, err := json.Marshal(obj)
	if err != nil {
		return respondErr(w, http.StatusInternalServerError, errors.WithMessage(err, "failed to marshal response"))
	}
	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(data)
	if err != nil {
		return http.StatusInternalServerError, errors.WithMessage(err, "failed to write response")
	}
	return http.StatusOK, nil
}

func respondErr(w http.ResponseWriter, code int, err error) (int, error) {
	http.Error(w, err.Error(), code)
	return code, err
}
