# GitHub Pages Deployment Guide

Complete step-by-step guide to deploy your staging website on GitHub Pages with custom domain support.

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in (or create account)
2. Click the **+** icon (top right) → **New repository**
3. Repository settings:
   - **Name**: `staging-website` (or any name you prefer)
   - **Visibility**: Public (required for free GitHub Pages)
   - **DO NOT** initialize with README (we already have files)
4. Click **Create repository**

## Step 2: Push Your Code to GitHub

Run these commands in your terminal:

```bash
# Navigate to your project
cd /home/train/Downloads/staging-website

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Elite Home Staging website"

# Rename branch to main (GitHub's default)
git branch -M main

# Add your GitHub repository as remote (REPLACE with your URL)
git remote add origin https://github.com/YOUR-USERNAME/staging-website.git

# Push to GitHub
git push -u origin main
```

**Note**: Replace `YOUR-USERNAME` with your actual GitHub username!

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: Select `main` and `/ (root)`
   - Click **Save**
5. Wait 1-2 minutes for deployment

Your site will be live at: `https://YOUR-USERNAME.github.io/staging-website/`

## Step 4: Connect Custom Domain (GoDaddy)

### A. Configure GitHub Pages

1. In GitHub Pages settings, find "Custom domain" section
2. Enter your domain: `yourdomain.com` (or `www.yourdomain.com`)
3. Click **Save**
4. Check **Enforce HTTPS** (wait a few minutes if greyed out)

### B. Configure GoDaddy DNS

#### For Root Domain (yourdomain.com):

1. Log into [GoDaddy.com](https://godaddy.com)
2. Go to **My Products** → **DNS** (for your domain)
3. Add/Edit **A Records** to point to GitHub's IPs:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 600 |
| A | @ | 185.199.109.153 | 600 |
| A | @ | 185.199.110.153 | 600 |
| A | @ | 185.199.111.153 | 600 |

4. Add **CNAME** record for www:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | YOUR-USERNAME.github.io | 600 |

#### For Subdomain Only (www.yourdomain.com):

Just add one CNAME record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | YOUR-USERNAME.github.io | 600 |

5. **Save** all changes
6. Wait 10 minutes to 24 hours for DNS propagation

### C. Verify Custom Domain

1. In your repository, create a file named `CNAME` (no extension)
2. Add your domain on one line: `yourdomain.com`
3. Commit and push:
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

## Step 5: Verify Deployment

1. Visit `https://YOUR-USERNAME.github.io/staging-website/`
2. After DNS propagates, visit `https://yourdomain.com`
3. Both should show your staging website with SSL!

## Updating Your Website

Whenever you make changes:

```bash
cd /home/train/Downloads/staging-website

# Make your edits to HTML/CSS/JS files

# Commit changes
git add .
git commit -m "Update website content"

# Push to GitHub
git push

# Site updates automatically in 1-2 minutes!
```

## Troubleshooting

### "Repository not found" error
- Check your repository URL is correct
- Make sure you're logged into GitHub

### Custom domain not working
- Wait 24 hours for DNS propagation
- Use [DNS Checker](https://dnschecker.org) to verify DNS records
- Make sure CNAME file is in repository root

### HTTPS not available
- Wait 10-15 minutes after adding custom domain
- Ensure DNS is properly configured
- Try unchecking and rechecking "Enforce HTTPS"

### 404 Error
- Ensure `index.html` is in repository root (not in subfolder)
- Check branch is set to `main` in Pages settings

### Changes not showing
- Wait 1-2 minutes after push
- Hard refresh browser: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache

## Benefits of GitHub Pages

✅ **Free forever** (for public repositories)
✅ **Free SSL/HTTPS** (automatic)
✅ **Custom domain support**
✅ **Global CDN** (fast worldwide)
✅ **Automatic deployment** (push to update)
✅ **99.9% uptime** (backed by GitHub/Microsoft)
✅ **No server management**
✅ **Version control** (rollback anytime)

## Limitations

- ⚠️ Repository must be public (or paid GitHub Pro)
- ⚠️ 1GB repository size limit
- ⚠️ 100GB bandwidth per month (soft limit)
- ⚠️ Static sites only (no backend/databases)
- ⚠️ Contact form needs third-party service (see below)

## Contact Form Setup

Since GitHub Pages is static, your contact form won't work by default. Options:

### Option 1: Formspree (Easiest)
1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month)
2. Get your form endpoint
3. Update `contact.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### Option 2: Netlify Forms
Consider switching to Netlify instead - it has built-in form handling.

### Option 3: Google Forms
Embed a Google Form or use their API.

## Security Notes

✅ **Much safer than home hosting**
- No home IP exposure
- DDoS protection from GitHub
- Professional security team
- Automatic HTTPS
- No server to maintain

## Need Help?

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Community](https://github.community)
- Check repository "Actions" tab for deployment status

---

**Your website will be live, secure, and professional - all for free! 🚀**
