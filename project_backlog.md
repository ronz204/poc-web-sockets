# TaskFlow - Product Backlog

## 📋 Estructura del Backlog

Cada ítem incluye:
- **ID único** para referencia
- **Título** descriptivo
- **Descripción** de la funcionalidad
- **Prioridad**: P0 (Crítico), P1 (Alto), P2 (Medio), P3 (Bajo)
- **Estimación**: S (Small: 1-3h), M (Medium: 4-8h), L (Large: 1-2 días), XL (Extra Large: 3+ días)
- **Dependencias**: Qué debe estar hecho antes

---

## 🏗️ MÓDULO 0: SETUP INICIAL

### BACK-0.1: Configuración del proyecto backend
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** Ninguna

**Descripción:**
- Inicializar proyecto Node.js con npm
- Instalar dependencias: express, socket.io, mongoose, jsonwebtoken, bcrypt, cors, dotenv
- Crear estructura de carpetas: src/, config/, models/, routes/, controllers/, socket/, middleware/
- Configurar scripts en package.json (dev, start)
- Setup de nodemon para hot-reload

**Criterios de aceptación:**
- [ ] Proyecto arranca con `npm run dev`
- [ ] Estructura de carpetas creada
- [ ] Todas las dependencias instaladas

---

### BACK-0.2: Configuración de base de datos
**Prioridad:** P0  
**Estimación:** S  
**Dependencias:** BACK-0.1

**Descripción:**
- Instalar MongoDB localmente o configurar MongoDB Atlas
- Crear archivo .env con DATABASE_URL, JWT_SECRET, PORT
- Configurar conexión con Mongoose en config/database.js
- Crear función de conexión con manejo de errores

**Criterios de aceptación:**
- [ ] Conexión exitosa a MongoDB
- [ ] Logs muestran "Database connected"
- [ ] Variables de entorno cargadas correctamente

---

### BACK-0.3: Setup de Socket.IO
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** BACK-0.1

**Descripción:**
- Integrar Socket.IO con Express server
- Configurar CORS para permitir conexiones del frontend
- Crear archivo config/socket.js con configuración base
- Implementar evento de conexión/desconexión básico
- Agregar logs para debugging

**Criterios de aceptación:**
- [ ] Socket.IO inicializado correctamente
- [ ] Evento 'connection' se dispara al conectar
- [ ] Logs muestran socket.id al conectar/desconectar

---

### FRONT-0.1: Configuración del proyecto frontend
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** Ninguna

**Descripción:**
- Crear proyecto Vue 3 con Vite
- Instalar dependencias: vue-router, pinia, socket.io-client, axios, @vueuse/core
- Configurar Tailwind CSS (o framework CSS preferido)
- Crear estructura de carpetas: components/, views/, stores/, services/, composables/
- Configurar Vite proxy para desarrollo

**Criterios de aceptación:**
- [ ] App Vue arranca con `npm run dev`
- [ ] Tailwind CSS funciona
- [ ] Estructura de carpetas creada

---

### FRONT-0.2: Configuración de servicios base
**Prioridad:** P0  
**Estimación:** S  
**Dependencias:** FRONT-0.1

**Descripción:**
- Crear services/api.js con Axios instance configurado
- Crear services/socket.js con Socket.IO client
- Configurar interceptores para agregar JWT a requests
- Crear composable useSocket.js básico

**Criterios de aceptación:**
- [ ] Axios instance configurado con baseURL
- [ ] Socket client puede conectar al backend
- [ ] Interceptor agrega Authorization header

---

### FRONT-0.3: Setup de routing y stores
**Prioridad:** P0  
**Estimación:** S  
**Dependencias:** FRONT-0.1

**Descripción:**
- Configurar Vue Router con rutas básicas: /login, /register, /dashboard
- Crear Pinia stores: auth.js, boards.js, tasks.js
- Implementar navigation guards para rutas protegidas
- Crear layout base con header/footer

**Criterios de aceptación:**
- [ ] Navegación entre rutas funciona
- [ ] Guard redirige a /login si no hay token
- [ ] Stores creados con state básico

---

## 🔐 MÓDULO 1: AUTENTICACIÓN Y USUARIOS

### AUTH-1.1: Modelo de Usuario
**Prioridad:** P0  
**Estimación:** S  
**Dependencias:** BACK-0.2

**Descripción:**
- Crear schema de Mongoose para User
- Campos: username, email, password, avatar, createdAt, lastSeen
- Implementar método pre-save para hashear password
- Agregar método comparePassword para login

**Criterios de aceptación:**
- [ ] Schema definido correctamente
- [ ] Password se hashea automáticamente al guardar
- [ ] método comparePassword funciona

---

### AUTH-1.2: Endpoint de registro
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** AUTH-1.1

**Descripción:**
- Crear POST /api/auth/register
- Validar que email y username sean únicos
- Generar avatar con color aleatorio
- Crear usuario en base de datos
- Generar JWT token
- Retornar token y datos de usuario (sin password)

**Criterios de aceptación:**
- [ ] Registro exitoso crea usuario en DB
- [ ] Retorna JWT válido
- [ ] Valida duplicados de email/username
- [ ] Password nunca se retorna en respuesta

---

### AUTH-1.3: Endpoint de login
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** AUTH-1.1

**Descripción:**
- Crear POST /api/auth/login
- Validar credenciales con comparePassword
- Actualizar campo lastSeen
- Generar nuevo JWT token
- Retornar token y datos de usuario

**Criterios de aceptación:**
- [ ] Login exitoso con credenciales correctas
- [ ] Error 401 con credenciales incorrectas
- [ ] Token JWT válido retornado
- [ ] lastSeen se actualiza

---

### AUTH-1.4: Middleware de autenticación HTTP
**Prioridad:** P0  
**Estimación:** S  
**Dependencias:** AUTH-1.3

**Descripción:**
- Crear middleware/auth.js
- Extraer token del header Authorization
- Verificar y decodificar JWT
- Buscar usuario en DB
- Agregar user a req.user
- Manejar tokens inválidos/expirados

**Criterios de aceptación:**
- [ ] Middleware protege rutas correctamente
- [ ] req.user disponible en rutas protegidas
- [ ] Error 401 con token inválido
- [ ] Error 401 sin token

---

### AUTH-1.5: Middleware de autenticación WebSocket
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** AUTH-1.4, BACK-0.3

**Descripción:**
- Crear middleware/socketAuth.js
- Validar token en socket.handshake.auth.token
- Agregar user a socket.user
- Rechazar conexión si token inválido
- Emitir evento 'authenticated' al conectar

