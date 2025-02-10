import database from "../config/database.js";
import productValidation from '../validations/product.validation.js';
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

async function findAll(req, res) {
  try {
    const [findAllProducts] = await database.query('SELECT * FROM product');
    if(!findAllProducts.length) {
      return res.status(400).send({message: 'Products not found'});
    }
    res.status(200).send({data: findAllProducts});
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

async function create(req, res) {
  try {
    const filename = req.file ? req.file.filename : null;
    const { error, value } = productValidation(req.body);
    if(req.file && error){
      fs.unlink(req.file.path, (e) => {
        if(e) {
          console.log(e.message);
        } else {
          console.log('image has been deleted');
        }
      });
      res.status(403).send({message: error.details[0].message});
      return
    }
    value.filename = filename;
    const { compNumber, price, type, status, characteristics } = value;
    const [createdProducts] = await database.query('INSERT INTO product (compNumber, price, type, image, status, characteristics) VALUES (?, ?, ?, ?, ?, ?)', [compNumber, price, type, filename, status, characteristics]);
    const [result] = await database.query('SELECT * FROM product WHERE id = ?', [createdProducts.insertId]);
    res.status(200).send({message: 'Product has been created', data: result});
  } catch (error) {
    if(req.file) {
      fs.unlink(req.file.path, (e) => {
        if(e) {
          console.log(e.message);
        } else {
          console.log('image has been deleted');
        }
      });
    }
    res.status(500).send({ error_message: error.message });
  }
}

async function findOne(req, res) {
  try {
    const { id } = req.params;
    const [findOneProduct] = await database.query('SELECT * FROM product WHERE id = ?', [id]);
    if(!findOneProduct.length) {
      return res.status(404).send({message: 'Product id not found'});
    }
    res.status(200).send({data: findOneProduct});
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

async function update(req, res) {
  try {
    const filename = req.file ? req.file.filename : "";
    const { id } = req.params;
    const { error, value } = productValidation(req.body);
    if(req.file && error) {
      fs.unlink(req.file.path, (e) => {
        if(e) {
          console.log(e.message);
        } else {
          console.log('image has been deleted');
        }
      });
      res.status(403).send({message: error.details[0].message});
      return
    }
    value.image = filename;
    const keys = Object.keys(value);
    const values = Object.values(value);

    if (keys.length === 0) {
      return res.status(400).send({ message: 'data not found' });
    }

    const queryKey = keys.map((k) => `${k} = ?`).join(', ');
    const [updateProducts] = await database.query(`UPDATE product SET ${queryKey} WHERE id = ?`, [...values, id]);
    if(!updateProducts.affectedRows) {
      return res.status(404).send({message: 'Product id not found and cannot update'});
    }
    const [result] = await database.query('SELECT * FROM product WHERE id = ?', [id]);
    res.status(200).send({message: 'Product has been updated', data: result[0]});
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (e) => {
        if (e) {
          console.log(e.message);
        } else {
          console.log('image has been deleted');
        }
      })
    }
    res.status(500).send({ error_message: error.message });
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function remove(req, res) {
  try {
    const { id } = req.params;
    let [findImage] = await database.query('SELECT image FROM product WHERE id = ?', [id]);
        
    if(findImage.affectedRows == 0) {
        return res.status(404).send({message: 'Product id not found ❗'});
    }

    let imagePath = path.join(__dirname, '../uploads', findImage[0].image);
    const [delProducts] = await database.query('DELETE FROM product WHERE id = ?', [id]);

    if(!delProducts.affectedRows) {
      return res.status(404).send({message: 'Product id not found and cannot delete'});
    }
   
    fs.unlink(imagePath, (e) => {
      if(e) {
        console.log(e.message);
      } else {
        console.log('image has been deleted');
      }
    });

    res.status(200).send({message: 'Product has been deleted'});
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

export { findAll, create, findOne, update, remove };