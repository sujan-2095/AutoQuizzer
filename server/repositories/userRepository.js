import { getDatabase, saveDatabase } from '../database/db.js';

export const userRepository = {
  findByEmail(email) {
    const db = getDatabase();
    const result = db.exec('SELECT id, email, created_at FROM users WHERE email = ?', [email]);
    if (!result[0] || result[0].values.length === 0) {
      return null;
    }
    const [id, userEmail, createdAt] = result[0].values[0];
    return { id, email: userEmail, createdAt };
  },

  findById(id) {
    const db = getDatabase();
    const result = db.exec('SELECT id, email, created_at FROM users WHERE id = ?', [id]);
    if (!result[0] || result[0].values.length === 0) {
      return null;
    }
    const [userId, email, createdAt] = result[0].values[0];
    return { id: userId, email, createdAt };
  },

  createUser(email) {
    const db = getDatabase();
    db.run('INSERT INTO users (email) VALUES (?)', [email]);
    saveDatabase();
    return this.findByEmail(email);
  },
};

export default userRepository;
