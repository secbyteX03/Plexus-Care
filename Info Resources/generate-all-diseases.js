const fs = require('fs');
const path = require('path');

// Read the template file
const templatePath = path.join(__dirname, 'disease-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Disease data
const diseases = [
    // Infectious Diseases
    {
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
    },
    {
        id: 'hiv-aids',
        name: 'HIV & AIDS',
        category: 'Infectious Diseases',
        overview: 'HIV (human immunodeficiency virus) attacks the body\'s immune system, specifically the CD4 cells (T cells), which help the immune system fight off infections.',
        keyFacts: [
            'HIV is a lifelong condition',
            'No effective cure exists',
            'Can be controlled with proper medical care',
            '38 million people living with HIV worldwide',
            '1.7 million people became newly infected in 2019'
        ],
        symptoms: [
            'Fever',
            'Chills',
            'Rash',
            'Night sweats',
            'Muscle aches',
            'Sore throat',
            'Fatigue',
            'Swollen lymph nodes',
            'Mouth ulcers'
        ],
        causes: 'HIV is spread through contact with certain body fluids from a person with HIV, most commonly during unprotected sex or through sharing injection drug equipment.',
        treatment: 'There is no cure for HIV, but it can be controlled with proper medical care. Treatment involves taking medicine called antiretroviral therapy (ART).'
    },
    // Add more diseases here following the same structure
    {
        id: 'malaria',
        name: 'Malaria',
        category: 'Infectious Diseases',
        overview: 'Malaria is a life-threatening disease caused by parasites that are transmitted to people through the bites of infected female Anopheles mosquitoes.',
        keyFacts: [
            'Caused by Plasmodium parasites',
            'Transmitted through the bites of infected mosquitoes',
            'In 2019, there were an estimated 229 million cases worldwide',
            'Estimated 409,000 deaths from malaria in 2019',
            'Preventable and curable'
        ],
        symptoms: [
            'Fever and chills',
            'Headache',
            'Nausea and vomiting',
            'Muscle pain and fatigue',
            'Sweating',
            'Chest or abdominal pain',
            'Cough'
        ],
        causes: 'Malaria is caused by Plasmodium parasites that are spread to people through the bites of infected female Anopheles mosquitoes.',
        treatment: 'Malaria is treated with prescription drugs to kill the parasite. The types of drugs and the length of treatment will vary, depending on the type of malaria, the severity of symptoms, age, and whether you\'re pregnant.'
    },
    {
        id: 'typhoid',
        name: 'Typhoid Fever',
        category: 'Infectious Diseases',
        overview: 'Typhoid fever is a life-threatening illness caused by the bacterium Salmonella Typhi. It is usually spread through contaminated food or water.',
        keyFacts: [
            'Caused by Salmonella Typhi',
            '11-21 million cases occur worldwide each year',
            'Causes an estimated 128,000-161,000 deaths each year',
            'Most common in areas with poor sanitation',
            'Can be prevented with vaccination'
        ],
        symptoms: [
            'High fever',
            'Headache',
            'Stomach pain',
            'Constipation or diarrhea',
            'Loss of appetite',
            'Rash',
            'Weakness and fatigue'
        ],
        causes: 'Typhoid fever is caused by Salmonella Typhi bacteria. The bacteria are passed on by eating food or drinking water that has been contaminated by someone who is infected or who is a carrier of the disease.',
        treatment: 'Typhoid fever is treated with antibiotics. Drug resistance is increasingly common, so your doctor may need to order special tests to determine which strain of bacteria is causing your infection.'
    },
    {
        id: 'pneumonia',
        name: 'Pneumonia',
        category: 'Infectious Diseases',
        overview: 'Pneumonia is an infection that inflames the air sacs in one or both lungs, which may fill with fluid or pus. It can range in seriousness from mild to life-threatening.',
        keyFacts: [
            'Can be caused by viruses, bacteria, or fungi',
            'Leading cause of death in children under 5 years old',
            'Accounted for 14% of all deaths of children under 5 years old in 2019',
            'Can be prevented by vaccines, adequate nutrition, and addressing environmental factors',
            'Most common in South Asia and sub-Saharan Africa'
        ],
        symptoms: [
            'Cough with phlegm or pus',
            'Fever, sweating and shaking chills',
            'Shortness of breath',
            'Chest pain when breathing or coughing',
            'Fatigue',
            'Nausea, vomiting or diarrhea',
            'Confusion (especially in older adults)'
        ],
        causes: 'Pneumonia can be caused by a variety of organisms, including bacteria, viruses, and fungi. The most common are: Streptococcus pneumoniae, Respiratory syncytial virus (RSV), and in some cases, the virus that causes COVID-19.',
        treatment: 'Treatment depends on the type of pneumonia you have, how severe your symptoms are, your age, and your overall health. Many cases can be treated at home with rest, antibiotics if it\'s bacterial, and by drinking plenty of fluids.'
    },
    {
        id: 'diarrheal-diseases',
        name: 'Diarrheal Diseases',
        category: 'Infectious Diseases',
        overview: 'Diarrheal disease is the second leading cause of death in children under five years old, and is responsible for killing around 525,000 children every year.',
        keyFacts: [
            'Leading cause of malnutrition in children under five',
            '1.7 billion cases of childhood diarrheal disease every year',
            'Causes 9% of all deaths in children under five',
            'Most common in developing countries with poor sanitation',
            'Preventable and treatable'
        ],
        symptoms: [
            'Loose, watery stools',
            'Abdominal cramps',
            'Abdominal pain',
            'Fever',
            'Blood in the stool',
            'Bloating',
            'Nausea',
            'Urgent need to have a bowel movement'
        ],
        causes: 'Diarrheal diseases are caused by a variety of bacteria, viruses, and parasites. Most cases are caused by contaminated food or water. Poor hygiene and sanitation can increase the risk of infection.',
        treatment: 'Treatment involves replacing lost fluids and electrolytes to prevent dehydration. In some cases, medications may be needed to treat the underlying infection. Oral rehydration solution (ORS) is the most effective treatment for dehydration caused by diarrhea.'
    }
    // Add more diseases as needed
];

// Color schemes
const themes = [
    { // Blue theme
        primary: '#1e88e5',
        primaryDark: '#1565c0'
    },
    { // Pink theme
        primary: '#e91e63',
        primaryDark: '#c2185b'
    }
];

// Generate HTML for a disease
function generateDiseaseHTML(disease, theme) {
    let html = template;
    
    // Replace placeholders with actual content
    html = html.replace(/\{\{PRIMARY_COLOR\}\}/g, theme.primary);
    html = html.replace(/\{\{PRIMARY_DARK\}\}/g, theme.primaryDark);
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

// Generate all disease pages
diseases.forEach((disease, index) => {
    const theme = themes[index % themes.length]; // Alternate between themes
    const html = generateDiseaseHTML(disease, theme);
    const outputPath = path.join(__dirname, `${disease.id}.html`);
    
    // Write the file
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: ${disease.id}.html`);
});

console.log('\nAll disease pages have been generated!');
