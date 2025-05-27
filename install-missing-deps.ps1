# This script installs missing dependencies causing build errors
# Focused on the packages identified in the error logs

# First, install refractor which is the main package causing build errors
pnpm add refractor

# If needed, add additional packages that might be causing issues
pnpm add copy-to-clipboard toggle-selection @portabletext/block-tools @portabletext/to-html
