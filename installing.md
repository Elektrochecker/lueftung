1. clone repo to system, install nodejs and npm packages
2. install and configure nginx:

`sudo apt install nginx`

`sudo rm /etc/nginx/sites-enabled/default`

`sudo cp lueftung.conf /etc/nginx/sites-enabled`

restart nginx.

3. auto-start with pm2

`npm install pm2@latest -g`

`pm2 start index.js`

`pm2 startup systemd`

-> copy/paste command

`pm2 save`

then:

`pm2 monitor index`

`pm2 restart index`