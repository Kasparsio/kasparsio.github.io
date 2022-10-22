$(document).ready(function(){
    $('.carousel__inner').slick({
        speed: 1200,
        /* adaptiveHeight: true, */
        prevArrow: '<button type="button" class="slick-prev"><img src="icons/left.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="icons/right.svg"></button>',
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    dots: true,
                    arrows: false,
                }
            }
        ]
    });

    //Настройка табов каталога

    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function() {
    $(this)
        .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
        .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
    });

/*     $('.catalog-item__link').each(function(i) {
        $(this).on('click', function(e) {
            e.preventDefault();
            $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
            $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
        })
    });

    $('.catalog-item__back').each(function(i) {
        $(this).on('click', function(e) {
            e.preventDefault();
            $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
            $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
        })
    }); */

    function toggleSlide(item) { // объединение предыдущих двух закоммент. блоков
        $(item).each(function(i) {
            $(this).on('click', function(e) {
                e.preventDefault();
                $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
                $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
            })
        });
    };

    toggleSlide('.catalog-item__link');
    toggleSlide('.catalog-item__back');

    // Модальные окна

    $('[data-modal=consultation]').on('click', function() {
        $('.overlay, #consultation').fadeIn('slow');
    });
    $('.modal__close').on('click', function() {
        $('.overlay, #consultation, #order, #thanks').fadeOut('slow');
    });

    // Модальное окно "купить", подставление title из карточки товара

    $('.button_mini').each(function(i) {
        $(this).on('click', function() {
            $('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
            $('.overlay, #order').fadeIn('slow');
        });
    });

    //Валидация форм (подключаемый плагин)

    /* $('#consultation-form').validate(); //Валидация 1 формы
    $('#consultation form').validate({ //Валидация 2 формы
        rules: { // Правила валидации
            name: 'required', //Обязательность поля name (в name в input)
            phone: 'required', //Обязательность поля phone
            email: { //правила для поля email
                required: true, //обязательность
                email: true //корректный email
            }
        },
        messages: { //Сообщения при ошибках валидации
            name: "Пожалуйста, введите своё имя",
            phone: "Пожалуйста, введите свой номер телефона",
            email: {
              required: "Пожалуйста, введите свой email",
              email: "Пожалуйста, введите адрес правильно"
            }
        }
    });
    $('#order form').validate(); //Валидация 3 формы */

    //Оптимизация, создание функции для передачи формы, чтобы не копировать правила валидации для каждой

    function validateForms(form){
        $(form).validate({ //Валидация формы
            rules: { // Правила валидации
                name: 'required', //Обязательность поля name (в name в input)
                phone: 'required', //Обязательность поля phone
                email: { //правила для поля email
                    required: true, //обязательность
                    email: true //корректный email
                }
            },
            messages: { //Сообщения при ошибках валидации
                name: "Пожалуйста, введите своё имя",
                phone: "Пожалуйста, введите свой номер телефона",
                email: {
                  required: "Пожалуйста, введите свой email",
                  email: "Пожалуйста, введите адрес правильно"
                }
            }
        });
    };

    validateForms('#consultation-form');
    validateForms('#consultation form');
    validateForms('#order form');

    // Настройка маски ввода номера телефона в формах

    $('input[name=phone]').mask("+9 (999) 999-99-99"); //Маска ввода для всех полей input с name='phone'

    // Настройка AJAX (подгрузка с сервера без обновления страницы), отправка данных на почту и очистка формы

    $('form').submit(function(e) { // Выбор всех форм и функция при их подтверждении
        e.preventDefault(); // Отмена стандартного поведения браузера (отмена стандартной перезагрузки страницы при submit)
        $.ajax({ // Обмен данных с сервером без перезагрузки страницы
            type: "POST", // Тип передачи: отправка на сервер
            url: "mailer/smart.php", // Выбор обработчика задачи
            data: $(this).serialize() // Что отправляем (this - то, с чем сейчас работаем)
        }).done(function() { //Действия при успешном обмене
            $(this).find("input").val(""); //В этих формах найти поля input и задать им пустое значение val
            $('#consultation, #order').fadeOut(); // Исчезновение модальных окон
            $('.overlay, #thanks').fadeIn('slow'); // Появление окна благодарности

            $('form').trigger('reset'); // Выбрать все формы и очистить
        });
        return false;
    });

    // Прописание скрипта кнопки "вверх" (Smooth scroll and page up)

    $(window).scroll(function() { //выполнение функции при скролле окна
        if ($(this).scrollTop() > 1600) { // Если проскроленное расстояние более 1600 px
            $('.pageup').fadeIn(); // то ссылка pageup будет появляться
        } else { // иначе
            $('.pageup').fadeOut(); // ссылка pageup будет пропадать
        }
    });

    // Скрипт на плавную прокрутку (chrome работает и без него, хз как в других)

    /* $("a[href=#up]").click(function() { // в ссылке #up при клике на неё выполняется функция
        const _href = $(this).attr("href"); // создаём переменую _href и передаём в неё значение атрибута href нажатой ссылки
        $("html, body").animate({scrollTop: $(_href).offset().top+"px"}); // анимация плавного пролистывания к нужному якорю
        return false;
    }); */

    // Подключение wow.js (анимации при прокрутке)

    new WOW().init();
});