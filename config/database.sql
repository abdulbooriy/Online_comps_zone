-- Active: 1738298208755@@127.0.0.1@3306@authorizations
CREATE DATABASE IF NOT EXISTS Online_comps_zone

USE Online_comps_zone

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM ('admin', 'user') NOT NULL DEFAULT 'user'
)

CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    compNumber INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    type ENUM ('strong', 'weak') NOT NULL,
    image VARCHAR(255) NOT NULL,
    status ENUM ('empty', 'inProccess') NOT NULL,
    characteristics VARCHAR(250) NOT NULL
)

CREATE TABLE room (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roomNumber INT,
    count INT NOT NULL,
    price DECIMAL(10, 2),
    image VARCHAR(255) NOT NULL,
    characteristics VARCHAR(250) NOT NULL,
    status ENUM ('empty', 'inProcess') NOT NULL DEFAULT 'empty'
)

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id),
    totalPrice DECIMAL(10, 2) NOT NULL,
    payment ENUM ('cash', 'card') NOT NULL,
    status ENUM ('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'
)

CREATE TABLE orderComp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    FOREIGN KEY (productId) REFERENCES product (id),
    orderId INT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders (id),
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    vipTime BOOLEAN NOT NULL DEFAULT FALSE,
    summa DECIMAL(10, 2) NOT NULL,
    roomId INT NOT NULL,
    FOREIGN KEY (roomId) REFERENCES room (id)
)