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

## Automated builds

The `build` workflow runs on pushes to `main`, including merged pull requests,
and on `repository_dispatch` events with type `build`. It checks out the latest
`main` documentation and the highest stable version tag (`vX.Y.Z`) of
`maxence-charriere/go-app`, then runs `make github` with that checkout. Prerelease
and non-version tags are excluded. This generates the API reference, builds
the WebAssembly app and `documentation` binary, and generates the GitHub Pages
files. Changes under `docs/` are committed and pushed to `main`; the local
`documentation` binary is ignored.

The workflow uses `GITHUB_TOKEN` with `contents: write`. Repository rules must
allow that token to push to `main`. Its generated commit does not trigger another
build. It also does not trigger a branch-based GitHub Pages deployment; publishing
the generated site requires a separate Pages deployment setup.

### Trigger from go-app or another repository

Add this step to the calling workflow on an Ubuntu runner:

```yaml
- name: Rebuild go-app documentation
  env:
    GH_TOKEN: ${{ secrets.GO_APP_DOCS_TOKEN }}
  run: |
    gh api --method POST \
      repos/maxence-charriere/go-app-docs/dispatches \
      -f event_type=build
```

Create `GO_APP_DOCS_TOKEN` in the calling repository using a fine-grained personal
access token with **Contents: write** access to `maxence-charriere/go-app-docs`,
or supply a GitHub App token with that access. The caller's own `GITHUB_TOKEN`
cannot access another repository. The workflow must be present on this
repository's default branch before dispatch events can trigger it.
