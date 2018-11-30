cd ~/mercado-track-api
git pull origin master
npm ci
pm2 restart mercado-track-api
