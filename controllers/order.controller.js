import {orderValidation, orderUpdateValidation } from "../validations/order.validation.js";
import database from '../config/database.js';

async function findAll(req, res) {
    try {
        let { role } = req.user;
        if(role == 'admin') {
            let [allOrders] = await database.query('SELECT o.id, o.totalPrice, o.payment, o.status, JSON_ARRAYAGG(JSON_OBJECT("id", u.id, "name", u.name, "phone", u.phone, "password", u.password, "role", u.role)) as users FROM orders o LEFT JOIN users u ON o.userId = u.id GROUP BY o.id');
            if(!allOrders.length) {
                return res.status(404).send({message: "Orders are not available ❗"});
            }
            res.status(200).send({data: allOrders});   
        } else {
            res.status(405).send({message: "Not Allowed. Only an Admins can see All Orders ❗"});
        }
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function create(req, res) {
    try {
        let { role } = req.user;
        if(role == "admin" || role != "user") {
            let { error, value } = orderValidation(req.body);
            if(error) {
                return res.status(403).send({message: error.details[0].message});
            }
            const { userId, totalPrice, payment, status } = value;
            let [createOrders] = await database.query('INSERT INTO orders (userId, totalPrice, payment, status) VALUES (?, ?, ?, ?)', [userId, totalPrice, payment, status]);
            let [result] = await database.query('SELECT * FROM orders WHERE id = ?', [createOrders.insertId]);
            res.status(200).send({message: 'Orders created successfully', data: result});
        } else {
            res.status(405).send({message: 'Not allowed. Only an Admins and Users can create Orders'});
        }
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function findOne(req, res) {
    try {
        let { role } = req.user;
        let { id } = req.params;
        if(role == 'admin' || role == 'user') {
            let [findOneOrder] = await database.query('SELECT o.id, o.totalPrice, o.payment, o.status, JSON_ARRAYAGG(JSON_OBJECT("id", u.id, "name", u.name, "phone", u.phone, "password", u.password, "role", u.role)) as users FROM orders o LEFT JOIN users u ON o.userId = u.id WHERE o.id = ? GROUP BY o.id', [id]);
            if(!findOneOrder.length) {
                return res.status(404).send({message: "Order id not found ❗"});
            }
            res.status(200).send({data: findOneOrder});
        } else {
            res.status(405).send({message: 'Not allowed. Only an Admins and Users can see one Order ❗'});
        }
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function update(req, res) {
    try {
        let { role } = req.user;
        let { id } = req.params;
        if(role == 'admin') {
            const { error, value } = orderUpdateValidation(req.body);
            if(error) {
                return res.status(403).send({message: error.details[0].message});
            }
            let keys = Object.keys(value);
            let values = Object.values(value);

            let queryKey = keys.map((k) => `${k} = ?`).join(', ');
            let [updateOrders] = await database.query(`UPDATE orders SET ${queryKey} WHERE id = ?`, [...values, id]);
            if(!updateOrders.affectedRows) {
                return res.status(404).send({message: 'Order id not found ❗'});
            }
            let [result] = await database.query('SELECT * FROM orders WHERE id = ?', [id]);
            res.status(200).send({message: "Order updated successfully", data: result});
        } else {
            res.status(405).send({message: 'Not allowed. Only an Admins can be update Orders ❗'});
        }
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function remove(req, res) {
    try {
        let { role } = req.user;
        let { id } = req.params;

        if(role == 'admin') {
            let [deleteOrders] = await database.query('DELETE FROM orders WHERE id = ?', [id]);
            if(!deleteOrders.affectedRows) {
                return res.status(404).send({message: 'Order id not found and cannot delete it ❗'});
            }
            res.status(200).send({message: 'Order deleted successfully'});
        } else {
            res.status(405).send({messsage: 'Not allowed. Only an Admins can be delete ❗'});
        }
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

export { findAll, create, findOne, update, remove };