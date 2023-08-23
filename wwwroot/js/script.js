let devInfo
let listJson
let defaultTheme = 'dark'
let theme

let themeDefinitions = {
    'light': {
        '--bg-color': '#ebebeb', '--text-color': '#262626', '--section-bg-color': '#ebebeb', '--form-bg-color': '#ccc'
    },
    'dark': {
        '--bg-color': '#101015', '--text-color': '#fff', '--section-bg-color': '#101015', '--form-bg-color': '#2d2d2d'
    }
}

let errorMessage = {
    'colors': {
        'NOT_FILLED': 'danger',
        'SUCCESS': 'success'
    },
    'messages': {
        'NOT_FILLED': 'Preencha todos os campos',
        'SUCCESS': 'Mensagem enviada com sucesso'
    }
}

$(document).ready(async function () {
    let year = new Date().getFullYear()
    let disclaimer = getCookie('disclaimer')
    if (disclaimer == "") {
        if (window.confirm("Ao entrar nesta página você está ciente de que só fazemos o anúncio dos produtos, não nos responsabilizamos pela sua aquisição de tal!")) {
            setCookie('disclaimer', true)
        } else {
            if (history.length > 1) { history.back() } else {
                window.close()
            }
        }
    }
    $("#current-year").text(year)
    await fetch('https://viikdev.github.io/userInfo/info.json')
        .then((res) => res.json())
        .then((data) => devInfo = data)
    try {
        await fetch('./wwwroot/json/list.json')
            .then(res => res.json())
            .then((data) => { if (data) listJson = data })
    } catch (error) { }
    populateCarousel(listJson)
    populateProducts(listJson)

    animationElements = document.querySelectorAll('.animate-on-scroll')
    let observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate')
            }
        })
    })
    for (let i = 0; i < animationElements.length; i++) {
        const el = animationElements[i];
        observer.observe(el)
    }

    document.documentElement.style.setProperty('--theme', defaultTheme)
    theme = document.documentElement.style.getPropertyValue('--theme')

    $("#theme-toggler i").addClass(theme == 'dark' ? 'fa-moon' : 'fa-sun')
    setThemeDefinitions(theme)

    let goToStore = getURLParameters()
    if (goToStore != "") {
        try {
            let owner = document.querySelector('[owner="' + decodeURI(goToStore) + '"')
            if ($(owner).is('[starred]')) {
                owner.scrollIntoView()
            }
        } catch (error) {
        }
    }
})

$("#theme-toggler").on('click', function () {
    event.preventDefault()
    if ($(".navbar-collapse.show").length > 0) {
        $(".navbar-toggler").click()
    }
    changeTheme(theme)
})

$(".designed-by").on('click', function () {
    window.open(devInfo.socials.instagram, '_blank')
})

$("[st]").on('click', function () {
    event.preventDefault();
    if ($(this).attr('st') == 'explore') {
        document.querySelector('[sect="explore"]').scrollIntoView();
    } else if ($(this).attr('st-star')) {
        document.querySelector('[owner="' + $(this).attr('st') + '"').scrollIntoView();
    }
    else {
        document.querySelector('#' + $(this).attr('st')).scrollIntoView();
    }
    $(this).blur()
})

$(".non-href").on('click', function () {
    event.preventDefault()
})

let prevScrollPos = window.pageYOffset;
const navbar = document.querySelector("nav");

function toggleNavbar() {
    const currentScrollPos = window.pageYOffset;
    let scrollOffset
    if (window.innerWidth < 500) {
        scrollOffset = 100
    } else {
        scrollOffset = 300
    }

    if (prevScrollPos > currentScrollPos) {
        navbar.style.top = 0
        navbar.style.transform = "translateY(0)";
    } else if (currentScrollPos > scrollOffset) {
        navbar.style.top = 0
        navbar.style.transform = "translateY(0)";
    } else if (currentScrollPos < scrollOffset && prevScrollPos > currentScrollPos) {
        navbar.style.top = 0
        navbar.style.transform = "translateY(0)";
    } else {
        navbar.style.top = -window.pageYOffset + "px"
        navbar.style.transform = "translateY(-100%)";
    }

    prevScrollPos = currentScrollPos;
}

window.addEventListener("scroll", toggleNavbar);

const styleVars = document.documentElement.style
// let animationElements = document.querySelectorAll('.animate-on-scroll')

// let observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//             entry.target.classList.add('animate')
//         }
//         // else { Add this to animate every time element appears on screen
//         // 	entry.target.classList.remove('animate')
//         // }
//     })
// })

// for (let i = 0; i < animationElements.length; i++) {
//     const el = animationElements[i];
//     observer.observe(el)
// }

