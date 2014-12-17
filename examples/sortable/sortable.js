document.addEventListener(
    'DOMContentLoaded',
    init
);

function init(){
    touchDrag(
        '.used-filters,.all-filters',
        'li',
        'dragGhost'
    );
    touchDrag(
        '.droppable-type2',
        'li'
    );
}