**Criterios de aceptación:**
- [ ] Solo usuarios autenticados pueden conectar
- [ ] socket.user disponible en todos los handlers
- [ ] Conexión rechazada sin token válido
- [ ] Evento 'authenticated' se emite

---

### AUTH-1.6: Formulario de registro (Frontend)
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** FRONT-0.3

**Descripción:**
- Crear componente views/Register.vue
- Formulario con: username, email, password, confirmar password
- Validación de campos en frontend
- Llamar a API de registro
- Guardar token en localStorage
- Actualizar store de auth
- Redirigir a /dashboard al éxito

**Criterios de aceptación:**
- [ ] Formulario valida campos antes de enviar
- [ ] Muestra errores de API
- [ ] Token se guarda correctamente
- [ ] Redirección funciona

---

### AUTH-1.7: Formulario de login (Frontend)
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** FRONT-0.3

**Descripción:**
- Crear componente views/Login.vue
- Formulario con: email/username, password
- Llamar a API de login
- Guardar token en localStorage
- Actualizar store de auth
- Conectar socket con token
- Redirigir a /dashboard

**Criterios de aceptación:**
- [ ] Login funcional con credenciales correctas
- [ ] Errores se muestran al usuario
- [ ] Socket se conecta automáticamente
- [ ] Estado de auth persiste al recargar

---

### AUTH-1.8: Función de logout (Frontend)
**Prioridad:** P1  
**Estimación:** S  
**Dependencias:** AUTH-1.7

**Descripción:**
- Agregar acción logout en store de auth
- Limpiar token de localStorage
- Desconectar socket
- Resetear todos los stores
- Redirigir a /login

**Criterios de aceptación:**
- [ ] Logout limpia estado completamente
- [ ] Socket se desconecta
- [ ] Redirección a login funciona
- [ ] No se puede acceder a rutas protegidas

---

## 📋 MÓDULO 2: TABLEROS (BOARDS)

### BOARD-2.1: Modelo de Board
**Prioridad:** P0  
**Estimación:** S  
**Dependencias:** AUTH-1.1

**Descripción:**
- Crear schema de Mongoose para Board
- Campos: name, description, owner, members[], inviteCode, columns[], createdAt, updatedAt
- Generar inviteCode único automáticamente
- Crear índice único en inviteCode
- Columnas por defecto: "Por Hacer", "En Progreso", "Completado"

**Criterios de aceptación:**
- [ ] Schema definido correctamente
- [ ] inviteCode se genera automáticamente
- [ ] Columnas por defecto se crean

---

### BOARD-2.2: Endpoint crear tablero
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** BOARD-2.1, AUTH-1.4

**Descripción:**
- Crear POST /api/boards
- Validar que usuario esté autenticado
- Crear tablero con owner = userId
- Agregar owner a members array con role: 'owner'
- Retornar tablero creado

**Criterios de aceptación:**
- [ ] Tablero se crea correctamente
- [ ] Owner automáticamente en members
- [ ] inviteCode único generado
- [ ] Error si no está autenticado

---

### BOARD-2.3: Endpoint listar tableros
**Prioridad:** P0  
**Estimación:** S  
**Dependencias:** BOARD-2.2

**Descripción:**
- Crear GET /api/boards
- Buscar tableros donde userId esté en members
- Poplar datos de owner y members
- Ordenar por updatedAt descendente
- Retornar array de tableros

**Criterios de aceptación:**
- [ ] Retorna tableros del usuario
- [ ] Incluye tableros propios y compartidos
- [ ] Datos de miembros poblados
- [ ] Ordenados por más recientes

---

### BOARD-2.4: Endpoint detalles de tablero
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** BOARD-2.2

**Descripción:**
- Crear GET /api/boards/:boardId
- Verificar que usuario sea miembro
- Poplar owner, members
- Retornar tablero con información completa
- Error 403 si no es miembro

**Criterios de aceptación:**
- [ ] Retorna tablero completo
- [ ] Verifica permisos correctamente
- [ ] Error 403 para no-miembros
- [ ] Datos poblados correctamente

---

### BOARD-2.5: Endpoint unirse a tablero
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** BOARD-2.2

**Descripción:**
- Crear POST /api/boards/join
- Recibir inviteCode
- Buscar tablero con ese código
- Validar que usuario no sea ya miembro
- Agregar a members array
- Retornar tablero

**Criterios de aceptación:**
- [ ] Usuario se une correctamente
- [ ] Error si código inválido
- [ ] Error si ya es miembro
- [ ] Retorna tablero completo

---

### BOARD-2.6: Socket - Unirse a room de tablero
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** BOARD-2.4, AUTH-1.5

**Descripción:**
- Handler para evento 'board:join' con boardId
- Verificar que usuario sea miembro
- socket.join(`board:${boardId}`)
- Agregar a activeUsers[boardId]
- Obtener lista de usuarios online
- Emitir 'board:joined' con lista de usuarios
- Broadcast 'user:joined' a otros

**Criterios de aceptación:**
- [ ] Socket se une al room correctamente
- [ ] Solo miembros pueden unirse
- [ ] Lista de usuarios online correcta
- [ ] Otros usuarios notificados

---

### BOARD-2.7: Socket - Salir de room de tablero
**Prioridad:** P0  
**Estimación:** S  
**Dependencias:** BOARD-2.6

**Descripción:**
- Handler para 'board:leave' y 'disconnect'
- Remover socket del room
- Remover de activeUsers[boardId]
- Broadcast 'user:left' a otros
- Limpiar recursos

**Criterios de aceptación:**
- [ ] Socket sale del room correctamente
- [ ] activeUsers actualizado
- [ ] Broadcast notifica a otros
- [ ] Sin memory leaks

---

### BOARD-2.8: Socket - Nuevo miembro se unió
**Prioridad:** P1  
**Estimación:** S  
**Dependencias:** BOARD-2.5, BOARD-2.6

**Descripción:**
- Modificar endpoint join para emitir WebSocket
- Después de agregar miembro, broadcast 'board:member-joined'
- Incluir datos del nuevo miembro
- Todos los clientes actualizan lista

**Criterios de aceptación:**
- [ ] Evento se emite correctamente
- [ ] Incluye datos completos del miembro
- [ ] Solo se emite a usuarios en ese board
- [ ] Clientes actualizan UI

---

### BOARD-2.9: Endpoint actualizar columnas
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** BOARD-2.4

