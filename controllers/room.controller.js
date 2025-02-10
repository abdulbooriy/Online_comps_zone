import database from '../config/database.js';
import fs from 'fs';

async function findAll(req, res) {
    try {
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function create(req, res) {
    try {
        
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function findOne(req, res) {
    try {
        
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function update(req, res) {
    try {
        
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function remove(req, res) {
    try {
        
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

export { findAll, create, findOne, update, remove };