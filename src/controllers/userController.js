const pool = require('../config/db');

const getUsers = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required.'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: rows[0]
    });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (name or email) is required for update.'
      });
    }

    const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const updatedName = name || existingUser[0].name;
    const updatedEmail = email || existingUser[0].email;

    await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [updatedName, updatedEmail, id]
    );

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: rows[0]
    });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
