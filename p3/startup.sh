#!/bin/bash

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt
npm install node
pip install django-cors-headers
npm install bootstrap
npm install react-bootstrap
npm install react-axios
npm install react-scripts
python manage.py makemigrations accounts
python manage.py makemigrations Recipes
python manage.py makemigrations
python manage.py migrate accounts
python manage.py migrate Recipes