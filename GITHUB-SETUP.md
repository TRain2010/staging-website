# GitHub Repository Setup Guide

Simple guide to push your staging website to GitHub as a regular project.

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in (or create free account)
2. Click **+** icon (top right) → **New repository**
3. Fill in details:
   - **Repository name**: `staging-website`
   - **Description**: Elite Home Staging Company Website
   - **Visibility**: Public (free) or Private (if you have GitHub Pro)
   - **DO NOT** check "Initialize with README" (we already have files)
4. Click **Create repository**
5. **Copy the repository URL** shown on the next page

## Step 2: Push Your Code to GitHub

Run these commands in your terminal:

```bash
# Navigate to project directory
cd /home/train/Downloads/staging-website

# Check git status
git status

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit - Elite Home Staging website"

# Rename branch to main
git branch -M main

# Add your GitHub repository as remote
# Replace YOUR-USERNAME and YOUR-REPO with your actual values
git remote add origin https://github.com/YOUR-USERNAME/staging-website.git

# Push to GitHub
git push -u origin main
```

**Important**: Replace `YOUR-USERNAME` with your GitHub username!

## Step 3: Verify Upload

1. Go to your repository on GitHub: `https://github.com/YOUR-USERNAME/staging-website`
2. You should see all your files listed
3. Your code is now backed up and version controlled!

## Daily Workflow - Updating Code

Whenever you make changes to your website:

```bash
# Check what changed
git status

# Add specific files
git add index.html css/style.js

# Or add all changes
git add .

# Commit with a descriptive message
git commit -m "Updated homepage hero section"

# Push to GitHub
git push
```

## Useful Git Commands

```bash
# View commit history
git log --oneline

# See what changed in files
git diff

# Undo changes to a file (before commit)
git checkout -- filename.html

# View remote repository URL
git remote -v

# Pull latest changes (if working from multiple computers)
git pull

# Create a new branch for experiments
git checkout -b new-feature

# Switch back to main branch
git checkout main

# Merge branch into main
git merge new-feature
```

## Authentication Options

### Option 1: HTTPS with Personal Access Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Give it a name: "Staging Website"
4. Select scopes: Check **repo** (full control)
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again!)
7. When pushing, use your token as password:
   - Username: your-github-username
   - Password: paste-your-token

### Option 2: SSH Keys

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key

# Change remote to SSH
git remote set-url origin git@github.com:YOUR-USERNAME/staging-website.git
```

## Repository Structure

Your GitHub repository will contain:

```
staging-website/
├── index.html              # Home page
├── about.html              # About page
├── services.html           # Services page
├── portfolio.html          # Portfolio page
├── contact.html            # Contact page
├── css/
│   └── style.css           # Styles
├── js/
│   └── script.js           # JavaScript
├── images/                 # Images folder
├── README.md               # Project documentation
├── GITHUB-SETUP.md         # This file
├── GITHUB-PAGES-SETUP.md   # GitHub Pages guide (if you want free hosting)
└── .gitignore              # Files to ignore

# Docker files are excluded by .gitignore
```

## Benefits of Using GitHub

✅ **Version Control** - Track all changes, rollback anytime
✅ **Backup** - Code is safe in the cloud
✅ **Collaboration** - Work with others easily
✅ **Portfolio** - Show your work to clients/employers
✅ **Free** - Unlimited public repositories
✅ **Professional** - Industry-standard tool

## Next Steps

### Option A: Keep It Simple (Current Setup)
- Just use GitHub for version control and backup
- Host using Docker on your machine (we already set that up)
- Or host elsewhere (Netlify, Cloudflare, etc.)

### Option B: Use GitHub Pages (Free Hosting)
- Follow `GITHUB-PAGES-SETUP.md` for free website hosting
- Your site goes live at `https://your-username.github.io/staging-website/`
- Connect custom domain for free

### Option C: Continue with Docker
- Your Docker setup still works
- You can deploy the same code from GitHub to any server
- Use GitHub as source, pull updates to your Docker container

## Troubleshooting

### Authentication Failed
- Use Personal Access Token (not your password)
- Or set up SSH keys

### Remote Already Exists
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/staging-website.git
```

### Conflicts When Pushing
```bash
git pull --rebase origin main
git push
```

### Want to Start Over
```bash
# This removes git history (careful!)
rm -rf .git
git init
git add .
git commit -m "Fresh start"
```

## .gitignore Explanation

We've excluded Docker files from the repository because:
- GitHub Pages doesn't need them
- Other hosting services don't need them
- Keeps repository focused on website code
- Docker files are only for local development

If you want to include them (for deployment elsewhere):

```bash
# Edit .gitignore and remove these lines:
# Dockerfile
# docker-compose.yml
# nginx.conf

# Then commit:
git add .gitignore Dockerfile docker-compose.yml nginx.conf
git commit -m "Include Docker configuration"
git push
```

## Resources

- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

**Your code is now on GitHub! 🎉**

Run the commands above to push your website to the cloud.
