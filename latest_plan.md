# CodingShark ↔ CRM Integration Plan

> Paste this file in the CodingShark project root.
> All CRM API calls go to the deployed CRM on Vercel.

---

## 1. ENV VARS TO ADD

Add these to `.env.local` (and Vercel environment variables):

```bash
# CRM Integration
NEXT_PUBLIC_CRM_API_URL=https://your-crm-vercel-url.vercel.app
CRM_EXTERNAL_API_KEY=cs-crm-key-change-this-in-production
NEXT_PUBLIC_CRM_EXTERNAL_API_KEY=cs-crm-key-change-this-in-production
```

> Replace `your-crm-vercel-url.vercel.app` with the actual deployed CRM domain.
> The API key must match `EXTERNAL_API_KEY` set in the CRM's Vercel env vars.

---

## 2. CRM API ENDPOINTS WE WILL USE

### A. Get Courses for Dropdown
```
GET {CRM_URL}/api/public/courses?courseType=all
```
- No auth required
- Returns all active courses with `id`, `name`, `courseType`
- Use `?courseType=workshop` for workshops only, `?courseType=regular` for regular only

**Response shape:**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Full Stack Web Dev", "courseType": "regular", "duration": "6 months", "price": 49999 },
    { "id": "uuid", "name": "React Workshop", "courseType": "workshop", "price": null }
  ]
}
```

### B. Submit Lead (from Lead Modal)
```
POST {CRM_URL}/api/public/leads
Headers: x-api-key: {CRM_EXTERNAL_API_KEY}
```

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "courseInterest": "uuid-of-selected-course",
  "notes": "Background: Working Professional (Non-Tech)"
}
```

**Response shape:**
```json
{
  "success": true,
  "data": { "id": "lead-uuid", "name": "John Doe" }
}
```

> On success: auto-welcome WhatsApp message is sent to the lead automatically by CRM.

---

## 3. FIELD MAPPING — Lead Modal → CRM

| Lead Modal Field | CRM Field | Notes |
|---|---|---|
| `name` | `name` | Direct map |
| `email` | `email` | Direct map |
| `phone` | `mobile` | Rename key |
| `program` (selected course name) | `courseInterest` | Must send **UUID**, not name — fetch courses first, map name→id |
| `background` | `notes` | Prefix: `"Background: Working Professional"` |

---

## 4. TASKS TO COMPLETE

### Task 1 — Create CRM API utility file
**File to create:** `src/lib/crm-api.ts`

```typescript
const CRM_URL = process.env.NEXT_PUBLIC_CRM_API_URL;
const CRM_KEY = process.env.NEXT_PUBLIC_CRM_EXTERNAL_API_KEY;

export interface CrmCourse {
  id: string;
  name: string;
  courseType: 'regular' | 'workshop';
  duration: string;
  price: number | null;
}

export async function fetchCrmCourses(courseType: 'all' | 'regular' | 'workshop' = 'all'): Promise<CrmCourse[]> {
  const res = await fetch(`${CRM_URL}/api/public/courses?courseType=${courseType}`, {
    next: { revalidate: 300 }, // cache 5 min (Next.js ISR)
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function submitLeadToCrm(data: {
  name: string;
  email: string;
  mobile: string;
  courseInterest?: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${CRM_URL}/api/public/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CRM_KEY || '',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return { success: json.success, error: json.error };
}
```

---

### Task 2 — Update Lead Modal (`src/components/common/lead-modal.tsx`)

**What to change:**
1. Fetch courses from CRM on modal open (not from `courses.json`)
2. Store courses in state: `{ id, name }[]`
3. Render `program` dropdown from fetched courses
4. On submit: map selected course name → UUID, send to CRM
5. Handle loading state for courses fetch
6. Handle API error state (show error message instead of success if CRM call fails)

**New form state shape:**
```typescript
const [courses, setCourses] = useState<CrmCourse[]>([]);
const [coursesLoading, setCoursesLoading] = useState(false);
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  courseId: '',      // UUID from CRM
  background: '',
});
```

**Fetch courses on open:**
```typescript
useEffect(() => {
  if (isOpen) {
    setCoursesLoading(true);
    fetchCrmCourses('all').then(data => {
      setCourses(data);
      setCoursesLoading(false);
    });
  }
}, [isOpen]);
```

**Submit handler (replace the mock setTimeout):**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  const result = await submitLeadToCrm({
    name: formData.name,
    email: formData.email,
    mobile: formData.phone,
    courseInterest: formData.courseId || undefined,
    notes: formData.background ? `Background: ${formData.background}` : undefined,
  });
  setLoading(false);
  if (result.success) {
    setSubmitted(true);
  } else {
    setError('Something went wrong. Please try again.');
  }
};
```

**Program dropdown change:**
```tsx
<select
  value={formData.courseId}
  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
