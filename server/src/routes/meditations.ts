import { Router } from 'express';
import type { Request, Response } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client.js';

const router = Router();

// GET /api/v1/meditations - List all meditations
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, duration, featured } = req.query;
    
    const client = getSupabaseClient();
    
    let query = client
      .from('meditations')
      .select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (duration) {
      query = query.eq('duration_minutes', parseInt(duration as string));
    }
    
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Get meditations error:', error);
      return res.status(500).json({ error: 'Failed to get meditations' });
    }
    
    res.json({
      meditations: data.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        durationMinutes: m.duration_minutes,
        category: m.category,
        scenario: m.scenario,
        audioUrl: m.audio_url,
        imageUrl: m.image_url,
        instructor: m.instructor,
        difficulty: m.difficulty,
        isFeatured: m.is_featured,
        playCount: m.play_count,
        createdAt: m.created_at
      }))
    });
  } catch (error) {
    console.error('Get meditations error:', error);
    res.status(500).json({ error: 'Failed to get meditations' });
  }
});

// GET /api/v1/meditations/categories - Get all categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('meditations')
      .select('category');
    
    if (error) {
      console.error('Get categories error:', error);
      return res.status(500).json({ error: 'Failed to get categories' });
    }
    
    const categories = [...new Set(data.map((r: any) => r.category))];
    
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// GET /api/v1/meditations/:id - Get single meditation
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('meditations')
      .select('*')
      .eq('id', parseInt(id))
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: 'Meditation not found' });
    }
    
    res.json({
      meditation: {
        id: data.id,
        title: data.title,
        description: data.description,
        durationMinutes: data.duration_minutes,
        category: data.category,
        scenario: data.scenario,
        audioUrl: data.audio_url,
        imageUrl: data.image_url,
        instructor: data.instructor,
        difficulty: data.difficulty,
        isFeatured: data.is_featured,
        playCount: data.play_count,
        createdAt: data.created_at
      }
    });
  } catch (error) {
    console.error('Get meditation error:', error);
    res.status(500).json({ error: 'Failed to get meditation' });
  }
});

// POST /api/v1/meditations/:id/play - Increment play count
router.post('/:id/play', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    
    const client = getSupabaseClient();
    
    // Get current play count
    const { data: current, error: fetchError } = await client
      .from('meditations')
      .select('play_count')
      .eq('id', parseInt(id))
      .single();
    
    if (fetchError || !current) {
      return res.status(404).json({ error: 'Meditation not found' });
    }
    
    // Update play count
    const { error: updateError } = await client
      .from('meditations')
      .update({ play_count: (current.play_count || 0) + 1 })
      .eq('id', parseInt(id));
    
    if (updateError) {
      return res.status(500).json({ error: 'Failed to update play count' });
    }
    
    res.json({ message: 'Play count updated' });
  } catch (error) {
    console.error('Update play count error:', error);
    res.status(500).json({ error: 'Failed to update play count' });
  }
});

export default router;
