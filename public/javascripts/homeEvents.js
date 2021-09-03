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
        for (let i = 0; i < closeModal.length; i++){
            closeModal[i].addEventListener('click', function(){
                    loginForm.classList.add('hidden')
                    registerForm.classList.add('hidden')
                    overlay.classList.add('hidden')
            });
        }

        document.addEventListener('keydown', function (e) {
        // console.log(e.key);

        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
            loginForm.classList.add('hidden')
            registerForm.classList.add('hidden')
            overlay.classList.add('hidden')
        }
});