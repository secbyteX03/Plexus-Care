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

### 💊 Comprehensive Drug Information & Management
![Medication Management](screenshots/medication-tracker.png)
- **Pill Identification**: Upload or take a photo to identify medications
- **Drug Database**: Searchable database of medications and supplements
- **Interaction Checker**: Check for potential drug interactions
- **Dosage Information**: Detailed dosage guidelines and instructions
- **Side Effects**: Comprehensive list of potential side effects
- **Alternative Medications**: Find suitable alternatives when needed
- **Pregnancy & Lactation Safety**: Special safety information
- **Storage Guidelines**: Proper storage recommendations
- **Expiration Tracking**: Monitor medication expiration dates
- **Refill Reminders**: Never run out of important medications

### 🤖 AI Symptom Checker & Health Assessment
![Symptom Checker](screenshots/symptom-checker.png)
- **Chat-Based Interface**: Describe your symptoms in natural language
- **AI-Powered Analysis**: Get instant preliminary assessment
- **Condition Matching**: Identifies potential conditions based on symptoms
- **Severity Indicator**: Understand when to seek immediate care
- **Personalized Recommendations**: Tailored health advice
- **Follow-up Questions**: AI asks relevant questions to narrow down causes
- **First Aid Guidance**: Immediate steps for common issues
- **Healthcare Provider Summary**: Exportable report for your doctor
- **Symptom History**: Track symptoms over time
- **Multilingual Support**: Available in multiple languages

### 🍽️ Smart Meal Planning & Nutrition
![Meal Planning](screenshots/meal-planner.png)
- **Personalized Meal Plans**: Customized based on dietary needs
- **Recipe Database**: Hundreds of healthy recipes with nutritional info
- **Meal Prep Tools**: Plan your weekly meals in advance
- **Grocery Lists**: Auto-generated shopping lists
- **Dietary Preferences**: Filter for vegetarian, vegan, gluten-free, etc.
- **Nutrition Tracking**: Monitor daily macronutrients and calories
- **Meal Timing**: Optimize meal schedules for energy and health
- **Local Ingredients**: Focus on locally available foods in Kenya
- **Budget-Friendly Options**: Healthy eating on any budget
- **Special Diets**: Support for various health conditions

### 🌿 Wellness & Lifestyle Management
![Wellness Dashboard](screenshots/wellness-dashboard.png)
- **Activity Tracking**: Monitor daily steps and exercise
- **Hydration Log**: Track water intake throughout the day
- **Sleep Analysis**: Improve sleep quality with insights
- **Stress Management**: Guided breathing and relaxation techniques
- **Mental Wellness**: Mood tracking and journaling
- **Habit Building**: Form and maintain healthy habits
- **Community Support**: Connect with others on similar journeys
- **Progress Reports**: Visualize your health improvements
- **Wellness Challenges**: Participate in health challenges
- **Personalized Tips**: Get recommendations based on your profile

### 🏥 Health Records & Management
![Health Records](screenshots/health-records.png)
- **Centralized Health Profile**: All your health information in one place
- **Appointment Tracking**: Never miss a doctor's visit
- **Vaccination Records**: Keep track of immunizations
- **Lab Results**: Store and analyze test results
- **Prescription History**: Complete medication history
- **Allergy Tracking**: Document and manage allergies
- **Family Health History**: Track hereditary conditions
- **Emergency Card**: Quick access to critical health information
- **Data Export**: Share records with healthcare providers
- **Reminders**: For medications, appointments, and check-ups

### 📱 Mobile Experience
![Mobile App](screenshots/mobile-dashboard.png)
- **Fully Responsive**: Works on all devices
- **Offline Access**: Key features available without internet
- **Biometric Login**: Quick and secure access
- **Push Notifications**: Stay updated on your health
- **Dark Mode**: Comfortable viewing in any light
- **Data Sync**: Seamless across all your devices
- **Voice Commands**: Hands-free operation
- **Widget Support**: Quick access to key features
- **Battery Efficient**: Minimal impact on device battery
- **Accessibility**: Designed for all users

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


## 🧠 How It Works

### 🍽️ Smart Meal Planning Journey
1. **Dietary Profile Setup**
   - Complete a brief questionnaire about your dietary preferences
   - Specify any allergies, restrictions, or health conditions
   - Set personalized nutrition goals (weight loss, muscle gain, maintenance)

2. **Personalized Meal Plans**
   - Receive customized weekly meal plans
   - Adjust portion sizes based on your needs
   - Swap recipes while maintaining nutritional balance

3. **Grocery Shopping Made Easy**
   - Auto-generated shopping lists organized by category
   - Local supermarket integration for price comparison
   - Budget tracking for your grocery spending

4. **Nutrition Tracking**
   - Log meals with our food database
   - Monitor macronutrients and micronutrients
   - Get insights into your eating patterns

### 🌿 Wellness Tracking Experience
1. **Daily Wellness Check-in**
   - Log your mood, energy levels, and stress
   - Track sleep quality and duration
   - Monitor water intake and physical activity

2. **Personalized Insights**
   - AI-powered analysis of your wellness trends
   - Correlations between lifestyle factors and how you feel
   - Actionable recommendations for improvement

3. **Wellness Challenges**
   - Join community challenges for motivation
   - Track progress with friends and family
   - Earn rewards for healthy behaviors

### 💊 Medication Management System
1. **Pill Identification**
   - Snap a photo of any medication
   - AI identifies the pill and provides detailed information
   - Get alerts for potential interactions with other medications

2. **Medication Tracking**
   - Set up custom medication schedules
   - Receive timely reminders for each dose
   - Track adherence and refill needs

3. **Health Profile**
   - Maintain a complete medication history
   - Share information with healthcare providers
   - Emergency access to critical health information

### 🤖 AI Health Assistant
1. **Symptom Assessment**
   - Chat-based interface for describing symptoms
   - AI analyzes patterns and provides guidance
   - Recommendations for self-care or professional help

2. **Health Monitoring**
   - Track symptoms over time
   - Receive alerts for concerning patterns
   - Share reports with your healthcare provider

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
For inquiries or feedback, please contact [faithmagret10@gmail.com](mailto:faithmagret10@gmail.com)