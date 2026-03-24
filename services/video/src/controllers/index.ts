import { Request, Response } from 'express';
import pool from '../models/video.model';

export const getVideoMetadata = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Video not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
