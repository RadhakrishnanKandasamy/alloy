ssh -t mowla@20.186.4.13 "cd /var/www/alloyio.com && git reset HEAD --hard && 
git pull origin demo-nov-15 && npm i && npm run build:prod && npm run sandbox:install && 
npm run sandbox:build && 
cp /var/www/alloyio.com/dist/standalone/alloy.js /var/www/alloyio.com/sandbox/build &&
cp /var/www/alloyio.com/dist/standalone/alloy.js /var/www/alloyio.com/sandbox/build/demo"