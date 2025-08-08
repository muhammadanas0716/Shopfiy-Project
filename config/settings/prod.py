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
# Ensure you set SECRET_KEY in your environment
SECRET_KEY = env("SECRET_KEY")

# DATABASES comes from base via env DATABASE_URL

# Static files with WhiteNoise for production
# Insert WhiteNoise right after SecurityMiddleware without duplicating entries
_base_middleware = list(MIDDLEWARE)
if "whitenoise.middleware.WhiteNoiseMiddleware" not in _base_middleware:
    try:
        security_index = _base_middleware.index("django.middleware.security.SecurityMiddleware")
        _base_middleware.insert(security_index + 1, "whitenoise.middleware.WhiteNoiseMiddleware")
    except ValueError:
        _base_middleware.insert(0, "whitenoise.middleware.WhiteNoiseMiddleware")
MIDDLEWARE = _base_middleware

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Media: point to Render Static Site (no /media prefix)
MEDIA_URL = env("MEDIA_URL", default="https://spoilersheflstatic.onrender.com/")

# Static files (production)
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
# Avoid conflicts: do not include source static dirs in prod
STATICFILES_DIRS = []