**Descripción:**
- Crear PUT /api/boards/:boardId/columns
- Verificar que usuario sea owner
- Validar que haya al menos 1 columna
- Actualizar campo columns
- Broadcast 'board:columns-updated' vía WebSocket

**Criterios de aceptación:**
- [ ] Solo owner puede actualizar
- [ ] Validación de columnas mínimas
- [ ] Evento WebSocket se emite
- [ ] Cambios persisten en DB

---

### BOARD-2.10: Vista Dashboard (Frontend)
**Prioridad:** P0  
**Estimación:** L  
**Dependencias:** FRONT-0.3, BOARD-2.3

**Descripción:**
- Crear views/Dashboard.vue
- Cargar lista de tableros al montar
- Mostrar grid de tarjetas de tableros
- Cada tarjeta: nombre, descripción, avatares de miembros
- Botón "Crear tablero"
- Botón "Unirse con código"

**Criterios de aceptación:**
- [ ] Lista de tableros se carga correctamente
- [ ] Diseño responsive
- [ ] Navegación a tablero al hacer click
- [ ] Botones funcionales

---

### BOARD-2.11: Modal crear tablero (Frontend)
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** BOARD-2.10

**Descripción:**
- Crear componente Modal para crear tablero
- Formulario: nombre, descripción
- Llamar API de creación
- Agregar tablero al store
- Cerrar modal y navegar al tablero nuevo

**Criterios de aceptación:**
- [ ] Modal se abre/cierra correctamente
- [ ] Validación de campos
- [ ] Tablero se crea correctamente
- [ ] Navegación automática funciona

---

### BOARD-2.12: Modal unirse a tablero (Frontend)
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** BOARD-2.10

**Descripción:**
- Crear componente Modal para unirse
- Input para código de invitación
- Llamar API de join
- Agregar tablero al store
- Navegar al tablero
- Manejar errores (código inválido, ya miembro)

**Criterios de aceptación:**
- [ ] Modal funcional
- [ ] Join exitoso con código correcto
- [ ] Errores se muestran claramente
- [ ] Navegación funciona

---

### BOARD-2.13: Vista detalle de tablero (Frontend)
**Prioridad:** P0  
**Estimación:** L  
**Dependencias:** BOARD-2.4

**Descripción:**
- Crear views/BoardDetail.vue
- Cargar detalles del tablero al montar
- Header con: nombre, código de invitación, avatares de miembros online
- Área principal para columnas (se implementa en módulo Tasks)
- Conectar a room de WebSocket
- Desconectar al desmontar

**Criterios de aceptación:**
- [ ] Tablero se carga correctamente
- [ ] Socket se conecta al room
- [ ] Miembros online se muestran
- [ ] Limpieza al salir de la vista

---

## ✅ MÓDULO 3: TAREAS (TASKS)

### TASK-3.1: Modelo de Task
**Prioridad:** P0  
**Estimación:** S  
**Dependencias:** BOARD-2.1, AUTH-1.1

**Descripción:**
- Crear schema de Mongoose para Task
- Campos: board, title, description, column, assignee, priority, order, createdBy, createdAt, updatedAt
- Índices: board, column
- Validación de priority: low/medium/high

**Criterios de aceptación:**
- [ ] Schema definido correctamente
- [ ] Índices creados
- [ ] Validación de enums funciona

---

### TASK-3.2: Endpoint crear tarea
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** TASK-3.1, AUTH-1.4

**Descripción:**
- Crear POST /api/boards/:boardId/tasks
- Verificar que usuario sea miembro del board
- Validar que column exista en el board
- Calcular order (última tarea + 1)
- Crear tarea con createdBy = userId
- Broadcast 'task:created' vía WebSocket
- Retornar tarea creada

**Criterios de aceptación:**
- [ ] Tarea se crea correctamente
- [ ] Solo miembros pueden crear
- [ ] Evento WebSocket se emite
- [ ] Order calculado correctamente

---

### TASK-3.3: Endpoint actualizar tarea
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** TASK-3.2

**Descripción:**
- Crear PUT /api/tasks/:taskId
- Verificar que usuario sea miembro del board
- Actualizar campos permitidos: title, description, priority, assignee
- Validar assignee sea miembro del board
- Broadcast 'task:updated' vía WebSocket
- Retornar tarea actualizada

**Criterios de aceptación:**
- [ ] Actualización funciona correctamente
- [ ] Validación de permisos
- [ ] Evento WebSocket se emite
- [ ] assignee validado

---

### TASK-3.4: Endpoint eliminar tarea
**Prioridad:** P0  
**Estimación:** S  
**Dependencias:** TASK-3.2

**Descripción:**
- Crear DELETE /api/tasks/:taskId
- Verificar que usuario sea creador o owner del board
- Eliminar comentarios asociados (cascade)
- Eliminar tarea
- Broadcast 'task:deleted' con taskId
- Retornar confirmación

**Criterios de aceptación:**
- [ ] Solo creador/owner puede eliminar
- [ ] Comentarios eliminados en cascada
- [ ] Evento WebSocket se emite
- [ ] Sin datos huérfanos

---

### TASK-3.5: Socket - Mover tarea
**Prioridad:** P0  
**Estimación:** L  
**Dependencias:** TASK-3.2

**Descripción:**
- Handler para 'task:move'
- Recibir taskId, newColumn, newOrder
- Verificar permisos
- Validar que newColumn exista
- Reordenar otras tareas si necesario
- Actualizar tarea
- Broadcast 'task:moved' con throttling (100ms)
- Manejar rollback si falla

**Criterios de aceptación:**
- [ ] Movimiento funciona correctamente
- [ ] Reordenamiento de otras tareas
- [ ] Throttling implementado
- [ ] Evento broadcast correcto

---

### TASK-3.6: Endpoint asignar tarea
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** TASK-3.2

**Descripción:**
- Crear PUT /api/tasks/:taskId/assign
- Recibir assigneeId
- Validar que assignee sea miembro
- Actualizar task.assignee
- Broadcast 'task:assigned'
- Emitir 'notification:task-assigned' solo al assignee

**Criterios de aceptación:**
- [ ] Asignación funciona
- [ ] Validación de miembro
- [ ] Broadcast grupal enviado
- [ ] Notificación personal enviada

---

### TASK-3.7: Endpoint listar tareas de board
**Prioridad:** P0  
**Estimación:** S  
**Dependencias:** TASK-3.2

**Descripción:**
- Crear GET /api/boards/:boardId/tasks
- Verificar permisos
- Buscar todas las tareas del board
- Poplar createdBy y assignee
- Ordenar por column y order
- Retornar array

