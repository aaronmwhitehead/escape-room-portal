window.onload = function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        card.onmouseover = () => {
            card.querySelector('span').style.borderBottom = '3px solid red'
        }
        card.onmouseleave = (ev) => {
            card.querySelector('span').style.borderBottom = '0px solid #000'
        }
    });
}


