#!/bin/bash
# Environment Setup Script for Digital Builders
# This script helps set up the development environment

echo "🚀 Digital Builders - Environment Setup"
echo "=================================="

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

# Create .env.local from template
if [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
else
    echo "❌ .env.example not found!"
    exit 1
fi

echo ""
echo "📝 Next Steps:"
echo "1. Edit .env.local with your actual Supabase credentials"
echo "2. Get Supabase URL and keys from: https://supabase.com/dashboard"
echo "3. Get Resend API key from: https://resend.com/api-keys"
echo "4. Run 'npm run dev' to start development server"
echo ""
echo "🔗 Useful Links:"
echo "   Supabase Dashboard: https://supabase.com/dashboard"
echo "   Resend API Keys: https://resend.com/api-keys"
echo "   Project Documentation: ./docs/"
echo ""
echo "✨ Setup complete! Happy coding!"
