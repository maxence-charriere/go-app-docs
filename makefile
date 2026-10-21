.PHONY: build run github clean

build:
	@echo "\033[94m• Building go-app documentation PWA\033[00m"
	@set -e; \
		reference_tmp=$$(mktemp ./docs/web/documents/reference.html.XXXXXX); \
		trap 'rm -f "$$reference_tmp"' EXIT; \
		godoc -url /pkg/github.com/maxence-charriere/go-app/v11/pkg/app/ > "$$reference_tmp"; \
		mv "$$reference_tmp" ./docs/web/documents/reference.html
	@GOARCH=wasm GOOS=js go build -v -o docs/web/app.wasm ./docs/src
	@echo "\033[94m• Building go-app documentation\033[00m"
	@go build -o docs/documentation ./docs/src

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
