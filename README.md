# go-app-docs

Source and generated website for the [go-app documentation](https://go-app.dev).

## Local development

Clone this repository alongside `go-app`, then run from this directory:

```sh
make build
make run
```

Open <http://localhost:7777>. To change the port, run
`GOAPP_DOCS_PORT=8888 make run`.

The build uses the local `go-app` module and its dependencies, including
uncommitted framework changes. This repository does not need a separate
`go.mod` for this development setup. If your checkout is elsewhere, use:

```sh
make run GOAPP_DIR=/path/to/go-app
```

Install Go and `godoc` before building:

```sh
go install golang.org/x/tools/cmd/godoc@latest
```

Ensure the installed `godoc` executable is on your `PATH`.

`make github` builds the app and generates static pages in `docs/`.
`make clean` removes the native server binary, Wasm binary, and generated API
reference. The next build recreates them.