function populateProducts({ users }) {
    let count = 0
    for (i in users) {
        let products = users[i].products
        let products_count = Object.keys(products).length
        let imgs = []
        let arr = []
        let prodImgs = {}
        let starred = false
        if (products_count > 0) {
            for (j in products) {
                prodImgs[j] = {}
                arr.push(j)
                imgs.push(...products[j].product_imgs)
                prodImgs[j]["imgs"] = products[j].product_imgs
                prodImgs[j]["desc"] = products[j].product_description
            }
        }
        for (j in products) {
            if (!starred) {
                starred = products[j].starred
            }
            else {
                break
            }
        }
        if (users[i].enabled) {
            $('.sect-wrapper').append(
                $(
                    `<section ${count == 0 ? "sect='explore'" : ""} owner='${splitToTwo(i, "-")}' ${starred ? "starred" : ""}>
                    <div class="left">
                        <div class="sect-description">
                            <div>
                                <span class="title"><!--<span class="desc" style="color:white;">Loja de:</span>--> ${splitToTwo(i, " ")}</span>
                                <span class="desc prod-list">${arr.join(", ")}</span>
                            </div>
                            <div>
                                <div>
                                    <span class="desc prod-name" disp-for="prod-name">${Object.keys(products)[0]}</span>
                                    <span class="desc prod-desc" disp-for="prod-desc">${products[Object.keys(products)[0]].product_description}</span>
                                </div>
                                <a href="#" class="order non-href whatsapp-redir animate-on-scroll" title="${users[i].user_contact}"><i class="fa fa-whatsapp"></i> Fazer pedido</a>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div id="carousel-client-${count}" class="carousel slide" data-bs-ride="carousel" style="width:100%;">
                            <div class="carousel-inner">
                                ${(function getImgs() {
                        const addDiv = (pn, i, d) => {
                            return `
                                        <div class="carousel-item${count2 == 0 ? " active" : ""}" prod-name="${pn}" prod-desc="${d}">
                                            ${count == 0 && count2 == 0 ? "<a class='click-on-img animate-on-scroll'>Clique em uma imagem para ampliá-la</a>" : ""}
                                            <img src="./wwwroot/img/products/${i}" class="d-block" alt="Image">
                                        </div>
                                        `
                        }
                        let tempStr = ``
                        let count2 = 0
                        for ([k, v] of Object.entries(prodImgs)) {
                            if (v['imgs'].length == 0) v['imgs'] = ["img-not-found.png"]
                            for (v2 of v['imgs']) {
                                tempStr += addDiv(k, v2, v['desc'])
                                count2++
                            }
                        }
                        return tempStr
                    })()
                    }
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-client-${count}" data-bs-slide="prev" style="z-index:2;">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carousel-client-${count}" data-bs-slide="next" style="z-index:2;">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                            <div class="carousel-label"><span disp-for="prod-name">${Object.keys(products)[0]}</span></div>
                        </div>
                    </div>
                    <div class="sect-fade"></div>
                </section>`
                )
            )
        }
        count++
    }
    $("img").unbind().on('error', function (e) {
        e.target.src = "./wwwroot/img/img-not-found.png"
        $(e.target).css('opacity', 0)
        $(e.target).parent().addClass("img-not-found")
    })
    $(".carousel button").parent().on('slide.bs.carousel', function () {
        if ($(this).attr('id') == "carousel") return

        $('.click-on-img').remove()

        setTimeout(() => {
            $(this).parent().parent().find('[disp-for="prod-name"]').each((_, el) => {
                if ($(this).find('.carousel-item-next').attr('prod-name') == undefined) {
                    $(el).text($(this).find('.carousel-item-prev').attr('prod-name'))
                } else {
                    $(el).text($(this).find('.carousel-item-next').attr('prod-name'))
                }
            })
            if ($(this).find('.carousel-item-next').attr('prod-desc') == undefined) {
                $(this).parent().parent().find('[disp-for="prod-desc"]').text($(this).find('.carousel-item-prev').attr('prod-desc'))
            } else {
                $(this).parent().parent().find('[disp-for="prod-desc"]').text($(this).find('.carousel-item-next').attr('prod-desc'))
            }
        }, 10)
    })
    $("[st]").unbind().on('click', function () {
        event.preventDefault();
        if ($(".navbar-collapse.show").length > 0) {
            $(".navbar-toggler").click()
        }
        if ($(this).attr('st') == 'explore') {
            document.querySelector('[sect="explore"]').scrollIntoView();
        } else if ($(this).is('[st-star]')) {
            document.querySelector('[owner="' + $(this).attr('st') + '"').scrollIntoView();
        }
        else {
            document.querySelector('#' + $(this).attr('st')).scrollIntoView();
        }
        $(this).blur()
    })
    $(".non-href").unbind().on('click', function () {
        event.preventDefault()
    })
    $(".whatsapp-redir").on('click', function (e) {
        let message = `Oi,+${$(e.target).parent().parent().find('.title').clone().children().remove().end().text().split(" ")[1]},+eu+gostaria+de+comprar+${$(e.target).parent().find('[disp-for="prod-name"]').text()}!`
        window.open(`https://wa.me/${$(e.target).attr('title')}?text=${message}`, "_blank")
    })
    $("#theme-toggler").unbind().on('click', function () {
        event.preventDefault()
        if ($(".navbar-collapse.show").length > 0) {
            $(".navbar-toggler").click()
        }
        changeTheme(theme)
    })
    $(".right").on('click', 'img', function (e) {
        let title = $(e.delegateTarget).parent().children('.left').find('[disp-for="prod-name"]').text()
        let desc = $(e.delegateTarget).parent().children('.left').find('[disp-for="prod-desc"]').text()
        w2popup.open({
            title: title,
            body: '<div class="w2ui-centered"><img title="' + desc + '" src="' + $(this).attr('src') + '"></img></div>'
        });
    });
    const animationElements = document.querySelectorAll('.animate-on-scroll')

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate')
            }
            // else { Add this to animate every time element appears on screen
            // 	entry.target.classList.remove('animate')
            // }
        })
    })

    for (let i = 0; i < animationElements.length; i++) {
        const el = animationElements[i];
        observer.observe(el)
    }
    // carouselJSReload()
}

