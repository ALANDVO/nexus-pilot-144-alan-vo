from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    app_env: str = "development"
    secret_key: str = "dev-secret-change-in-production"

    # Database
    database_url: str = "sqlite:///./nexus_pilot.db"

    # LLM
    llm_api_key: str = ""
    llm_provider: str = "openai-compatible"
    llm_model: str = "gpt-4o-mini"
    llm_base_url: str = "https://api.openai.com/v1"

    # Keycloak
    keycloak_url: str = "http://localhost:8080"
    keycloak_realm: str = "nexus-pilot"
    keycloak_client_id: str = "nexus-pilot-frontend"
    keycloak_client_secret: str = ""


settings = Settings()