cd ~/mercado-track-api
git checkout master
git pull origin master
npm ci
pm2 restart mercado-track-api
