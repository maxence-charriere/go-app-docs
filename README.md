# go-app-docs

Source and generated website for the [go-app documentation](https://go-app.dev).

## Local development

Clone this repository, then run from this directory:

```sh
make build
make run
```

Open <http://localhost:7777>. To change the port, run
`GOAPP_DOCS_PORT=8888 make run`.

Each build uses the local `../go-app` checkout when available, including
uncommitted changes. The API reference and both binaries use that same checkout
through a temporary Go workspace, which is removed after the build.

To use a checkout elsewhere:

```sh
make build GOAPP_DIR=/path/to/go-app
```

When the checkout is unavailable, the build fetches the latest published
`go-app/v11` release with `go get`, updating `go.mod` and `go.sum` as needed.
To use the latest release even when a local checkout exists:

```sh
make build GOAPP_DIR=
```

`make run` and `make github` use the same selection and accept `GOAPP_DIR` too.

Install Go and `godoc` before building:

```sh
go install golang.org/x/tools/cmd/godoc@latest
```

Ensure the installed `godoc` executable is on your `PATH`.

`make github` builds the app and generates static pages in `docs/`.
`make clean` removes the native server binary and tidies module dependencies.
