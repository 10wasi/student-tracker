# Using npm in PowerShell (when scripts are disabled)

If you see **"running scripts is disabled on this system"** when you run `npm install` or `npm run dev`, use **`npm.cmd`** instead of `npm`:

```powershell
# Install dependencies
npm.cmd install

# Start dev server
npm.cmd run dev
```

Or use the batch files (they always work):
- **`install.bat`** — installs dependencies
- **`run-dev.bat`** — starts the app at http://localhost:5173
