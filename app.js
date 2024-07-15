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
const CategorieValide=["politique","sport","santé","édication"]

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
        let errorMessage = "Le libellé doit avoir au moins 5 et au plus 20 caractères.";
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
        const cart= document.createElement('cart');
        cart.innerHTML = `
        <div style="margin-left:5%;margin-right:5%;margin-top:18px">
            <h1 style="border-bottom:3px dotted #1b7247;">${data.categorie}</h1>
            <h3 style="margin-top:5%">${data.libelle}</h3>
            <p style="margin-top:5%">${data.message}</p>
          <div style="display:flex; justify-content:space-between;margin-top:20%;align-items: start;">
               <button onclick="toggleApproval(${index})" style="width:30%;color:white;height:2.5rem;border:none;border-radius:10px;background-color: ${data.approver ? '#ce0033' : '#1B7247'}">
    ${data.approver ? 'Désapprouver' : 'Approuver'}
</button>   
            <button onclick="deleteIdea(${index})" style="padding:8px;border:none;background-color: transparent;"><i class='fas fa-trash-alt' style='font-size:20px;color:red'></i></button>
            </div>
            </div>
        `;
        
        dataBody.appendChild(cart);
        dataBody.style="display:flex;border:3px solid #1B7247;flex-wrap:wrap;width:79.5rem;position: relative;";

       
        cart.style=`border:1px solid ${data.approver ? '#ce0033' : '#1B7247'};box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;margin:10px;height:20rem;width:25rem;`;
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

