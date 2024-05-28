echo "Git pull"
git pull
echo "Install dependencies"
npm i
git config --local user.email "elias.elliotson@gmail.com"
git config --local user.name "Copyrighter (bot)"
echo "Add copyright data to pngs"
node bin/copyright-pngs.mjs
echo "Stage changes"
git add .
echo "Commit changes"
git commit -am "fix: (bot) copyright png files"
echo "Push changes"
git push origin main