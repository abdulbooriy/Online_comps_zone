import database from '../config/database.js';
import bcrypt from 'bcrypt';
import { totp } from 'otplib';
import {userValidation, userUpdateValidation } from '../validations/user.validation.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

async function sendOtp(req, res) {
    try {
        const { phone } = req.body;
        const otp = totp.generate(process.env.secretKey + phone);
        res.status(200).send({message: 'Otp sended', otp});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function verifyOtp(req, res) {
    try {
        const { phone, otp } = req.body;
        const checkOtp = totp.check(otp, process.env.secretKey + phone);
        if(!checkOtp) {
            return res.status(400).send({message: 'Otp or Phone number wrong'});
        }
        res.status(200).send({message: 'Otp verified successfully ✅, You can register'});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function register(req, res) {
    try {
        const { error, value } = userValidation(req.body);
        if(error){
            return res.status(403).send({message: error.details[0].message});
        }
        const { name, phone, password, role } = value;
        const [user] = await database.query('SELECT * FROM users WHERE phone = ?', [phone]);
        if(user.length) {
            return res.status(400).send({message: 'This account already exists'});
        }
        const hashPaasword = bcrypt.hashSync(password, 10);
        await database.query('INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)', [name, phone, hashPaasword, role]);
        res.status(200).send({message: 'Registered successfully ✅'});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function login(req, res) {
    try {
        const { phone, password } = req.body;
        const [user] = await database.query('SELECT * FROM users WHERE phone = ?', [phone]);
        if(!user.length) {
            return res.status(403).send({message: 'Phone number wrong'});
        }
        const comparePassword = bcrypt.compareSync(password, user[0].password);
        if(!comparePassword) {
            return res.status(400).send({message: 'Password wrong'});
        }
        const token = jwt.sign({id: user[0].id, phone: user[0].phone, role: user[0].role}, process.env.JWT_SECRET_KEY);
        res.status(200).send({messaeg: 'Logged in successfully ✅', access_token: token});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function findAll(req, res) {
    try {
        const { role } = req.user;
        if(role == 'admin') {
            const [findAllUsers] = await database.query('SELECT * FROM users');
            if(!findAllUsers.length) {
                return res.status(404).send({message: 'Users not found'});
            }
            res.status(200).send({data: findAllUsers});
        } else {
            res.status(405).send({message: 'Not allowed and cannot see All users'});
        }
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function create(req, res) {
    try {
        const { role } = req.user;
        const { error, value } = userValidation(req.body);
        if(error) {
            return res.status(403).send({message: error.details[0].message});
        }
        const { name, phone, password } = value;
        if(role == 'admin') {
            const newRole = req.body.role;
            const hashPaasword = bcrypt.hashSync(password, 10);
            const [createUser] = await database.query('INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)', [name, phone, hashPaasword, newRole]);
            const [result] = await database.query('SELECT * FROM users WHERE id = ?', [createUser.insertId]);

            res.status(200).send({message: 'User created', data: result});
        } else {
            res.status(405).send({message: "Not allowed and cannot create user"});
        }
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function update(req, res) {
    try {
        const { role } = req.user;
        const { id } = req.params;
        const { error } = userUpdateValidation(req.body);
        if(error) {
            return res.status(403).send({message: error.details[0].message});
        }

        const keys = Object.keys(req.body);
        const values = Object.values(req.body);

        const queryKey = keys.map((k) => k += '= ?');

        if(role == 'admin' || role == 'user') {
            const [updatedUser] = await database.query(`Update users SET ${queryKey.join(', ')} WHERE id = ?`, [...values, id]);
            if(!updatedUser.affectedRows) {
                return res.status(404).send({message: 'User id not found'});
            }
            const [result] = await database.query('SELECT * FROM users WHERE id = ?', [id]);
            res.status(200).send({message: 'User has been updated', data: result});
        } else {
            res.status(405).send({message: 'Not allowed and cannot update user'});
        }
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function findOne(req, res) {
    try {
        const { role } = req.user;
        const { id } = req.params;
        if(role == 'admin') {
            const [findOneUser] = await database.query('SELECT * FROM users WHERE id = ?', [id]);
            if(!findOneUser.length) {
                return res.status(404).send({message: 'User id not found ❗'});
            }
            res.status(200).send({data: findOneUser});
        } else {
            res.status(405).send({message: 'Not allowed and cannot see user, only an admin can see one user'});
        }
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function remove(req, res) {
    try {
        const { role } = req.user;
        const { id } = req.params;
        if(role == 'admin') {
            const [delUsers] = await database.query('DELETE FROM users WHERE id = ?', [id]);
            if(!delUsers.affectedRows) {
                return res.status(404).send({message: 'User id not found and cannot delete'});
            }
            res.status(200).send({message: 'User has been deleted'});
        } else {
            res.status(405).send({message: 'Users are not allowed and cannot be deleted, only an admin can delete users'});
        }
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

export { register, sendOtp, verifyOtp, login, findAll, create, update, findOne, remove };