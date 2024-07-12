const form = document.querySelector('#form');
const categorie = document.querySelector('#categorie');
const libelle = document.querySelector('#libelle');
const message = document.querySelector('#message');
const inputContainers = document.querySelectorAll('.input-container');
const contactForm = document.querySelector('.contact-form');
const errorDiv = document.querySelector('.erreur');
const dataBody = document.querySelector('#donnée');
const successDiv = document.querySelector('.success');

form.addEventListener('submit', e => {
    e.preventDefault();
    verification();
});

function verification() {
    const categorieValue = categorie.value.trim();
    const libelleValue = libelle.value.trim();
    const messageValue = message.value.trim();
    let isValid = true;

    if (categorieValue === "") {
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
        let errorMessage = "Le libellé doit avoir entre 5 et 20 caractères.";
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
        let errorMessage = "Le message doit avoir entre 20 et 255 caractères.";
        setError(message, errorMessage);
        isValid = false;
    } else {
        setSuccess(message);
    }

    if (isValid) {
        sauvegader(categorieValue, libelleValue, messageValue);
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
    form.classList.remove('active');
    form.classList.add('hidden');
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
        form.classList.add('active');
        form.classList.remove('hidden');
        errorDiv.style.display = 'none';
    }, 2000);
}

function sauvegader(categorie, libelle, message) {
    const data = {
        categorie,
        libelle,
        message,
        approver: false
    };
    let storedData = localStorage.getItem('formData');
    if (storedData) {
        storedData = JSON.parse(storedData);
    } else {
        storedData = [];
    }
    storedData.push(data);
    localStorage.setItem('formData', JSON.stringify(storedData));
    displayDonnée();
}

function displayDonnée() {
    let storedData = localStorage.getItem('formData');
    if (storedData) {
        storedData = JSON.parse(storedData);
    } else {
        storedData = [];
    }
    dataBody.innerHTML = '';
    storedData.forEach((data, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.categorie}</td>
            <td>${data.libelle}</td>
            <td>${data.message}</td>
            <td>
               <button onclick="toggleApproval(${index})" style="color:white;padding:10px;border:none;border-radius:10px;background-color: ${data.approver ? '#ce0033' : '#008000'}">
    ${data.approver ? 'Désapprouver' : 'Approuver'}
</button>

                
            </td>
            <td><button onclick="deleteIdea(${index})" style="color:white;background-color:#ce0033;padding:10px;border:none;border-radius:10px">Supprimer</button></td>
        `;
        dataBody.appendChild(row);
    });
}

function toggleApproval(index) {
    let storedData = JSON.parse(localStorage.getItem('formData'));
    storedData[index].approver = !storedData[index].approver;
    localStorage.setItem('formData', JSON.stringify(storedData));
    displayDonnée();
}

function deleteIdea(index) {
    let storedData = JSON.parse(localStorage.getItem('formData'));
    storedData.splice(index, 1);
    localStorage.setItem('formData', JSON.stringify(storedData));
    displayDonnée();
}

function displaySuccessMessage() {
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 2000);
}

// Affichez les données dès que la page est chargée
document.addEventListener('DOMContentLoaded', displayDonnée);
