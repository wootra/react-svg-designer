#!/bin/bash
cp ./* ../svg-designer
cp -R ./src ../svg-designer
cp -R ./public ../svg-designer

cd ../svg-designer
git add .
git commit
git push