**Criterios de aceptación:**
- [ ] Retorna todas las tareas
- [ ] Ordenamiento correcto
- [ ] Datos poblados
- [ ] Permisos validados

---

### TASK-3.8: Componente columna de tareas (Frontend)
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** BOARD-2.13

**Descripción:**
- Crear components/Board/TaskColumn.vue
- Recibir props: column, tasks
- Mostrar header con nombre de columna y contador
- Botón "Agregar tarea"
- Área de drop para drag & drop
- Lista de TaskCard components

**Criterios de aceptación:**
- [ ] Columna se renderiza correctamente
- [ ] Contador de tareas funciona
- [ ] Drop zone funcional
- [ ] Diseño responsive

---

### TASK-3.9: Componente tarjeta de tarea (Frontend)
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** TASK-3.8

**Descripción:**
- Crear components/Board/TaskCard.vue
- Recibir prop: task
- Mostrar: título, badge de prioridad, avatar de assignee
- Click abre modal de detalles
- Draggable con VueDraggable
- Indicador visual si alguien está editando

**Criterios de aceptación:**
- [ ] Tarjeta muestra info correctamente
- [ ] Draggable funciona
- [ ] Click abre modal
- [ ] Indicadores visuales

---

### TASK-3.10: Modal crear tarea (Frontend)
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** TASK-3.8

**Descripción:**
- Crear components/Board/AddTask.vue
- Formulario: título, descripción, prioridad
- Validación de campos
- Llamar API de creación
- **Actualización optimista:** agregar a store inmediatamente
- Cerrar modal al éxito
- Rollback si falla

**Criterios de aceptación:**
- [ ] Modal funcional
- [ ] Validación frontend
- [ ] Optimistic update funciona
- [ ] Rollback en errores

---

### TASK-3.11: Modal detalles de tarea (Frontend)
**Prioridad:** P1  
**Estimación:** L  
**Dependencias:** TASK-3.9

**Descripción:**
- Crear components/Board/TaskDetails.vue
- Mostrar: título, descripción, prioridad, assignee, creador, fechas
- Modo edición: click para editar inline
- Socket 'task:edit-start' al editar
- Dropdown para cambiar assignee
- Botón eliminar (solo si tiene permisos)
- Sección de comentarios (módulo 5)

**Criterios de aceptación:**
- [ ] Modal muestra todos los datos
- [ ] Edición inline funciona
- [ ] Lock de edición implementado
- [ ] Permisos respetados

---

### TASK-3.12: Drag and Drop (Frontend)
**Prioridad:** P0  
**Estimación:** L  
**Dependencias:** TASK-3.8, TASK-3.9

**Descripción:**
- Integrar VueDraggable en TaskColumn
- Calcular newColumn y newOrder al drop
- **Actualización optimista:** mover en UI inmediatamente
- Emitir 'task:move' vía socket
- Implementar throttling de 100ms
- Rollback si servidor rechaza

**Criterios de aceptación:**
- [ ] Drag and drop fluido
- [ ] Actualización optimista
- [ ] Throttling implementado
- [ ] Rollback funciona

---

### TASK-3.13: Sincronización en tiempo real (Frontend)
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** TASK-3.10, BOARD-2.13

**Descripción:**
- En composable useSocket, handlers para:
  - 'task:created' → agregar a store
  - 'task:updated' → actualizar en store
  - 'task:moved' → mover en store
  - 'task:deleted' → remover de store
  - 'task:assigned' → actualizar assignee
- Actualizar UI reactivamente
- Mostrar toast sutil en cambios de otros

**Criterios de aceptación:**
- [ ] Todos los eventos manejados
- [ ] UI se actualiza sin refresh
- [ ] Toast no intrusivo
- [ ] Sin duplicados de tareas

---

## 👥 MÓDULO 4: PRESENCIA DE USUARIOS

### PRESENCE-4.1: Estructura de datos en servidor
**Prioridad:** P1  
**Estimación:** S  
**Dependencias:** BOARD-2.6

**Descripción:**
- Crear objeto en memoria: activeUsers = {}
- Estructura: { boardId: Set([userId1, userId2]) }
- Agregar en 'board:join', remover en 'board:leave'
- Crear función helper getUsersInBoard(boardId)

**Criterios de aceptación:**
- [ ] Estructura de datos creada
- [ ] Add/remove funciona
- [ ] Helper retorna array correcto
- [ ] Sin memory leaks

---

### PRESENCE-4.2: Socket - Usuario online/offline
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** PRESENCE-4.1

**Descripción:**
- Al hacer board:join, agregar a activeUsers
- Broadcast 'presence:user-online' con userData
- Al disconnect, remover de activeUsers
- Broadcast 'presence:user-offline' con userId
- Incluir lista completa en respuesta de board:joined

**Criterios de aceptación:**
- [ ] Eventos se emiten correctamente
- [ ] activeUsers se mantiene preciso
- [ ] Lista inicial correcta
- [ ] Limpieza al desconectar

---

### PRESENCE-4.3: Socket - Indicador de "escribiendo"
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** PRESENCE-4.1

**Descripción:**
- Handler para 'typing:start' con taskId
- Agregar a typingUsers[taskId][userId]
- Timeout de 2s para auto-limpiar
- Broadcast 'typing:active' a otros (excepto emisor)
- Handler para 'typing:stop'
- Broadcast 'typing:inactive'

**Criterios de aceptación:**
- [ ] Indicador funciona correctamente
- [ ] Timeout auto-limpia
- [ ] No se emite al propio usuario
- [ ] Sin memory leaks

---

### PRESENCE-4.4: Socket - Lock de edición
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** PRESENCE-4.1

**Descripción:**
- Crear editingTasks = {}
- Handler 'task:edit-start'
- Si > 45s sin ping, disconnect(true)
- Cliente envía 'ping' cada 20s
- Servidor responde 'pong' y actualiza timestamp
- Cliente reconecta automáticamente si no recibe pong

**Criterios de aceptación:**
- [ ] Zombies detectados y desconectados
- [ ] Ping/pong funciona
- [ ] Reconexión automática
- [ ] Limpieza de recursos

---

### PRESENCE-4.6: Componente usuarios online (Frontend)
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** BOARD-2.13, PRESENCE-4.2

**Descripción:**
- Crear components/Board/OnlineUsers.vue
- Store de presence con array de usersOnline
- Listener para 'presence:user-online' y 'offline'
- Mostrar avatares apilados (máx 5 visibles + contador)
- Tooltip con username al hover
- Actualizar lista reactivamente

