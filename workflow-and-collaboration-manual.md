# Git Workflow & Collaboration Manual

This document outlines the recommended Git workflow for collaborative development projects.

## Branch Strategy

### Main Branches
- **`main`** - Stable, production-ready code only
  - Contains tested and reviewed features
  - Always deployable
  - Protected from direct pushes
  
- **`dev`** - Integration branch for active development
  - Current development state
  - Features are merged here after review
  - May contain unstable code

### Feature Branches
- Created from `dev` branch
- Named descriptively: `feature/feature-name` or `fix/issue-description`
- Examples:
  - `feature/voting-interface`
  - `feature/smart-contract-updates`
  - `fix/wallet-connection-bug`
  - `docs/update-readme`

## Daily Workflow

### Starting New Work
```bash
# 1. Update your local dev branch
git checkout dev
git pull origin dev

# 2. Create a new feature branch
git checkout -b feature/your-feature-name

# 3. Work on your feature
# ... make changes ...

# 4. Commit your work
git add .
git commit -m "feat: add voting interface components"

# 5. Push your feature branch
git push origin feature/your-feature-name
```

### Commit Message Convention
Use conventional commits for clarity:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```bash
git commit -m "feat: implement wallet connection"
git commit -m "fix: resolve voting transaction error"
git commit -m "docs: update API documentation"
```

## Pull Request Process

### Creating Pull Requests
1. Push your feature branch to GitHub
2. Create a pull request from your feature branch to `dev`
3. Fill out the PR template with:
   - Clear description of changes
   - Testing performed
   - Any breaking changes
4. Request code review from team members

### Review Process
- At least one team member must review
- Address all review comments
- Ensure tests pass
- Merge only after approval

### Merging Strategy
- **Feature → dev**: After review and approval
- **dev → main**: Only when stable and ready for production

## Team Collaboration Guidelines

### Before Starting Work
1. Check if someone is already working on similar features
2. Discuss major changes with the team
3. Create issues for larger features

### During Development
1. Pull latest changes from `dev` regularly
2. Resolve conflicts early
3. Write clear commit messages
4. Test your changes thoroughly

### Code Review Etiquette
1. Be constructive and respectful
2. Focus on code quality, not personal style
3. Explain the "why" behind suggestions
4. Respond to reviews promptly

## Emergency Procedures

### Hotfixes for Production Issues
```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 2. Fix the issue and commit
git commit -m "fix: resolve critical voting bug"

# 3. Merge to main and dev
git checkout main
git merge hotfix/critical-bug-fix
git push origin main

git checkout dev
git merge hotfix/critical-bug-fix
git push origin dev

# 4. Delete hotfix branch
git branch -d hotfix/critical-bug-fix
git push origin --delete hotfix/critical-bug-fix
```

### Resolving Merge Conflicts
```bash
# 1. Pull latest changes
git pull origin dev

# 2. If conflicts occur, resolve them in your editor
# 3. Mark conflicts as resolved
git add .

# 4. Continue the merge/rebase
git commit  # for merge conflicts
# or
git rebase --continue  # for rebase conflicts
```

## Best Practices

### General Rules
- Never push directly to `main`
- Keep branches focused on single features
- Write meaningful commit messages
- Test before creating pull requests
- Delete merged feature branches

### Branch Protection
- Enable branch protection on GitHub for `main`
- Require pull request reviews
- Require status checks to pass
- Include administrators in enforcement

### Release Management
- Tag releases on `main` branch
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Useful Commands

### Branch Management
```bash
# List all branches
git branch -a

# Delete local branch
git branch -d feature-name

# Delete remote branch
git push origin --delete feature-name

# Rename branch
git branch -m old-name new-name
git push origin :old-name new-name
```

### History & Status
```bash
# See commit history
git log --oneline --graph

# See who changed what
git blame filename

# Check branch status
git status
```

## Setup for New Team Members

### Initial Setup
```bash
# 1. Clone the repository
git clone https://github.com/Edward-Manela-jr/blockchain-voting-dapp.git
cd blockchain-voting-dapp

# 2. Set up your development branch
git checkout dev
git pull origin dev

# 3. Create your first feature branch
git checkout -b feature/your-first-feature
```

### Configuration
```bash
# Set your Git identity (if not already set)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

---

## Quick Reference

| Branch | Purpose | Who can push |
|--------|---------|--------------|
| `main` | Production stable | Maintainers only |
| `dev` | Development integration | All team members |
| `feature/*` | New features | Individual developers |
| `hotfix/*` | Emergency fixes | Maintainers |

Remember: **When in doubt, ask!** Communication is key to successful collaboration.
