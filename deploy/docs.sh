#!/usr/bin/env bash
# Builds the docs site image with podman, pushes it to our registry and rolls it out on OpenShift.
# Run from the repository root:
#   WU_REGISTRY=registry.example.com:5000 deploy/docs.sh          # build, push and deploy
#   WU_REGISTRY=registry.example.com:5000 deploy/docs.sh build    # build and push only (the machine with podman)
#   WU_REGISTRY=registry.example.com:5000 deploy/docs.sh deploy   # deploy only (the machine logged in with oc)
# WU_TAG picks the tag (default: the current commit), and WU_TLS_VERIFY=false allows a registry served over plain HTTP.
# Once per registry: `podman login` on the build machine and, if the registry needs a login to pull, a pull secret in
# the OpenShift project:
#   oc create secret docker-registry wiraui-registry --docker-server=<registry> --docker-username=<user> --docker-password=<password>
#   oc secrets link default wiraui-registry --for=pull
# A registry over plain HTTP must also be listed as insecure in the cluster's image configuration.
set -euo pipefail

cd "$(dirname "$0")/.."
REGISTRY="${WU_REGISTRY:?set WU_REGISTRY to the registry host, e.g. registry.example.com:5000}"
TAG="${WU_TAG:-$(git rev-parse --short HEAD)}"
IMAGE="$REGISTRY/wiraui-docs"
TLS="--tls-verify=${WU_TLS_VERIFY:-true}"
STEP="${1:-all}"

if [ "$STEP" = all ] || [ "$STEP" = build ]; then
  podman build -f deploy/openshift/Containerfile -t "$IMAGE:$TAG" -t "$IMAGE:latest" .
  podman push "$TLS" "$IMAGE:$TAG"
  podman push "$TLS" "$IMAGE:latest"
  echo "pushed $IMAGE:$TAG"
fi

if [ "$STEP" = all ] || [ "$STEP" = deploy ]; then
  sed "s#WU_DOCS_IMAGE#$IMAGE:$TAG#" deploy/openshift/docs.yaml | oc apply -f -
  oc rollout status deployment/wiraui-docs --timeout=5m
  echo "deployed $IMAGE:$TAG"
fi
