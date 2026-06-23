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

---

## Parte Teórica

### 1. Optimización en sistemas financieros (Imagina que trabajas en una aplicación bancaria que debe procesar
transacciones en tiempo real. ¿Qué estrategias aplicarías para mejorar el
rendimiento y la escalabilidad? Considera aspectos como concurrencia, caché
y patrones de diseño)

Para una app bancaria en tiempo real aplicaría:

**Concurrencia:**
- Programación reactiva (WebFlux) para operaciones I/O bound
- Colas de mensajes (Kafka/RabbitMQ) para desacoplar procesamiento de transacciones

**Caché:**
- Caché (Redis) para sesiones y datos compartidos entre instancias
- Invalidación por eventos: cuando se actualiza un saldo, se publica evento para invalidar caché

**Patrones:**
- CQRS: separar lecturas de escrituras para escalar independientemente
- Circuit Breaker (Resilience4j) para llamadas a servicios externos

---

### 2. Seguridad en APIs financieras (Explica cómo protegerías una API que maneja información sensible de cuentas
bancarias contra ataques como inyección SQL, CSRF, XSS y otros ataques
comunes)

Para proteger la app aplicaría:

**Inyección SQL:**
- JPA/Hibernate con parámetros nombrados, nunca concatenar queries
- Validación de inputs con Bean Validation (@Valid, @NotNull, @Size)

**XSS:**
- Sanitización de inputs en el backend
- Content-Type: application/json en responses
- Headers de seguridad: X-Content-Type-Options, X-XSS-Protection, CSP

**Otros:**
- HTTPS obligatorio (TLS 1.3)
- Rate limiting para prevenir fuerza bruta
- JWT con expiración corta + refresh tokens
- Principio de mínimo privilegio en roles (USER vs ADMIN)
- Auditoría con Spring Data Audit (@CreatedBy, @LastModifiedDate)

---

### 3. Transacciones en sistemas distribuidos (En un sistema bancario distribuido, ¿cómo implementarías la consistencia y el
manejo de errores en una API que procesa transferencias entre cuentas en
diferentes servicios?)

Para transferencias entre cuentas en diferentes servicios:

**Patrón Saga (Orquestación):**
1. Servicio A: DEBITAR cuenta origen → evento "Débito exitoso"
2. Servicio B: ACREDITAR cuenta destino → evento "Acreditación exitosa"
3. Si falla en paso 2 → Servicio A ejecuta COMPENSACIÓN (revertir débito)

**Implementación:**
- Spring State Machine o librería como Axon para orquestar sagas
- Cada paso tiene una acción compensatoria definida
- Tabla de estado de saga para tracking

**Manejo de errores:**
- Idempotencia: cada transacción tiene un ID único, si se reintenta no se duplica
- Dead Letter Queue para mensajes que fallan después de N reintentos
- Eventual consistency: aceptar que el sistema puede estar inconsistente temporalmente

**Ejemplo práctico:**
```java
@Transactional
public TransferResult transfer(Long fromId, Long toId, BigDecimal amount) {
    accountRepository.debit(fromId, amount);  // Falla → rollback
    accountRepository.credit(toId, amount);   // Falla → rollback
    return TransferResult.success();
}
```
Para servicios separados, usar eventos asíncronos con compensación.

---

### 4. Pruebas unitarias y de integración (Describe cómo diseñarías una suite de pruebas que asegure la correcta
operación de una API bancaria, considerando tanto pruebas unitarias como de
integración. ¿Qué herramientas utilizarías?)

Para test aplicaría:

**Pruebas unitarias:**
- JUnit 5 + Mockito para aislar la lógica de negocio
- Testear servicios, validaciones, reglas de negocio
- Cobertura mínima del 80% en capa de servicio
- @MockBean para repositorios

**Pruebas de integración:**
- @SpringBootTest con base de datos H2 en memoria
- Testear endpoints con MockMvc o WebTestClient
- Verificar flujo completo: request → controller → service → repository → response
- @DataJpaTest para capa de persistencia

