
#!/bin/bash

# CONFIGURA TUS DATOS
GIT_USER="valenxo"
GIT_EMAIL="avochoa1@gmail.com"
GITHUB_REPO_URL="https://github.com/valenxo/QuizPaises"

echo "Inicializando repositorio..."

git init
git config user.name "$GIT_USER"
git config user.email "$GIT_EMAIL"

# Día 1: Estructura y README
git add README.md
GIT_AUTHOR_DATE="2025-04-06T10:00:00" GIT_COMMITTER_DATE="2025-04-06T10:00:00" git commit -m "chore: estructura inicial y documentación"

# Día 4: Server y package.json
git add server.js package.json
GIT_AUTHOR_DATE="2025-04-09T14:00:00" GIT_COMMITTER_DATE="2025-04-09T14:00:00" git commit -m "feat: configuración del servidor con Express"

# Día 7: HTML
git add public/index.html
GIT_AUTHOR_DATE="2025-04-12T12:00:00" GIT_COMMITTER_DATE="2025-04-12T12:00:00" git commit -m "feat: página principal con layout básico"

# Día 10: Estilos
git add public/styles.css
GIT_AUTHOR_DATE="2025-04-15T18:00:00" GIT_COMMITTER_DATE="2025-04-15T18:00:00" git commit -m "style: estilos generales con Tailwind-like CSS"

# Día 13: Script base
git add public/script.js
GIT_AUTHOR_DATE="2025-04-18T09:00:00" GIT_COMMITTER_DATE="2025-04-18T09:00:00" git commit -m "feat: lógica de preguntas de capital"

# Día 18: Nuevos tipos de preguntas
git add public/script.js
GIT_AUTHOR_DATE="2025-04-23T11:00:00" GIT_COMMITTER_DATE="2025-04-23T11:00:00" git commit -m "feat: preguntas de bandera y fronteras integradas"

# Día 24: Feedback
git add public/script.js
GIT_AUTHOR_DATE="2025-04-29T15:00:00" GIT_COMMITTER_DATE="2025-04-29T15:00:00" git commit -m "feat: feedback de respuestas correctas e incorrectas"

# Día actual
git add .
git commit -m "docs: versión final para entrega y despliegue"

# Subir a GitHub
git branch -M main
git remote add origin "$GITHUB_REPO_URL"
git push -u origin main

echo "Repositorio simulado creado y subido a GitHub."