>
  <option value="">Select a program</option>
  {coursesLoading ? (
    <option disabled>Loading...</option>
  ) : (
    courses.map(c => (
      <option key={c.id} value={c.id}>{c.name}</option>
    ))
  )}
</select>
```

---

### Task 3 — Create a Next.js API proxy route (recommended)

Instead of calling CRM directly from browser (CORS issues possible), create a thin proxy:

**File to create:** `src/app/api/leads/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_CRM_API_URL}/api/public/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CRM_EXTERNAL_API_KEY || '',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
```

Then in `submitLeadToCrm()` — call `/api/leads` instead of `${CRM_URL}/api/public/leads`.
This way API key stays server-side only and CORS is never an issue.

---

### Task 4 — Book Demo & Contact pages

Both pages are currently empty (`BasicPage` placeholder).

**Book Demo page** — add a simple form:
- Fields: name, email, phone, preferred time (morning/afternoon/evening)
- Submit to CRM as a lead with `notes: "Book Demo - Preferred: Morning"`

**Contact page** — add a contact form:
- Fields: name, email, message
- Submit to CRM as a lead OR send email (decide with sir)

---

## 5. WHAT TO CHECK / UPDATE IN CRM

| Item | Status | Action |
|---|---|---|
| `POST /api/public/leads` accepts `notes` field | ✅ Already there | Nothing |
| `GET /api/public/courses?courseType=all` | ✅ Already built | Nothing |
| CORS — CRM needs to allow CodingShark domain | ⚠️ Check | Add `Access-Control-Allow-Origin` for CodingShark domain in CRM |
| `mobile` validation — CRM expects 10-digit Indian number | ⚠️ Check | Phone input on modal: add validation, strip country code |
| CRM `EXTERNAL_API_KEY` env var set on Vercel | ⚠️ Pending | Set before go-live |

---

## 6. CORS FIX IN CRM (if needed)

If calling CRM directly from browser (not via proxy), add to CRM's `/api/public/leads/route.ts` and `/api/public/courses/route.ts`:

```typescript
// Add to response headers
return NextResponse.json(data, {
  headers: {
    'Access-Control-Allow-Origin': 'https://codingsharks.in', // or '*' for dev
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
  }
});
```

Or create `src/middleware.ts` in CRM to handle CORS globally for `/api/public/*` routes.

---

## 7. PHONE NUMBER VALIDATION

CRM validates mobile as **10-digit Indian number** (no country code, no +91).

In the lead modal, before submitting:
```typescript
const cleanPhone = formData.phone.replace(/\D/g, '').replace(/^91/, '').slice(-10);
// "9876543210" ✓
// "+91 98765 43210" → "9876543210" ✓
```

---

## 8. WORKSHOP PAGE (Phase 2 — Do after above is complete)

**New pages to build in CodingShark:**
1. `/workshops` — listing of all active workshops (fetch from `GET /api/public/courses?courseType=workshop`)
2. `/workshops/[slug]` — individual workshop detail page

**New pages in CRM Admin:**
- Workshop management is already handled in CRM Courses section (`courseType=workshop`)
- No separate admin page needed — filter courses by type

**Workshop registration form:**
- Same lead modal OR a dedicated workshop registration form
- Pre-fill `courseId` with workshop ID from URL slug
- Add extra fields if needed: batch preference, payment mode, etc.

---

## 9. OWNER NOTIFICATION (Already built in CRM)

When a lead submits the form, CRM automatically sends a WhatsApp message to **9915824156** (your number).

**Message format:**
```
🔔 New Lead — CodingShark Website

Name: Rahul Sharma
Mobile: 9876543210
Course: Full Stack Web Development
Notes: Background: Working Professional (Non-Tech)
```

**How it works:**
- Triggered inside `POST /api/public/leads` in CRM after lead is saved
- Fire-and-forget — form submission never fails because of this
- Controlled via `OWNER_WHATSAPP_NUMBER` env var in CRM (currently set to `9915824156`)
- To change your notification number: update `OWNER_WHATSAPP_NUMBER` in CRM Vercel env vars

**Nothing to do on CodingShark side** — this is fully handled in CRM.

---

## 10. ORDER OF WORK

1. [ ] Add ENV vars to `.env.local`
2. [ ] Create `src/lib/crm-api.ts`
3. [ ] Create `src/app/api/leads/route.ts` (proxy)
4. [ ] Update `src/components/common/lead-modal.tsx` (Tasks 2 above)
5. [ ] Test: open modal → courses load → submit → check CRM leads list → check WhatsApp (student gets welcome msg, you get notification)
6. [ ] Book Demo page form
7. [ ] Contact page form
8. [ ] Deploy CodingShark + set Vercel env vars
9. [ ] **Phase 2**: Workshop listing + detail pages

---

*CRM deployed at: (fill in after Vercel deploy)*
*CodingShark domain: codingsharks.in*
