#!/usr/bin/env bash

echo "Running formatting and lint checks..."
npm run format && npm run lint || { echo "Code quality checks failed! Aborting build."; exit 1; }

echo "Running tests before build..."
npm run test || { echo "Tests failed! Aborting build."; exit 1; }

version=$(node -p "require('./package.json').version")

cd src
mkdir -p ../dist
rm -f "../dist/notion-enhancer-$version.zip"
zip -r9 "../dist/notion-enhancer-$version.zip" .
echo "Build complete: dist/notion-enhancer-$version.zip"