const form = document.querySelector('#form');
const categorie = document.querySelector('#categorie');
const libelle = document.querySelector('#libelle');
const message = document.querySelector('#message');
const inputContainers = document.querySelectorAll('.input-container');
const errorDiv = document.querySelector('.erreur');
const successDiv = document.querySelector('.success');

// Fonction de sauvegarde
async function sauvegarder(categorieValue, libelleValue, messageValue) {
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkaWZrYXNtZ2t4YmNpb2J3dmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwNTY2MzQsImV4cCI6MjAzNjYzMjYzNH0.fbmi3jHaJf9s4k70FuW_1n1hoNjWg1-I6k3xiDd7K6g";
    const url = "https://pdifkasmgkxbciobwvko.supabase.co";
    const database = supabase.createClient(url, key);

    try {
        const { data, error } = await database
            .from('idée')
            .insert([
                { categorie: categorieValue, libelle: libelleValue, message: messageValue }
            ]);

        if (error) {
            console.error('Error inserting data:', error.message);
        } else {
            console.log('Data inserted successfully:', data);
        }
    } catch (error) {
        console.error('Error inserting data:', error.message);
    }
}
const getIdée=async()=>{
    let cart=document.getElementById('row');
    
}

// Fonction de vérification
function verification() {
    const categorieValue = categorie.value.trim();
    const libelleValue = libelle.value.trim();
    const messageValue = message.value.trim();
    let isValid = true;
    const CategorieValide = ["politique", "sport", "sante", "education"];

    if (categorieValue === "" || !CategorieValide.includes(categorieValue)) {
        let errorMessage = "La catégorie ne peut pas être vide.";
        setError(categorie, errorMessage);
        isValid = false;
    } else {
        setSuccess(categorie);
    }

    if (libelleValue === "") {
        let errorMessage = "Le libellé ne peut pas être vide.";
        setError(libelle, errorMessage);
        isValid = false;
    } else if (!libelleValue.match(/^[a-zA-Z]/)) {
        let errorMessage = "Le libellé doit commencer par une lettre.";
        setError(libelle, errorMessage);
        isValid = false;
    } else if (libelleValue.length < 5 || libelleValue.length > 100) {
        let errorMessage = "Le libellé doit avoir au moins 5 et au plus 100 caractères.";
        setError(libelle, errorMessage);
        isValid = false;
    } else {
        setSuccess(libelle);
    }

    if (messageValue === "") {
        let errorMessage = "Le message ne doit pas être vide.";
        setError(message, errorMessage);
        isValid = false;
    } else if (!messageValue.match(/^[a-zA-Z]/)) {
        let errorMessage = "Le message doit commencer par une lettre.";
        setError(message, errorMessage);
        isValid = false;
    } else if (messageValue.length < 20 || messageValue.length > 255) {
        let errorMessage = "Le message doit avoir au moins 20 et au plus 255 caractères.";
        setError(message, errorMessage);
        isValid = false;
    } else {
        setSuccess(message);
    }

    if (isValid) {
        sauvegarder(categorieValue, libelleValue, messageValue);
        displaySuccessMessage();
        form.reset();
    } else {
        voireError();
    }
}

function setError(elem, message) {
    let formControl = elem.parentElement;
    const small = formControl.querySelector('small');
    small.innerText = message;
    formControl.className = "input-container error";
}

function setSuccess(elem) {
    let formControl = elem.parentElement;
    formControl.className = "input-container success";
}

function voireError() {
    let errorMessages = '';
    inputContainers.forEach(container => {
        if (container.classList.contains('error')) {
            const errorMessage = container.querySelector('small').innerText;
            errorMessages += `<p>${errorMessage}</p>`;
        }
    });
    errorDiv.innerHTML = errorMessages;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 2000);
}

function displaySuccessMessage() {
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 2000);
}

// Ajouter un écouteur d'événement pour le formulaire
form.addEventListener('submit', (e) => {
    e.preventDefault();
    verification();
});
