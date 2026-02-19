#!/bin/bash
# AI SDR Frontend Deployment Script
# Run this script to deploy the frontend to Vercel

set -e

echo "🚀 AI SDR Frontend Deployment Script"
echo "==================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SUPABASE_URL="https://qazrfivyfrgfcnibilzo.supabase.co"
STRIPE_KEY="pk_test_51T2XMuEavt3frPE9bbV1fFVhuBcxtoauih0YVlunRCTGMGR3HMwXcuzBtdvCxy3QVuc3w6SaxdWo2ZwExuirpqx800Wrd4Anlv"

echo -e "${YELLOW}Supabase URL:${NC} $SUPABASE_URL"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Check if logged in
echo -e "${YELLOW}Checking Vercel login...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}Not logged in to Vercel${NC}"
    echo "Please run: vercel login"
    exit 1
fi

echo -e "${GREEN}✓ Logged in to Vercel${NC}"
echo ""

# Set environment variables
echo -e "${YELLOW}Setting environment variables...${NC}"
vercel env add VITE_SUPABASE_URL production <<< "$SUPABASE_URL"
vercel env add VITE_STRIPE_PUBLIC_KEY production <<< "$STRIPE_KEY"

echo -e "${GREEN}✓ Environment variables set${NC}"
echo ""

# Deploy
echo -e "${YELLOW}Deploying to Vercel...${NC}"
vercel --prod

echo ""
echo -e "${GREEN}===================================${NC}"
echo -e "${GREEN}✅ FRONTEND DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}===================================${NC}"
echo ""
echo "Next steps:"
echo "1. Note the deployed URL"
echo "2. Test the signup flow"
echo "3. Configure custom domain (optional)"
