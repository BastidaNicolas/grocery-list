// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********

// Submit form
form.addEventListener('submit', addItem);
//clear items
clearBtn.addEventListener('click', clearItems);
// load items
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********

function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString(); //This is not how you make an id the proper way

    if (value && !editFlag) { //Adds value to list //You can do !value(false) or value(true) to check if the string is empty or not.
        createListItem(id, value);
        // display alert
        displayAlert('item added to list', 'success');
        //show container
        container.classList.add('show-container');
        //add to local storage
        addToLocalStorage(id, value);
        //set back to default
        setBackToDefault();

    } else if (value && editFlag) { //Edit value in list
        //changes value displayed in item
        editElement.innerHTML = value;
        displayAlert('Value chamged', 'success');
        //changes value in local storge
        editLocalStorage(editID, value);
        setBackToDefault();
    } else { //Do nothing if value is empty and editFlag is false
        displayAlert('Please enter value', 'danger');
    }
}

// Display alert
function displayAlert(text, action) {
    alert.textContent = text; //adds "alert" text to what you entered
    alert.classList.add(`alert-${action}`);// adds the class from the css depending if it's "success" or "danger"

    // remove alert
    setTimeout(function () {
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

//delete item
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length == 0) {
        container.classList.remove('show-container');
    }
    displayAlert('item removed', 'danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

//edit item
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // set idit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}

// clear all items from list
function clearItems() {
    const items = document.querySelectorAll('.grocery-item');

    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        });
    }
    container.classList.remove('show-container');
    displayAlert('empty list', 'danger');
    localStorage.removeItem('list');
    setBackToDefault();
}

//set back to default
function setBackToDefault() {
    grocery.value = '';
    editFlag = false;
    editID = '';
    submitBtn.textContent = 'submit';
}

// ****** LOCAL STORAGE **********

//add to local storage
function addToLocalStorage(id, value) {
    const grocery = { id, value }; //in ES6 if both names are the same you dont have to place it like this you could just put "id, value"
    let items = getLocalStorage();
    items.push(grocery); //adding an item submitted to the array of items
    localStorage.setItem('list', JSON.stringify(items)); //passing the array of items into local storage
}

// remove from local storage
function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter(function (item) {
        // goes through the array of items and just returns the elements that dont match the id
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items)); //passing the array of items into local storage
}

// edit from local storage
function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items)); //passing the array of items into local storage
}

//  get array from local storage, udsed in the start of every function that needs values stored in the local storage
function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []; //find this item in local storage and if it is there then return it, if not then return null
}


//localStorage API
// setItem
// getItem
// removeItem
// save as strings

// ****** SETUP ITEMS **********

// itterate through array and display at startup
function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id, item.value);
        });
        container.classList.add('show-container');
    }
}

// adding an HTML element (blueprint for each item)
function createListItem(id, value){
    const element = document.createElement('article');
    //add class
    element.classList.add('grocery-item');
    //add id
    const attribute = document.createAttribute('data-id');
    attribute.value = id;
    element.setAttributeNode(attribute);
    element.innerHTML = `<p class="title">${value}</p>
                        <div class="btn-container">
                        <button type="button" class="edit-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                        </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    //append child
    list.appendChild(element);
}
