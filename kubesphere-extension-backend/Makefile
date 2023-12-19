# build params
PREFIX?=ringtail
VERSION?=v0.1
GIT_COMMIT:=$(shell git rev-parse --short HEAD)

# Image URL to use all building/pushing image targets
IMG ?= $(PREFIX)/kruise-game-dashboard-backend:$(VERSION)-$(GIT_COMMIT)
all: test build-binary

# Run tests
test: fmt vet
	go test ./  -coverprofile cover.out

# Build kubernetes-webhook-injector binary
build-binary:
	go build -o kruise-game-dashboard-backend main.go


# Run against the configured Kubernetes cluster in ~/.kube/config
run: fmt vet
	go run ./main.go

# Run go fmt against code
fmt:
	go fmt ./

# Run go vet against code
vet:
	go vet ./

# Build the docker image
docker-build:
	docker build . -f Dockerfile -t ${IMG} --no-cache

# Push the docker image
docker-push:
	docker push ${IMG}