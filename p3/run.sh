#!/bin/bash 
cd easychef
npm start &

cd ..
python manage.py migrate
python manage.py runserver
