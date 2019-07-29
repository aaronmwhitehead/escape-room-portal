$('.score').each(function(index) {

    switch (index) {
        case 0:
            $(this).prepend(`<div class="medal first-place"></div>`)
            break;
        case 1:
            $(this).prepend(`<div class="medal second-place"></div>`)
            break;
        case 2:
            $(this).prepend(`<div class="medal third-place"></div>`)
            break;
        default:
            break;
    }

    switch(index) {
        case 0:
        case 1:
        case 2:
            $('.top-ranked').append($(this));
            $(this).addClass(`ranked-${index + 1}`);
            break;
        default:
            $('.other-scores').append($(this));
            break;
    }
    
    $(this).prepend(`<span class="rank">${index+1}</span>`);
});