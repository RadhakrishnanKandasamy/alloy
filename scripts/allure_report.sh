#!/bin/sh

mkdir target/github-pages
git clone --single-branch --branch master https://shammowla:$GITHUB_TOKEN@github.com/shammowla/alloy-qe target/master
sleep 5
cp -R target/github-pages/history build/allure-results
# shellcheck disable=SC2164
cd build
allure generate --clean
sleep 10
cd ..
# shellcheck disable=SC2164
cp -R build/allure-report/* target/github-pages/
# shellcheck disable=SC2164
cd target/github-pages/
git config user.name "Travis CI"
git config user.email "deploy@travis-ci.org"
# shellcheck disable=SC2035
git add -A
git commit -m "Auto deploy from Travis CI $TRAVIS_BUILD_NUMBER"
git push origin master