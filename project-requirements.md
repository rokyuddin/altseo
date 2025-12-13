# Project Requirements Document (PRD)

## Project Name: AltSEO

---

# 1. Project Overview

AltSEO is a micro-SaaS platform that allows users to upload images and automatically generate SEO‑friendly, accessible alt text using AI. The system supports single uploads, provides downloadable results, and offers simple API access for developers.

The focus is **speed**, **accuracy**, and **SEO optimization**, making it suitable for bloggers, content writers, e‑commerce store owners, and agencies.

---

# 2. Project Goals

### Primary Goals

* Generate high‑quality alt text for individual or multiple images.
* Provide intuitive UI for uploading and reviewing generated alt text.
* Allow users to copy, edit, and download generated alt text.
* Provide an API endpoint for automated alt‑text generation.

### Secondary Goals

* Offer SEO‑enhanced descriptions (keyword insertion, optional).
* Provide image metadata extraction (size, dimensions, file type).
* Subscription‑based limits on generation.

---

# 3. Technology Stack

### Frontend

* **Next.js (App Router)**
* Supabase
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui** (optional)

### Backend

* Next.js Route Handlers / Server Actions
* AI Generation (Groq)

### Database & Auth

* Supabase (Auth + Postgres)

### Storage

* Supabase Storage for uploaded images

---

# 4. User Roles

### 1. Guest User

* Can view landing page only.
* Can upload or generate alt text.
* but when can't not download the image until signup

### 2. Free User

* Limited number of images per day (e.g., 10/day).
* Access single image upload.

### 3. Pro User

* Unlimited images.
* API access.
* Export/download features.

---

# 5. Core Features (Detailed Requirements)

# 5.1 Authentication

* Supabase email/password auth
* Rate limits tied to user ID

---

# 5.2 Image Upload

### Requirements

* Single image upload 
* Support PNG, JPG, JPEG, WEBP etc
* Max file size (20 mb)

### UI

* Drag‑and‑drop uploader
* Upload progress indicator with percentaige
* Error handling (invalid formats & oversize)

---

# 5.3 Alt‑Text Generation

### Core Behavior

* Call AI Vision API to interpret the image
* Generate short alt text (default)
* Optionally generate:

  * SEO‑optimized alt text
  * Long description
  * Accessibility‑focused description

### Requirements

* Must return result in < 5 seconds ideally
* Must support retry on failure
* User can edit generated text

---

# 5.4 Output Management

### For each uploaded image, user can:

* View preview of image
* View & edit generated alt text
* Copy text to clipboard
* Download results as:

  * .txt file
  * JSON (optional)

---

# 5.5 History Page

### Requirements

* Show list of previously processed images
* Show generated alt text
* Show timestamps
* Allow re‑download

Free users:

* Last 10 results only

Pro users:

* Full history

---

# 5.6 Limits & Billing

### Free Plan

* 10 images/day
* Single upload only
* No API access

### Pro Plan

* Unlimited images
* API key generation
* Priority processing

### Enforcement

* Rate limit checks on:

  * Upload
  * Generation

---

# 5.7 API Access (Pro Users)

### Endpoints

* `POST /api/generate-alt-text` → returns alt text

### Authentication

* Bearer token (API key)

### Logs

* Store request count per user

---

# 6. Management

* RLS policies for per‑user isolation
* API keys hashed before storage
* Validate uploaded images to prevent malicious content
* AI response sanitization

---

# 9. Performance Requirements

* Generate alt text within 3–5 seconds
* Cache results to avoid duplicate billing

---

# 12. One‑Sentence Value Proposition

Generate accurate, SEO‑friendly alt text for your images in seconds—no effort required.




