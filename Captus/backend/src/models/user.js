// User model - migrated from C# ENTITY\User.cs
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.name = data.name || '';
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  // Validate user data
  validate() {
    const errors = [];

    if (!this.email || !this.email.includes('@')) {
      errors.push('Valid email is required');
    }

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Name is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to database format
  toDatabase() {
    return {
      email: this.email,
      name: this.name,
      updated_at: new Date()
    };
  }

  // Create from database row
  static fromDatabase(row) {
    return new User({
      id: row.id,
      email: row.email,
      name: row.name,
      created_at: row.created_at,
      updated_at: row.updated_at
    });
  }

  // Create from Supabase auth user
  static fromSupabaseAuth(authUser) {
    return new User({
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || authUser.email.split('@')[0],
      created_at: authUser.created_at,
      updated_at: authUser.updated_at
    });
  }
}

export default User;