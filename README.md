# CanaryCheeseExpressSequelize
Aplicación web para la gestión de quesos canarios, desarrollada con **Ionic + Angular** (frontend) y **Node.js + Express + Sequelize** (backend).  
Permite listar, añadir, editar y eliminar quesos con nombre, curación, peso, origen e imagen, conectándose a una base de datos **MySQL**.  
Incluye autenticación básica de usuarios (registro + login con JWT).

---

## Getting Started
Estas instrucciones te permitirán obtener una copia del proyecto y ejecutarlo en tu máquina local para desarrollo y pruebas.

---

## Prerequisites
Asegúrate de tener instalado:

- **Node.js** (v18 o superior)  
  https://nodejs.org/es/download
- **npm** o **yarn**
- **MySQL**  
  https://dev.mysql.com/downloads/installer/
- **Ionic CLI**  
  Instalar con:
    
    npm install -g @ionic/cli

---

## Instalation

1. Clonar el repositorio:

    git clone https://github.com/denox74/CanaryCheeseExpressSequelize.git

2. Entrar en la carpeta del proyecto:

    cd CanaryCheeseExpressSequelize

3. Instalar dependencias del backend:

    cd backend
    npm install

4. Instalar dependencias del frontend:

    cd ../frontend
    npm install

---

## Configuración de la base de datos

1. Crea una base de datos MySQL, por ejemplo:

    CREATE DATABASE canary_cheese_express

2. Configura los datos de conexión (host, usuario, contraseña, nombre de BD) en el archivo de configuración de Sequelize del backend  
   (por ejemplo: `backend/config/db.config.js`).

---

## Ejecución del proyecto

### Backend (API + autenticación)

Desde la carpeta `backend`:

- Inicializar modelos y API principal:

    node index.js

- Servicio de autenticación de usuarios (login / registro):

    node server.js

La API por defecto escucha en:

    http://localhost:8080
y en 
    http://localhost:4000
para el encriptado/login

### Frontend (Ionic + Angular)

Desde la carpeta `frontend`:

    ionic serve

La aplicación se abrirá normalmente en:

    http://localhost:8100

---

## Funcionalidades principales

### Quesos

- Listar quesos registrados.
- Crear un nuevo queso con:
  - Nombre
  - Curación
  - Peso
  - Origen
  - Imagen (captura desde cámara o selección desde galería).
- Editar la información de un queso existente.
- Eliminar un queso.
- Validación de formularios con **ReactiveForms**.
- Comunicación con API REST mediante **HttpClient**.

### Usuarios

- Registro de usuarios (password cifrada con **bcrypt**).
- Inicio de sesión.
- Generación de **token JWT**.
- Envío al frontend de:
  - Datos básicos del usuario.
  - `access_token` para autenticación en las peticiones protegidas.

---

## Tecnologías usadas

- **Frontend:** Ionic, Angular, TypeScript, HTML, SCSS  
- **Backend:** Node.js, Express, Sequelize, bcrypt, JSON Web Tokens  
- **Base de datos:** MySQL  
- **Control de versiones:** Git + GitHub  

---

## Comandos útiles

### Crear una página nueva (frontend)

    ionic g page "NombreDeLaPagina"

### Iniciar modelos en `index.js` del backend

    cd backend
    node index.js

### Autentificador para los usuarios

    cd backend
    node server.js

### Iniciar Ionic (frontend)

    cd frontend
    ionic serve

---

## POSTMAN

Colección / documentación de la API en Postman:

https://documenter.getpostman.com/view/48919814/2sB3QMKU32



---

## Autores

### David Liaño Macías

Proyecto educativo para la asignatura de Desarrollo de Aplicaciones Multiplataforma (3ºDAM)  
IES El Rincón – Curso 2024-25

---

## Licencia

Este proyecto se distribuye bajo licencia **Creative Commons CC0 1.0 Universal**.

> “Renuncio a todos los derechos de autor. Cualquiera puede usar, modificar o distribuir este proyecto sin ninguna restricción.”
