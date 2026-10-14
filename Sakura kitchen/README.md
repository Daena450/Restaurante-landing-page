# 🌸 Sakura Kitchen – Sistema de Gestión de Productos

Aplicación web para restaurante de comida japonesa con CRUD completo de productos.

## Tecnologías utilizadas
- **Python** + **Flask** (backend)
- **SQLite** (base de datos relacional)
- **HTML5** + **CSS3** + **JavaScript**
- **Bootstrap 5** (diseño responsivo)
- **Font Awesome** (íconos)

## Modelo Entidad–Relación (tabla `productos`)

| Campo          | Tipo     | Descripción                        |
|----------------|----------|------------------------------------|
| id             | INTEGER  | Clave primaria autoincremental     |
| nombre         | TEXT     | Nombre del producto                |
| descripcion    | TEXT     | Descripción detallada              |
| categoria      | TEXT     | Categoría (Sushi, Ramen, etc.)     |
| precio         | REAL     | Precio en MXN                      |
| cantidad       | INTEGER  | Stock disponible                   |
| imagen_url     | TEXT     | URL de imagen (opcional)           |
| disponible     | INTEGER  | 1 = activo, 0 = no disponible      |
| fecha_creacion | TIMESTAMP| Fecha de registro automática       |

## Instalación y ejecución

```bash
# 1. Instalar dependencias
pip install -r requirements.txt

# 2. Ejecutar la aplicación
python app.py
```

Abre tu navegador en: **http://127.0.0.1:5000**

## Funcionalidades
- 📋 Catálogo de productos con tarjetas visuales
- 🔍 Búsqueda por nombre o descripción
- 🏷️ Filtro por categoría
- ➕ Agregar nuevo producto
- ✏️ Editar producto existente
- 🗑️ Eliminar producto con confirmación
- 📊 Estadísticas generales (total, stock, categorías)
- 🌐 API REST en `/api/productos`
