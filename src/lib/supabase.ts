import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables and check for wrong key type
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://elssomvrpowzhjdnhjcv.supabase.co' || supabaseAnonKey === 'sb_secret_yM-bWp9k6gIfDcqeIQCbbQ_ltpAf-9t') {
  console.warn('⚠️ Supabase environment variables not configured. Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
} else {
  // Check if user accidentally used the service_role key (which starts with eyJ... and is longer)
  // The anon key is shorter and safe for browser use
  // Service role keys typically are much longer and should NOT be used in the browser
  if (supabaseAnonKey.length > 200 || supabaseAnonKey.includes('service_role')) {
    console.error('❌ ERROR: You are using the SECRET/SERVICE_ROLE key! This is DANGEROUS and forbidden in browsers.');
    console.error('Please use the ANON/PUBLIC key from Supabase Dashboard → Settings → API → anon public');
    console.error('The anon key is shorter and safe for browser use. NEVER use service_role key in frontend code!');
    throw new Error('SECRET_KEY_DETECTED: Please use the ANON (public) key, not the service_role (secret) key. Check your .env file.');
  }
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Helper functions for database operations
export const db = {
  // User operations
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createUser(userData: any) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Task operations
  async getTasks(userId: string, date?: string) {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);
    
    if (date) {
      query = query.eq('date', date);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data ? data.map(mapTaskFromDb) : [];
  },

  async createTask(taskData: any) {
    const dbData = {
      user_id: taskData.userId,
      title: taskData.title,
      type: taskData.type,
      goal: taskData.goal,
      progress: taskData.progress,
      points: taskData.points,
      category: taskData.category,
      date: taskData.date,
      completed: taskData.completed,
      streak: taskData.streak,
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(dbData)
      .select()
      .single();
    
    if (error) throw error;
    return mapTaskFromDb(data);
  },

  async updateTask(taskId: string, updates: any) {
    const dbUpdates: any = {};
    if (updates.userId !== undefined) dbUpdates.user_id = updates.userId;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.goal !== undefined) dbUpdates.goal = updates.goal;
    if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
    if (updates.points !== undefined) dbUpdates.points = updates.points;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
    if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
    
    const { data, error } = await supabase
      .from('tasks')
      .update(dbUpdates)
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) throw error;
    return data ? mapTaskFromDb(data) : null;
  },

  async deleteTask(taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) throw error;
  },

  // Daily entry operations
  async getDailyEntry(userId: string, date: string) {
    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data ? mapDailyEntryFromDb(data) : null;
  },

  async createDailyEntry(entryData: any) {
    const dbData = {
      user_id: entryData.userId,
      date: entryData.date,
      tasks: entryData.tasks,
      notes: entryData.notes || '',
      mood: entryData.mood || '',
      memories: entryData.memories || '',
      completion_rate: entryData.completionRate || 0,
      points_earned: entryData.pointsEarned || 0,
    };
    
    const { data, error } = await supabase
      .from('daily_entries')
      .insert(dbData)
      .select()
      .single();
    
    if (error) throw error;
    return mapDailyEntryFromDb(data);
  },

  async updateDailyEntry(entryId: string, updates: any) {
    const dbUpdates: any = {};
    if (updates.userId !== undefined) dbUpdates.user_id = updates.userId;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.tasks !== undefined) dbUpdates.tasks = updates.tasks;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.mood !== undefined) dbUpdates.mood = updates.mood;
    if (updates.memories !== undefined) dbUpdates.memories = updates.memories;
    if (updates.completionRate !== undefined) dbUpdates.completion_rate = updates.completionRate;
    if (updates.pointsEarned !== undefined) dbUpdates.points_earned = updates.pointsEarned;
    
    const { data, error } = await supabase
      .from('daily_entries')
      .update(dbUpdates)
      .eq('id', entryId)
      .select()
      .single();
    
    if (error) throw error;
    return data ? mapDailyEntryFromDb(data) : null;
  },

  async getDailyEntriesRange(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data ? data.map(mapDailyEntryFromDb) : [];
  },
};

// Helper functions to map database column names to app property names
function mapTaskFromDb(data: any) {
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    type: data.type,
    goal: data.goal,
    progress: data.progress,
    points: data.points,
    category: data.category,
    date: data.date,
    completed: data.completed,
    streak: data.streak,
    createdAt: data.created_at,
  };
}

function mapDailyEntryFromDb(data: any) {
  return {
    id: data.id,
    userId: data.user_id,
    date: data.date,
    tasks: data.tasks,
    notes: data.notes,
    mood: data.mood,
    memories: data.memories,
    completionRate: parseFloat(data.completion_rate || 0),
    pointsEarned: data.points_earned || 0,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

