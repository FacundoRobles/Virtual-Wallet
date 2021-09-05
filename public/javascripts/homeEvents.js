const loginBtn = document.querySelector('#login');
const registerBtn = document.querySelector('#register');
const loginForm = document.querySelector('#loginForm');
const registerForm = document.querySelector('#registerForm');
const overlay = document.querySelector('.overlay');
const closeModal = document.querySelectorAll('.close-modal');

loginBtn.addEventListener('click', function(e){
    e.preventDefault();
    loginForm.classList.remove('hidden')
    overlay.classList.remove('hidden')
})
registerBtn.addEventListener('click', function(e){
    e.preventDefault();
    registerForm.classList.remove('hidden')
    overlay.classList.remove('hidden')
})

overlay.addEventListener('click', hideAll);

function hideAll (){
    loginForm.classList.add('hidden')
    registerForm.classList.add('hidden')
    overlay.classList.add('hidden')
};

for (let i = 0; i < closeModal.length; i++){
    closeModal[i].addEventListener('click', hideAll);
}

document.addEventListener('keydown', function (e) {
if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
    hideAll();
}
});
