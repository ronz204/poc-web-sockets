# Sistema de Colaboración en Tiempo Real - TaskFlow
## Arquitectura Detallada por Módulos y Acciones

---

## 📦 MÓDULO 1: AUTENTICACIÓN Y USUARIOS

### Descripción del Módulo
Gestiona todo lo relacionado con usuarios, desde el registro hasta la autenticación de sesiones tanto HTTP como WebSocket. Este módulo es la base de seguridad de toda la aplicación.

### Modelos de Datos

```javascript
User {
  _id: ObjectId,
  username: String (único),
  email: String (único),
  password: String (hasheado con bcrypt),
  avatar: String (URL o color hex),
  createdAt: Date,
  lastSeen: Date
}
```

### Acciones del Módulo

#### 1.1 REGISTRO DE USUARIO
**Endpoint:** `POST /api/auth/register`

**Flujo detallado:**
1. Cliente envía username, email y password
2. Backend valida que el email tenga formato correcto
3. Backend verifica que username y email no existan en DB
4. Password se hashea con bcrypt (10 rounds de salt)
5. Se genera un color aleatorio para el avatar del usuario
6. Se crea el registro en la base de datos
7. Se genera un JWT token con el _id del usuario
8. Se retorna el token y datos del usuario (sin password)

**Por qué es importante:** Establece la identidad única de cada usuario en el sistema. El hash de password asegura que ni siquiera nosotros podemos ver la contraseña real.

---

#### 1.2 INICIO DE SESIÓN
**Endpoint:** `POST /api/auth/login`

**Flujo detallado:**
1. Cliente envía email/username y password
2. Backend busca el usuario en la base de datos
3. Si no existe, retorna error 401 "Credenciales inválidas"
4. Si existe, compara el password enviado con el hash usando bcrypt.compare()
5. Si no coincide, retorna error 401
6. Si coincide, actualiza el campo lastSeen del usuario
7. Genera un nuevo JWT token
8. Retorna token y datos del usuario

**Por qué es importante:** Valida la identidad del usuario y crea una sesión segura mediante JWT que se usará en todas las peticiones posteriores.

---

#### 1.3 VERIFICACIÓN DE TOKEN
**Middleware:** `authMiddleware`

**Flujo detallado:**
1. Intercepta todas las peticiones protegidas
2. Extrae el token del header Authorization (formato: "Bearer TOKEN")
3. Verifica el token con jwt.verify() usando la clave secreta
4. Si es inválido o expiró, retorna error 401
5. Si es válido, decodifica el payload (contiene el _id del usuario)
6. Busca el usuario en la base de datos con ese _id
7. Agrega el objeto user completo a req.user
8. Permite que la petición continúe

**Por qué es importante:** Protege los endpoints y asegura que solo usuarios autenticados accedan a recursos. Es el guardián de toda la API REST.

---

#### 1.4 AUTENTICACIÓN DE SOCKET
**Middleware de Socket.IO:** `socketAuthMiddleware`

**Flujo detallado:**
1. Cuando un cliente intenta conectarse vía WebSocket
2. Socket.IO ejecuta este middleware antes de aceptar la conexión
3. Extrae el token del handshake (socket.handshake.auth.token)
4. Verifica el token igual que en authMiddleware
5. Si es inválido, rechaza la conexión con socket.disconnect()
6. Si es válido, decodifica el usuario
7. Agrega socket.user = datosDelUsuario
8. Permite la conexión
9. Emite evento 'authenticated' al cliente

**Por qué es importante:** WebSockets mantienen conexiones persistentes. Sin esto, cualquiera podría conectarse y recibir/enviar datos. Es crucial validar ANTES de aceptar la conexión.

---

## 📦 MÓDULO 2: TABLEROS (BOARDS)

### Descripción del Módulo
Gestiona la creación y administración de espacios de trabajo colaborativos. Cada tablero es un contenedor de tareas con sus propios miembros y permisos.

### Modelos de Datos

