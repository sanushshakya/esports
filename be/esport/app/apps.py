from django.apps import AppConfig


class AppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app"
    
    #Django loads the signals automatically.
    def ready(self):
        import app.signals