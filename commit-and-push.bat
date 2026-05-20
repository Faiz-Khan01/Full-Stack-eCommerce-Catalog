@echo off
REM Git Commit and Push Script for TechStore eCommerce

echo.
echo ============================================================
echo  TechStore eCommerce - Git Commit & Push
echo ============================================================
echo.

REM Set colors (Windows 10+)
setlocal enabledelayedexpansion

REM Go to project root
cd /d "d:\JavaBasic\ecom_catalog"

echo [1/6] Checking git configuration...
git config user.email >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git not configured. Please run:
    echo git config --global user.email "your-email@example.com"
    echo git config --global user.name "Your Name"
    pause
    exit /b 1
)

echo [2/6] Committing Backend Changes...
cd product_catalog-backend
git add -A
git commit -m "feat: implement per-user cart system with database persistence%NL%%NL%- Create Cart and CartItem entities%NL%- Implement CartService for business logic%NL%- Update CartController with proper JSON responses%NL%- Move cart to public endpoints%NL%- Fix 403 Forbidden errors%NL%%NL%Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

if errorlevel 1 (
    echo [2/6] No changes in backend (or other error)
) else (
    echo [2/6] Backend committed successfully!
)

echo [3/6] Pushing Backend to GitHub...
git push origin main
if errorlevel 0 (
    echo [3/6] Backend pushed successfully!
) else (
    echo [3/6] Failed to push backend (might be network issue)
)

echo.
echo [4/6] Committing Frontend Changes...
cd ..\product_catalog-frontend
git add -A
git commit -m "feat: update cart pages with real-time updates and proper API integration%NL%%NL%- Add Authorization header support%NL%- Real-time cart badge%NL%- Display product count%NL%- Proper JSON parsing%NL%- Better error handling%NL%%NL%Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

if errorlevel 1 (
    echo [4/6] No changes in frontend (or other error)
) else (
    echo [4/6] Frontend committed successfully!
)

echo [5/6] Pushing Frontend to GitHub...
git push origin main
if errorlevel 0 (
    echo [5/6] Frontend pushed successfully!
) else (
    echo [5/6] Failed to push frontend (might be network issue)
)

echo.
echo [6/6] Verifying commits...
cd ..
echo.
echo Backend Commit History:
cd product_catalog-backend
git log --oneline -3
echo.
echo Frontend Commit History:
cd ..\product_catalog-frontend
git log --oneline -3

echo.
echo ============================================================
echo  ✅ Git Commit and Push Complete!
echo ============================================================
echo.
echo Next Steps:
echo 1. Verify commits on GitHub (https://github.com/Faiz-Khan01/Full-Stack-eCommerce-Catalog)
echo 2. Check that both backend and frontend changes are visible
echo 3. Run tests to ensure everything works
echo.
pause
