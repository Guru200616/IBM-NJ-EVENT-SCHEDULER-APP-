from pydantic import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://mongo:27017"
    DB_NAME: str = "event_scheduler"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    class Config:
        env_file = "../.env"

settings = Settings()
