# Basketball Movement Intelligence Platform Setup Guide

## 🚀 Quick Start with Supabase

### Step 1: Set up Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or use your existing "DatDatIt ORG" project
3. Get your project URL and API keys from Settings > API

### Step 2: Configure Database

1. Open the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql` into the editor
3. Run the SQL to create all tables, policies, and functions

### Step 3: Update Configuration

#### Frontend Configuration
Update `frontend/src/config/supabase.ts` with your actual Supabase URL:

```typescript
const supabaseUrl = 'https://your-actual-project-ref.supabase.co'
const supabaseAnonKey = 'sbp_539599b21db43f4644894d6d7d7906f422e00a30'
```

#### Backend Configuration
Create a `.env` file in the backend directory:

```env
SUPABASE_URL=https://your-actual-project-ref.supabase.co
SUPABASE_KEY=sbp_539599b21db43f4644894d6d7d7906f422e00a30
```

### Step 4: Run the Application

#### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Step 5: Test the Application

1. Open http://localhost:5173 in your browser
2. Click "Sign Up" to create a new account
3. Verify that authentication works
4. Test the dashboard and other features

## 🔧 Configuration Details

### Supabase Setup

1. **Authentication**: The app uses Supabase Auth for user management
2. **Database**: PostgreSQL with Row Level Security (RLS) policies
3. **Storage**: Video files stored in Supabase Storage bucket
4. **Real-time**: WebSocket subscriptions for live updates

### Environment Variables

#### Frontend (.env.local)
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Backend (.env)
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-service-role-key
REDIS_URL=redis://localhost:6379
ENVIRONMENT=development
```

### Database Schema

The database includes these main tables:
- `users` - User profiles and authentication
- `teams` - Basketball teams
- `players` - Individual players
- `sessions` - Game/practice sessions
- `player_stats` - Performance metrics
- `penalties` - Detected violations

### Security Features

- Row Level Security (RLS) policies for data access control
- JWT-based authentication
- Role-based permissions (coach, player, analyst, admin)
- Secure video storage with access controls

## 🎯 Next Steps

1. **Test Authentication**: Create accounts and verify login/logout
2. **Upload Videos**: Test the video upload functionality
3. **Add Sample Data**: Create teams and players for testing
4. **Configure Computer Vision**: Set up YOLOv8 and pose estimation
5. **Deploy**: Deploy to your preferred hosting platform

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Supabase URL is correct
2. **Authentication Fails**: Check your API keys and RLS policies
3. **Database Errors**: Verify the schema was created correctly
4. **Video Upload Issues**: Check storage bucket permissions

### Getting Help

- Check the Supabase logs in your dashboard
- Review the browser console for frontend errors
- Check the backend logs for API errors
- Verify all environment variables are set correctly

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
