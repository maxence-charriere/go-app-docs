.PHONY: build run github clean

GOAPP_DIR ?= ../go-app

build:
	@set -e; \
		build_tmp=$$(mktemp -d); \
		trap 'rm -rf "$$build_tmp"' EXIT; \
		if [ -f "$(GOAPP_DIR)/go.mod" ] && [ -n "$(GOAPP_DIR)" ]; then \
			echo "• Using local go-app: $(GOAPP_DIR)"; \
			export GOWORK="$$build_tmp/go.work"; \
			go work init . "$(GOAPP_DIR)"; \
		else \
			echo "• Updating go-app to the latest published v11 release"; \
			export GOWORK=off; \
			go get github.com/maxence-charriere/go-app/v11@latest; \
		fi; \
		echo "\033[94m• Building go-app documentation PWA\033[00m"; \
		reference_tmp="$$build_tmp/reference.html"; \
		godoc -url /pkg/github.com/maxence-charriere/go-app/v11/pkg/app/ > "$$reference_tmp"; \
		mv "$$reference_tmp" ./docs/web/documents/reference.html; \
		GOARCH=wasm GOOS=js go build -v -o docs/web/app.wasm ./docs/src; \
		echo "\033[94m• Building go-app documentation\033[00m"; \
		go build -o docs/documentation ./docs/src

run: build
	@echo "\033[94m• Running go-app documentation server\033[00m"
	@cd docs && ./documentation local

github: build
	@echo "\033[94m• Generating GitHub Pages\033[00m"
	@cd docs && ./documentation github

clean:
	@go clean -v ./...
	-@rm docs/documentation
	@go mod tidy
