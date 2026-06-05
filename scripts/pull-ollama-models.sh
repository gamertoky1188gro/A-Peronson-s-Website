#!/usr/bin/env bash
set -euo pipefail

echo "==> Pulling BGE-M3 embedding model..."
docker exec gartexhub-ollama ollama pull bge-m3

echo "==> Pulling BGE-Reranker model..."
docker exec gartexhub-ollama ollama pull bge-reranker-v2-m3

echo "==> All models ready."
