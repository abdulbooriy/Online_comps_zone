import database from '../config/database.js';
import bcrypt from 'bcrypt';
import { totp } from 'otplib';
import {userValidation, userUpdateValidation } from '../validations/user.validation.js';
import dotenv from 'dotenv';

dotenv.config();

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

async function sendOtp(req, res) {
    try {
        const { phone } = req.body;
        const [user] = await database.query('SELECT * FROM users WHERE phone = ?', [phone]);
        if(!user.length) {
            return res.status(401).send({message: 'Phone is wrong'});
        }
        const otp = totp.generate(process.env.secretKey + phone);
        res.status(200).send({message: 'Otp sended', otp});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function verifyOtp(req, res) {
    try {
        const { phone, otp } = req.body;
        const [chekPhone] = await database.query('SELECT * FROM users WHERE phone = ?', [phone]);
        if(!chekPhone.length) {
            return res.status(403).send({message: 'Phone is wrong'});
        }
        const checkOtp = totp.check(otp, process.env.secretKey + phone);
        if(!checkOtp) {
            return res.status(400).send({message: 'Otp is wrong'});
        }
        res.status(200).send({message: 'Welcome', data: chekPhone[0]});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function login(req, res) {
    try {
        const { phone, password } = req.body;
        const [chekPhone] = await database.query('SELECT * FROM users WHERE phone = ?', [phone]);
        if(!chekPhone.length) {
            return res.status(403).send({message: 'Phone wrong'});
        }
        const comparePassword = bcrypt.compareSync(password, chekPhone[0].password);
        if(!comparePassword) {
            return res.status(400).send({message: 'Password wrong'});
        }
        res.status(200).send({messaeg: 'Logged in successfully ✅', data: chekPhone[0]});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function findAll(req, res) {
    try {
        const [findAllUsers] = await database.query('SELECT * FROM users');
        if(!findAllUsers.length) {
            return res.status(404).send({message: 'Users not found'});
        }
        res.status(200).send({data: findAllUsers});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        const { error } = userUpdateValidation(req.body);
        if(error) {
            return res.status(403).send({message: error.details[0].message});
        }

        const keys = Object.keys(req.body);
        const values = Object.values(req.body);

        const queryKey = keys.map((k) => k += '= ?');

        const [updatedUser] = await database.query(`Update users SET ${queryKey.join(', ')} WHERE id = ?`, [...values, id]);
        if(!updatedUser.affectedRows) {
            return res.status(404).send({message: 'User id not found'});
        }
        const [result] = await database.query('SELECT * FROM users WHERE id = ?', [id]);
        res.status(200).send({message: 'User has updated', data: result});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function findOne(req, res) {
    try {
        const { id } = req.params;
        const [findOneUser] = await database.query('SELECT * FROM users WHERE id = ?', [id]);
        if(!findOneUser.length) {
            return res.status(404).send({message: 'User id not found and cannot update'});
        }
        res.status(200).send({data: findOneUser});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function remove(req, res) {
    try {
        const { id } = req.params;
        const [delUsers] = await database.query('DELETE FROM users WHERE id = ?', [id]);
        if(!delUsers.affectedRows) {
            return res.status(404).send({message: 'User id not found and cannot delete'});
        }
        res.status(200).send({message: 'User has deleted'});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

export { register, sendOtp, verifyOtp, login, findAll, update, findOne, remove };