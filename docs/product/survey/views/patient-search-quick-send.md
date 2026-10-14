---
id: patient-search-quick-send
title: Patient Search & Quick Send Flow
roles:
  - Super Admin GB
environment: dev
status: Observed
routes:
  - /paco/patient-search
  - /paco-connect/quick-send (404)
controls: []
verified_by: []
last_observed: 2026-10-06
relationships: []
---

# Patient Search & Quick Send Flow

## Entry

Route: `/paco/patient-search`

## Patient Search Page

### Header
- Total patients: 495,081
- Search box: "Search Patients..."
- Filters button
- Show archived checkbox
- Offline config button
- Create new patient button

### Grid Columns
- Registration Type
- Title
- First Name
- Middle Name
- Last Name
- Known as
- Date of Birth
- Date of Death
- Gender
- NHS Number
- Patient Identifier
- Marital Status
- Ethnicity
- Country of Birth
- Date of Entry to UK
- Main Language
- Interpreter Required
- Religion
- Home Phone
- Mobile Phone
- Email Address
- Preferred Contact Method
- SMS Options
- Email Options
- House Name / Flat Number
- Number & Street
- City
- County
- Postcode
- Preferred Communication Method
- Usual GP
- Hospital Number
- Date of Registration

### Actions Menu
- Profile
- View
- Edit
- View Audit
- Archive
- Save for offline access

## Test Patient Found

Search "Mickey" returned 1 result:

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

## Quick Send (NHS Comms Hub)

Quick Send in PACO sidebar links to NHS Comms Hub (separate auth):
- Template Manager
- Campaign Manager
- Patient Manager

NHS Comms Hub requires separate login (Microsoft SAML2 SSO).

## Observations

- Patient search on "test" returned 378,068 results (slow)
- Specific search "Mickey" returned 1 result quickly
- Actions menu truncated to 6 items visible
- Quick Send requires NHS Comms Hub separate auth

## Provenance

- Environment: dev
- Role: Super Admin GB
- Observed at: 2026-10-06T07:51:59Z
- Patient found: Mickey Mouse (QA test patient)
