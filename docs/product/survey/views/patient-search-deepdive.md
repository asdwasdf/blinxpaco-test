# Patient Search - Deep Dive

**Date:** 2026-10-06  
**Role:** Super Admin GB  
**Environment:** dev  
**URL:** `/paco/patient-search`

---

## Patient Search Page

### Entry Point
- Sidebar → Patient Search

### Header Stats
- Total patients: 495,081

### Search Controls
- Search textbox: "Search Patients..."
- Filters button
- Show archived checkbox

### Action Buttons
- Offline config
- Create new patient

### Grid Columns (30 columns)
1. Registration Type
2. Title
3. First Name
4. Middle Name
5. Last Name
6. Known as
7. Date of Birth
8. Date of Death
9. Gender
10. NHS Number
11. Patient Identifier
12. Marital Status
13. Ethnicity
14. Country of Birth
15. Date of Entry to UK
16. Main Language
17. Interpreter Required
18. Religion
19. Home Phone
20. Mobile Phone
21. Email Address
22. Preferred Contact Method
23. SMS Options
24. Email Options
25. House Name / Flat Number
26. Number & Street
27. City
28. County
29. Postcode
30. Preferred Communication Method
31. Usual GP
32. Hospital Number
33. Date of Registration

### Actions Menu
1. Profile
2. View
3. Edit
4. View Audit
5. Archive
6. Save for offline access

---

## Search Behavior

### Test: "test" (general search)
- Returns: 378,068 results
- Slow loading

### Test: "Mickey" (specific search)
- Returns: 1 result
- Fast loading
- Patient: Mickey Mouse (Mr Mouse Clara Mickey)

### Patient Details Found
| Field | Value |
|-------|-------|
| Registration Type | Anonymous |
| Title | Mr |
| First Name | Mouse |
| Middle Name | Clara |
| Last Name | Mickey |
| Known as | Mickey |
| Date of Birth | 05/11/2024 |
| Gender | Male |
| Main Language | English |
| Interpreter Required | No |
| Usual GP | DR Jones |

---

## Quick Book Patient Search (from Appointment Book)

When searching patients in Quick Book dialog:

### Search Results Format
Each result shows:
- Initials (e.g., "MW", "PM", "MG")
- Name (e.g., "Mike Wong")
- NHS Number (if available)
- DOB and age (e.g., "15/05/1993 (33 yo)")
- Phone (e.g., "07915932033")
- Postcode (e.g., "L70JN")

### Test: "Mickey" in Quick Book
- Returns: 8 results
- Results: MW Mike Wong, PM, MG, MM, MP, MS, MM, MP

### Additional Options
- "Include deleted patients" checkbox
- "Within Organisations Hierarchy" checkbox

---

## Observations

1. **Large dataset**: 495,081 patients total
2. **Performance varies**: Specific searches are fast, general searches are slow
3. **Rich patient data**: 33 columns of patient information
4. **Actions menu**: 6 actions available per patient
5. **Quick Book integration**: Patient search in Quick Book shows compact card format
6. **Offline capability**: "Save for offline access" option available

---

## Session Timeout Issue

Session expired after ~3 hours of inactivity.  
Re-authentication requires Microsoft SSO (Single Sign On) which cannot be automated.