**Criterios de aceptación:**
- [ ] Avatares se muestran correctamente
- [ ] Lista se actualiza en tiempo real
- [ ] Diseño atractivo
- [ ] Performance con muchos usuarios

---

### PRESENCE-4.7: Indicador "escribiendo" (Frontend)
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** TASK-3.11, PRESENCE-4.3

**Descripción:**
- En TaskDetails, detectar cuando usuario escribe
- Debounce de 300ms antes de emitir
- Emitir 'typing:start' con taskId
- Listener para 'typing:active' de otros
- Mostrar mensaje: "Juan está escribiendo..."
- Ocultar después de 2s o al recibir 'typing:inactive'

**Criterios de aceptación:**
- [ ] Debounce implementado
- [ ] Mensaje aparece/desaparece
- [ ] No spam de eventos
- [ ] Diseño claro

---

### PRESENCE-4.8: Indicador de tarea siendo editada (Frontend)
**Prioridad:** P2  
**Estimación:** S  
**Dependencias:** TASK-3.9, PRESENCE-4.4

**Descripción:**
- En TaskCard, listener para 'task:being-edited'
- Mostrar badge: "Editando: Usuario X"
- Al hacer click en tarea siendo editada:
  - Emitir 'task:edit-start'
  - Si denegado, mostrar toast
  - No abrir modal
- Listener para 'task:edit-released'
- Remover badge

**Criterios de aceptación:**
- [ ] Badge visible cuando alguien edita
- [ ] Click denegado apropiadamente
- [ ] Toast informativo
- [ ] Badge desaparece al liberar

---

## 💬 MÓDULO 5: COMENTARIOS

### COMMENT-5.1: Modelo de Comment
**Prioridad:** P1  
**Estimación:** S  
**Dependencias:** TASK-3.1, AUTH-1.1

**Descripción:**
- Crear schema de Mongoose para Comment
- Campos: task, author, content, mentions[], createdAt, updatedAt
- Índice en task
- Ref a Task y User

**Criterios de aceptación:**
- [ ] Schema definido
- [ ] Referencias configuradas
- [ ] Índice creado

---

### COMMENT-5.2: Endpoint crear comentario
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** COMMENT-5.1

**Descripción:**
- Crear POST /api/tasks/:taskId/comments
- Parsear @mentions del content
- Validar que task exista y user sea miembro del board
- Resolver usernames a userIds
- Crear comentario
- Broadcast 'comment:added' a todos en board
- Emitir 'notification:mentioned' a mencionados
- Emitir 'notification:comment-on-task' a assignee (si aplica)

**Criterios de aceptación:**
- [ ] Comentario se crea
- [ ] Mentions parseadas
- [ ] Broadcast correcto
- [ ] Notificaciones dirigidas enviadas

---

### COMMENT-5.3: Endpoint listar comentarios
**Prioridad:** P1  
**Estimación:** S  
**Dependencias:** COMMENT-5.2

**Descripción:**
- Crear GET /api/tasks/:taskId/comments
- Verificar permisos
- Buscar comments de esa task
- Poplar author
- Ordenar por createdAt asc
- Retornar array

**Criterios de aceptación:**
- [ ] Retorna comentarios correctos
- [ ] Ordenamiento cronológico
- [ ] Author poblado
- [ ] Permisos validados

---

### COMMENT-5.4: Socket - Comentario agregado
**Prioridad:** P1  
**Estimación:** S  
**Dependencias:** COMMENT-5.2

**Descripción:**
- Ya implementado en COMMENT-5.2
- Asegurar que broadcast incluya comment completo
- Incluir author poblado

**Criterios de aceptación:**
- [ ] Evento contiene datos completos
- [ ] Solo se emite a board correcto

---

### COMMENT-5.5: Componente sección de comentarios (Frontend)
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** TASK-3.11

**Descripción:**
- Crear components/Task/Comments.vue
- Mostrar dentro de TaskDetails
- Cargar comentarios al abrir modal
- Lista de comentarios con autor y fecha
- Input para nuevo comentario
- Detectar @mentions mientras escribe
- Autocompletar con miembros del board

**Criterios de aceptación:**
- [ ] Comentarios se cargan
- [ ] Lista renderizada correctamente
- [ ] Input funcional
- [ ] Autocompletar de mentions

---

### COMMENT-5.6: Envío de comentarios (Frontend)
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** COMMENT-5.5

**Descripción:**
- Submit del input llama API
- Parsear mentions antes de enviar
- **Actualización optimista:** agregar al array local
- Scroll automático al último comentario
- Limpiar input al éxito
- Rollback si falla

**Criterios de aceptación:**
- [ ] Envío funciona
- [ ] Optimistic update
- [ ] Scroll automático
- [ ] Mentions parseadas

---

### COMMENT-5.7: Sincronización en tiempo real (Frontend)
**Prioridad:** P1  
**Estimación:** S  
**Dependencias:** COMMENT-5.6

**Descripción:**
- Listener para 'comment:added'
- Si modal de esa task está abierto:
  - Agregar comentario al array
  - Scroll al nuevo comentario
- Si modal cerrado:
  - Incrementar badge de comentarios no leídos
- Reproducir sonido sutil (opcional)

**Criterios de aceptación:**
- [ ] Comentarios aparecen en tiempo real
- [ ] Scroll funciona
- [ ] Badge de no leídos
- [ ] Sin duplicados

---

## 📊 MÓDULO 6: ACTIVIDAD Y NOTIFICACIONES

### ACTIVITY-6.1: Modelo de Activity
**Prioridad:** P2  
**Estimación:** S  
**Dependencias:** BOARD-2.1, AUTH-1.1

**Descripción:**
- Crear schema de Mongoose para Activity
- Campos: board, user, action, targetType, target, metadata, createdAt
- Índices: board, createdAt
- Enum para action: created/updated/moved/deleted/commented

**Criterios de aceptación:**
- [ ] Schema definido
- [ ] Índices creados
- [ ] Enums validados

---

### ACTIVITY-6.2: Service de logging automático
**Prioridad:** P2  
**Estimación:** M  
**Dependencias:** ACTIVITY-6.1

**Descripción:**
- Crear services/ActivityService.js
- Método log(boardId, userId, action, target, metadata)
- Llamar automáticamente después de cada operación
- Crear registro en DB
- Broadcast 'activity:new' con entry formateada

