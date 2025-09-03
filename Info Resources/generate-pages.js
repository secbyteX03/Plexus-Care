const fs = require('fs');
const path = require('path');

// Disease data with basic info
const diseases = [
    // Infectious Diseases
    { id: 'tuberculosis', name: 'Tuberculosis (TB)', category: 'Infectious Diseases' },
    { id: 'hiv-aids', name: 'HIV & AIDS', category: 'Infectious Diseases' },
    { id: 'pneumonia', name: 'Pneumonia', category: 'Infectious Diseases' },
    { id: 'diarrheal-diseases', name: 'Diarrheal Diseases', category: 'Infectious Diseases' },
    
    // Lifestyle & Chronic Conditions
    { id: 'diabetes', name: 'Diabetes', category: 'Lifestyle & Chronic Conditions' },
    { id: 'hypertension', name: 'Hypertension', category: 'Lifestyle & Chronic Conditions' },
    { id: 'cancer', name: 'Cancer', category: 'Lifestyle & Chronic Conditions' },
    { id: 'asthma', name: 'Asthma', category: 'Lifestyle & Chronic Conditions' },
    { id: 'heart-disease', name: 'Heart Disease', category: 'Lifestyle & Chronic Conditions' },
    { id: 'chronic-kidney-disease', name: 'Chronic Kidney Disease', category: 'Lifestyle & Chronic Conditions' },
    
    // Maternal & Child Health
    { id: 'pregnancy-antenatal-care', name: 'Pregnancy & Antenatal Care', category: 'Maternal & Child Health' },
    { id: 'safe-delivery', name: 'Safe Delivery', category: 'Maternal & Child Health' },
    { id: 'postpartum-health', name: 'Postpartum Health', category: 'Maternal & Child Health' },
    { id: 'child-nutrition', name: 'Child Nutrition', category: 'Maternal & Child Health' },
    { id: 'vaccination-immunization', name: 'Vaccination & Immunization', category: 'Maternal & Child Health' },
    { id: 'common-childhood-illnesses', name: 'Common Childhood Illnesses', category: 'Maternal & Child Health' },
    
    // Mental Health & Everyday Issues
    { id: 'depression-anxiety', name: 'Depression & Anxiety', category: 'Mental Health & Everyday Issues' },
    { id: 'substance-abuse', name: 'Substance Abuse', category: 'Mental Health & Everyday Issues' },
    { id: 'sexually-transmitted-infections', name: 'Sexually Transmitted Infections (STIs)', category: 'Mental Health & Everyday Issues' },
    { id: 'ulcers-stomach-disorders', name: 'Ulcers & Stomach Disorders', category: 'Mental Health & Everyday Issues' },
    { id: 'back-pain-joint-problems', name: 'Back Pain & Joint Problems', category: 'Mental Health & Everyday Issues' },
    { id: 'headaches-migraines', name: 'Headaches & Migraines', category: 'Mental Health & Everyday Issues' }
];

// Generate HTML for a single disease page
function generateDiseaseHTML(disease, isBlueTheme) {
    const primaryColor = isBlueTheme ? '#1e88e5' : '#e91e63';
    const primaryDark = isBlueTheme ? '#1565c0' : '#c2185b';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${disease.name} - Plexus Care</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../css/variables.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        :root { --primary: ${primaryColor}; --primary-dark: ${primaryDark}; }
        .hero-section { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); 
                       color: white; padding: 20px 0; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .section { padding: 40px 0; }
        .section-header { margin-bottom: 20px; }
        .nav-tabs { background: #f8f9fa; padding: 15px 0; }
        .nav-tab { padding: 10px 20px; text-decoration: none; color: #555; }
        .nav-tab.active { background: var(--primary); color: white; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="hero-section">
        <div class="container">
            <h1>${disease.name}</h1>
            <p>Resource Center</p>
        </div>
    </div>

    <div class="nav-tabs">
        <div class="container">
            <a href="#overview" class="nav-tab active">Overview</a>
            <a href="#symptoms" class="nav-tab">Symptoms</a>
            <a href="#causes" class="nav-tab">Causes</a>
            <a href="#treatment" class="nav-tab">Treatment</a>
        </div>
    </div>

    <div class="main-content">
        <div id="overview" class="section">
            <div class="container">
                <div class="section-header">
                    <h2>Overview</h2>
                </div>
                <div class="section-content">
                    <p>Content for ${disease.name} overview will be added here.</p>
                </div>
            </div>
        </div>

        <div id="symptoms" class="section">
            <div class="container">
                <div class="section-header">
                    <h2>Symptoms</h2>
                </div>
                <div class="section-content">
                    <p>Symptoms of ${disease.name} will be listed here.</p>
                </div>
            </div>
        </div>

        <div id="causes" class="section">
            <div class="container">
                <div class="section-header">
                    <h2>Causes & Risk Factors</h2>
                </div>
                <div class="section-content">
                    <p>Information about causes and risk factors for ${disease.name}.</p>
                </div>
            </div>
        </div>

        <div id="treatment" class="section">
            <div class="container">
                <div class="section-header">
                    <h2>Treatment</h2>
                </div>
                <div class="section-content">
                    <p>Treatment options for ${disease.name} will be detailed here.</p>
                </div>
            </div>
        </div>
    </div>

    <footer style="background: #f8f9fa; padding: 20px 0; text-align: center; margin-top: 40px;">
        <div class="container">
            <p>© 2023 Plexus Care. All rights reserved.</p>
        </div>
    </footer>

    <script>
        // Simple tab functionality
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const targetId = this.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            });
        });
    </script>
</body>
</html>`;
}

// Generate all disease pages
diseases.forEach((disease, index) => {
    const isBlueTheme = index % 2 === 0; // Alternate between blue and pink
    const html = generateDiseaseHTML(disease, isBlueTheme);
    const filePath = path.join(__dirname, `${disease.id}.html`);
    
    fs.writeFileSync(filePath, html);
    console.log(`Generated: ${disease.id}.html`);
});

console.log('\nAll disease pages have been generated!');
