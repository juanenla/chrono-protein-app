## ChronoProtein · Feedback de usuarios

Este archivo recopila feedback enviado por personas que usan la app ChronoProtein.

- Cada feedback se guarda como un **bloque JSON independiente** dentro de un bloque de código markdown.
- El formato está pensado para que una IA pueda leer fácilmente todas las entradas, agruparlas y generar planes de acción de mejora para el sitio.

Formato esperado de cada entrada:

```json
{
  "id": "uuid-o-timestamp",
  "timestamp": "2026-03-06T12:34:56Z",
  "page": "dashboard.html",
  "type": "bug",
  "message": "Texto libre del feedback...",
  "user": {
    "name": "Nombre o alias",
    "email": "usuario@example.com"
  }
}
```

Cuando el sistema de feedback esté implementado, cada nuevo envío se agregará al final de este archivo como un bloque JSON con esta estructura.

