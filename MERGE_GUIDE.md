# Branch Merge Guide: Student Branches → Dev

## Overview
This guide shows how to merge changes from student branches into the main `dev` branch for collaborative development.

## Current Branch Structure
```
main                    (production)
├── dev                 (development)
├── student-1-smart-contracts
├── student-2-UI-and-wallet-integration
└── student-3-blockchain-infrastructure
```

## Prerequisites
- All student branches pushed to GitHub
- Clean working directory (no uncommitted changes)
- Git installed and configured

## Step-by-Step Merge Process

### Step 1: Update Local Repository
```bash
# Fetch latest changes from all branches
git fetch --all

# Update dev branch with latest changes
git checkout dev
git pull origin dev
```

### Step 2: Check Branch Status
```bash
# See current state of all branches
git branch -a

# Check differences between branches
git log --oneline --graph --decorate --all
```

### Step 3: Merge Student Branch 1 (Smart Contracts)
```bash
# Ensure you're on dev branch
git checkout dev

# Merge student-1 branch
git merge student-1-smart-contracts

# Check for conflicts
git status
```

**If Conflicts Occur:**
```bash
# See conflict files
git status

# Open conflicted files and resolve manually
# Look for <<<<<<<, =======, >>>>>>> markers

# After resolving conflicts
git add .
git commit -m "Resolve merge conflicts from student-1"
```

### Step 4: Merge Student Branch 2 (UI & Wallet)
```bash
# Still on dev branch
git merge student-2-UI-and-wallet-integration

# Check for conflicts
git status
```

### Step 5: Merge Student Branch 3 (Infrastructure)
```bash
# Still on dev branch
git merge student-3-blockchain-infrastructure

# Check for conflicts
git status
```

### Step 6: Test Merged Code
```bash
# Test the combined application
cd voting-dapp && npm test
cd ../voting-contract && npm test
```

### Step 7: Push Merged Changes
```bash
# Push the updated dev branch
git push origin dev
```

## Alternative: Pull Request Method (Recommended)

### Step 1: Create Pull Request on GitHub
1. Go to your GitHub repository
2. Click "Pull Requests" tab
3. Click "New pull request"
4. Select source: `student-1-smart-contracts`
5. Select target: `dev`
6. Click "Create pull request"

### Step 2: Review and Merge
1. Review changes in pull request
2. Check for any conflicts
3. Add reviewers if needed
4. Click "Merge pull request"
5. Select "Create a merge commit"
6. Confirm merge

### Step 3: Repeat for Other Branches
Create separate pull requests for:
- `student-2-UI-and-wallet-integration` → `dev`
- `student-3-blockchain-infrastructure` → `dev`

## Common Merge Scenarios

### Scenario 1: No Conflicts
```bash
git checkout dev
git merge student-1-smart-contracts
# Automatic merge succeeds
git push origin dev
```

### Scenario 2: File Conflicts
```bash
# Example: Both branches modified same file
git checkout dev
git merge student-1-smart-contracts

# Conflict in package.json
# <<<<<<< HEAD (dev branch)
#   "version": "1.0.0"
# =======
#   "version": "1.1.0"
# >>>>>>> student-1-smart-contracts

# Edit file to resolve
#   "version": "1.1.0"

git add package.json
git commit -m "Resolve version conflict in package.json"
```

### Scenario 3: Directory Conflicts
```bash
# Both created same folder with different contents
git checkout dev
git merge student-2-UI-and-wallet-integration

# Manual resolution required
# Keep both folders or merge contents
git add .
git commit -m "Resolve directory structure conflicts"
```

## Best Practices

### Before Merging
1. **Update branches**: Ensure all branches are up-to-date
2. **Run tests**: Verify code works before merging
3. **Communicate**: Let team know you're merging
4. **Backup**: Create a tag or branch before major merges

### During Merging
1. **One branch at a time**: Merge sequentially
2. **Resolve conflicts immediately**: Don't leave unresolved conflicts
3. **Test after each merge**: Verify functionality
4. **Clear commit messages**: Describe what was merged

### After Merging
1. **Push immediately**: Don't let merged code diverge
2. **Delete merged branches** (optional): Clean up completed branches
3. **Update documentation**: Record merge decisions
4. **Notify team**: Let others know dev is updated

## Advanced Merge Strategies

### Strategy 1: Squash Merge
```bash
# Combine all commits into one
git merge --squash student-1-smart-contracts
git commit -m "Add smart contracts functionality"
```

### Strategy 2: Rebase and Merge
```bash
# Rebase student branch onto dev first
git checkout student-1-smart-contracts
git rebase dev

# Then merge
git checkout dev
git merge student-1-smart-contracts
```

### Strategy 3: Merge All at Once
```bash
# Create a temporary merge branch
git checkout -b merge-all-branches
git merge student-1-smart-contracts
git merge student-2-UI-and-wallet-integration
git merge student-3-blockchain-infrastructure

# Test thoroughly, then merge to dev
git checkout dev
git merge merge-all-branches
git branch -d merge-all-branches
```

## Troubleshooting

### Issue: Merge Failed - Not Up to Date
```bash
# Update both branches first
git checkout student-1-smart-contracts
git pull origin student-1-smart-contracts

git checkout dev
git pull origin dev

# Then try merge again
git merge student-1-smart-contracts
```

### Issue: Too Many Conflicts
```bash
# Abort merge and try different approach
git merge --abort

# Consider rebase instead
git checkout student-1-smart-contracts
git rebase dev
```

### Issue: Accidentally Merged Wrong Branch
```bash
# Undo last merge
git reset --hard HEAD~1

# Or revert merge commit
git revert -m 1 HEAD
```

## Automation Script (Optional)
```bash
#!/bin/bash
# Auto-merge script for student branches

BRANCHES=("student-1-smart-contracts" "student-2-UI-and-wallet-integration" "student-3-blockchain-infrastructure")

git checkout dev
git pull origin dev

for branch in "${BRANCHES[@]}"; do
    echo "Merging $branch..."
    git merge $branch
    
    if [ $? -eq 0 ]; then
        echo "Successfully merged $branch"
    else
        echo "Merge failed for $branch - resolve conflicts manually"
        exit 1
    fi
done

git push origin dev
echo "All branches merged successfully!"
```

## Quick Reference Commands
```bash
# Update all branches
git fetch --all

# Switch to dev
git checkout dev

# Merge student branch
git merge student-1-smart-contracts

# Check status
git status

# Push merged changes
git push origin dev

# View merge history
git log --oneline --graph
```

## Final Steps
After successful merge:
1. **Test the combined application**
2. **Update documentation** if needed
3. **Notify team members**
4. **Consider merging to main** for production

Remember: Communication is key in collaborative development!
