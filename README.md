# TP6 – EcoHarmony Park

Aplicación web para consultar fechas disponibles y comprar entradas para EcoHarmony Park. El repositorio está organizado como un monorepo con npm workspaces: el frontend y la API se mantienen en `apps/`.

## Tecnologías

- **Frontend:** React, JavaScript y Vite.
- **Backend:** Node.js y Express.
- **Pruebas:** Jest, con pruebas de dominio y de la API.


## Estructura del proyecto

```text
.
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── domain/
│   │   │   │   ├── compras/       # Servicio y procesamiento de compras
│   │   │   │   ├── confirmacion/  # Resumen y datos del correo de confirmación
│   │   │   │   ├── entradas/      # Validaciones de cantidad y límites
│   │   │   │   ├── fechas/        # Calendario, horario y validaciones de fecha
│   │   │   │   ├── pagos/         # Formas de pago y estados de transacción
│   │   │   │   ├── precios/       # Tarifas, descuentos y totales
│   │   │   │   ├── usuarios/      # Validaciones de usuario
│   │   │   │   └── visitantes/    # Validaciones de visitantes
│   │   │   ├── app.js             # Configuración de Express y rutas de la API
│   │   │   └── server.js          # Inicio del servidor HTTP
│   │   ├── tests/                 # Pruebas agrupadas por dominio y API
│   │   │   └── helpers/           # Datos y utilidades compartidas por las pruebas
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── components/        # Espacio para componentes reutilizables
│       │   ├── pages/             # Espacio para pantallas
│       │   ├── services/api.js    # Comunicación con la API
│       │   ├── App.jsx            # Flujo de compra e interfaz principal
│       │   ├── app.css            # Estilos de la aplicación
│       │   └── main.jsx           # Punto de entrada de React
│       ├── index.html
│       ├── vite.config.js         # Servidor de desarrollo y proxy de /api
│       └── package.json
├── docs/
│   ├── CONTRIBUTING.md            # Convenciones de ramas, commits y contribución
│   └── Guías de estilo de Airbnb
├── package.json                  # Workspaces y comandos compartidos
├── package-lock.json
└── README.md
```

## Desarrollo local

Se requiere Node.js 20.19 o posterior (también funciona con Node.js 22.12+ y 24) y npm.

Desde la raíz del repositorio, instalar las dependencias:

```bash
npm install
```

Iniciar frontend y backend juntos:

```bash
npm run dev
```

También se pueden iniciar por separado, cada uno en una terminal:

```bash
npm run dev:backend
npm run dev:frontend
```

El frontend queda disponible en `http://localhost:5173` y la API en `http://localhost:3001`. Vite reenvía las solicitudes `/api` al backend.

Comandos adicionales disponibles desde la raíz:

```bash
npm test          # Ejecuta las pruebas del backend
npm run build     # Genera la compilación de producción del frontend
npm run lint      # Revisa el código de apps/
```

## Funcionalidades implementadas

- Calendario de visitas: el parque cierra los lunes, el 25 de diciembre y el 1 de enero. Se puede reservar desde el día actual hasta un mes calendario adelante; la compra para el mismo día está habilitada hasta las 17:30 (hora local del servidor).
- Compra de 1 a 10 entradas por transacción, con precio Regular de $10.000 o VIP de $20.000. Hasta los 3 años inclusive la entrada es gratuita; entre 4 y 15 años, y desde los 60 años inclusive, se aplica un descuento del 50 %.
- Flujo de pago simulado: la tarjeta permite simular aprobación, rechazo y reintento; el efectivo queda pendiente hasta validar el pago en boletería.
- La sesión usa un usuario de prueba configurado en el backend; no hay pantallas de registro ni de inicio de sesión.
- La confirmación y el correo se representan dentro de la aplicación. No se envía correo real ni se genera el PDF mostrado como adjunto.

## API principal

- `GET /api/health`, `GET /api/horario` y `GET /api/calendario`
- `POST /api/compras/cotizacion` y `POST /api/compras`
- `GET /api/compras/:id`
- `POST /api/compras/:id/pago`, `POST /api/compras/:id/reintento` y `POST /api/compras/:id/validacion-boleteria`

## Contribuir

Las convenciones para ramas, commits y flujo de trabajo están en [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md). Las guías de estilo de JavaScript y React están en la carpeta `docs/`.
