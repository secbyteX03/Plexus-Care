# Plexus Care - AI-Powered Healthcare Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Supabase](https://img.shields.io/badge/Built%20with-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![Deployed with Vercel](https://img.shields.io/badge/Deployed%20with-Vercel-000000?logo=vercel)](https://vercel.com/)

<div align="center">
  <img src="assets/logo.png" alt="Plexus Care Logo" width="200"/>
</div>

## 🌟 Overview
Plexus Care is an innovative healthcare platform that leverages AI and modern web technologies to provide accessible healthcare solutions. Built for the PLP July Cohort Hackathon, this project addresses the critical need for affordable and reliable healthcare services in Africa through a user-friendly web application.

## 🚀 Features

### 💊 Pill Identification
- Snap or upload a photo of any medication
- AI-powered identification of pills using computer vision
- Detailed drug information including dosage, side effects, and interactions

### 🤖 AI Symptom Checker
- Chat-based symptom assessment
- AI-powered preliminary diagnosis
- Recommended next steps and when to seek medical attention

### 🏥 Doctor Consultations
- Book virtual consultations with licensed healthcare providers
- Secure video calling integration
- Digital prescriptions and medical records

### 💊 Drugs & Supplements Hub
- Comprehensive drug information database
- Pill identification using physical characteristics
- Drug interaction checker
- A-Z navigation for easy browsing
- Vitamin and supplement information
- Safety facts and guidelines
- Responsive design for all devices

### 📱 Mobile-First Design
- Fully responsive interface for all devices
- Offline functionality for low-connectivity areas
- Push notifications for appointment reminders

## 🛠️ Technology Stack

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)** - Core web technologies
- **Tailwind CSS** - Utility-first CSS framework
- **Alpine.js** - Lightweight JavaScript framework for reactive interfaces
- **Interactive UI Components** - For drug search, pill identification, and interaction checking

### Backend
- **Supabase** - Backend-as-a-Service (Authentication, Database, Storage)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework

### AI/ML
- **Hugging Face Transformers** - For natural language processing
- **TensorFlow.js** - For client-side ML models
- **OpenAI API** - For advanced AI capabilities

### Payment Integration
- **IntaSend** - For seamless M-Pesa and card payments
- **Stripe** - International payment processing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- IntaSend API keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Plexus-Care.git
   cd Plexus-Care
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_INTASEND_PUBLIC_KEY=your_intasend_public_key
   VITE_INTASEND_TEST_MODE=true
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 📸 Screenshots

| Feature | Screenshot |
|---------|------------|
| **Homepage** | ![Homepage](screenshots/homepage.png) |
| **Pill Identification** | ![Pill ID](screenshots/pill-id.png) |
| **Symptom Checker** | ![Symptom Checker](screenshots/symptom-checker.png) |
| **Doctor Booking** | ![Doctor Booking](screenshots/doctor-booking.png) |

## 🧠 How It Works

### AI-Powered Pill Identification
1. User uploads a photo of a pill
2. Image is processed using TensorFlow.js on the client side
3. The system identifies the pill based on shape, color, and markings
4. Drug information is retrieved from a medical database
5. Results are displayed to the user with safety information

### Symptom Checker Flow
1. User describes their symptoms through a chat interface
2. Natural Language Processing (NLP) extracts key symptoms
3. AI compares symptoms against a medical knowledge base
4. System provides possible conditions and recommended actions
5. Option to book a consultation if needed

### Payment Integration
1. User selects a plan (Free, Basic, or Pro)
2. For paid plans, user enters payment details
3. IntaSend processes the payment via M-Pesa or card
4. On successful payment, user gains access to premium features
5. Receipt and subscription details are stored in Supabase

## 🎯 Hackathon Focus Areas

### Problem Statement
Access to affordable and reliable healthcare information and services remains a significant challenge in many African communities. Plexus Care addresses this by providing:
- **Accessibility**: Mobile-first platform for users with limited connectivity
- **Affordability**: Free basic features with affordable premium options
- **Education**: Empowering users with reliable health information

### Innovation
- **AI-Powered Triage**: Reduces unnecessary hospital visits
- **Localized Solutions**: Built with African healthcare challenges in mind
- **Offline-First**: Functions in areas with poor connectivity

## 📊 Technical Implementation

### Database Schema
```sql
-- Users table
create table users (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  subscription_tier text default 'free',
  trial_ends_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Consultations table
create table consultations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  doctor_id uuid references users(id),
  symptoms text,
  diagnosis text,
  status text default 'scheduled',
  scheduled_for timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### API Endpoints
- `POST /api/identify-pill` - Process pill images
- `POST /api/check-symptoms` - Analyze symptoms
- `GET /api/doctors` - List available doctors
- `POST /api/book-consultation` - Schedule a consultation
- `POST /api/process-payment` - Handle payments

## 🏆 Hackathon Submission

### Team Members
- [Your Name] - Team Lead / Full Stack Developer
- [Team Member 2] - Frontend Developer
- [Team Member 3] - Backend Developer
- [Team Member 4] - AI/ML Engineer
- [Team Member 5] - UI/UX Designer

### Demo Video
[![Watch the demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

### Live Demo
[Plexus Care Live Demo](https://plexus-care.vercel.app)

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- PLP for organizing this hackathon
- Supabase for their amazing BaaS platform
- IntaSend for seamless payment integration
- All open-source contributors whose work made this project possible

## 📬 Contact
For inquiries or feedback, please contact [your-email@example.com](mailto:your-email@example.com)