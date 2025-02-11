import orderCompValidation from "../validations/orderComp.validation.js";
import database from "../config/database.js";

async function findAll(req, res) {
  try {
    let { role } = req.user;
    if (role == "admin") {
      let [allorderComps] = await database.query("SELECT oc.id, oc.startTime, oc.endTime, oc.vipTime, oc.summa, oc.roomId, JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'compNumber', p.compNumber, 'price', p.price, 'type', p.type, 'image', p.image, 'status', p.status, 'characteristics', p.characteristics)) as products, JSON_ARRAYAGG(JSON_OBJECT('id', o.id, 'userId', o.userId, 'totalPrice', o.totalPrice, 'payment', o.payment, 'status', o.status)) as orders, JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'roomNumber', r.roomNumber, 'count', r.count, 'price', r.price, 'image', r.image, 'characteristics', r.characteristics, 'status', r.status)) as rooms FROM orderComp oc LEFT JOIN product p ON oc.productId = p.id LEFT JOIN orders o ON o.id = oc.orderId LEFT JOIN room r ON oc.id = r.id GROUP BY oc.id");
      res.status(200).send({ data: allorderComps });
    }
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

async function create(req, res) {
  try {
    let { role } = req.user;
    if (role == "admin") {
      let { error, value } = orderCompValidation(req.body);
      if (error) {
        return res.status(403).send({ message: error.details[0].message });
      }
      const { productId, orderId, startTime, endTime, vipTime, summa, roomId } =
        value;
      let [createOrderComp] = await database.query(
        "INSERT INTO orderComp (productId, orderId, startTime, endTime, vipTime, summa, roomId) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [productId, orderId, startTime, endTime, vipTime, summa, roomId]
      );
      let [result] = await database.query(
        "SELECT * FROM orderComp WHERE id = ?",
        [createOrderComp.insertId]
      );
      res
        .status(200)
        .send({ message: "OrderComp created successfully", data: result });
    } else {
      res.status(405).send({ message: "Not allowed ❗" });
    }
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

export { findAll, create };
