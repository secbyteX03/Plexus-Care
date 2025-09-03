const fs = require('fs');
const path = require('path');

// Read the template file
const templatePath = path.join(__dirname, 'disease-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Disease data - we'll process one disease at a time
const disease = {
    id: 'tuberculosis',
    name: 'Tuberculosis (TB)',
    category: 'Infectious Diseases',
    overview: 'Tuberculosis (TB) is a potentially serious infectious disease that mainly affects the lungs. The bacteria that cause tuberculosis are spread from person to person through tiny droplets released into the air via coughs and sneezes.',
    keyFacts: [
        'Caused by Mycobacterium tuberculosis',
        'One of the top 10 causes of death worldwide',
        'About 10 million people fell ill with TB in 2020',
        '1.5 million people died from TB in 2020',
        'Treatable and curable with proper medication'
    ],
    symptoms: [
        'Cough that lasts 3 weeks or longer',
        'Chest pain',
        'Coughing up blood or sputum',
        'Fatigue',
        'Fever',
        'Night sweats',
        'Chills',
        'Loss of appetite',
        'Weight loss'
    ],
    causes: 'TB is caused by bacteria that spread from person to person through microscopic droplets released into the air. This can happen when someone with the untreated, active form of tuberculosis coughs, speaks, sneezes, spits, laughs, or sings.',
    treatment: 'Treatment for TB depends on whether a person has active TB disease or only TB infection. For active TB, a doctor will prescribe several special antibiotics that must be taken for at least 6 to 9 months.'
};

// Color schemes
const blueTheme = {
    primary: '#1e88e5',
    primaryDark: '#1565c0'
};

const pinkTheme = {
    primary: '#e91e63',
    primaryDark: '#c2185b'
};

// Generate HTML for the disease
function generateDiseaseHTML(disease, theme) {
    let html = template;
    
    // Replace placeholders with actual content
    html = html.replace(/\{\{PRIMARY_COLOR\}\}/g, theme.primary);
    html = html.replace(/\{\{PRIMARY_DARK\}\}/g, theme.pinkTheme);
    html = html.replace(/\{\{DISEASE_NAME\}\}/g, disease.name);
    
    // Replace content sections
    html = html.replace('{{OVERVIEW_CONTENT}}', `<p>${disease.overview}</p>`);
    
    // Generate key facts list
    const keyFactsHTML = disease.keyFacts.map(fact => `<li>${fact}</li>`).join('\n                    ');
    html = html.replace('{{KEY_FACTS}}', keyFactsHTML);
    
    // Generate symptoms list
    const symptomsHTML = `
        <p>Common symptoms of ${disease.name.split('(')[0].trim()} include:</p>
        <ul>
            ${disease.symptoms.map(symptom => `<li>${symptom}</li>`).join('\n            ')}
        </ul>`;
    html = html.replace('{{SYMPTOMS_CONTENT}}', symptomsHTML);
    
    // Add causes content
    html = html.replace('{{CAUSES_CONTENT}}', `<p>${disease.causes}</p>`);
    
    // Add treatment content
    html = html.replace('{{TREATMENT_CONTENT}}', `<p>${disease.treatment}</p>`);
    
    return html;
}

// Generate the page
const theme = Math.random() > 0.5 ? blueTheme : pinkTheme; // Randomly select theme
const html = generateDiseaseHTML(disease, theme);
const outputPath = path.join(__dirname, `${disease.id}.html`);

// Write the file
fs.writeFileSync(outputPath, html);
console.log(`Generated: ${disease.id}.html`);
