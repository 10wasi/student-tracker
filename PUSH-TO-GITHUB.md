# Push this project to GitHub

## 1. Create a new repository on GitHub

1. Go to **https://github.com/new**
2. Set **Repository name** (e.g. `student-performance-tracker`)
3. Choose **Public**, leave "Add a README" **unchecked**
4. Click **Create repository**

## 2. Connect and push from your PC

In PowerShell, from this project folder run (replace `YOUR_USERNAME` and `REPO_NAME` with your GitHub username and repo name):

```powershell
cd "c:\Users\Tajirz International\OneDrive\Desktop\Student Performance Tracker"

git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

**Example:** If your GitHub username is `johndoe` and repo name is `student-performance-tracker`:

```powershell
git remote add origin https://github.com/johndoe/student-performance-tracker.git
git branch -M main
git push -u origin main
```

When prompted, sign in with your GitHub account (browser or token).

## Optional: Set your Git identity (if not set)

```powershell
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

Then amend the last commit to use it:

```powershell
git commit --amend --reset-author --no-edit
git push -u origin main
```
