# Golden Rome Tour - Quick Reference

## 📊 Tours Available: 73

### By Category
| Category | Count | Price Range |
|----------|-------|-------------|
| Vatican | 19 | €19-€199 |
| Colosseum & Ancient Rome | 11 | €45-€299 |
| City & Walking | 20 | €28-€379 |
| Hidden Gems & Special | 14 | €1-€700 |
| **TOTAL** | **73** | **€1-€700** |

---

## 💰 Price Breakdown

| Price Range | Count | Examples |
|------------|-------|----------|
| €1-€50 | 19 | Stadium of Domitian (€1), Pantheon (€32-€35) |
| €51-€150 | 25 | Vatican Tours (€65-€99), Colosseum (€85) |
| €151-€300 | 8 | Golf Cart Tours (€220-€260), Private Tours |
| €301+ | 7 | Day Trips (€399-€700) |

---

## ⏱️ Duration Options

| Duration | Count | Examples |
|----------|-------|----------|
| Under 1.5h | 5 | Pantheon (1h), Stadium (45-60min) |
| 1.5-4h | 30+ | Most guided tours |
| 5-8h | 15+ | Full day tours |
| 24h+ | 4 | Hop-on Hop-off passes |

---

## 🏆 Top 5 Tours

1. **Early Morning Vatican Tour** - €79 (3h) - Skip crowds
2. **Colosseum Underground & Arena** - €89-€299 (3-3.5h) - VIP access
3. **Rome in a Day Combo** - €109-€119 (7-8h) - Vatican + Colosseum
4. **Vatican Museums Skip-the-Line** - €49-€69 (3h) - Most popular
5. **Golf Cart Tours** - €220-€260 (3h) - Fun & unique

---

## 🎯 Best Value Tours

| Tour | Price | Duration | Value |
|------|-------|----------|-------|
| Stadium of Domitian | €1 | 45-60min | Incredible |
| Pantheon Guided | €32-€35 | 1-1.5h | Excellent |
| Rome Bus Tour | €28-€34 | 3-24h | Great |
| Colosseum Tour | €45-€48 | 2.5h | Good |
| Vatican Museums | €49-€52 | 3h | Good |

---

## 🌟 Premium Experiences

| Tour | Price | Duration | Highlights |
|------|-------|----------|-----------|
| Orvieto Day Trip | €700 | 8-9h | Most exclusive |
| Assisi Day Trip | €400 | 9-10h | Spiritual |
| Monte Cassino | €400 | 8-9h | Historical |
| Tivoli Gardens | €399 | 7h | Scenic |
| Marmore Waterfalls | €399 | 8h | Nature |

---

## 📍 Tour Categories

### Vatican (19 tours)
- Skip-the-line tickets
- Guided tours
- Private tours
- Dome climbs
- Gardens tours

### Colosseum & Ancient Rome (11 tours)
- Underground tours
- Arena floor access
- Sunrise tours
- Combo tours
- Private tours

### City & Walking (20 tours)
- Walking tours
- Golf cart tours
- Bus tours
- Private car tours
- Food tours

### Hidden Gems (14 tours)
- Underground experiences
- Day trips
- Private tours
- Shopping tours
- Spiritual tours

---

## 🔧 Backend Configuration

**Status:** ✅ Connected and Working

```
DATA_SOURCE=payload
PAYLOAD_API_URL=https://admin.wondersofrome.com
PAYLOAD_API_KEY=g3UDzJOPpj-_EOLcFzyy2mhVp75H62zHwNrJL5Kb-hU
NEXT_PUBLIC_SITE_ID=goldenrometour
```

**Features:**
- 10-second timeout protection
- Automatic error handling
- Image storage: Cloudflare R2
- All tours have images

---

## 🚀 Quick Start

```bash
# 1. Navigate to project
cd goldenrometour

# 2. Start dev server
npm run dev

# 3. Visit homepage
# http://localhost:3000

# 4. See all 73 tours displayed
```

---

## 📋 Tour Status

- **Total Tours:** 73
- **Status:** All in "draft" mode
- **Images:** All have R2 images
- **Availability:** Ready for production

---

## 💡 Tips

1. **Budget travelers:** Look for €1-€50 tours
2. **Time-limited:** Choose 1-2 hour tours
3. **Full experience:** Book 7-8 hour combo tours
4. **Unique:** Try golf cart or food tours
5. **Luxury:** Private car or day trip tours

---

## 📞 Support

For issues:
1. Check `GOLDENROMETOUR_ALL_BACKEND_TOURS.md` for full tour list
2. Check `GOLDENROMETOUR_SETUP_COMPLETE.md` for setup details
3. Verify `.env` configuration
4. Check browser console for errors
5. Verify Payload API is responding

---

## 📈 Performance Notes

- **73 tours** may need pagination on homepage
- **Images** are optimized via Cloudflare R2
- **API calls** have 10-second timeout
- **Load time** should be under 3 seconds

---

**Last Updated:** May 2, 2026
**Backend:** Payload CMS (admin.wondersofrome.com)
**Tenant:** goldenrometour