**Criterios de aceptación:**
- [ ] Service funciona
- [ ] Logs se crean automáticamente
- [ ] Broadcast se emite
- [ ] Metadata útil incluida

---

### ACTIVITY-6.3: Endpoint listar actividades
**Prioridad:** P2  
**Estimación:** S  
**Dependencias:** ACTIVITY-6.2

**Descripción:**
- Crear GET /api/boards/:boardId/activity
- Query params: page, limit (default 20)
- Verificar permisos
- Buscar activities del board
- Poplar user
- Ordenar por createdAt desc
- Retornar array

**Criterios de aceptación:**
- [ ] Paginación funciona
- [ ] User poblado
- [ ] Ordenamiento correcto
- [ ] Permisos validados

---

### ACTIVITY-6.4: Componente feed de actividad (Frontend)
**Prioridad:** P2  
**Estimación:** M  
**Dependencias:** BOARD-2.13, ACTIVITY-6.3

**Descripción:**
- Crear components/Activity/ActivityFeed.vue
- Sidebar o panel en vista de board
- Cargar últimas 20 actividades
- Scroll infinito para cargar más
- Formatear cada entry: "Juan movió 'Fix bug' a Completado"
- Iconos por tipo de acción

**Criterios de aceptación:**
- [ ] Feed se renderiza
- [ ] Scroll infinito funciona
- [ ] Formato legible
- [ ] Diseño atractivo

---

### ACTIVITY-6.5: Actualización en tiempo real (Frontend)
**Prioridad:** P2  
**Estimación:** S  
**Dependencias:** ACTIVITY-6.4

**Descripción:**
- Listener para 'activity:new'
- Agregar nueva entrada al inicio del feed
- Máximo 50 en memoria, eliminar antiguas
- Auto-scroll si feed está en top
- Animación sutil de entrada

**Criterios de aceptación:**
- [ ] Nuevas actividades aparecen
- [ ] Límite de 50 respetado
- [ ] Scroll inteligente
- [ ] Animación funciona

---

### ACTIVITY-6.6: Sistema de notificaciones toast
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** FRONT-0.1

**Descripción:**
- Crear components/Common/Toast.vue
- Crear composable useToast.js
- Store de toasts: array reactivo
- Método showToast(type, message, duration)
- Tipos: success, info, warning, error
- Auto-dismiss después de duration
- Máximo 3 toasts simultáneos
- Posición: top-right

**Criterios de aceptación:**
- [ ] Toasts aparecen correctamente
- [ ] Auto-dismiss funciona
- [ ] Límite de 3 respetado
- [ ] Diseño atractivo

---

### ACTIVITY-6.7: Notificaciones personales (Frontend)
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** ACTIVITY-6.6

**Descripción:**
- Listeners para eventos de notificación:
  - 'notification:task-assigned'
  - 'notification:mentioned'
  - 'notification:comment-on-task'
- Cada uno muestra toast apropiado
- Sonido sutil (opcional)
- Badge de contador en navbar

**Criterios de aceptación:**
- [ ] Todos los eventos manejados
- [ ] Toasts informativos
- [ ] Sonidos opcionales
- [ ] Badge funciona

---

## 🔄 MÓDULO 7: RECONEXIÓN Y MANEJO DE ERRORES

### RECONNECT-7.1: Configuración de reconexión Socket.IO
**Prioridad:** P0  
**Estimación:** S  
**Dependencias:** FRONT-0.2

**Descripción:**
- Configurar socket.io-client con opciones:
  - reconnection: true
  - reconnectionDelay: 1000
  - reconnectionDelayMax: 30000
  - reconnectionAttempts: Infinity
- Listeners para 'disconnect' y 'connect'

**Criterios de aceptación:**
- [ ] Configuración correcta
- [ ] Reconexión automática funciona
- [ ] Backoff exponencial

---

### RECONNECT-7.2: UI de estado de conexión
**Prioridad:** P1  
**Estimación:** S  
**Dependencias:** RECONNECT-7.1

**Descripción:**
- Crear components/Common/ConnectionStatus.vue
- Banner en top de la página
- Estados: conectado, desconectado, reconectando
- Colores: verde, rojo, amarillo
- Mostrar intento actual de reconexión
- Auto-ocultar cuando conectado

**Criterios de aceptación:**
- [ ] Banner aparece al desconectar
- [ ] Estados visuales claros
- [ ] Contador de intentos
- [ ] Auto-oculta correctamente

---

### RECONNECT-7.3: Re-autenticación al reconectar
**Prioridad:** P0  
**Estimación:** M  
**Dependencias:** RECONNECT-7.1, AUTH-1.5

**Descripción:**
- Al evento 'connect', reenviar token
- Server valida nuevamente
- Si token expiró, forzar logout
- Si válido, reincorporar a boards activos

**Criterios de aceptación:**
- [ ] Re-auth automática
- [ ] Logout si token expiró
- [ ] Re-join a boards funciona

---

### RECONNECT-7.4: Sincronización de estado tras reconexión
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** RECONNECT-7.3

**Descripción:**
- Al reconectar, comparar timestamps
- Si local está desactualizado, fetch completo
- Merge estado local con servidor
- Conservar cambios optimistas pendientes
- Reintentar acciones fallidas en cola

**Criterios de aceptación:**
- [ ] Estado se sincroniza
- [ ] Sin pérdida de datos
- [ ] Cambios locales conservados
- [ ] Cola de reintentos funciona

---

### RECONNECT-7.5: Sistema de actualización optimista
**Prioridad:** P0  
**Estimación:** L  
**Dependencias:** TASK-3.10

**Descripción:**
- Crear composable useOptimisticUpdate.js
- Métodos: applyOptimistic, confirm, rollback
- Guardar snapshot del estado antes de cambio
- Marcar cambio como "pending"
- Al recibir confirmación, marcar "confirmed"
- Si error, ejecutar rollback con snapshot
- Queue para múltiples cambios

**Criterios de aceptación:**
- [ ] Optimistic updates funcionan
- [ ] Rollback restaura estado
- [ ] Queue maneja múltiples cambios
- [ ] Sin race conditions

---

### RECONNECT-7.6: Manejo de errores de validación
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** Todos los endpoints

**Descripción:**
- Agregar validación consistente en todos los endpoints
- Retornar errores con estructura uniforme:
  - { error: true, message: "...", field: "..." }
- Frontend parsea errores y muestra apropiadamente
- Marcar campos con error en rojo
- Ejecutar rollback si fue optimistic

