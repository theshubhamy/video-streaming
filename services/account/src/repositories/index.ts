import { client } from '../config/db';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
}
interface Subscription {
  id: string;
  userId: string;
  tier: string;
  ended_at: string | null;
}
export const findUsers = async () => {
  let res = await client.query('SELECT * FROM users');
  return res;
};
export const findOneUser = async (key: string, value: string) => {
  let allowedKeys = ['id', 'email', 'phone'];
  if (!allowedKeys.includes(key)) {
    throw new Error('Invalid column key');
  }
  let res = await client.query(
    `SELECT * FROM users WHERE ${key} = $1 LIMIT 1`,
    [value],
  );
  return res.rows[0];
};
export const CreateUser = async (user: User) => {
  const queryText =
    'INSERT INTO users(id,name, email,phone,password_hash) VALUES($1,$2,$3,$4,$5) RETURNING *';
  const values = [
    user.id,
    user.name,
    user.email,
    user.phone,
    user.password_hash,
  ];
  let res = await client.query(queryText, values);
  return res;
};

export const CreateSubscription = async (item: Subscription) => {
  const queryText =
    'INSERT INTO users(id,user_id, tier,ended_at) VALUES($1,$2,$3,$4) RETURNING *';
  const values = [item.id, item.userId, item.tier, item.ended_at];
  let res = await client.query(queryText, values);
  return res;
};
