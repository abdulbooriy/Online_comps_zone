import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function verifytoken(req, res, next) {
  let header = req.header("Authorization").split(" ");
  let [_, token] = header;
  if (!token) {
    return res.status(404).send({ message: "Token not found ❗" });
  }
  try {
    let data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = data;
    next();
  } catch (error) {
    res.status(500).send({error_message: error.message});
  }
}

export default verifytoken;
