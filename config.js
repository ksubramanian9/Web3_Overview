// Allow the runtime to specify whether we are executing in a Docker
// environment.  This value can be injected at build time via an
// environment variable or by setting `globalThis.RUNNING_IN_DOCKER`
// before this script loads.  It defaults to `false` when not provided.
window.RUNNING_IN_DOCKER = !!(
  (typeof process !== 'undefined' && process.env.RUNNING_IN_DOCKER === 'true') ||
  globalThis.RUNNING_IN_DOCKER
);
