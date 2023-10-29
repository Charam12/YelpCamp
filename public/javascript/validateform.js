(() => {
    'use strict'

    bsCustomFileInput.init()

    var forms = document.querySelectorAll('.form-validation');

    Array.from(forms)
        .forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false)
        })
})()