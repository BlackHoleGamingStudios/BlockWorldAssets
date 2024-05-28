echo "Git pull"
git pull
echo "Install dependencies"
npm i
git config --local user.email "elias.elliotson@gmail.com"
git config --local user.name "Sorter (bot)"
echo "Sorting and formatting all json"
node bin/sort-json.mjs
echo "Stage changes"
git add .
echo "Commit changes"
git commit -am "fix: (bot) sort and format json"
echo "Push changes"
git push origin main