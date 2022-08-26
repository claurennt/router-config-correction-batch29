const { nextTick } = require("process");
const db = require("../database/client");

const get_all_users = async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * from users");
    return res.status(200).send(rows);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
// username, password, firstname, lastname are required fields ,
const get_user_by_id = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const {
      rows: [user],
      rowCount,
    } = await db.query("SElECT * FROM users WHERE user_id = $1;", [id]);
    if (!rowCount) {
      return res.status(404).send(`User with id ${id} not found`);
    }
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const create_new_user = async (req, res, next) => {
  const { username, password, firstname, lastname } = req.body;

  try {
    const {
      rows: [createdUser],
      rowCount,
    } = await db.query(
      `INSERT INTO users(username, password, firstname, lastname)
    VALUES($1,$2,$3,$4) RETURNING*
    `,
      [username, password, firstname, lastname]
    );

    return res.status(200).send(createdUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const update_user = async (req, res) => {
  const { id } = req.params;
  const { username, password, firstname, lastname } = req.body;
  try {
    const {
      rows: [updatedUser],
      rowCount,
    } = await db.query(
      "UPDATE users SET username = $1, password = $2, firstname = $3, lastname = $4 WHERE user_id = $5 RETURNING *",
      [username, password, firstname, lastname, id]
    );
    if (!rowCount) {
      return res.status(404).send(`User with id ${id} not found`);
    }
    return res.status(201).send(updatedUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const update_one_field_of_user = async (req, res) => {
  const { id } = req.params;
  const [[key, value]] = Object.entries(req.body);

  try {
    const {
      rowCount,
      rows: [updatedUser],
    } = await db.query(
      `UPDATE users SET ${key}=$1 WHERE user_id=$2 RETURNING *`,
      [value, id]
    );

    if (!rowCount)
      return res.status(404).send(`The user with id ${id} does not exist`);
    return res.status(200).send(updatedUser);
  } catch (err) {
    next(err);
  }
};

const delete_one_user = async (req, res, next) => {
  const { id } = req.params;
  try {
    const {
      rowCount,
      rows: [deleteDUser],
    } = await db.query("DELETE FROM users WHERE user_id = $1", [id]);

    if (!rowCount)
      return res.status(404).send(`The user with id ${id} does not exist`);

    return res.status(200).send(deleteDUser);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  get_all_users,
  get_user_by_id,
  create_new_user,
  update_user,
  update_one_field_of_user,
  delete_one_user,
};
