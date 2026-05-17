from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes.auth import router as auth_router
from app.api.routes.contacts import router as contacts_router
from app.api.routes.health import router as health_router
from app.api.routes.me import router as me_router
from app.api.routes.mentor import router as mentor_router
from app.api.routes.admin import router as admin_router
from app.core.config import get_settings

settings = get_settings()
app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={'detail': exc.detail})


app.include_router(health_router)
app.include_router(auth_router)
app.include_router(me_router)
app.include_router(mentor_router)
app.include_router(contacts_router)
app.include_router(admin_router)
