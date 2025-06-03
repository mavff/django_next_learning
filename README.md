# Projeto Django + Next.js + PostgreSQL

Este projeto é um sistema de tarefas com autenticação JWT, backend em Django REST Framework e frontend em Next.js. Permite criar, listar, editar e comentar tarefas, além de organizar por tags.

---

## **Pré-requisitos**

- Python 3.10+
- Node.js 18+
- PostgreSQL
- (Opcional) pipenv ou virtualenv

---

## **Configuração do Backend (Django)**

1. **Instale as dependências:**

   ```sh
   cd django_backend
   pip install -r requirements.txt
   ```

2. **Configure o banco de dados:**

   Edite `django_postgree_backend/settings.py` com os dados do seu PostgreSQL.

3. **Aplique as migrações:**

   ```sh
   py manage.py makemigrations
   py manage.py migrate
   ```

4. **Crie um superusuário:**

   ```sh
   py manage.py createsuperuser
   ```

5. **(Opcional) Apague todas as tags antigas se necessário:**

   ```sh
   py manage.py shell
   >>> from tasks.models import Tag
   >>> Tag.objects.all().delete()
   >>> exit()
   ```

6. **Rode o servidor:**

   ```sh
   py manage.py runserver
   ```

7. **Acesse o admin:**

   - [http://localhost:8000/admin](http://localhost:8000/admin)

---

## **Configuração do Frontend (Next.js)**

1. **Instale as dependências:**

   ```sh
   cd ../next_frontend
   npm install
   ```

2. **Rode o frontend:**

   ```sh
   npm run dev
   ```

3. **Acesse:**

   - [http://localhost:3000](http://localhost:3000)

---

## **Funcionalidades**

- **Login:** Use o usuário criado no Django.
- **Tarefas:** Crie, conclua, edite e exclua tarefas.
- **Tags:** Crie tags, associe a tarefas e edite as tags das tarefas.
- **Comentários:** Adicione comentários em cada tarefa.
- **Logout:** Encerre a sessão com segurança.

---

## **Dicas de Manipulação**

- **Adicionar tags:** Use o campo "Nova tag" e clique em "Adicionar Tag".
- **Associar tags:** Selecione as tags desejadas ao criar uma tarefa.
- **Editar tags de uma tarefa:** Clique em "Editar Tags" na tarefa e salve.
- **Apagar todas as tags:** Use o admin Django ou o shell conforme acima.
- **Problemas com migração:** Se adicionar campos obrigatórios, apague registros antigos ou forneça um valor padrão ao migrar.

---

## **Problemas comuns**

- **Erro ao criar tag:** Verifique se o campo `user` está como read-only no serializer e se o método `perform_create` do backend está correto.
- **Erro 400/500:** Veja o terminal do backend para detalhes do erro.
- **Token inválido:** Faça login novamente.