**Criterios de aceptación:**
- [ ] Errores estructurados
- [ ] Frontend parsea correctamente
- [ ] Campos marcados en rojo
- [ ] Rollback en errores

---

### RECONNECT-7.7: Timeout y reintentos
**Prioridad:** P2  
**Estimación:** M  
**Dependencias:** RECONNECT-7.5

**Descripción:**
- Timeout de 5s para acciones socket
- Si no hay respuesta, marcar como "timeout"
- Agregar a cola de reintentos
- Botón "Reintentar" en toast de error
- Máximo 3 reintentos automáticos
- Backoff exponencial: 2s, 5s, 10s

**Criterios de aceptación:**
- [ ] Timeouts detectados
- [ ] Cola de reintentos funciona
- [ ] Botón manual de reintento
- [ ] Máximo de reintentos respetado

---

## ⚡ MÓDULO 8: OPTIMIZACIÓN Y PERFORMANCE

### PERF-8.1: Throttling de eventos de movimiento
**Prioridad:** P1  
**Estimación:** S  
**Dependencias:** TASK-3.12

**Descripción:**
- Implementar función throttle (lodash)
- Aplicar a 'task:move' con 100ms
- Agrupar eventos en ventanas de tiempo
- Solo emitir último de cada ventana
- Calcular FPS en dev mode

**Criterios de aceptación:**
- [ ] Throttling reduce eventos 6x+
- [ ] Drag and drop sigue fluido
- [ ] FPS > 30 en drag

---

### PERF-8.2: Debouncing de typing indicators
**Prioridad:** P1  
**Estimación:** S  
**Dependencias:** PRESENCE-4.3

**Descripción:**
- Implementar debounce en input de comentarios
- Delay de 300ms
- Cancelar timer anterior al teclear
- Solo emitir al pausar

**Criterios de aceptación:**
- [ ] Debounce reduce eventos 10x+
- [ ] Experiencia natural
- [ ] Sin lag perceptible

---

### PERF-8.3: Paginación de actividades
**Prioridad:** P2  
**Estimación:** M  
**Dependencias:** ACTIVITY-6.4

**Descripción:**
- Implementar scroll infinito
- Intersection Observer en último elemento
- Cargar siguiente página al entrar en viewport
- Loading indicator mientras carga
- Deshabilitar si no hay más páginas

**Criterios de aceptación:**
- [ ] Scroll infinito funciona
- [ ] No carga todas al inicio
- [ ] Loading states claros
- [ ] Performance buena con 1000+ activities

---

### PERF-8.4: Compresión de mensajes WebSocket
**Prioridad:** P2  
**Estimación:** S  
**Dependencias:** BACK-0.3

**Descripción:**
- Habilitar perMessageDeflate en Socket.IO server
- threshold: 1024 bytes
- Medir tamaño de mensajes antes/después
- Log de savings en dev mode

**Criterios de aceptación:**
- [ ] Compresión habilitada
- [ ] Mensajes >1KB comprimidos
- [ ] ~60% reducción de tamaño
- [ ] Sin impacto perceptible en latencia

---

### PERF-8.5: Limpieza de memoria en servidor
**Prioridad:** P2  
**Estimación:** M  
**Dependencias:** PRESENCE-4.1

**Descripción:**
- Interval cada 5 minutos para limpieza
- Remover entries de activeUsers sin sockets
- Limpiar typingUsers con timeouts vencidos
- Limpiar editingTasks de sockets desconectados
- Log de limpieza en dev mode

**Criterios de aceptación:**
- [ ] Limpieza automática funciona
- [ ] Sin memory leaks
- [ ] Logs informativos
- [ ] Proceso no bloquea event loop

---

### PERF-8.6: Virtualización de lista de tareas (Frontend)
**Prioridad:** P3  
**Estimación:** L  
**Dependencias:** TASK-3.8

**Descripción:**
- Instalar vue-virtual-scroller
- Aplicar a TaskColumn si > 100 tareas
- Solo renderizar tareas visibles + buffer
- Mantener drag & drop funcional

**Criterios de aceptación:**
- [ ] Virtualización funciona
- [ ] FPS estable con 500+ tareas
- [ ] Drag & drop no afectado
- [ ] Scroll suave

---

### PERF-8.7: Caching de datos del tablero
**Prioridad:** P2  
**Estimación:** M  
**Dependencias:** BOARD-2.13

**Descripción:**
- Implementar cache en store de boards
- TTL de 5 minutos
- Invalidar al recibir updates vía WebSocket
- Fetch solo si cache expirado o invalidado
- Indicador de datos "stale"

**Criterios de aceptación:**
- [ ] Cache reduce fetches innecesarios
- [ ] Invalidación funciona
- [ ] TTL respetado
- [ ] No muestra datos obsoletos

---

## 🎨 MÓDULO 9: POLISH Y UX

### POLISH-9.1: Animaciones de transición
**Prioridad:** P2  
**Estimación:** M  
**Dependencias:** Componentes relevantes

**Descripción:**
- Transiciones de Vue en modales
- Fade in/out de toasts
- Slide de tarjetas al crear/eliminar
- Smooth drag & drop
- Loading skeletons en vez de spinners

**Criterios de aceptación:**
- [ ] Animaciones suaves
- [ ] No jarring transitions
- [ ] Skeletons en loads
- [ ] Performance no afectada

---

### POLISH-9.2: Responsive design
**Prioridad:** P1  
**Estimación:** L  
**Dependencias:** Todos los componentes

**Descripción:**
- Adaptar layout a móvil/tablet
- Columnas se apilan verticalmente en móvil
- Menús tipo drawer en móvil
- Touch-friendly drag & drop
- Testear en diferentes tamaños

**Criterios de aceptación:**
- [ ] Funcional en móvil
- [ ] Touch interactions suaves
- [ ] Layout adaptativo
- [ ] No scroll horizontal

---

### POLISH-9.3: Temas y personalización
**Prioridad:** P3  
**Estimación:** M  
**Dependencias:** FRONT-0.1

**Descripción:**
- Modo oscuro/claro
- Toggle en settings
- Preferencia guardada en localStorage
- CSS variables para colores
- Transición suave entre temas

**Criterios de aceptación:**
- [ ] Ambos temas funcionan
- [ ] Toggle accesible
- [ ] Preferencia persiste
- [ ] Contraste adecuado

---

### POLISH-9.4: Atajos de teclado
**Prioridad:** P3  
**Estimación:** M  
**Dependencias:** TASK-3.11

