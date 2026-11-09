$(document).ready(function() {

    /* ==========================
       1. MENÚ HAMBURGUESA (slideToggle)
    ========================== */
    $('#hamburger').on('click', function() {
        $('#menu').slideToggle(300);
        
        // Cambiar icono
        const icon = $(this).find('i');
        if ($('#menu').is(':visible')) {
            icon.removeClass('fa-bars').addClass('fa-xmark');
        } else {
            icon.removeClass('fa-xmark').addClass('fa-bars');
        }
    });

    // Cerrar menú al hacer clic en un enlace (en móvil)
    $('.menu a').on('click', function() {
        if ($(window).width() <= 1024) {
            $('#menu').slideUp(300);
            $('#hamburger i').removeClass('fa-xmark').addClass('fa-bars');
        }
    });

    /* ==========================
       2. MODO OSCURO / CLARO
    ========================== */
    $('#modoBtn').on('click', function() {
        $('body').toggleClass('light-mode');
        const icon = $(this).find('i');
        
        if ($('body').hasClass('light-mode')) {
            icon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            icon.removeClass('fa-sun').addClass('fa-moon');
        }
    });

    /* ==========================
       3. FILTROS DE CATÁLOGO (fadeIn / hide)
    ========================== */
    $('.filter-btn').on('click', function() {
        // Cambiar botón activo
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        const filterValue = $(this).data('filter');

        // Ocultar todos y luego mostrar los que correspondan
        $('.product-card').hide(); // Uso de hide
        
        if (filterValue === 'todos') {
            $('.product-card').fadeIn(400); // Uso de fadeIn
        } else {
            $(`.product-card[data-category="${filterValue}"]`).fadeIn(400);
        }
    });

    // Si hacen clic en el menú de navegación superior, activar el filtro correspondiente
    $('.filter-link').on('click', function() {
        const filter = $(this).data('filter');
        $(`.filter-btn[data-filter="${filter}"]`).trigger('click');
    });

    /* ==========================
       4. MODAL DE REGISTRO
    ========================== */
    $('#abrirModal').on('click', function() {
        $('#modal').fadeIn(300).css('display', 'flex'); // Uso de fadeIn
    });

    function cerrarModal() {
        $('#modal').fadeOut(300); // Uso de fadeOut
    }

    $('.close-modal').on('click', cerrarModal);
    
    // Cerrar si se hace clic fuera del modal
    $(window).on('click', function(e) {
        if ($(e.target).is('#modal')) {
            cerrarModal();
        }
    });

    // Cerrar con la tecla Escape
    $(document).on('keydown', function(e) {
        if (e.key === "Escape") {
            cerrarModal();
        }
    });

    /* ==========================
       5. VALIDACIONES EN TIEMPO REAL (jQuery)
    ========================== */
    
    // Expresiones regulares
    const regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/;
    const regexNumeros = /^[0-9]+$/;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTelefono = /^[67][0-9]{7}$/; // 8 dígitos, empieza con 6 o 7
    const regexCI = /^[0-9]{5,10}$/;

    // Función para mostrar/ocultar error (Uso de show/hide)
    function validarCampo(inputId, condicion) {
        const $input = $('#' + inputId);
        const $group = $input.closest('.form-group');
        
        if (condicion) {
            $group.removeClass('error');
            $group.find('.error-msg').hide();
            return true;
        } else {
            $group.addClass('error');
            $group.find('.error-msg').show();
            return false;
        }
    }

    // --- Validaciones en tiempo real (evento input) ---
    
    $('#nombre, #apellido').on('input', function() {
        // Restringir a solo letras en tiempo real
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]/g, "");
        validarCampo(this.id, regexLetras.test(this.value) && this.value.length >= 2);
    });

    $('#ci, #telefono').on('input', function() {
        // Restringir a solo números en tiempo real
        this.value = this.value.replace(/\D/g, "");
        
        if (this.id === 'ci') {
            validarCampo('ci', regexCI.test(this.value));
        } else {
            validarCampo('telefono', regexTelefono.test(this.value));
        }
    });

    $('#ciudad').on('change', function() {
        validarCampo('ciudad', $(this).val() !== "");
    });

    $('#correo').on('input', function() {
        validarCampo('correo', regexCorreo.test($(this).val().trim()));
    });

    $('#password').on('input', function() {
        const val = $(this).val();
        // Mínimo 8 caracteres, 1 mayúscula, 1 número
        const esValida = val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val);
        validarCampo('password', esValida);
        
        // Si ya escribió en confirmar, volver a validar
        if ($('#confirmar').val() !== "") {
            $('#confirmar').trigger('input');
        }
    });

    $('#confirmar').on('input', function() {
        validarCampo('confirmar', $(this).val() === $('#password').val() && $(this).val() !== "");
    });

    $('#terminos').on('change', function() {
        if ($(this).is(':checked')) {
            $('#error-terminos').hide();
        } else {
            $('#error-terminos').show();
        }
    });

    /* ==========================
       6. ENVÍO DEL FORMULARIO
    ========================== */
    $('#registroForm').on('submit', function(e) {
        e.preventDefault();

        // Validar todos los campos manualmente al enviar
        let nombreOk = validarCampo('nombre', regexLetras.test($('#nombre').val().trim()) && $('#nombre').val().length >= 2);
        let apellidoOk = validarCampo('apellido', regexLetras.test($('#apellido').val().trim()) && $('#apellido').val().length >= 2);
        let ciOk = validarCampo('ci', regexCI.test($('#ci').val().trim()));
        let ciudadOk = validarCampo('ciudad', $('#ciudad').val() !== "");
        let telefonoOk = validarCampo('telefono', regexTelefono.test($('#telefono').val().trim()));
        let correoOk = validarCampo('correo', regexCorreo.test($('#correo').val().trim()));
        
        let passVal = $('#password').val();
        let passwordOk = validarCampo('password', passVal.length >= 8 && /[A-Z]/.test(passVal) && /[0-9]/.test(passVal));
        let confirmarOk = validarCampo('confirmar', $('#confirmar').val() === passVal && $('#confirmar').val() !== "");

        let terminosOk = true;
        if (!$('#terminos').is(':checked')) {
            $('#error-terminos').show(); // Uso de show
            terminosOk = false;
        } else {
            $('#error-terminos').hide();
        }

        // Si todo es correcto
        if (nombreOk && apellidoOk && ciOk && ciudadOk && telefonoOk && correoOk && passwordOk && confirmarOk && terminosOk) {
            alert("✅ ¡Cuenta VIP creada con éxito! Bienvenido a Velocity Kicks.");
            this.reset();
            // Ocultar todos los mensajes de error
            $('.error-msg').hide();
            $('.form-group').removeClass('error');
            cerrarModal();
        }
    });

    /* ==========================
       7. CARRITO (Simulación visual)
    ========================== */
    let cartCount = 0;
    
    $('.add-cart-btn').on('click', function() {
        cartCount++;
        $('.cart-count').text(cartCount);
        
        // Efecto visual de rebote en el carrito
        const $cartIcon = $('.cart-btn');
        $cartIcon.css('transform', 'scale(1.2)');
        setTimeout(() => $cartIcon.css('transform', 'scale(1)'), 200);
        
        // Animación del botón
        $(this).css('background-color', '#00d2ff').css('color', '#000');
        setTimeout(() => {
            $(this).css('background-color', '').css('color', '');
        }, 500);
    });

});