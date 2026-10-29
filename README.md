# 🏛️ AICTE-SAMANVAY

> **Unified Cross-Bureau Complaint Intelligence & Overlap Resolution Engine**  
> *Developed for Smart India Hackathon (SIH) 2026*

![SIH 2026](https://img.shields.io/badge/SIH-2026-orange?style=for-the-badge&logo=hackaday)
![PS ID](https://img.shields.io/badge/PS_ID-26264-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Prototype_Live-success?style=for-the-badge)

**Problem Statement ID:** 26264  
**Problem Statement Title:** Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells  
**Team Name:** FutureMinds  

🔗 **[Live Demo](https://samanvay-lilac.vercel.app/)** | 📺 **[Video Walkthrough](#)** *(Add your YouTube link here)*

---

## 📖 Overview

The All India Council for Technical Education (AICTE) receives grievances across multiple bureaus (Regulation Bureau, Public Grievance Redressal Cell, Regional Offices). Currently, these bureaus operate in silos, leading to overlapping investigations, duplicate efforts, and conflicting directives (e.g., parallel Show-Cause Notices) sent to the same institution.

**AICTE-SAMANVAY** is a single-window Command & Control Dashboard that unifies all AICTE bureaus. It establishes a single source of truth by creating a Master Institution 360° Registry and utilizes a proprietary **3-Tier Hybrid Entity & Semantic Engine** to instantly detect overlapping complaints—even when reference IDs are missing or descriptions vary.

## ✨ Key Features

*   **360° Institution Profile:** A consolidated dossier for every AICTE-approved institution indexed by Permanent ID (PID) and AISHE Code.
*   **Real-Time Case Tracker:** Complete state-machine tracking (Received → Scrutiny → RO Probe → SCSC → Disposed).
*   **Cross-Bureau Overlap Detection:** Automatically detects when RB and PGRC are investigating the same institute and fires a "Coordination Lock" alert.
*   **Joint Case Docket:** 1-Click case linking to merge overlapping cases and prevent conflicting penal actions.
*   **Immutable Action History:** SHA-256 tamper-proof chronological audit trail of all officer actions and transfers.
*   **Live SLA & Workload Dashboard:** Role-based views with predictive SLA-breach alerts (<48h warnings).

## 🧠 Core Innovation: 3-Tier Overlap Engine

Our system accurately detects duplicates across unformatted legacy data and multi-channel inflows:
1.  **Tier 1 (Deterministic):** Exact lookup via AICTE PID, AISHE Code, or Geo-PIN.
2.  **Tier 2 (Fuzzy Logic):** Jaro-Winkler and Levenshtein string matching to catch misspellings and name abbreviations.
3.  **Tier 3 (AI Semantic Vectorization):** Uses `BGE-M3` / `all-mpnet-base-v2` with `pgvector` / `FAISS` to compute cosine similarity across the natural language descriptions of the complaints.

## 🛠️ Technology Stack

*   **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Shadcn UI, Recharts
*   **Backend / API:** Node.js/Express (Role-Based Access Control) & FastAPI (Python AI Overlap Engine)
*   **Database:** PostgreSQL + PostGIS, `pgvector` (Semantic Search)
*   **Caching & Queues:** Redis Pub/Sub (Live Alerts), BullMQ (SLA Cron Jobs)
*   **Security & Deployment:** JWT Authentication, Docker & Kubernetes (Targeted for NIC/MeghRaj GI Cloud)

## 📸 Screenshots

*(Replace these placeholder links with actual screenshots of your dashboard)*

| Command Dashboard | Overlap Alert Modal |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x350.png?text=Dashboard+Screenshot" alt="Dashboard" width="400"/> | <img src="https://via.placeholder.com/600x350.png?text=Overlap+Alert+Screenshot" alt="Alert" width="400"/> |

## 🚀 Local Installation & Setup

Follow these steps to run AICTE-SAMANVAY locally:

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)
*   PostgreSQL (with `pgvector` extension)
*   Redis

### 1. Clone the Repository
```bash
git clone [https://github.com/SamarthKapdi/samanvay.git](https://github.com/SamarthKapdi/samanvay.git)
cd samanvay
