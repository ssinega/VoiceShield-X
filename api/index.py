import sys
import os

# Vercel runs from the project root — add backend to sys.path so `app.*` imports resolve
_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(_root, "backend"))

from app.main import app  # noqa: E402 — FastAPI app instance
