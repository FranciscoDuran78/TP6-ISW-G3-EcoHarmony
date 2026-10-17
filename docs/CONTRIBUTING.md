# Convenciones del proyecto

Este documento es la **fuente de verdad** de cómo nombrar una rama, cómo hacer un commit o cuándo una tarea está terminada.

## 1. Ramas

No se trabaja sobre `main`. Se crea una rama por tarea, con este formato:

```
tipo/descripcion-corta
```

| Tipo    | Cuándo              | Ejemplo                      |
| ------- | ------------------- | ---------------------------- |
| `feat/` | Funcionalidad nueva | `feat/pantalla-login`        |
| `fix/`  | Corregir un bug     | `fix/calculo-importe`        |
| `test/` | Agregar tests       | `test/caracterizacion-login` |
| `docs/` | Documentación       | `docs/flujo-de-compra`       |

La descripción debe ser CORTA, en MINÚSCULAS y con GUIONES y el nombre debe ser EXPLICATIVO de los test y funcionalidades a implementar que dicha rama abarca.

---

## 2. Commits

Usamos un formato fijo, con la descripción en infinitivo.

La convención a utilizar es: 1 commit por cada etapa del TDD el cual abarque por funcionalidad.

```
tipo/descripcion-corta
```

### Tipos de commits TDD

```
red: <nombre del commit>
green: <nombre del commit>
refactor: <nombre del commit>
```

### Tipos de commits genéricos

```
feat: <nombre del commit>
fix: <nombre del commit>
test: <nombre del commit>
docs: <nombre del commit>
```

Un commit debería contar **una** cosa. Si tu commit necesita un "y" en la descripción, probablemente son dos commits.

No hace falta que cada commit sea perfecto, pero evitá los `asd`, `cambios`, `wip` o `ahora sí`.

---

## 3. El flujo de trabajo, paso a paso

Este es un ejemplo del circuito completo, desde que se selecciona un caso de prueba hasta que queda mergeada:

1. Seleccionar uno o varios casos de prueba.
2. **Actualizá tu `main`** y creá la rama:

```bash
   git checkout main
   git pull
   git checkout -b feat/pruebas-campo-fecha
```

3. **Trabaja y commiteá** con el formato de arriba. Commits chicos y seguido:

```bash
  git add .
  git commit -m "red: rechazar fecha vacia"
  ...
  ...
```

4. **Subí la rama:**

```bash
   git push -u origin feat/pruebas-campo-fecha
```

5. Abrir una "Pull Request" hacia `main`.
6. Pedir un review de tu "Pull Request". No mergees la tuya propia sin que alguien lo apruebe.
7. Luego de que sea revizada. Realizar el merge a main.

Si te trabás en cualquier paso y tenes dudas o inquietudes PREGUNTAR al grupo. Preguntar es lo esperado, no es señal de que no sabés.

---
