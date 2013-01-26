PATH=$PATH:$HOME/bin:
cd ~/apps/accounting.js
nohup node src/app.js 15233 > accounting.log & 
