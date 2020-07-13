When pushing to heroku, go to .gitignore to remove config/production.json since Heroku will need it.
Heroku will run script "heroku-postbuild" to setup everything it needs for deploying this project.