**Herramientas:**
- JUnit 5, Mockito, AssertJ
- Testcontainers para pruebas con PostgreSQL real
- WireMock para simular servicios externos
- Jacoco para reporte de cobertura

**Estructura:**
```
src/test/
├── unit/
│   ├── LoanServiceTest.java
│   └── AuthServiceTest.java
├── integration/
│   ├── LoanControllerTest.java
│   └── AuthControllerTest.java
└── resources/
    └── application-test.properties
```

---

### 5. Front-end: estado y autenticación (En una aplicación bancaria que muestra el saldo de las cuentas, ¿cómo
gestionarías el estado y la autenticación en el front-end, garantizando la
seguridad y la coherencia de los datos?)

Para la gestión de estado aplicaría:

**Estado:**
- Zustand o Context API para estado global (sesión, usuario)
- React Query/SWR para estado del servidor (saldos, transacciones) con cache automático
- Separar estado de UI (formularios, modales) del estado de servidor

**Autenticación:**
- JWT almacenado en httpOnly cookie (más seguro) o memoria (menos persistente)
- Interceptor en fetch que adjunte el token automáticamente
- Refresh token silencioso antes de que expire el access token
- Guards por ruta: si no hay sesión, redirigir a login

**Coherencia de datos:**
- Optimistic updates: actualizar UI inmediatamente, revertir si falla
- Invalidación de cache tras mutations
- Polling o WebSockets para datos en tiempo real (saldos)

**Seguridad:**
- Nunca guardar tokens en localStorage (vulnerable a XSS)
- Sanitizar todos los inputs del usuario
- No exponer datos sensibles en el frontend (números de cuenta completos)

---

### 6. Spring Boot

#### a. @SpringBootApplication (Que pasa en una aplicación internamente cuando usas la anotación
@SpringBootApplication y cómo afecta el arranque de una aplicación?)

Es una composición de 3 anotaciones:
- **@SpringBootConfiguration**: marca la clase como fuente de configuración (@Configuration)
- **@EnableAutoConfiguration**: activa el auto-discovery de beans según dependencias en classpath
- **@ComponentScan**: escanea el paquete base y subpaquetes para encontrar @Component, @Service, @Repository, @Controller

Al arrancar, `SpringApplication.run()` crea el ApplicationContext, ejecuta el auto-configuration scan, y levanta el servidor embebido (Tomcat).

#### b. Ciclo de vida de un Bean (¿Cómo funciona el ciclo de vida de un beans en Spring y como podrías
intervenir en él?)

1. **Instanciación**: Spring crea el objeto
2. **Inyección de dependencias**: @Autowired, @Value
3. **@PostConstruct**: inicialización personalizada
4. **BeanPostProcessor.beforeInitialization**: hooks previos
5. **InitializingBean.afterPropertiesSet** o @PostConstruct
6. **BeanPostProcessor.afterInitialization**: proxies AOP
7. **Bean listo para usar**
8. **@PreDestroy**: limpieza antes de destruir

Para intervenir:
- @PostConstruct / @PreDestroy (simple)
- Implementar InitializingBean, DisposableBean
- BeanPostProcessor para lógica avanzada (AOP, proxies)

#### c. Auto-configuración personalizada (¿Cómo personalizarías el comportamiento de la auto-configuración en Spring
Boot sin romper la filosofía de 'convención sobre configuración'?)

**Sin romper convención sobre configuración:**

1. **application.properties**: sobreescribir defaults de forma declarativa
2. **@ConditionalOnMissingBean**: crear un bean solo si no existe otro (permite override)
3. **@ConfigurationProperties**: mapear properties a POJOs tipados
4. **Exclusiones**: `@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})`

```java
@Configuration
@ConditionalOnMissingBean(EmailService.class)
public class CustomEmailConfig {
    @Bean
    public EmailService emailService() {
        return new SmtpEmailService(); // Override del default
    }
}
```

Esto permite que el usuario defina su propio bean si necesita algo diferente, pero si no lo hace, Spring usa el default. Eso es "convención sobre configuración".