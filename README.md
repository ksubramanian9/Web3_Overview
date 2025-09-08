# Web3 Overview

Static site exploring Web3 topics. Pages are generated from content definitions using `generate_pages.js`.

## Development

```bash
node generate_pages.js
```

## Docker

Build the Docker image:

```bash
docker build -t web3-overview .
```

Run the container (requires a local Ollama server on port 11434):

```bash
docker run --rm -p 8080:8080 --add-host=host.docker.internal:host-gateway -e OLLAMA_MODEL=<model> web3-overview
```

When running inside Docker, each page queries the local Ollama server for a brief outline of the topic and displays it in the right-hand panel. If the site is not running in Docker, or the server is unreachable, the panel remains empty.