// function populateCarousel({ users }) {
//     let arr = []
//     for (i in users) {
//         let products = users[i].products
//         let products_count = Object.keys(products).length
//         if (products_count > 0) {
//             for (j in products) {
//                 if (products[j].starred && users[i].enabled) {
//                     arr.push({ 'product': products[j], 'user': i, 'img': products[j].product_imgs[0] })
//                 }
//             }
//         }
//     }
//     if (arr.length > 0) {
//         $('#carousel .carousel-inner').empty()
//         arr.forEach((item, idx) => {
//             $('#carousel .carousel-inner').append(`
//             <div class="carousel-item${idx == 0 ? ' active' : ''}" st-star st="${splitToTwo(item.user, "-")}">
//                 <img src="./wwwroot/img/products/${item.img}" class="d-block" alt="Image">
//             </div>
//         `)
//         })
//     }
// }

function populateCarousel({ users }) {
    let arr = []
    for (i in users) {
        let products = users[i].products
        let products_count = Object.keys(products).length
        if (products_count > 0) {
            for (j in products) {
                if (products[j].starred && users[i].enabled) {
                    arr.push({ 'product_name': j, 'product': products[j], 'user': i, 'img': products[j].product_imgs[0] })
                }
            }
        }
    }
    if (arr.length > 0) {
        $('#mainSlides').empty()
        let slideCount = $('#slider').find('h2')
        slideCount.text(slideCount.text() + ` (${arr.length})`)
        arr.forEach((item, _) => {
            $('#mainSlides').append(`
            <div>
                <div class="slide" st-star st="${splitToTwo(item.user, "-")}">
                    <div class="slide-img" style="background-image: url('./wwwroot/img/products/${item.img}'), url('./wwwroot/img/img-not-found.png');"><a>${item.product_name}</a><a class="star-owner">${splitToTwo(item.user, " ")}</a></div>
                </div>
            </div>
        `)
        })
    } else {
        $('#mainSlides').empty()
        let slideCount = $('#slider').find('h2')
        slideCount.text(slideCount.text() + ' (5)')
        for (let i = 1; i <= 5; i++) {
            $('#mainSlides').append(`
                <div>
                    <div class="slide">
                        <div class="slide-img" style="background-image: url('./wwwroot/img/carousel-${i}.jpg'), url('./wwwroot/img/img-not-found.png');"><a>Ilustração ${i}</a></div>
                    </div>
                </div>
            `)
        }
    }
    var s = document.createElement('script');
    var s2 = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.4/min/tiny-slider.js';
    s2.src = './wwwroot/js/slider.js';
    s.defer = true
    s2.defer = true
    document.body.appendChild(s);
    setTimeout(() => {
        document.body.appendChild(s2);
    }, 1000)
}

$('.nav-link, .navbar-brand').on('click', function () {
    if ($(".navbar-collapse.show").length > 0) {
        $(".navbar-toggler").click()
    }
})

window.addEventListener('click', function (e) {
    if (!document.querySelector('nav').contains(e.target)) {
        if ($(".navbar-collapse.show").length > 0) {
            $(".navbar-toggler").click()
        }
    }
});

function splitToTwo(str, concat) {
    let strArray = str.split(" ")
    if (strArray.length > 1) {
        strArray = strArray[0].concat(concat, strArray[strArray.length - 1])
    }
    return strArray
}

