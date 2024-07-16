const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkaWZrYXNtZ2t4YmNpb2J3dmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwNTY2MzQsImV4cCI6MjAzNjYzMjYzNH0.fbmi3jHaJf9s4k70FuW_1n1hoNjWg1-I6k3xiDd7K6g";
const url = "https://pdifkasmgkxbciobwvko.supabase.co";
const database = supabase.createClient(url, key);

const form = document.querySelector('#form');
const categorie = document.querySelector('#categorie');
const libelle = document.querySelector('#libelle');
const message = document.querySelector('#message');
const inputContainers = document.querySelectorAll('.input-container');
const errorDiv = document.querySelector('.erreur');
const successDiv = document.querySelector('.success');

let storedData = [];

// Fonction de sauvegarde
async function sauvegarder(categorieValue, libelleValue, messageValue) {
    try {
        const { data, error } = await database
            .from('idée')
            .insert([
                { categorie: categorieValue, libelle: libelleValue, message: messageValue, statut: false }
            ]);

        if (error) {
            console.error('Erreur lors de l\'insertion des données:', error.message);
        } else {
            console.log('Données insérées avec succès:', data);
            afficherDonnees();
        }
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données:', error.message);
    }
}

// Fonction pour afficher les données depuis la base de données
async function afficherDonnees() {
    try {
        const { data, error } = await database
            .from('idée')
            .select();

        if (error) {
            throw error;
        } else {
            storedData = data;
            afficherSurPage();
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
    }
}

// Fonction pour afficher les données sur la page
function afficherSurPage() {
    const dataBody = document.getElementById('donneesContainer');
    dataBody.innerHTML = '';
    storedData.forEach((data, index) => {
        const cart = document.createElement('div');
        cart.innerHTML = `
            <div style="margin-left:5%;margin-right:5%;margin-top:18px">
                <h1 style="border-bottom:3px dotted #1b7247;">${data.categorie}</h1>
                <h3 style="margin-top:5%">${data.libelle}</h3>
                <p style="margin-top:5%">${data.message}</p>
                <div style="display:flex; justify-content:space-between;margin-top:20%;align-items: start;">
                    <button onclick="toggleApproval(${index})" style="width:30%;color:white;height:2.5rem;border:none;border-radius:10px;background-color: ${data.statut ? '#ce0033' : '#1B7247'}">
                        ${data.statut ? 'Désapprouver' : 'Approuver'}
                    </button>  
                    <button onclick="deleteIdea(${index})" style="padding:8px;border:none;background-color: transparent;">
                        <i class='fas fa-trash-alt' style='font-size:20px;color:red'></i>
                    </button>
                </div>
            </div>
        `;
        dataBody.appendChild(cart);
        dataBody.style = "display:flex;border:3px solid #1B7247;flex-wrap:wrap;width:79.5rem;position: relative;";
        cart.style = `border:1px solid ${data.statut ? '#ce0033' : '#1B7247'};box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;margin:10px;height:20rem;width:25rem;`;
    });

}
document.addEventListener("DOMContentLoaded", () => {
   
    afficherSurPage();
});

// Fonction pour approuver ou désapprouver une idée
async function toggleApproval(index) {
    let item = storedData[index];
    if (item) {
        let newStatut = !item.statut;

        try {
            const { data: updatedData, error } = await database
                .from('idée')
                .update({ statut: newStatut })
                .eq('id', item.id);

            if (error) {
                console.error('Erreur lors de la mise à jour :', error);
            } else {
                item.statut = newStatut;
                localStorage.setItem('formData', JSON.stringify(storedData));
                afficherSurPage();
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour :', error.message);
        }
    }
}

// Fonction pour supprimer une idée
async function deleteIdea(index) {
    let item = storedData[index];
    if (item) {
        try {
            console.log('Suppression de l\'idée avec ID :', item.id); 
            const { data: deletedData, error } = await database
                .from('idée')
                .delete()
                .eq('id', item.id);

            if (error) {
                console.error('Erreur lors de la suppression :', error.message);
            } else {
                console.log('Données supprimées avec succès :', deletedData); 
                storedData.splice(index, 1);
                localStorage.setItem('formData', JSON.stringify(storedData));
                afficherSurPage();
            }
        } catch (error) {
            console.error('Erreur lors de la suppression :', error.message);
        }
    }
}


// Appel initial pour afficher les données
document.addEventListener('DOMContentLoaded', () => {
    const localData = localStorage.getItem('formData');
    if (localData) {
        storedData = JSON.parse(localData);
    }
    afficherDonnees();
});

// Fonction de vérification du formulaire
function verification() {
    const categorieValue = categorie.value.trim();
    const libelleValue = libelle.value.trim();
    const messageValue = message.value.trim();
    let isValid = true;
    const CategorieValide = ["politique", "sport", "santé", "éducation"];

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
        let errorMessage = "Le libellé doit avoir entre 5 et 100 caractères.";
        setError(libelle, errorMessage);
        isValid = false;
    } else {
        setSuccess(libelle);
    }

    if (messageValue === "") {
        let errorMessage = "Le message ne peut pas être vide.";
        setError(message, errorMessage);
        isValid = false;
    } else if (!messageValue.match(/^[a-zA-Z]/)) {
        let errorMessage = "Le message doit commencer par une lettre.";
        setError(message, errorMessage);
        isValid = false;
    } else if (messageValue.length < 20 || messageValue.length > 255) {
        let errorMessage = "Le message doit avoir entre 20 et 255 caractères.";
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

// Fonction pour définir une erreur sur un champ de formulaire
function setError(elem, message) {
    let formControl = elem.parentElement;
    const small = formControl.querySelector('small');
    small.innerText = message;
    formControl.className = "input-container error";
}

// Fonction pour définir un succès sur un champ de formulaire
function setSuccess(elem) {
    let formControl = elem.parentElement;
    formControl.className = "input-container success";
}

// Fonction pour afficher les messages d'erreur
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

// Fonction pour afficher le message de succès
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
