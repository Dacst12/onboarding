# Onboarding System

Система управления онбордингом сотрудников с ролевым доступом (администратор, ментор, новый сотрудник).

## Технологический стек

**Backend:**
- FastAPI
- SQLAlchemy (async)
- SQLite
- JWT Authentication

**Frontend:**
- React + TypeScript
- Vite
- React Query
- Ant Design

**DevOps:**
- Docker
- Docker Compose

## Требования

- Docker и Docker Compose
- или
- Python 3.9+
- Node.js 16+

## Быстрый старт (Docker)

### 1. Клонируем репозиторий

```bash
git clone <repository-url>
cd onboarding
```

### 2. Запускаем проект

```bash
docker-compose up --build
```

Проект будет доступен по адресам:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000

### 3. Создаем администратора

```bash
docker-compose exec backend python scripts/create_admin.py \
  --email admin@example.com \
  --password SecurePassword123 \
  --full-name "Admin Name"
```

## Локальный запуск

### Backend

```bash
cd backend

# Создаем виртуальное окружение
python -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate

# Устанавливаем зависимости
pip install -r requirements.txt

# Запускаем сервер
uvicorn app.main:app --reload
```

Сервер будет доступен на http://localhost:8000

### Frontend

```bash
cd frontend

# Устанавливаем зависимости
npm install

# Запускаем dev сервер
npm run dev
```

Frontend будет доступен на http://localhost:5173

### Создание администратора (локально)

```bash
cd backend

# Убедитесь, что виртуальное окружение активировано
python scripts/create_admin.py \
  --email admin@example.com \
  --password SecurePassword123 \
  --full-name "Admin Name"
```

## Структура проекта

```
onboarding/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py
│   │   │   │   ├── users.py
│   │   │   │   ├── admin.py
│   │   │   │   └── mentor.py
│   │   │   └── dependencies.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── db/
│   │   │   ├── session.py
│   │   │   └── init_db.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── scripts/
│   │   │   └── create_admin.py
│   │   └── main.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── router/
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── package.json
│   └── .dockerignore
├── docker-compose.yml
└── .gitignore
```

## Пользователи и роли

### Роли в системе

- **Admin (администратор)** — управление пользователями, ментор-ами, шаблонами планов онбординга
- **Mentor (ментор)** — управление процессом онбординга назначенных сотрудников
- **New Employee (новый сотрудник)** — просмотр плана онбординга, выполнение задач, ответы на опросы

### Создание администратора

При первом запуске необходимо создать администратора:

**Через Docker:**
```bash
docker-compose exec backend python scripts/create_admin.py \
  --email admin@example.com \
  --password SecurePassword123 \
  --full-name "Иван Петров"
```

**Локально:**
```bash
python scripts/create_admin.py \
  --email admin@example.com \
  --password SecurePassword123 \
  --full-name "Иван Петров"
```

Параметры:
- `--email` — email администратора
- `--password` — пароль (минимум 8 символов рекомендуется)
- `--full-name` — полное имя администратора

## API документация

После запуска backend, документация доступна по адресу:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Основные endpoints

### Аутентификация
- `POST /api/auth/login` — вход в систему
- `POST /api/auth/refresh` — обновление токена доступа
- `POST /api/auth/logout` — выход из системы

### Администратор
- `GET /api/admin/users` — список всех пользователей
- `POST /api/admin/users` — создание пользователя
- `PUT /api/admin/users/{user_id}` — редактирование пользователя
- `DELETE /api/admin/users/{user_id}` — удаление пользователя

### Ментор
- `GET /api/mentor/mentees` — список наставляемых сотрудников
- `GET /api/mentor/mentees/{user_id}` — информация о сотруднике
- `GET /api/mentor/mentees/{user_id}/plan` — план онбординга сотрудника
- `PATCH /api/mentor/mentees/{user_id}/tasks/{task_id}/status` — обновление статуса задачи

## Переменные окружения

### Backend (.env)

```
DATABASE_URL=sqlite+aiosqlite:///./data/onboarding.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend (.env)

```
VITE_BACKEND_URL=http://localhost:8000
```

## Разработка

### Установка pre-commit hooks (опционально)

```bash
pip install pre-commit
pre-commit install
```

### Запуск тестов backend

```bash
cd backend
pytest
```

### Форматирование кода

```bash
# Backend
cd backend
black app/
flake8 app/

# Frontend
cd frontend
npm run lint
npm run format
```

## Troubleshooting

### Docker контейнер не стартует

```bash
# Проверьте логи
docker-compose logs backend
docker-compose logs frontend

# Пересоберите образы
docker-compose build --no-cache
docker-compose up
```

### Database ошибка

```bash
# Удалите старую базу и пересоздайте
rm backend/data/onboarding.db
docker-compose up
```

### CORS ошибка при запросе к API

Убедитесь, что `CORS_ORIGINS` в `.env` содержит адрес frontend:
```
CORS_ORIGINS=["http://localhost:5173"]
```

## Лицензия

MIT
