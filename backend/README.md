# Backend API для онбординга

Backend на FastAPI для процесса онбординга: аутентификация, профили, планы, действия наставника, шаблоны и администрирование пользователей.

## Локальный запуск
1. Создайте и активируйте виртуальное окружение.
2. Установите зависимости:
   ```
   pip install -r requirements.txt
   ```
3. Запустите сервер:
   ```
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

Backend будет доступен на `http://localhost:8000`, frontend на `http://localhost:5173`.

## Создание администратора
Скрипт использует настройки БД из `.env` (переменная `DATABASE_URL`).

```
cd backend
../.venv/bin/python -m scripts.create_admin --email admin@example.com --password "secret123" --full-name "Admin User"
```

Если пользователь с таким email уже существует, скрипт завершится с ошибкой и ничего не изменит.

## Authentication
- `POST /auth/login` возвращает access token и устанавливает cookie `refresh_token`.
- Для защищённых эндпоинтов передавайте заголовок `Authorization: Bearer <access_token>`.
- `POST /auth/refresh` использует cookie для выдачи нового access token.
- `POST /auth/logout` удаляет cookie.

## Swagger / OpenAPI
- Swagger UI: `GET /docs`
- ReDoc: `GET /redoc`
- Файл спецификации OpenAPI: `backend/openapi.json`

## Эндпоинты (кратко)
| Тег      | Эндпоинты                                                                                                                                                                                                                                                                                                                                                                   |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| health   | `GET /health`                                                                                                                                                                                                                                                                                                                                                               |
| auth     | `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`                                                                                                                                                                                                                                                                                                               |
| me       | `GET /me/plan`, `PATCH /me/tasks/{task_id}/complete`, `PATCH /me/tasks/{task_id}/uncomplete`, `POST /me/feedback`, `GET /me/feedback/available`                                                                                                                                                                                                                             |
| mentor   | `GET /mentor/mentees`, `GET /mentor/mentees/{user_id}/plan`, `POST /mentor/mentees/{user_id}/tasks`, `PATCH /mentor/mentees/{user_id}/tasks/{task_id}/deadline`, `DELETE /mentor/mentees/{user_id}/tasks/{task_id}`                                                                                                                                                         |
| contacts | `GET /contacts?search=...`                                                                                                                                                                                                                                                                                                                                                  |
| admin    | `GET/POST /admin/templates`, `GET/PUT/DELETE /admin/templates/{template_id}`, `POST /admin/templates/{template_id}/stages`, `PUT/DELETE /admin/templates/{template_id}/stages/{stage_id}`, `POST /admin/templates/stages/{stage_id}/tasks`, `PUT/DELETE /admin/templates/stages/{stage_id}/tasks/{task_id}`, `POST/GET /admin/users`, `PATCH/DELETE /admin/users/{user_id}` |
