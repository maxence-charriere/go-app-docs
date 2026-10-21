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

The build and generated API reference use the `go-app` dependency selected by
this repository's `go.mod`.

Install Go and `godoc` before building:

```sh
go install golang.org/x/tools/cmd/godoc@latest
```

Ensure the installed `godoc` executable is on your `PATH`.

`make github` builds the app and generates static pages in `docs/`.
`make clean` removes the native server binary and tidies module dependencies.
