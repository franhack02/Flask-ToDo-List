# Todo

A simple todo-list web application which provides the following functionality:  
• A list of todos  
• Create a new todo item  
• Mark a todo item as done or undone  
• Edit a todo item  
• Delete a todo item  
• Mark everything as completed  

The project makes use of Python3, Flask, SQLite, Bootstrap and JQuery.

## Getting Started

```bash
git clone https://github.com/booleancl/Flask-ToDo-List 
cd Flask-ToDo-List
```

## Create virtualenv and activate


```bash
python3 -m venv .venv
```

## Activate virtual env

```bash
source .venv/bin/activate
```

## Install

pip install -r requirements.txt

## Create .env file with the following 

FLASK_APP=app.py

## Run
```bash
flask run  
```
## If require server to be publicly accessible  

```bash
flask run --host=0.0.0.0
```
## Browse

Navigate to: http://localhost:5000/


## Create database tables

Stop the server then run the following:

```bash
flask shell
db.create_all()
exit()
```

## Run again and browse

```bash
flask
```
## Authors

**Zac Clery**

## License

This project is licensed under the MIT License
