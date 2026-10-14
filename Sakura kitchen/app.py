from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import sqlite3
import os

app = Flask(__name__)
app.secret_key = 'sakura_secret_2024'

DATABASE = 'restaurante.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT NOT NULL,
            categoria TEXT NOT NULL,
            precio REAL NOT NULL,
            cantidad INTEGER NOT NULL,
            imagen_url TEXT,
            disponible INTEGER DEFAULT 1,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Insertar datos de ejemplo si la tabla está vacía
    cursor.execute('SELECT COUNT(*) FROM productos')
    if cursor.fetchone()[0] == 0:
        productos_iniciales = [
            ('Sushi Salmón', 'Delicado nigiri de salmón fresco con arroz de sushi sazonado', 'Sushi', 85.00, 50, 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400', 1),
            ('Ramen Tonkotsu', 'Caldo de cerdo cremoso con fideos, chashu, huevo marinado y nori', 'Sopas', 120.00, 30, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 1),
            ('Tempura Mix', 'Selección de camarones y verduras en tempura crujiente con salsa tentsuyu', 'Frituras', 95.00, 25, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', 1),
            ('California Roll', 'Roll clásico con cangrejo, aguacate y pepino, cubierto con tobiko', 'Rolls', 75.00, 40, 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400', 1),
            ('Gyoza', 'Dumplings japoneses rellenos de cerdo y verduras, dorados a la plancha', 'Entradas', 65.00, 35, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 1),
            ('Edamame', 'Vainas de soya al vapor con sal de mar, aperitivo tradicional japonés', 'Entradas', 40.00, 60, 'https://images.unsplash.com/photo-1554978754-c52a2e0a2b83?w=400', 1),
            ('Miso Soup', 'Sopa de miso con tofu, wakame y cebollín, acompañamiento clásico', 'Sopas', 35.00, 80, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', 1),
            ('Matcha Ice Cream', 'Helado artesanal de té verde matcha, servido con mochi de arroz', 'Postres', 55.00, 20, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', 1),
        ]
        cursor.executemany('''
            INSERT INTO productos (nombre, descripcion, categoria, precio, cantidad, imagen_url, disponible)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', productos_iniciales)

    conn.commit()
    conn.close()

# ── Rutas ──────────────────────────────────────────────

@app.route('/')
def index():
    conn = get_db()
    categoria = request.args.get('categoria', '')
    busqueda = request.args.get('busqueda', '')

    query = 'SELECT * FROM productos WHERE 1=1'
    params = []

    if categoria:
        query += ' AND categoria = ?'
        params.append(categoria)
    if busqueda:
        query += ' AND (nombre LIKE ? OR descripcion LIKE ?)'
        params.extend([f'%{busqueda}%', f'%{busqueda}%'])

    query += ' ORDER BY categoria, nombre'
    productos = conn.execute(query, params).fetchall()

    categorias = conn.execute('SELECT DISTINCT categoria FROM productos ORDER BY categoria').fetchall()
    stats = conn.execute('SELECT COUNT(*) as total, SUM(cantidad) as stock FROM productos').fetchone()
    conn.close()

    return render_template('index.html', productos=productos, categorias=categorias,
                           categoria_activa=categoria, busqueda=busqueda, stats=stats)

@app.route('/producto/nuevo', methods=['GET', 'POST'])
def nuevo_producto():
    if request.method == 'POST':
        nombre = request.form['nombre'].strip()
        descripcion = request.form['descripcion'].strip()
        categoria = request.form['categoria'].strip()
        precio = float(request.form['precio'])
        cantidad = int(request.form['cantidad'])
        imagen_url = request.form.get('imagen_url', '').strip()
        disponible = 1 if request.form.get('disponible') else 0

        conn = get_db()
        conn.execute('''
            INSERT INTO productos (nombre, descripcion, categoria, precio, cantidad, imagen_url, disponible)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (nombre, descripcion, categoria, precio, cantidad, imagen_url, disponible))
        conn.commit()
        conn.close()
        flash('✅ Producto agregado exitosamente.', 'success')
        return redirect(url_for('index'))

    return render_template('form_producto.html', producto=None, accion='Agregar')

@app.route('/producto/<int:id>/editar', methods=['GET', 'POST'])
def editar_producto(id):
    conn = get_db()
    producto = conn.execute('SELECT * FROM productos WHERE id = ?', (id,)).fetchone()

    if not producto:
        flash('Producto no encontrado.', 'danger')
        return redirect(url_for('index'))

    if request.method == 'POST':
        nombre = request.form['nombre'].strip()
        descripcion = request.form['descripcion'].strip()
        categoria = request.form['categoria'].strip()
        precio = float(request.form['precio'])
        cantidad = int(request.form['cantidad'])
        imagen_url = request.form.get('imagen_url', '').strip()
        disponible = 1 if request.form.get('disponible') else 0

        conn.execute('''
            UPDATE productos SET nombre=?, descripcion=?, categoria=?, precio=?, cantidad=?, imagen_url=?, disponible=?
            WHERE id=?
        ''', (nombre, descripcion, categoria, precio, cantidad, imagen_url, disponible, id))
        conn.commit()
        conn.close()
        flash('✏️ Producto actualizado correctamente.', 'success')
        return redirect(url_for('index'))

    conn.close()
    return render_template('form_producto.html', producto=producto, accion='Editar')

@app.route('/producto/<int:id>/eliminar', methods=['POST'])
def eliminar_producto(id):
    conn = get_db()
    conn.execute('DELETE FROM productos WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    flash('🗑️ Producto eliminado.', 'warning')
    return redirect(url_for('index'))


@app.route('/api/productos/categoria/<string:categoria>')
def api_por_categoria(categoria):
    conn = get_db()
    if categoria == 'all':
        productos = conn.execute('SELECT * FROM productos ORDER BY nombre').fetchall()
    else:
        productos = conn.execute(
            'SELECT * FROM productos WHERE categoria = ? ORDER BY nombre', (categoria,)
        ).fetchall()
    conn.close()
    return jsonify([dict(p) for p in productos])

@app.route('/api/productos')
def api_productos():
    conn = get_db()
    productos = conn.execute('SELECT * FROM productos ORDER BY nombre').fetchall()
    conn.close()
    return jsonify([dict(p) for p in productos])



@app.route('/api/stats')
def api_stats():
    conn  = get_db()
    stats = conn.execute('SELECT COUNT(*) as total, SUM(cantidad) as stock FROM productos').fetchone()
    cats  = conn.execute('SELECT COUNT(DISTINCT categoria) as n FROM productos').fetchone()
    conn.close()
    return jsonify({
        'total': stats['total'],
        'stock': stats['stock'] or 0,
        'categorias': cats['n']
    })

@app.route('/api/carrito/confirmar', methods=['POST'])
def confirmar_carrito():
    data   = request.get_json()
    items  = data.get('items', [])
    conn   = get_db()
    errores = []
    for item in items:
        pid = item['id']; qty = item['cantidad']
        p   = conn.execute('SELECT * FROM productos WHERE id=?', (pid,)).fetchone()
        if not p:
            errores.append(f'Producto #{pid} no encontrado.')
        elif p['cantidad'] < qty:
            errores.append(f'Stock insuficiente: {p["nombre"]} (disponible: {p["cantidad"]}).')
        else:
            conn.execute('UPDATE productos SET cantidad = cantidad - ? WHERE id=?', (qty, pid))
    if errores:
        conn.rollback(); conn.close()
        return jsonify({'ok': False, 'errores': errores}), 400
    conn.commit(); conn.close()
    return jsonify({'ok': True})

@app.route('/api/producto/<int:id>/stock')
def get_stock(id):
    conn = get_db()
    p = conn.execute('SELECT cantidad FROM productos WHERE id=?', (id,)).fetchone()
    conn.close()
    return jsonify({'id': id, 'cantidad': p['cantidad']}) if p else (jsonify({'error': 'No encontrado'}), 404)

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
