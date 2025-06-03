import requests

# 1. Obtenha o token JWT
login_url = "http://localhost:8000/api/token/"
login_data = {
    "username": "Marco",      # Substitua pelo seu usuário
    "password": "2013marco437"         # Substitua pela sua senha
}
resp = requests.post(login_url, json=login_data)
print("Login:", resp.status_code, resp.text)
tokens = resp.json()
access_token = tokens.get("access")

# 2. Liste as tarefas (GET)
headers = {"Authorization": f"Bearer {access_token}"}
tasks_url = "http://localhost:8000/api/tasks/"
resp = requests.get(tasks_url, headers=headers)
print("Listar tarefas:", resp.status_code, resp.text)

# 3. Crie uma tarefa (POST)
new_task = {"name": "Tarefa criada via Python","tag_ids": []}
resp = requests.post(tasks_url, headers=headers, json=new_task)
print("Criar tarefa:", resp.status_code, resp.text)