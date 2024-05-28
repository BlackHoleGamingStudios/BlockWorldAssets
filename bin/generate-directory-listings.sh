echo "Git pull"
git pull
echo "Install dependencies"
npm i
git config --local user.email "elias.elliotson@gmail.com"
git config --local user.name "Lister (bot)"
echo "Autogenerating directory listings page"
node bin/generate-directory-listings.mjs
echo "Stage changes"
git add .
echo "Commit changes"
git commit -am "fix: (bot) generate file directory page"
echo "Push changes"
git push origin main