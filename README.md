# go-app-docs

Source and generated website for the [go-app documentation](https://go-app.dev).

## Local development

### Prerequisites

Install Go and `godoc` before building:

```sh
go install golang.org/x/tools/cmd/godoc@latest
```

Ensure the installed `godoc` executable is on your `PATH`.

### Run locally

Clone this repository, then run from this directory:

```sh
make
```

Open <http://localhost:7777>. To change the port, run
`GOAPP_DOCS_PORT=8888 make run`.

### Use a local go-app checkout

Each build uses the local `../go-app` checkout when available, including
uncommitted changes. The API reference and both binaries use that same checkout
through a temporary Go workspace, which is removed after the build.

To use a checkout elsewhere:

```sh
make build GOAPP_DIR=/path/to/go-app
```

### Use the latest release

When the checkout is unavailable, the build fetches the latest published
`go-app/v11` release with `go get`, updating `go.mod` and `go.sum` as needed.
To use the latest release even when a local checkout exists:

```sh
make build GOAPP_DIR=
```

`make run` uses the same selection and accepts `GOAPP_DIR` too.
