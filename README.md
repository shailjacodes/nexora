# Nexora — KIIT University Event Discovery & Management Platform

> **Website Name:** **Nexora**  
> **Institution:** Kalinga Institute of Industrial Technology (KIIT) Deemed to be University, Bhubaneswar, Odisha, India  
> **Evaluation Focus:** Creativity, UI/UX, Functionality, Responsiveness, Code Quality, GitHub Documentation & Deployment  
> **Status:** Production-Ready, Responsive, Authenticated & Payment-Integrated

---

## 🌟 Overview & Problem Statement

**Nexora** is the dedicated event discovery, ticketing, and payment tracking platform developed for **KIIT University, Bhubaneswar**. It connects over 30,000 students, faculty members, and external delegates with world-class campus events across Campus 1 through Campus 24 in Patia, Bhubaneswar.

### Key Workflows Implemented:
1. **Login Page Gatekeeper:** Users are prompted with a dedicated KIIT authentication portal before entering the main application. Supports KIIT Student Roll Numbers (e.g. `24155278`) and university emails (`24155278@kiit.ac.in`), with a one-click quick demo login button.
2. **KIIT University & Bhubaneswar Events:** All events are situated within KIIT campuses in Bhubaneswar:
   - **KIIT Fest 2026** (Campus 6 Lawns & Central Auditorium, Bhubaneswar)
   - **ICDCIT 2026** (School of Computer Engineering, Campus 15, Bhubaneswar)
   - **KIIT E-Summit 2026** (KIIT-TBI Innovation Hub, Campus 11, Bhubaneswar)
   - **KSTAR 36-Hr Hackathon** (School of Computer Applications, Campus 3, Bhubaneswar)
   - **KIIT Premier League (KPL) Floodlight Cricket** (KIIT International Cricket Stadium, Campus 13, Bhubaneswar)
   - **KIIT International MUN** (Campus 9 Convention Centre, Bhubaneswar)
   - **KRONICLE Parliamentary Debate** (School of Law, Campus 7, Bhubaneswar)
   - **KIIT MediaCon Film Fest** (School of Film & Media Sciences, Campus 18, Bhubaneswar)
3. **Registration to Payment Section Flow:**
   - Registration collects participant name, KIIT roll number, university email, and ticket tier.
   - Upon submitting registration with client-side JavaScript validation, users are **directed immediately to the Payment Gateway Section**.
   - Supports **UPI (Google Pay, PhonePe, Paytm, BHIM with VPA & QR)**, **KIIT Campus Smart Card / Student Wallet**, and **Debit/Credit Cards (RuPay, Visa, Master)** in Indian Rupees (₹ INR).
   - Live payment processing engine with animated state tracking (*"Connecting to Gateway"*, *"Verifying with Bank / UPI network"*, *"Payment Approved"*).
4. **Payment Tracking & History:**
   - Each registered pass generates an authentic Transaction ID (e.g. `TXN-KIIT-2026-XXXXX`).
   - Payment status, payment method, timestamp, and amount paid are tracked and displayed on the digital pass and in the **"Passes & Payment Tracking"** drawer.
5. **Digital Pass & Scannable QR Code:**
   - Holographic digital pass with scannable QR representation, `.ics` calendar sync, and print/PDF pass receipt.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 (Functional Components, Hooks, State Machines) |
| **Language** | TypeScript (Strict Typing & Modular Schemas) |
| **Styling** | Tailwind CSS v4 (`@import "tailwindcss"`) |
| **Icons** | Lucide React |
| **Testing** | Node.js Built-in Test Runner (`node:test`, `node:assert/strict`) via `tsx` |
| **Persistence** | Browser `localStorage` (Auth session, Pass records, Payment ledger) |

---

## 🧪 Unit Testing

Decoupled business logic verified with 18 automated unit tests:
- `src/utils/validation.ts` & `src/utils/validation.test.ts`
- `src/utils/date.ts` & `src/utils/date.test.ts`
- `src/utils/payment.ts` & `src/utils/payment.test.ts`
- `src/utils/auth.ts`

To execute tests:
```bash
npx --yes tsx --test src/utils/validation.test.ts src/utils/date.test.ts src/utils/payment.test.ts
```
**Results:** 18/18 tests passing.

---

## 💻 Local Setup & Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nexora-kiit-events.git
   cd nexora-kiit-events
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📱 Responsive Verification

- **Mobile Viewport (390px):** Tested with single-column cards, collapsible KIIT student drawer, touch-friendly payment selectors.
- **Desktop (1440px):** Tested with multi-column layout, widescreen countdown ticker, interactive tabbed modals.

---

## 📜 Acknowledgements

Developed for the **Responsive Event Management Website** assignment.  
Institution: **KIIT Deemed to be University, Bhubaneswar**  
Website Name: **Nexora**

## Author
Shailja Khemani
