# MediScan - Medical Diagnosis with AI

MediScan is a futuristic medical platform that uses Artificial Intelligence to improve diagnostic accuracy through interactive 3D visualization of medical images.

##  Despliegue con Docker

Para lanzar la aplicación completa, sigue estos pasos:

1. Asegúrate de tener **Docker** y **Docker Compose** instalados.
2. Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker-compose build && docker-compose up
```

La aplicación estará disponible en [http://localhost:8080](http://localhost:8080).

##  Credenciales de Prueba

Para acceder y probar las funcionalidades de la aplicación, utiliza las siguientes credenciales:

- **Usuario:** `admin@mediscan.com`
- **Contraseña:** `admin1234`

- **Usuario:** `doctor@mediscan.com`
- **Contraseña:** `doctor1234`

##  Tecnologías Utilizadas

- **Frontend:** Vue 3, Vuetify 3, Pinia, Vue Router, Vite.
- **Estilos:** SCSS / CSS.
- **Infraestructura:** Docker, Nginx.

##  Estructura del Proyecto

- `vue-app/`: Aplicación frontend en Vue 3.
- `docker-compose.yml`: Configuración de orquestación de contenedores.
- `index.html`, `simulator.html`, `contact.html`: Versión estática original (legado).

---
© 2025 MediScan. Todos los derechos reservados.
