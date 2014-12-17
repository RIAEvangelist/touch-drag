document.addEventListener(
    'DOMContentLoaded',
    init
);

function init(){
    touchDrag(
        {
            dropTargetClasses   : '.used-filters,.all-filters',
            ghostContent        : '<p> for pink lists </p>'
        }
    );
    touchDrag(
        {
            dropTargetClasses   : '.droppable-type2',
            ghostContent        : '<img class="funnyImg" src="http://www.animatedimages.org/data/media/56/animated-computer-image-0004.gif" />'
        }
    );
}