# WordPress-like Blog Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the project root with the following variables:

```env
# Database (MongoDB)
DATABASE_URL="mongodb://localhost:27017/blog_db"
# For MongoDB Atlas (cloud):
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/blog_db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Service (for invitations)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@yourblog.com"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Your Blog"
```

### 2. Database Setup

```bash
# Install MongoDB locally or use MongoDB Atlas (cloud)
# For local installation: https://docs.mongodb.com/manual/installation/

# MongoDB doesn't require migrations like SQL databases
# Just generate the Prisma client
npx prisma generate

# Push the schema to create collections
npx prisma db push

# Optional: Seed with sample data
npx prisma db seed
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add these redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your blog!

## 📁 Project Structure

```
your-blog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── posts/         # Blog posts CRUD
│   │   │   ├── comments/      # Comments management
│   │   │   ├── invites/       # Author invitations
│   │   │   └── users/         # User management
│   │   ├── posts/             # Blog pages
│   │   │   ├── page.tsx       # Posts listing
│   │   │   └── [slug]/        # Individual post
│   │   ├── page.tsx           # Homepage
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # Basic UI components
│   │   ├── layout/            # Layout components
│   │   └── post-card.tsx      # Blog post preview
│   ├── lib/
│   │   ├── prisma.ts          # Database client
│   │   ├── auth.ts            # Auth configuration
│   │   ├── email.ts           # Email utilities
│   │   └── utils.ts           # Helper functions
│   └── types/
│       └── next-auth.d.ts     # Auth type extensions
├── prisma/
│   └── schema.prisma          # Database schema
└── package.json
```

## 🔑 Key Features

### ✅ Implemented
- **Authentication**: Google OAuth with NextAuth.js
- **User Roles**: Admin, Author, Reader with proper permissions
- **Blog Posts**: CRUD operations with rich content support
- **Comments**: Moderated commenting system
- **Invitations**: Admin can invite authors via email
- **Responsive Design**: Mobile-first with Tailwind CSS
- **SEO-Friendly**: Proper meta tags and slug URLs

### 🚧 Next Steps to Complete

1. **Admin Dashboard** (`/admin`)
2. **Post Editor** with rich text editing
3. **Comment Form** for authenticated users
4. **File Upload** for images
5. **Email Templates** for invitations
6. **Search Functionality**
7. **Social Sharing** buttons

## 🛠 API Endpoints

### Posts
- `GET /api/posts` - List posts with pagination
- `POST /api/posts` - Create new post (author/admin)
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post (author/admin)
- `DELETE /api/posts/[id]` - Delete post (author/admin)

### Comments
- `GET /api/comments?postId=[id]` - Get post comments
- `POST /api/comments` - Create comment (authenticated)
- `PUT /api/comments/[id]` - Moderate comment (admin/author)
- `DELETE /api/comments/[id]` - Delete comment (admin/author)

### Invitations
- `GET /api/invites` - List invites (admin)
- `POST /api/invites` - Send invitation (admin)
- `GET /api/invites/verify?code=[code]` - Check invite validity
- `POST /api/invites/verify` - Use invitation code

### Users
- `GET /api/users` - List users (admin)
- `PUT /api/users?id=[id]` - Update user role (admin)

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production
```env
# For MongoDB Atlas (recommended for production)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/blog_db"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
# ... other variables
```

## 📝 Creating Your First Admin User

After deployment, you'll need to manually create an admin user in the database:

```sql
-- Connect to your database and run:
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@gmail.com';
```

Then you can use the admin panel to invite other authors!

## 🎨 Customization

- **Styling**: Modify `src/app/globals.css` and Tailwind classes
- **Branding**: Update `NEXT_PUBLIC_APP_NAME` in environment variables
- **Email Templates**: Customize in `src/lib/email.ts`
- **Database Schema**: Modify `prisma/schema.prisma` and run migrations

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**: Ensure MongoDB is running and DATABASE_URL is correct
2. **Google OAuth**: Check client ID/secret and redirect URIs
3. **Email Sending**: Verify SMTP credentials and settings
4. **Prisma Client**: Run `npx prisma generate` after schema changes

### Reset Database
```bash
# For MongoDB, just drop collections and recreate
npx prisma db push --force-reset
npx prisma generate
```

## 🤝 Contributing

Feel free to submit issues and pull requests! This is a fully functional WordPress-like blog system built with modern technologies.

---

**Happy Blogging! 🎉** 