```javascript
Board {
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  members: [{
    user: ObjectId (ref: User),
    role: String (owner/member),
    joinedAt: Date
  }],
  inviteCode: String (único, 8 caracteres),
  columns: [{
    id: String,
    name: String,
    order: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Acciones del Módulo

#### 2.1 CREAR TABLERO
**Endpoint:** `POST /api/boards`
**WebSocket:** No aplica (operación inicial)

**Flujo detallado:**
1. Usuario autenticado envía nombre y descripción del tablero
2. Backend valida que el nombre no esté vacío
3. Genera un código de invitación único aleatorio (8 caracteres)
4. Crea el tablero con columnas por defecto: "Por Hacer", "En Progreso", "Completado"
5. Agrega al creador como owner en el array de members
6. Guarda en base de datos
7. Retorna el tablero completo

**Por qué es importante:** Establece el espacio de trabajo. El inviteCode será usado para que otros se unan. Las columnas por defecto dan estructura inicial.

---

#### 2.2 LISTAR MIS TABLEROS
**Endpoint:** `GET /api/boards`

**Flujo detallado:**
1. Usuario autenticado hace la petición
2. Backend busca todos los tableros donde:
   - El usuario sea owner, O
   - El usuario esté en el array de members
3. Popula los datos de owner y members (trae username, email, avatar)
4. Ordena por updatedAt descendente (más recientes primero)
5. Retorna el array de tableros

**Por qué es importante:** Dashboard principal del usuario. Muestra tanto tableros propios como compartidos.

---

#### 2.3 OBTENER DETALLES DE TABLERO
**Endpoint:** `GET /api/boards/:boardId`

**Flujo detallado:**
1. Usuario solicita un tablero específico por ID
2. Backend busca el tablero en la base de datos
3. Verifica que el usuario sea miembro (owner o member)
4. Si no es miembro, retorna error 403 Forbidden
5. Si es miembro, popula datos completos de members
6. Popula las tareas del tablero (se explica en módulo de tareas)
7. Retorna el tablero con toda su información

**Por qué es importante:** Carga inicial cuando entras a un tablero. Trae todo lo necesario para renderizar la vista completa.

---

#### 2.4 UNIRSE A TABLERO POR CÓDIGO
**Endpoint:** `POST /api/boards/join`
**WebSocket:** `board:member-joined` (broadcast a miembros del tablero)

**Flujo detallado:**
1. Usuario envía un inviteCode
2. Backend busca tablero con ese código
3. Si no existe, retorna error 404
4. Verifica si el usuario ya es miembro
5. Si ya es miembro, retorna error 400 "Ya eres miembro"
6. Si no es miembro, lo agrega al array members con role: 'member'
7. Guarda el tablero actualizado
8. **WEBSOCKET:** Emite evento `board:member-joined` a todos los sockets en el room del tablero
9. El evento incluye los datos del nuevo miembro
10. Retorna el tablero completo

**Por qué es importante:** Permite colaboración. El evento WebSocket notifica a todos los usuarios conectados que alguien nuevo se unió, actualizando la lista de miembros en tiempo real.

---

#### 2.5 ACTUALIZAR COLUMNAS DEL TABLERO
**Endpoint:** `PUT /api/boards/:boardId/columns`
**WebSocket:** `board:columns-updated` (broadcast)

**Flujo detallado:**
1. Usuario envía nuevo array de columnas (puede agregar, eliminar o renombrar)
2. Backend verifica permisos (solo owner puede modificar columnas)
3. Si no es owner, retorna error 403
4. Valida que haya al menos una columna
5. Actualiza el campo columns del tablero
6. Guarda en base de datos
7. **WEBSOCKET:** Broadcast `board:columns-updated` a todos en el room
8. El evento incluye el array completo de columnas actualizado
9. Todos los clientes conectados reorganizan su UI

**Por qué es importante:** Permite personalizar el flujo de trabajo. El broadcast asegura que todos vean la nueva estructura instantáneamente.

---

#### 2.6 CONECTARSE AL TABLERO (WebSocket)
**Evento:** `board:join`
**Emitido por:** Cliente
**Responde con:** `board:joined`

**Flujo detallado:**
1. Cliente se conecta al WebSocket y emite `board:join` con boardId
2. Backend verifica que el usuario sea miembro del tablero
3. Si no es miembro, emite error y desconecta
4. Si es miembro, hace socket.join(boardId) - lo agrega al "room"
5. Registra en memoria quién está en qué tablero: activeUsers[boardId].add(userId)
6. Obtiene lista de todos los usuarios actualmente conectados a ese tablero
7. **Emite al cliente:** `board:joined` con la lista de usuarios presentes
8. **Broadcast a otros:** `user:joined` con datos del usuario que se conectó
9. Todos los clientes actualizan su lista de "Quién está aquí"

**Por qué es importante:** Los "rooms" de Socket.IO son fundamentales. Aseguran que eventos solo lleguen a usuarios viendo ese tablero específico, no a todos los conectados a la app.

---

#### 2.7 DESCONECTARSE DEL TABLERO (WebSocket)
**Evento:** `board:leave` o `disconnect`

**Flujo detallado:**
1. Cliente emite `board:leave` o se desconecta completamente
2. Backend identifica de qué tablero(s) estaba el socket
3. Remueve el socket del room: socket.leave(boardId)
4. Remueve userId de activeUsers[boardId]
5. **Broadcast:** `user:left` con userId a todos los restantes en el room
6. Limpia recursos en memoria asociados a ese socket
7. Todos los clientes remueven al usuario de la lista de presentes

**Por qué es importante:** Mantiene la lista de presencia precisa. Sin esto, usuarios desconectados aparecerían como "online" para siempre.

---

## 📦 MÓDULO 3: TAREAS (TASKS)

### Descripción del Módulo
El corazón de la aplicación. Gestiona las tareas dentro de cada tablero con sincronización en tiempo real de todas las operaciones.

### Modelos de Datos

```javascript
Task {
  _id: ObjectId,
  board: ObjectId (ref: Board),
  title: String,
  description: String,
  column: String (id de la columna),
  assignee: ObjectId (ref: User, nullable),
  priority: String (low/medium/high),
  order: Number (para ordenar dentro de la columna),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Acciones del Módulo

#### 3.1 CREAR TAREA
**Endpoint:** `POST /api/boards/:boardId/tasks`
**WebSocket:** `task:created` (broadcast)

**Flujo detallado:**
1. Usuario envía title, description, column, priority
2. Backend verifica que sea miembro del tablero
3. Valida que la columna exista en el tablero
4. Calcula el order: busca la última tarea en esa columna y suma 1
5. Crea la tarea con createdBy = userId
6. Guarda en base de datos
7. Popula los datos de createdBy y assignee
8. **WEBSOCKET INMEDIATO:** Broadcast `task:created` a todo el room del tablero
9. El evento incluye la tarea completa
10. **Todos los clientes:** Agregan la tarea a su estado local sin hacer otra petición HTTP
11. Retorna la tarea al creador (confirmación)

**Por qué es importante:** La sincronización instantánea crea la sensación de colaboración real. Cuando un usuario crea una tarea, otro usuario viendo el tablero la ve aparecer en menos de 100ms.

---

#### 3.2 ACTUALIZAR TAREA
**Endpoint:** `PUT /api/tasks/:taskId`
**WebSocket:** `task:updated` (broadcast)

**Flujo detallado:**
1. Usuario envía campos a actualizar (title, description, priority, assignee)
2. Backend busca la tarea y verifica que pertenezca a un tablero del cual es miembro
3. Si no es miembro, error 403
4. Actualiza solo los campos enviados (merge)
5. Si se asigna a alguien nuevo, valida que ese usuario sea miembro del tablero
6. Actualiza updatedAt = Date.now()
7. Guarda cambios
8. **WEBSOCKET:** Broadcast `task:updated` con la tarea completa actualizada
9. **Todos los clientes:** Encuentran la tarea en su estado local por _id y la reemplazan
10. La UI se actualiza automáticamente (Vue es reactivo)

**Por qué es importante:** Edición colaborativa en tiempo real. Si dos usuarios están viendo el tablero, ambos ven los cambios del otro instantáneamente.

---

#### 3.3 MOVER TAREA ENTRE COLUMNAS
**Endpoint:** `PUT /api/tasks/:taskId/move`
**WebSocket:** `task:moved` (broadcast con throttling)

**Flujo detallado:**
1. Usuario arrastra tarea de una columna a otra (drag & drop)
2. Frontend calcula: newColumn, newOrder (posición dentro de esa columna)
3. **Actualización optimista:** Cliente mueve la tarea en su UI inmediatamente
4. Cliente emite evento WebSocket `task:move` con taskId, newColumn, newOrder
5. Backend verifica permisos de membresía
6. Valida que newColumn exista en el tablero
7. **Reordenamiento:** 
   - Si la tarea se movió más arriba, decrementa el order de tareas que estaban entre oldOrder y newOrder
   - Si se movió más abajo, incrementa el order de tareas en ese rango
8. Actualiza la tarea con column = newColumn y order = newOrder
9. **WEBSOCKET con THROTTLING:** Agrupa múltiples movimientos en 100ms y hace un solo broadcast
10. Broadcast `task:moved` con taskId, newColumn, newOrder
11. **Otros clientes:** Actualizan la posición de la tarea
12. **Si falla:** Cliente que movió revierte el cambio optimista (rollback)

**Por qué es importante:** El throttling previene que 100 movimientos rápidos saturen el servidor. La actualización optimista da feedback instantáneo aunque haya latencia de red.

---

#### 3.4 ELIMINAR TAREA
**Endpoint:** `DELETE /api/tasks/:taskId`
**WebSocket:** `task:deleted` (broadcast)

**Flujo detallado:**
1. Usuario solicita eliminar una tarea
2. Backend verifica que sea el creador de la tarea o el owner del tablero
3. Si no tiene permisos, error 403
4. Elimina todos los comentarios asociados a esa tarea (CASCADE)
5. Elimina la tarea de la base de datos
6. **WEBSOCKET:** Broadcast `task:deleted` con solo el taskId
7. **Todos los clientes:** Filtran su array de tareas para remover la que tiene ese _id
8. La tarea desaparece de la UI de todos

**Por qué es importante:** Sincronización de eliminaciones. Evita que usuarios vean tareas "fantasma" que ya no existen.

---

#### 3.5 ASIGNAR TAREA
**Endpoint:** `PUT /api/tasks/:taskId/assign`
**WebSocket:** `task:assigned` (broadcast + notificación personal)

**Flujo detallado:**
1. Usuario selecciona a quién asignar la tarea
2. Backend verifica que el assignee sea miembro del tablero
3. Actualiza task.assignee = userId
4. Guarda cambios
5. **WEBSOCKET 1:** Broadcast `task:assigned` a todos en el room con taskId y assigneeId
6. **WEBSOCKET 2:** Emite `notification:task-assigned` SOLO al socket del usuario asignado
7. El usuario asignado recibe una notificación toast: "Te han asignado: [Título de tarea]"
8. Todos los demás solo ven el cambio visual del avatar del assignee

**Por qué es importante:** Combina broadcast grupal con mensaje dirigido. Todos ven el cambio, pero solo el afectado recibe la notificación.

---

## 📦 MÓDULO 4: PRESENCIA DE USUARIOS

### Descripción del Módulo
Gestiona quién está conectado, qué están haciendo, y proporciona feedback visual de actividad en tiempo real.

### Estructura de Datos en Memoria

```javascript
// En el servidor (NO en base de datos, solo RAM)
activeUsers = {
  'boardId1': Set(['userId1', 'userId2']),
  'boardId2': Set(['userId3'])
}

typingUsers = {
  'taskId1': {
    'userId1': {
      username: 'Juan',
      timeout: timeoutId
    }
  }
}

editingTasks = {
  'taskId1': 'userId1' // Solo un editor a la vez
}
```

### Acciones del Módulo

#### 4.1 TRACKING DE USUARIOS ONLINE
**Automático al conectar/desconectar**

**Flujo detallado:**
1. Cuando usuario se une a un tablero (board:join):
   - Server agrega userId al Set activeUsers[boardId]
   - Broadcast `presence:user-online` con userData
2. Cuando usuario se desconecta:
   - Server remueve userId del Set
   - Broadcast `presence:user-offline` con userId
3. Frontend mantiene array reactivo de usersOnline
4. Componente muestra avatares en la esquina superior del tablero
5. Máximo 5 avatares visibles, resto como "+3 más"

**Por qué es importante:** Awareness colaborativo. Saber quién más está trabajando genera sensación de equipo y reduce conflictos de edición.

---

#### 4.2 INDICADOR DE "ESCRIBIENDO"
**Evento:** `typing:start` y `typing:stop`
**Debounced:** 2 segundos

**Flujo detallado:**
1. Usuario empieza a escribir en título o descripción de tarea
2. **Debounce (Frontend):** Espera 300ms de pausa antes de emitir
3. Cliente emite `typing:start` con taskId
4. Backend agrega userId a typingUsers[taskId]
5. Crea un timeout de 2 segundos para auto-limpiar
6. **Broadcast:** `typing:active` con taskId y username a todos EXCEPTO el emisor
7. Otros usuarios ven mensaje: "Juan está escribiendo..."
8. Si usuario deja de escribir por 2 segundos:
   - Timeout ejecuta auto-limpieza
   - Emite `typing:stop`
   - Broadcast `typing:inactive` con taskId
   - Mensaje desaparece

**Por qué es importante:** Previene que dos personas editen simultáneamente. El debounce evita spam de eventos (si escribes "Hola" son 4 letras = 4 eventos sin debounce).

---

#### 4.3 LOCK DE EDICIÓN
**Evento:** `task:edit-start` y `task:edit-end`

**Flujo detallado:**
1. Usuario hace click en "Editar" en una tarea
2. Cliente emite `task:edit-start` con taskId
3. Backend verifica si editingTasks[taskId] ya tiene alguien
4. Si está vacío:
   - Asigna editingTasks[taskId] = userId
   - Emite confirmación `task:edit-locked` al cliente
   - Broadcast `task:being-edited` a otros con userId
   - Cliente muestra modal de edición
5. Si está ocupado:
   - Emite `task:edit-denied` con username del editor actual
   - Cliente muestra mensaje: "María está editando esta tarea"
6. Cuando termina de editar o cierra modal:
   - Cliente emite `task:edit-end`
   - Backend limpia editingTasks[taskId]
   - Broadcast `task:edit-released`

**Por qué es importante:** Previene "edit wars" donde cambios se sobrescriben mutuamente. Es un lock optimista: no impide guardar pero advierte.

---

#### 4.4 HEARTBEAT Y DETECCIÓN DE ZOMBIES
**Automático cada 30 segundos**

**Flujo detallado:**
1. Servidor inicia interval de 30 segundos al arrancar
2. Cada 30 segundos, para cada socket conectado:
   - Verifica socket.lastPing timestamp
   - Si hace más de 45 segundos desde último ping, se considera "zombie"
   - Ejecuta limpieza: socket.disconnect(true)
3. Cliente envía `ping` cada 20 segundos automáticamente
4. Servidor responde con `pong` y actualiza socket.lastPing = Date.now()
5. Si cliente no recibe `pong` en 10 segundos, asume desconexión
6. Cliente intenta reconectar automáticamente

**Por qué es importante:** Conexiones pueden "morir" silenciosamente (WiFi perdido, laptop hibernada). Sin heartbeat, servidor no detecta que user ya no está.

---

## 📦 MÓDULO 5: COMENTARIOS

### Descripción del Módulo
Sistema de comunicación asincrónica dentro de tareas. Permite discusiones contextuales con notificaciones y menciones.

### Modelos de Datos

```javascript
Comment {
  _id: ObjectId,
  task: ObjectId (ref: Task),
  author: ObjectId (ref: User),
  content: String,
  mentions: [ObjectId] (refs: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Acciones del Módulo

#### 5.1 CREAR COMENTARIO
**Endpoint:** `POST /api/tasks/:taskId/comments`
**WebSocket:** `comment:added` (broadcast) + notificaciones personales

**Flujo detallado:**
1. Usuario escribe comentario en tarea
2. **Frontend:** Parsea el contenido buscando @mentions
3. Extrae usernames mencionados: regex /@(\w+)/g
4. Envía content + array de usernames mencionados
5. Backend valida que la tarea exista y user sea miembro del board
6. Resuelve los usernames a userIds
7. Crea el comentario con author y mentions poblados
8. Guarda en base de datos
9. **WEBSOCKET 1:** Broadcast `comment:added` a todos en el room
   - Incluye el comentario completo con author populado
10. **WEBSOCKET 2:** Para cada userId en mentions:
    - Emite `notification:mentioned` solo a ese socket
    - Notificación: "@Juan te mencionó en: [Título tarea]"
11. **WEBSOCKET 3:** Si la tarea tiene assignee diferente al autor:
    - Emite `notification:comment-on-task` al assignee
12. Todos los clientes agregan el comentario al array de la tarea

**Por qué es importante:** Combina tres tipos de WebSocket: broadcast grupal, notificaciones dirigidas, y notificaciones condicionales. Es el patrón más complejo de eventos.

---

#### 5.2 LISTAR COMENTARIOS DE TAREA
**Endpoint:** `GET /api/tasks/:taskId/comments`

**Flujo detallado:**
1. Al abrir modal de tarea, cliente solicita comentarios
2. Backend busca todos los comments donde task = taskId
3. Popula author (username, avatar)
4. Ordena por createdAt ascendente (más antiguos primero)
5. Retorna array de comentarios
6. Cliente los renderiza cronológicamente

**Por qué es importante:** Carga inicial de historial. Los WebSockets solo envían comentarios NUEVOS, no históricos.

---

#### 5.3 ACTUALIZACIÓN EN TIEMPO REAL
**Evento:** `comment:added` (recibido del server)

**Flujo detallado en Cliente:**
1. Vue store recibe evento `comment:added` vía socket
2. Extrae taskId del comentario
3. Busca la tarea en el estado local: state.tasks.find(t => t._id === taskId)
4. Si la tarea está cargada:
   - Agrega el comentario a task.comments array
   - Vue reactivity actualiza la UI automáticamente
5. Si el modal de esa tarea está abierto:
   - El nuevo comentario aparece instantáneamente
   - Scroll automático al último comentario
6. Incrementa badge de "comentarios no leídos" si modal cerrado

**Por qué es importante:** Sincronización selectiva. Solo actualiza UI si la tarea está siendo vista o rastreada.

---

## 📦 MÓDULO 6: ACTIVIDAD Y NOTIFICACIONES

### Descripción del Módulo
Sistema de logging de acciones y notificaciones en tiempo real para awareness del equipo.

### Modelos de Datos

```javascript
Activity {
  _id: ObjectId,
  board: ObjectId (ref: Board),
  user: ObjectId (ref: User),
  action: String (created/updated/moved/deleted/commented),
  targetType: String (task/comment/board),
  target: ObjectId,
  metadata: Object {
    taskTitle: String,
    fromColumn: String,
    toColumn: String,
    // etc
  },
  createdAt: Date
}
```

### Acciones del Módulo

#### 6.1 REGISTRO AUTOMÁTICO DE ACTIVIDAD
**Automático en todas las acciones**

**Flujo detallado:**
1. Después de cualquier operación exitosa (crear/actualizar/mover tarea, etc.)
2. Controller llama a `ActivityService.log()`
3. Se crea registro con:
   - user: quien hizo la acción
   - action: tipo de acción
   - metadata: detalles relevantes
4. Se guarda en base de datos
5. **WEBSOCKET:** Broadcast `activity:new` a todos en el board
6. Incluye datos formateados: "Juan movió 'Fix bug' a En Progreso"
7. Clientes agregan entrada al feed de actividad
8. Feed muestra últimas 20 actividades con scroll infinito

**Por qué es importante:** Auditoría y transparencia. Equipos pueden ver quién hizo qué y cuándo. Útil para resolver confusiones.

---

#### 6.2 FEED DE ACTIVIDAD EN TIEMPO REAL
**Endpoint:** `GET /api/boards/:boardId/activity`
**WebSocket:** `activity:new` (broadcast)

**Flujo detallado:**
1. Al abrir tablero, cliente carga últimas 20 actividades
2. Backend busca activities del board, ordenadas por createdAt desc
3. Popula user (username, avatar)
4. Retorna array de actividades
5. Cliente renderiza en sidebar o sección de actividad
6. **En tiempo real:**
   - Cuando alguien hace una acción, todos reciben `activity:new`
   - Nueva actividad se agrega al principio del feed
   - Máximo 50 en memoria, las viejas se eliminan
7. Si feed está en scroll abajo, auto-scroll a nueva actividad

**Por qué es importante:** Contexto de equipo. Ver qué están haciendo otros ayuda a coordinar y evitar duplicar trabajo.

---

#### 6.3 SISTEMA DE NOTIFICACIONES TOAST
**Evento:** `notification:*` (varios tipos)

**Flujo detallado:**
1. Server emite notificación dirigida a socket específico
2. Cliente recibe evento, ej: `notification:task-assigned`
3. **Frontend Toast Manager:**
   - Crea objeto de notificación: { id, type, message, duration }
   - Agrega a array reactivo de toasts
   - Toast aparece en esquina superior derecha
   - Tipos: success (verde), info (azul), warning (amarillo)
4. Después de `duration` ms (default 5000):
   - Toast se desvanece con animación
   - Se remueve del array
5. Usuario puede cerrar manualmente con X
6. Máximo 3 toasts simultáneos
7. Si llegan más, se encolan y aparecen al cerrar otros

**Por qué es importante:** Feedback no intrusivo. El usuario sabe que algo pasó sin interrumpir su flujo de trabajo.

---

## 📦 MÓDULO 7: RECONEXIÓN Y MANEJO DE ERRORES

### Descripción del Módulo
Gestiona fallos de red, desconexiones y recuperación de estado para experiencia resiliente.

### Acciones del Módulo

#### 7.1 RECONEXIÓN AUTOMÁTICA
**Evento:** `disconnect` y `connect`

**Flujo detallado:**
1. Usuario pierde conexión (WiFi, servidor reinicia, etc.)
2. Socket.IO detecta desconexión, dispara evento `disconnect`
3. **Cliente:**
   - Muestra banner: "Reconectando..."
   - socket.io-client intenta reconectar automáticamente
   - Estrategia: 1s, 2s, 5s, 10s, 30s (exponencial con cap)
4. Cuando reconecta, dispara evento `connect`
5. Cliente automáticamente:
   - Re-autentica enviando token en handshake
   - Re-join al tablero: emite `board:join` con boardId actual
6. Server responde con estado completo:
   - Lista de usuarios online
   - Versión actual del tablero (timestamp)
7. Cliente compara timestamps:
   - Si su última actualización es menor, solicita sync completo
   - Hace GET /api/boards/:boardId para refrescar

**Por qué es importante:** Internet no es confiable. Sin esto, cada desconexión requeriría refresh manual de página.

---

#### 7.2 SINCRONIZACIÓN OPTIMISTA CON ROLLBACK
**Patrón usado en todas las mutaciones**

**Flujo detallado:**
1. Usuario hace acción (ej: mover tarea)
2. **Paso 1 - Optimistic Update:**
   - Cliente actualiza su estado local INMEDIATAMENTE
   - UI refleja el cambio al instante (0ms de latencia percibida)
   - Se guarda snapshot del estado anterior
3. **Paso 2 - Envío al servidor:**
   - Emite evento WebSocket con la acción
   - Marca la acción como "pending"
4. **Paso 3 - Confirmación:**
   - Server procesa, valida, guarda en DB
   - Responde con `success` o `error`
5. **Si SUCCESS:**
   - Cliente marca como "confirmed"
   - Elimina snapshot anterior
   - Usuario nunca nota que hubo red involucrada
6. **Si ERROR:**
   - Cliente ejecuta ROLLBACK
   - Restaura snapshot del estado anterior
   - Muestra toast de error
   - La tarea vuelve a su posición original en la UI

**Por qué es importante:** La ilusión de 0 latencia. Apps modernas se sienten instantáneas porque no esperan confirmación de servidor para actualizar UI.

---

#### 7.3 MANEJO DE CONFLICTOS
**Estrategia: Last Write Wins (LWW)**

**Flujo detallado:**
1. Usuario A y B editan la misma tarea simultáneamente
2. Ambos hacen cambios optimistas en su UI
3. A guarda primero → Server acepta y actualiza updatedAt
4. B guarda 2 segundos después → Server acepta y sobrescribe
5. **Broadcast:** `task:updated` se envía a ambos
6. A recibe el update de B y su cambio es sobrescrito
7. A ve que su edición desapareció
8. **Mitigación:**
   - Lock de edición (módulo 4.3) reduce probabilidad
   - Indicador visual "Alguien más editó esto"
   - Opción de "Ver versión anterior" en historial

**Estrategia alternativa (más compleja):**
- Operational Transformation (OT)
- Conflict-free Replicated Data Types (CRDTs)
- No implementadas en v1 por complejidad

**Por qué es importante:** En apps colaborativas, conflictos son inevitables. LWW es simple pero funcional para nivel intermedio.

---

#### 7.4 MANEJO DE ERRORES DE SOCKET

**Flujo detallado:**
1. **Error de autenticación:**
   - Server emite `error:auth` con mensaje
   - Cliente desconecta socket
   - Redirige a /login
   - Limpia token inválido
2. **Error de permisos:**
   - Server emite `error:forbidden` 
   - Cliente muestra toast: "No tienes permisos"
   - No realiza rollback (fue bloqueado intencionalmente)
3. **Error de validación:**
   - Server emite `error:validation` con campo específico
   - Cliente marca campo en rojo
   - Ejecuta rollback del cambio optimista
4. **Error de red:**
   - Cliente detecta timeout (5s sin respuesta)
   - Marca acción como "failed"
   - Ofrece botón "Reintentar"
   - Guarda en cola de reintentos

**Por qué es importante:** Errores bien manejados = mejor UX. El usuario siempre sabe qué pasó y puede recuperarse.

---

## 📦 MÓDULO 8: OPTIMIZACIÓN Y PERFORMANCE

### Descripción del Módulo
Técnicas para que la app escale y sea rápida incluso con muchos usuarios o datos.

### Acciones del Módulo

#### 8.1 THROTTLING DE EVENTOS
**Aplicado a:** Movimiento de tareas, scroll, resize

**Flujo detallado:**
1. Usuario arrastra tarea rápidamente
2. Sin throttling: 60 eventos/segundo (cada frame)
3. **Con throttling (100ms):**
   - Cliente agrupa eventos en ventanas de 100ms
   - Solo emite el último evento de cada ventana
   - 60 eventos → 10 eventos
4. Server recibe menos carga
5. Broadcast se hace solo 10 veces
6. Otros clientes reciben menos updates pero suficientes para smooth animation

**Implementación:**
```javascript
// Cliente
const throttledMove = throttle((taskId, newColumn, newOrder) => {
  socket.emit('task:move', { taskId, newColumn, newOrder });
}, 100);
```

**Por qué es importante:** Reduce carga en servidor y red 6x sin afectar UX perceptiblemente.

---

#### 8.2 DEBOUNCING DE TYPING
**Aplicado a:** Indicadores de "escribiendo"

**Flujo detallado:**
1. Usuario teclea en input
2. Sin debounce: emit por cada keystroke (spam)
3. **Con debounce (300ms):**
   - Espera 300ms de inactividad
   - Si sigue escribiendo, resetea el timer
   - Solo emite cuando hace pausa
4. Reduce eventos de 1000 a ~5 por frase típica

**Implementación:**
```javascript
const debouncedTyping = debounce(() => {
  socket.emit('typing:start', { taskId });
}, 300);
```

**Por qué es importante:** Evita spam de eventos. "Hola mundo" serían 10 eventos sin debounce, 1 evento con debounce.

---

#### 8.3 PAGINACIÓN DE ACTIVIDADES
**Endpoint:** `GET /api/boards/:boardId/activity?page=1&limit=20`

**Flujo detallado:**
1. Feed de actividad usa scroll infinito
2. Carga inicial: page=1, limit=20
3. Usuario scrollea al fondo
4. **Intersection Observer detecta:**
   - Último elemento entró en viewport
5. Cliente hace fetch de page=2
6. Backend skip = (page-1) * limit
7. Retorna siguiente chunk de 20 activities
8. Cliente las agrega al final del array
9. Proceso se repite hasta que no hay más

**Por qué es importante:** Un tablero con 10,000 actividades colapsaría el browser si se cargan todas. Paginación mantiene memoria baja.

---

#### 8.4 COMPRESIÓN DE MENSAJES WEBSOCKET
**Configuración de Socket.IO**

**Flujo detallado:**
1. En server config: `io = new Server(httpServer, { perMessageDeflate: true })`
2. Socket.IO automáticamente comprime mensajes > 1KB
3. Usa algoritmo deflate (mismo que gzip)
4. Reduce ancho de banda ~60% para JSON grande
5. CPU trade-off: usa más CPU para comprimir/descomprimir
6. Worth it para conexiones lentas (móvil, rural)

**Por qué es importante:** Un evento con 100 tareas puede ser 50KB. Comprimido → 20KB. Crucial para móviles.

---

#### 8.5 LIMPIEZA DE MEMORIA (GARBAGE COLLECTION)

**Flujo detallado:**
1. **Limpiar usuarios inactivos:**
   - Cada 5 minutos, revisar activeUsers
   - Remover entries de tableros sin sockets
2. **Limpiar typing indicators:**
   - Timeouts automáticos después de 2s
   - Previene memory leak si cliente no envía `stop`
3. **Limpiar locks de edición:**
   - Si socket disconnect, liberar todos sus locks
   - Evita tareas bloqueadas permanentemente
4. **Limitar cache en cliente:**
   - Máximo 100 tareas en memoria
   - Si board tiene 500, usar virtualización
   - Solo renderizar tareas visibles en viewport

**Por qué es importante:** Apps long-running acumulan basura. Sin limpieza, RAM crece indefinidamente hasta crash.

---

## 🎯 FLUJOS COMPLETOS DE EJEMPLO

### Ejemplo 1: Usuario crea tarea y otro la ve

**Timeline detallado:**

```
T+0ms: Usuario A hace click en "Nueva tarea"
T+50ms: Modal se abre en cliente A
T+2000ms: Usuario A escribe título y click "Crear"
T+2001ms: [CLIENTE A] Optimistic update - tarea aparece en UI
T+2010ms: [CLIENTE A] POST /api/boards/123/tasks (HTTP)
T+2080ms: [SERVER] Valida, crea en DB, obtiene _id
T+2081ms: [SERVER] Broadcast task:created a room "board:123"
T+2085ms: [CLIENTE B] Recibe evento task:created
T+2086ms: [CLIENTE B] Agrega tarea a state.tasks
T+2087ms: [CLIENTE B] Vue reactivity → tarea aparece en UI
T+2090ms: [CLIENTE A] Recibe respuesta HTTP con _id definitivo
T+2091ms: [CLIENTE A] Reemplaza _id temporal con real

RESULTADO: Cliente B vio la tarea 87ms después de que A hizo click!
```

---

### Ejemplo 2: Dos usuarios intentan editar simultáneamente

**Timeline detallado:**

```
T+0ms: Usuario A click "Editar" en tarea X
T+5ms: [CLIENTE A] Emit task:edit-start { taskId: X }
T+15ms: [SERVER] editingTasks[X] está vacío
T+16ms: [SERVER] editingTasks[X] = userA
T+17ms: [SERVER] Emit task:edit-locked a Cliente A
T+20ms: [CLIENTE A] Muestra modal de edición
T+25ms: [SERVER] Broadcast task:being-edited a otros
T+30ms: [CLIENTE B] Recibe task:being-edited
T+31ms: [CLIENTE B] Muestra badge "Usuario A editando"

T+500ms: Usuario B click "Editar" en MISMA tarea X
T+505ms: [CLIENTE B] Emit task:edit-start { taskId: X }
T+515ms: [SERVER] editingTasks[X] = userA (ocupado!)
T+516ms: [SERVER] Emit task:edit-denied { editor: "Usuario A" }
T+521ms: [CLIENTE B] Muestra toast "Usuario A está editando"
T+522ms: [CLIENTE B] Click es ignorado, modal NO se abre

RESULTADO: Lock previno conflicto de edición simultánea
```

---

### Ejemplo 3: Reconexión tras pérdida de red

**Timeline detallado:**

```
T+0ms: Usuario trabajando normalmente
T+1000ms: WiFi se desconecta
T+1050ms: Socket.IO detecta disconnect (ping timeout)
T+1051ms: [CLIENTE] Evento 'disconnect' dispara
T+1052ms: [CLIENTE] Muestra banner "Conexión perdida"
T+1053ms: [CLIENTE] UI entra en modo "offline"
T+1100ms: [CLIENTE] Intenta reconectar (attempt 1, delay 1s)
T+2100ms: Falla (WiFi aún off)
T+2101ms: [CLIENTE] Intenta reconectar (attempt 2, delay 2s)
T+4100ms: Falla
T+4101ms: [CLIENTE] Intenta reconectar (attempt 3, delay 5s)
T+9100ms: WiFi vuelve!
T+9150ms: Socket conecta exitosamente
T+9151ms: [CLIENTE] Evento 'connect' dispara
T+9152ms: [CLIENTE] Reautentica con token
T+9200ms: [SERVER] Valida token, acepta conexión
T+9201ms: [CLIENTE] Emit board:join con boardId actual
T+9250ms: [SERVER] Usuario rejoin al room
T+9251ms: [SERVER] Envía estado completo: users online, lastUpdate
T+9255ms: [CLIENTE] Compara lastUpdate con local
T+9256ms: [CLIENTE] Detecta que está desactualizado (30s atrás)
T+9257ms: [CLIENTE] GET /api/boards/123 (resync completo)
T+9400ms: [CLIENTE] Recibe tablero actualizado
T+9401ms: [CLIENTE] Merge con estado local (conserva cambios offline)
T+9402ms: [CLIENTE] Banner cambia a "Reconectado ✓"
T+11402ms: Banner desaparece (2s después)

RESULTADO: Usuario recuperó conexión sin perder trabajo
```

---

## 📊 MÉTRICAS Y MONITOREO

### Métricas Clave a Trackear

**Server-side:**
- Sockets activos simultáneos
- Eventos/segundo por tipo
- Latencia promedio de broadcasts
- Memoria usada por activeUsers/typingUsers
- Tasa de reconexiones por minuto
- Errores de autenticación de socket

**Client-side:**
- Tiempo desde click hasta UI update (optimistic)
- Tiempo desde evento server hasta UI update
- % de acciones que requieren rollback
- Duración promedio de desconexiones
- FPS durante drag & drop

**Herramientas sugeridas:**
- Server: Winston logger + Grafana
- Client: Browser Performance API
- WebSocket: Socket.IO admin UI

---

## 🔐 CONSIDERACIONES DE SEGURIDAD

### Validación en Doble Capa

**Nunca confiar solo en cliente:**
1. Cliente valida (UX rápido)
2. Server SIEMPRE re-valida (seguridad)

**Ejemplo:**
```javascript
// ❌ MALO: Solo validación cliente
socket.on('task:delete', (taskId) => {
  Task.deleteOne({ _id: taskId }); // Cualquiera puede borrar cualquier cosa!
});

// ✅ BUENO: Validación servidor
socket.on('task:delete', async (taskId) => {
  const task = await Task.findById(taskId);
  if (!task) return socket.emit('error', 'Task not found');
  
  const board = await Board.findById(task.board);
  if (!board.members.includes(socket.user._id)) {
    return socket.emit('error', 'Forbidden');
  }
  
  if (task.createdBy !== socket.user._id && board.owner !== socket.user._id) {
    return socket.emit('error', 'Only creator or owner can delete');
  }
  
  await task.deleteOne();
  io.to(`board:${board._id}`).emit('task:deleted', taskId);
});
```

**Por qué es crítico:** Cliente puede ser manipulado (DevTools). Server es la única fuente de verdad.