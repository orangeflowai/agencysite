#!/bin/bash

# Complete Audit Script - Runs all verification checks

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║              COMPLETE AUDIT - ALL WEBSITES & TOURS                 ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Make scripts executable
chmod +x audit-all-sites-tours.js verify-all-images.js check-frontend-tours.js

# Create output directory
OUTPUT_DIR="audit-results-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUTPUT_DIR"

echo -e "${CYAN}Results will be saved to: $OUTPUT_DIR${NC}"
echo ""

# Run audits
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PHASE 1: BACKEND TOUR AUDIT${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

node audit-all-sites-tours.js | tee "$OUTPUT_DIR/1-backend-tour-audit.txt"

echo ""
read -p "Press Enter to continue to Phase 2 (Image Verification)..."
echo ""

echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PHASE 2: IMAGE VERIFICATION${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

node verify-all-images.js | tee "$OUTPUT_DIR/2-image-verification.txt"

echo ""
read -p "Press Enter to continue to Phase 3 (Frontend Check)..."
echo ""

echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PHASE 3: FRONTEND VERIFICATION${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo ""

node check-frontend-tours.js | tee "$OUTPUT_DIR/3-frontend-verification.txt"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                    ║${NC}"
echo -e "${GREEN}║                    ✅ AUDIT COMPLETE!                               ║${NC}"
echo -e "${GREEN}║                                                                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Results saved to: $OUTPUT_DIR/${NC}"
echo ""
echo -e "${MAGENTA}Files created:${NC}"
ls -lh "$OUTPUT_DIR"
echo ""
echo -e "${CYAN}To view results:${NC}"
echo "  cat $OUTPUT_DIR/1-backend-tour-audit.txt"
echo "  cat $OUTPUT_DIR/2-image-verification.txt"
echo "  cat $OUTPUT_DIR/3-frontend-verification.txt"
echo ""
