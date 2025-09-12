from .base import *

DEBUG = False

# Security settings for production
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_PRELOAD = True
SECURE_REDIRECT_EXEMPT = []
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'
SECURE_REFERRER_POLICY = "same-origin"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True

# Hosts and CSRF
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["*"])
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=[])

# Require a strong secret key in production
SECRET_KEY = env("SECRET_KEY")

# Static files with WhiteNoise for production
_base_middleware = list(MIDDLEWARE)
if "whitenoise.middleware.WhiteNoiseMiddleware" not in _base_middleware:
    try:
        security_index = _base_middleware.index("django.middleware.security.SecurityMiddleware")
        _base_middleware.insert(security_index + 1, "whitenoise.middleware.WhiteNoiseMiddleware")
    except ValueError:
        _base_middleware.insert(0, "whitenoise.middleware.WhiteNoiseMiddleware")
MIDDLEWARE = _base_middleware

STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage"

# WhiteNoise configuration for better admin static files handling
WHITENOISE_USE_FINDERS = True
WHITENOISE_AUTOREFRESH = True

# Static files (production)
STATICFILES_DIRS = []  # ignore STATICFILES_DIRS in production
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

