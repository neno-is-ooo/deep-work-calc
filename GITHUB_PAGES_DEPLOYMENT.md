# GitHub Pages Deployment Guide

## Setup Instructions

### 1. Update the base path in vite.config.ts
Edit the `base` property to match your repository name:
```javascript
base: '/your-repo-name/',
```

For example, if your repo URL is `https://github.com/yourusername/deepwork-calc`, then use:
```javascript
base: '/deepwork-calc/',
```

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Navigate to Settings → Pages
3. Under "Build and deployment", select:
   - Source: **GitHub Actions**

### 4. Deploy
The site will automatically deploy when you push to the main branch.

You can also manually trigger deployment:
1. Go to Actions tab in your repository
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

### 5. Access Your Site
Your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

## Manual Deployment (Alternative)

If you prefer manual deployment using gh-pages:

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Deploy:
```bash
npm run deploy
```

## Custom Domain (Optional)

If you want to use a custom domain like `deepwork-calc.meaning.systems`:

1. Create a `CNAME` file in the `public` folder with your domain:
```
deepwork-calc.meaning.systems
```

2. Configure your DNS:
   - Add a CNAME record pointing to `YOUR_USERNAME.github.io`
   - Or add A records pointing to GitHub's IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

3. Update vite.config.ts:
```javascript
base: '/', // Use root path for custom domain
```

4. In GitHub repository settings → Pages:
   - Add your custom domain
   - Enable "Enforce HTTPS"

## Troubleshooting

- If the site shows 404, check that the `base` path in vite.config.ts matches your repo name
- If assets don't load, ensure all paths are relative
- Clear browser cache if changes don't appear
- Check Actions tab for deployment status and errors