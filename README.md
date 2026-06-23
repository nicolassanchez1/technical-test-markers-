# Prueba Tecnica Makers - Sistema de Prestamos

Este es el monorepo para la prueba tecnica. Esta dividido en dos carpetas principales: `/frontend` y `/backend`.

## Tecnologias principales
* Backend: Java 21, Spring Boot 4, Spring Security (JWT), PostgreSQL.
* Arquitectura: Hexagonal (Puertos y Adaptadores).
* Frontend: React, TypeScript, Vite.

## ¿Cómo levantar el proyecto?

**Nota sobre la Base de Datos:**
Para agilizar la revision, el backend esta apuntando a una base de datos PostgreSQL alojada en la nube (NeonDB). No es necesario que levantes contenedores de Docker ni configures nada local. Las tablas y los datos de prueba se auto-generan al arrancar.

### 1. Levantar el Backend
Necesitas tener Java 21 y Maven instalados.

1. Abre una terminal y entra a la carpeta del back:
   `cd backend`
2. Ejecuta el proyecto:
   `mvn spring-boot:run`
3. El servidor iniciara en `http://localhost:8080`

### 2. Levantar el Frontend
Necesitas Node.js (se probo con v18+).

1. Abre otra terminal y entra al front:
   `cd frontend`
2. Instala dependencias:
   `npm install`
3. Arranca el server de desarrollo:
   `npm run dev`

## 🔑 Usuarios de Prueba

El sistema inyecta automaticamente estos usuarios en la bd para que puedas probar los roles sin tener que registrar nada:

* **Administrador**
  * Email: `admin@test.com`
  * Pass: `123`

* **Usuario normal**
  * Email: `usuario@test.com`
  * Pass: `123`

## Notas de desarrollo / Arquitectura
* Decidi aplicar Arquitectura Hexagonal estricta. El dominio (`Loan`) no conoce nada de Spring Boot ni de la web, aislando por completo la logica de negocio.
* Se implemento un manejador global de exepciones (`ControllerAdvice`) para formatear los errores y no devolver los stacktraces de java crudos en el responce.
* Segun los requisitos, se agrego un esquema de cache nativo para aligerar las consultas repetitivas de los prestamos por usuario.