// function carouselJSReload() {
//     $(".carousel button[data-bs-slide='next']").each((_, el) => {
//         let parent = $(el).parent()
//         if (parent.attr('id') != "carousel") {
//             parent.unbind().on('slide.bs.carousel', function () {
//                 parent.children('carousel-inner').children('carousel-item').each((_, el2) => {
//                     $(el2).css('opacity', $(el2).hasClass('active') ? 0 : 1)
//                 })
//             })
//         }
//     })
// }

function changeTheme(t) {
    theme = t == 'dark' ? 'light' : 'dark'
    if ($("#theme-toggler i").hasClass('fa-moon')) {
        $("#theme-toggler i").addClass('fa-sun')
        $("#theme-toggler i").removeClass('fa-moon')
    } else if ($("#theme-toggler i").hasClass('fa-sun')) {
        $("#theme-toggler i").addClass('fa-moon')
        $("#theme-toggler i").removeClass('fa-sun')
    }
    setThemeDefinitions(theme)
    return theme
}

function setThemeDefinitions(t) {
    let keys = Object.keys(themeDefinitions[t])
    keys.forEach(key => {
        let value = themeDefinitions[t][key]
        document.documentElement.style.setProperty(key, value)
    })
}

function sendMessage() {
    let message = `Tenho interesse em colocar um produto no UniVendas: - - - Nome: [nome_cliente] - - - Celular: [celular_cliente] - - - Produto: [nome_produto] - - - Descrição: [descricao_produto] - - - Categoria: [categoria_produto]`

    let data = getDataFromForm()
    if (!data) {
        return false
    }

    message = message.replace("[nome_cliente]", data.name).replace("[celular_cliente]", data.phone).replace("[nome_produto]", data.prodName).replace("[descricao_produto]", data.prodDesc).replace("[categoria_produto]", data.prodCategory)

    message = message.split(" ").join("+")
    window.open(`https://wa.me/14910049542?text=${message}`, "_blank")
    event.preventDefault()
    createAlert('.form-pre-wrapper', 'SUCCESS')
    return true
}

function getDataFromForm() {
    let form = "#form_message "
    let params = {}
    params.name = $(form + "[name='name']").val()
    params.phone = $(form + "[name='phone']").val()
    params.prodName = $(form + "[name='prod_name']").val()
    params.prodDesc = $(form + "[name='prod_desc']").val()
    params.prodCategory = $(form + "[name='prod_category']").val()
    for (i in params) {
        if (params[i] == '' || params[i] == undefined) {
            createAlert('.form-pre-wrapper', 'NOT_FILLED')
            return false
        }
    }
    $(form + "[name='name']").val('')
    $(form + "[name='phone']").val('')
    $(form + "[name='prod_name']").val('')
    $(form + "[name='prod_desc']").val('')
    $(form + "[name='prod_category']").val('')
    return params
}

function createAlert(el, msg) {
    $(el + ' .alert').remove()
    $(el).prepend(`
        <div class="alert alert-${errorMessage['colors'][msg]}" role="alert">
            ${errorMessage['messages'][msg]}
        </div>
    `)
    detectAlertClick()
}

function detectAlertClick() {
    $(".alert").unbind().on('click', function () {
        $(this).remove()
    })
}

// $("#searchButton").on('click', function () {
//     event.preventDefault()
//     let input = $(this).parent().children('input')
//     let users = listJson['users']
//     let results = []
//     if (input.val() != '') {
//         Object.keys(users).forEach(user => {
//             let p = users[user]
//             if (p.enabled) {
//                 if (user.search(input.val()) >= 0) {
//                     results.push(p)
//                 }
//             }
//         })
//     }
//     console.log(results)
// })

// for (let i = 0; i < 12; i++) {
//     $("#mainSlides").append('<div><div class="slide"><div class="slide-img"><a href="" class="link"></a></div></div></div>');
// }

// $(".slide .slide-img").each(function (i, obj) {
//     $(this).attr('style', 'background-image: url("' + data[numArray[i]].img + '");');
//     $(this).find('a').attr('href', data[numArray[i]].path);
//     $(this).find('a').text(data[numArray[i]].name);
//     $(this).find('a').attr('title', data[numArray[i]].name);
// });

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(nome, valor, dias) {
    diasms = (new Date()).getTime() + 1000 * 3600 * 24 * dias;
    dias = new Date(diasms);
    expires = dias.toGMTString();
    document.cookie = escape(nome) + "=" + escape(valor) + "; expires=" + expires;
}

function getURLParameters() {
    // let temp = window.location.href.replace(window.location.origin, "")
    // temp = temp.replace(temp[0], "").replace("#&", "")
    // console.log(temp)
    let temp = window.location.hash.replace(window.location.hash[0], "")
    return temp
}