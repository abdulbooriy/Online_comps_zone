import database from '../config/database.js';
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import {roomValidation, roomPatchValidation } from '../validations/room.validation.js';

async function findAll(req, res) {
    try {
        const { role } = req.user;
        if(role == 'admin' || role == 'user') {
            const [rooms] = await database.query('SELECT * FROM room');
            if(!rooms.length) {
                return res.status(404).send({message: 'Rooms are not available ❗'}); 
            }
            res.status(200).send({data: rooms});
        } else {
            res.status(405).send({message: 'Not allowed. Only an Admins and Users can see rooms ❗'});
        }
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function create(req, res) {
    try {
        const { role } = req.user;
        const filename = req.file ? req.file.filename : null;
        const { error, value } = roomValidation(req.body);
        if(req.file && error) {
            fs.unlink(req.file.path, (e) => {
                if(e) {
                    console.log(e.message);
                } else {
                    console.log('image deleted');
                }
            })

            res.status(403).send({message: error.details[0].message});
            return;
        }
        const { roomNumber, count, price, characteristics, status } = value;
        value.image = filename;
        if(role == 'admin') {
            const [createRooms] = await database.query('INSERT INTO room (roomNumber, count, price, image, characteristics, status) VALUES (?, ?, ?, ?, ?, ?)', [roomNumber, count, price, filename, characteristics, status]);
            const [result] = await database.query('SELECT * FROM room WHERE id = ?', [createRooms.insertId]);
            res.status(200).send({message: 'Room created', data: result});
        } else {
            res.status(405).send({message: 'Not allowed. Only an Admins can be create rooms ❗'});
        }
    } catch (error) {
        if(req.file) {
            fs.unlink(req.file.path, (e) => {
                if(e) {
                    console.log(e.message);
                }
            })
        }
        res.status(500).send({error_message: error.message});
    }
}

async function findOne(req, res) {
    try {
        const { id } = req.params;
        const { role } = req.user;
        if(role == 'admin') {
            let [findOneRoom] = await database.query('SELECT * FROM room WHERE id = ?', [id]);
            if(!findOneRoom.length) {
                return res.status(404).send({message: 'Room id not found ❗'});
            }
            res.status(200).send({message: findOneRoom});
        } else {
            res.status(405).send({message: 'Not allowed. Only an Admins can be see Room ❗'});
        }
    } catch (error){
        res.status(500).send({error_message: error.message});
    }
}

async function update(req, res) {
    try {
        const { role } = req.user;
        const { id } = req.params;

        if(role !== 'admin') {
            res.status(405).send({message: 'Not allowed. Only an Admins can be update Room ❗'});
        } else {
            const filename = req.file ? req.file.filename : null;
            const { error, value } = roomPatchValidation(req.body);

            if(req.file && error) {
                await fs.promises.unlink(req.file.path, (e) => {
                    if(e) {
                        console.log(e.message);
                    }
                });

                return res.status(403).send({message: error.details[0].message});
            }

            if (filename) {
                value.image = filename;
            }

            let keys = Object.keys(value);
            let values = Object.values(value);

            let queryKey = keys.map((k) => `${k} = ?`).join(', ');
            let [updatedRoom] = await database.query(`UPDATE room SET ${queryKey} WHERE id = ?`, [...values, id]);

            if(!updatedRoom.affectedRows) {
                return res.status(404).send({message: 'Room id not found ❗'});
            }
            let [result] = await database.query('SELECT * FROM room WHERE id = ?', [id]);
            res.status(200).send({message: 'Room update successfully', data: result});
        }
    } catch (error) {
        if(req.file) {
            await fs.promises.unlink(req.file.path, (e) => {
                if(e) {
                    console.log(e.message);
                }
            })
        }
        res.status(500).send({error_message: error.message});
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function remove(req, res) {
    try {
        const { role } = req.user;
        const { id } = req.params;
        let [findImage] = await database.query('SELECT image FROM room WHERE id = ?', [id]);
            
        if(findImage.affectedRows == 0) {
            return res.status(404).send({message: 'Image id not found ❗'});
        }
    
        if(role == 'admin') {
          let imagePath = path.join(__dirname, '../uploads', findImage[0].image);
          const [deleteRooms] = await database.query('DELETE FROM room WHERE id = ?', [id]);
    
          if(!deleteRooms.affectedRows) {
            return res.status(404).send({message: 'Room id not found and cannot delete ❗'});
          }
        
          fs.unlink(imagePath, (e) => {
            if(e) {
              console.log(e.message);
            }
          });
    
          res.status(200).send({message: 'Room has been deleted'});
        } else {
          res.status(405).send({message: 'Not allowed. Only an Admins can be delete Rooms ❗'});
        }
      } catch (error) {
        res.status(500).send({ error_message: error.message });
    }
}

export { findAll, create, findOne, update, remove };