let didScroll = false;
const changeHeaderOn = 200;

const ids = ['#home', '#about', '#skills', '#blogs', '#contact'];
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let mediumArticles = [];
let scalerArticles = [{
    'link': './report1.pdf',
    'title': 'Forensic and security research',
    'pubDate': 'December 24, 2021',
    'content': 'This assignment explores tools for efficient forensic analysis. Dcfldd ensures disk integrity, extracting key information. Bulk-extractor uncovers hidden data like email addresses and credit card numbers. The aim is to gather evidence systematically.',
    'thumbnail': './images/ff.png',
}];

scalerArticles.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
});

scalerArticles.reverse();

const getArticleDOM = function(article) {
    const content = article.content.replace(/<\/?[^>]+>/ig, " ").substring(0, 400);
    const articleLink = article.link.split('?')[0];
    const date = new Date(article.pubDate.replace(/-/g, "/"));

    const pubDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    const imgTag = article.thumbnail.length > 0 ? `<img src="${article.thumbnail}" alt="${article.title}">` : "";

    return `<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 blog box no-border no-padding">
                <a href="${articleLink}" target="_blank">
                    ${imgTag}
                    <div class="content">
                        <h5>${article.title}</h5>
                        <p class="description">${content}</p>
                    </div>
                </a>
            </div>`;
}

const getArticles = function() {
    const data = {
        rss: "https://medium.com/feed/@ganeshkumarm1"
    };

    $.get(
        "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40ganeshkumarm1",
        data,
        function(response) {
            mediumArticles = response.items;
            mediumArticles = mediumArticles.slice(0, 3);

            let articlesDOM = "";

            for (const mediumArticle of scalerArticles) {
                articlesDOM += getArticleDOM(mediumArticle);
            }

            $('#blogs div.blogs').prepend(articlesDOM);
        });
}

const renderScalerArticles = function() {
    let articleDOM = "";

    for (const scalerArticle of scalerArticles) {
        articleDOM += getArticleDOM(scalerArticle);
    }

    $('#blogs div.scaler-blogs').prepend(articleDOM);
}

$(function() {


    $(".dropdown-menu li a").on('click', function() {
        const text = $(this).text();
        const classname = text.substring(0, 2).toLowerCase();

        $('#dropdown-value').text(text);

        $('.' + (classname === 'en' ? 'ta' : 'en')).css('display', 'none');
        $('.' + classname).css('display', 'inline-block');
    });

    const scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: '#menu',
    })

    if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
        $("#wrapper").toggleClass("toggled");
    }

    getArticles();
    renderScalerArticles();

    $(window).on('load', function() {
        $('.loader-wrapper').fadeOut(300);
    });

    $("#menu-toggle").on(
        'click',
        function(e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });


    $('.sidebar-heading').on(
        'click',
        function(e) {
            e.preventDefault();
            $('#wrapper').toggleClass("toggled");
        });

    $('.navbar-brand').on(
        'click',
        function(e) {
            const id = this.href.split('#')[1];
            addNavBg('#' + id);
            $('#wrapper').toggleClass("toggled");
        });

    let curr = 0;

    $('body').on('keydown', function(e) {
        if (e.code === 'ArrowDown') {
            curr += 1;
            if (curr >= ids.length) curr = ids.length - 1;
        } else if (e.code === 'ArrowUp') {
            curr -= 1;
            if (curr < 0) curr = 0;
        } else if (e.code === 'Escape') {
            $('#wrapper').toggleClass("toggled");
        }

        if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
            addNavBg(ids[curr]);
            $('html, body').animate({
                scrollTop: $(ids[curr]).offset().top
            }, 100, 'easeOutBounce');
        }

    });

    $("a").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();

            const hash = this.hash;

            addNavBg(hash);

            $('body').animate({
                scrollTop: $(hash).offset().top
            }, 100, 'swing', function() {
                window.location.hash = hash;
            });

            $('#wrapper').toggleClass("toggled");
            $(hash + '-nav').addClass('active');
        }
    });

    window.addEventListener('scroll', function(event) {
        if (!didScroll) {
            didScroll = true;
            setTimeout(scrollPage, 250);
        }
    }, false);
});

const addNavBg = function(id) {
    if (id === '#home') {
        $('.navbar').removeClass('navbar-bg')
    } else {
        $('.navbar').addClass('navbar-bg')
    }
}

function scrollPage() {
    const sy = scrollY();
    if (sy >= changeHeaderOn) {
        $('.navbar').addClass('navbar-bg');
    } else {
        $('.navbar').removeClass('navbar-bg');
    }
    didScroll = false;
}

function scrollY() {
    return window.pageYOffset || document.documentElement.scrollTop;
}