**Descripción:**
- Implementar shortcuts:
  - 'N' - Nueva tarea
  - 'Esc' - Cerrar modal
  - 'Cmd/Ctrl + Enter' - Guardar
  - '?' - Mostrar ayuda de shortcuts
- Composable useKeyboardShortcuts
- Modal de ayuda con lista

**Criterios de aceptación:**
- [ ] Shortcuts funcionan
- [ ] No conflictos con inputs
- [ ] Help modal informativo
- [ ] Accesible con teclado

---

### POLISH-9.5: Estados vacíos y onboarding
**Prioridad:** P2  
**Estimación:** M  
**Dependencias:** BOARD-2.10

**Descripción:**
- Empty states con ilustraciones/copy
- Dashboard sin tableros: CTA crear o unirse
- Board sin tareas: explicar cómo crear
- Tooltip tour en primer uso
- Hints contextuales

**Criterios de aceptación:**
- [ ] Empty states atractivos
- [ ] CTAs claros
- [ ] Tour opcional funcional
- [ ] No intrusivo

---

## 🧪 MÓDULO 10: TESTING Y DEPLOYMENT

### TEST-10.1: Tests unitarios de backend
**Prioridad:** P2  
**Estimación:** L  
**Dependencias:** Todos los módulos backend

**Descripción:**
- Setup de Jest
- Tests de models (validación, methods)
- Tests de controllers
- Tests de middleware
- Mock de DB con mongodb-memory-server
- Coverage > 70%

**Criterios de aceptación:**
- [ ] Suite de tests corre
- [ ] Coverage > 70%
- [ ] Tests pasan consistentemente

---

### TEST-10.2: Tests de integración WebSocket
**Prioridad:** P2  
**Estimación:** L  
**Dependencias:** Módulos de WebSocket

**Descripción:**
- Tests de eventos de socket
- socket.io-client para tests
- Verificar broadcasts correctos
- Tests de permisos en sockets
- Tests de reconexión

**Criterios de aceptación:**
- [ ] Eventos testeados
- [ ] Broadcasts verificados
- [ ] Permisos validados

---

### TEST-10.3: Tests E2E con Cypress
**Prioridad:** P3  
**Estimación:** XL  
**Dependencias:** Toda la app

**Descripción:**
- Setup de Cypress
- Tests de flujos completos:
  - Registro → Login → Crear board → Crear task → Mover task
  - Unirse a board → Ver cambios en tiempo real
- Tests de multi-usuario (paralelos)

**Criterios de aceptación:**
- [ ] Flujos principales testeados
- [ ] Tests E2E pasan
- [ ] CI puede correr tests

---

### DEPLOY-10.4: Configuración de producción
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** BACK-0.1, FRONT-0.1

**Descripción:**
- Variables de entorno de producción
- Build de frontend optimizado
- Configurar CORS correctamente
- HTTPS/WSS en producción
- Reverse proxy (nginx o similar)
- Rate limiting

**Criterios de aceptación:**
- [ ] Builds de producción funcionan
- [ ] HTTPS configurado
- [ ] CORS seguro
- [ ] Rate limiting activo

---

### DEPLOY-10.5: Deploy a hosting
**Prioridad:** P1  
**Estimación:** M  
**Dependencias:** DEPLOY-10.4

**Descripción:**
- Frontend: Vercel/Netlify
- Backend: Railway/Render/Heroku
- Database: MongoDB Atlas
- Variables de entorno configuradas
- Health check endpoints
- Monitoreo básico

**Criterios de aceptación:**
- [ ] App deployada y accesible
- [ ] WebSockets funcionan en prod
- [ ] DB conectada
- [ ] Health checks funcionan

---

## 📊 RESUMEN DE PRIORIDADES

### P0 - Crítico (MVP básico funcional)
**Total estimado: ~20 días**
- Setup completo (Backend + Frontend)
- Autenticación completa
- CRUD de tableros y tareas
- WebSocket básico de sincronización
- Drag & drop
- UI básica funcional

### P1 - Alto (Features clave)
**Total estimado: ~10 días adicionales**
- Sistema de presencia
- Comentarios
- Notificaciones
- Reconexión robusta
- Optimizaciones básicas
- Polish de UX

### P2 - Medio (Nice to have)
**Total estimado: ~7 días adicionales**
- Feed de actividad
- Heartbeat avanzado
- Performance optimizations
- Testing básico
- Themes

### P3 - Bajo (Features extras)
**Total estimado: ~5 días adicionales**
- Virtualización
- Atajos de teclado
- Tests E2E
- Features avanzadas

---

## 🎯 SPRINTS SUGERIDOS

### Sprint 1 (Días 1-5): Foundation
- MÓDULO 0 completo
- MÓDULO 1 completo
- Autenticación end-to-end funcionando

### Sprint 2 (Días 6-10): Core Features
- MÓDULO 2 completo
- MÓDULO 3: TASK-3.1 a TASK-3.7
- CRUD básico de tareas funcionando

### Sprint 3 (Días 11-15): Real-time Magic
- MÓDULO 3: TASK-3.8 a TASK-3.13
- Drag & drop y sincronización completa
- Primera versión usable

### Sprint 4 (Días 16-20): Collaboration Features
- MÓDULO 4 completo
- MÓDULO 5 completo
- Presencia y comentarios funcionando

---

## ✅ DEFINICIÓN DE "DONE"

Cada ítem se considera completo cuando:
- [ ] Código implementado según especificación
- [ ] Funciona correctamente en desarrollo
- [ ] Manejo de errores implementado
- [ ] UI/UX cumple criterios de aceptación
- [ ] Sin bugs conocidos bloqueantes
- [ ] Código revisado (self-review mínimo)
- [ ] Testeado manualmente

Para features P1-P0 adicional:
- [ ] Tests unitarios escritos (si aplica)
- [ ] Documentación básica (comentarios en código) task ya está siendo editada, emitir 'task:edit-denied'
- Si libre, asignar editingTasks[taskId] = userId
- Emitir 'task:edit-locked' al editor
- Broadcast 'task:being-edited' a otros
- Handler 'task:edit-end' limpia el lock

**Criterios de aceptación:**
- [ ] Solo un editor a la vez
- [ ] Mensajes de denegación claros
- [ ] Lock se libera correctamente
- [ ] Limpieza al desconectar

---

### PRESENCE-4.5: Heartbeat y detección de zombies
**Prioridad:** P2  
**Estimación:** M  
**Dependencias:** PRESENCE-4.1

**Descripción:**
- Implementar interval cada 30s
- Verificar socket.lastPing para cada conexión
- Si