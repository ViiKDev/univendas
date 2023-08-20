let slider = tns({
    container: ".my-slider",
    "slideBy": 1,
    "speed": 400,
    "nav": false,
    "rewind": true,
    "autoplay": true,
    "autoplayTimeout": 4000,
    "autoplayButtonOutput": false,
    controlsContainer: "#controls",
    prevButton: ".prev-slide",
    nextButton: ".next-slide",
    responsive: {
        1440: {
            "slideBy": 2,
            items: 4,
            gutter: 20
        },
        1152: {
            "slideBy": 2,
            items: 3,
            gutter: 20
        },
        800: {
            "slideBy": 1,
            items: 2,
            gutter: 20
        },
        580: {
            "slideBy": 1,
            items: 2,
            gutter: 20
        },
        420: {
            "slideBy": 1,
            items: 1
        },
    }
});