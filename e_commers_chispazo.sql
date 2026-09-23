gcreate database e_commer;

use e_commer;


CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(10),
    rol ENUM('CLIENTE', 'ADMIN') NOT NULL DEFAULT 'CLIENTE',
    img VARCHAR(255)
    
);

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    url_img VARCHAR(255) UNIQUE,
    datasheet VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
);

CREATE TABLE direcciones (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    estado VARCHAR(100) NOT NULL,
    colonia VARCHAR(100) NOT NULL,
    calle VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    cp VARCHAR(10) NOT NULL,

    CONSTRAINT fk_direccion_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
);

CREATE TABLE carritos (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_carrito_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
);

CREATE TABLE detalle_carrito (
    id_carrito INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,

    PRIMARY KEY (id_carrito, id_producto),

    CONSTRAINT fk_detalle_carrito
        FOREIGN KEY (id_carrito)
        REFERENCES carritos(id_carrito),

    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto)
);

CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_direccion INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    metodo_pago VARCHAR(50) NOT NULL,
    estado ENUM(
        'PENDIENTE',
        'PAGADO',
        'EN_PROCESO',
        'ENVIADO',
        'ENTREGADO',
        'CANCELADO'
    ) NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT fk_pedido_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario),

    CONSTRAINT fk_pedido_direccion
        FOREIGN KEY (id_direccion)
        REFERENCES direcciones(id_direccion)
);

CREATE TABLE detalle_pedido (
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    PRIMARY KEY (id_pedido, id_producto),

    CONSTRAINT fk_detalle_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES pedidos(id_pedido),

    CONSTRAINT fk_detalle_pedido_producto
        FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto)
);
