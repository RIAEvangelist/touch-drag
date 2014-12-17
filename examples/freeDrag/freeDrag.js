document.addEventListener(
    'DOMContentLoaded',
    init
);

function init(){
    touchDrag(
        {
            dropTargetClasses   : 'body',
            dragTargetClasses   : 'div.draggable',
            noGhost             : true,
            noAutoDrop          : true
        }
    );
}