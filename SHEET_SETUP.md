# Google Sheet setup — TUBE Coffee Privilege Coupons backend

## 1. Create the Sheet and its 6 tabs

Create a new Google Sheet, then create these tabs with **exactly** these
names and column headers (row 1 = headers, matching case, no extra spaces).
Order of columns doesn't matter, but every column name below must exist.

### Tab: `Employees`
```
id  name  dob  password  role  branch  department  position  status  crossStoreAccess
```

### Tab: `Franchisees`
```
id  name  contact  store  password  status  eligible
```

### Tab: `Branches`
```
name  managerId
```

### Tab: `Campaigns`
```
id  name  code  description  brand  category  benefit  terms  eligibleGroup  eligibleDept  eligiblePosition  eligibleFrId  startDate  expiryDate  totalQuantity  qtyPerPerson  redemptionLimit  applicableStores  hours  status  createdAt  createdBy
```
(`applicableStores` stores multiple branch names as one comma-separated cell, e.g. `BKK1 Flagship, Toul Kork`)

### Tab: `Coupons`
```
id  code  holderId  holderName  branch  holderKind  typeId  typeLabel  month  issuedAt  expiresAt  status  redeemedAt  redeemedBy
```

### Tab: `AuditLog`
```
ts  by  text
```
(AuditLog only ever gets new rows appended — never edited or deleted, so it doesn't need an `id` column.)

## 2. Add the backend script

1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete whatever's in the default `Code.gs` file and paste in the
   `Code.gs` I gave you.
3. Click **Save** (the disk icon).

## 3. Deploy it as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Settings:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**. The first time, Google will ask you to authorize it —
   click through the "Google hasn't verified this app" warning (it's your
   own script, so this is expected) and allow access.
5. Copy the URL shown — it ends in `/exec`. **Send me this URL** and I'll
   wire the app to use it.

## Important: redeploying after changes

If you (or I) ever edit `Code.gs` later, the live URL does **not**
automatically update. You need to go to **Deploy → Manage deployments →
edit (pencil icon) → New version → Deploy** to push the change live.

## A note on passwords

Right now employee/franchisee passwords are stored in the Sheet as plain
text (same as they currently live in the app's memory). Anyone with edit
access to the Sheet can see them. That's an acceptable tradeoff for now
since it matches what you already have, but worth knowing as this app
handles more real people.
