# Plexus Care - Comprehensive Healthcare Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Supabase](https://img.shields.io/badge/Built%20with-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![Deployed with Netlify](https://img.shields.io/badge/Deployed%20with-Netlify-00C7B7?logo=netlify)](https://www.netlify.com/)

<div align="center">
  <img src="assets/images/home.PNG" alt="Plexus Care Preview" width="800"/>
  <p><strong>Live Demo:</strong> <a href="https://plexus-care.netlify.app/">https://plexus-care.netlify.app/</a></p>
</div>

## 🌟 Overview
Plexus Care is a comprehensive healthcare platform that provides accessible healthcare information and resources. The platform offers a wide range of health-related tools and information, including drug databases, symptom checking, health resources, meal planning, and wellness tracking, all through a user-friendly web application.

## 🚀 Key Features

### 💊 Comprehensive Drug Information
- Detailed drug database with search functionality
- Pill identification using physical characteristics
- Drug interaction checker
- A-Z navigation for easy browsing
- Vitamin and supplement information
- Safety facts and guidelines
- Responsive design for all devices

### 🤖 Symptom Checker
- Interactive symptom assessment
- AI-powered preliminary guidance
- Recommended next steps
- When to seek medical attention

### 🍎 Nutrition & Wellness
- Personalized meal planning
- Food recipes with nutritional information
- Wellness tracking and recommendations
- Healthy lifestyle tips

### 📚 Health Information Resources
- Extensive library of health conditions
- Parenting resources and guides
- Pregnancy and postpartum care
- Chronic disease management
- First aid and emergency care

### 🧑‍⚕️ Health Tools
- BMI Calculator
- Medication reminders
- Health journal
- Appointment scheduling

### 🌐 Accessible Design
- Fully responsive interface for all devices
- Accessibility features for users with disabilities
- Easy-to-navigate interface

## 🛠️ Technology Stack

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)** - Core web technologies
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Alpine.js** - Lightweight JavaScript framework for reactive interfaces
- **Chart.js** - For data visualization in health tracking
- **Interactive UI Components** - For enhanced user experience

### Backend
- **Supabase** - Backend-as-a-Service (Authentication, Database, Storage)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework

### Database
- **PostgreSQL** - Primary database via Supabase
- **Row Level Security** - For data protection
- **Realtime Subscriptions** - For live updates

### Integrations
- **Nutrition API** - For meal planning and recipes
- **Health Data APIs** - For comprehensive health information
- **Authentication** - Secure user management

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

## 🌍 Our Mission

Plexus Care is committed to making healthcare information accessible to everyone. Our platform provides:
- **Comprehensive Resources**: From medication information to wellness tips
- **User Empowerment**: Tools to take control of personal health
- **Evidence-Based**: Information from trusted medical sources
- **Privacy-Focused**: Your health data stays secure

### Key Differentiators
- **All-in-One Platform**: Health information, meal planning, and wellness tracking in one place
- **User-Centric Design**: Intuitive interface for all age groups
- **Regular Updates**: Continuously expanding content and features

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

## 🚀 Getting Started

### Live Demo
[Plexus Care Live Demo](https://plexus-care.netlify.app/)

### Local Development
1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your environment variables
4. Run `npm run dev` to start the development server

### Key Pages
- **Home**: Overview of all features
- **Dashboard**: User health dashboard
- **Drugs & Supplements**: Comprehensive medication information
- **Symptom Checker**: AI-powered health assessment
- **Nutrition**: Meal plans and recipes
- **Wellness**: Health tracking and tips
- **Info Resources**: Extensive health information library

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- [Supabase](https://supabase.com/) for the amazing backend services
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Netlify](https://www.netlify.com/) for hosting and deployment
- [Chart.js](https://www.chartjs.org/) for data visualization
- All open-source libraries and resources that made this project possible possible

## 📬 Contact
For inquiries or feedback, please contact [your-email@example.com](mailto:your-email@example.com)