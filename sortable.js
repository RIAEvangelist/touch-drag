/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


document.addEventListener(
    'DOMContentLoaded',
    init
);

function init(){
    sortable(
        '.used-filters,.all-filters',
        'li',
        'dragGhost'
    );
    sortable(
        '.droppable-type2',
        'li'
    );
}

/*
 * > dropTargetClasses :
 * comma deliminated list of classes for drop areas
 * 
 * > dropTargetClasses :
 * comma deliminated list of classes to add onto this particular ghost element
 * 
 */
function sortable(dropTargetClasses, dragTargetClasses, ghostClasses, ghostContent){
    if(typeof dropTargetClasses != 'string')
        return;
    
    var dragTarget=false;
    var ghost=document.createElement('div');
    ghost.style.position='absolute';
    ghost.style.zIndex=1e4;
    ghost.style.backgroundColor='rgba(100,100,100,.7)';
    ghost.style.display='none';
    
    if(ghostClasses){
        ghost.classList.add(
            ghostClasses.replace(/\s/g,'')
        );
    }
    
    if(ghostContent){
       ghost.innerHTML=ghostContent;
    }
    
    document.getElementsByTagName('body')[0].appendChild(ghost);
    
    var lists=document.querySelectorAll(dropTargetClasses);
    
    for(var i=0; i<lists.length; i++){
        lists[i].addEventListener(
            'mousedown',
            startDrag
        );

        lists[i].addEventListener(
            'touchstart',
            startDrag
        );
        var items=lists[i].querySelectorAll(dragTargetClasses);
        for(var j=0; j<items.length; j++){
            items[j].classList.add('draggable');
        }
    }
    
    document.getElementsByTagName('body')[0].appendChild(ghost);
    
    function startDrag(e){
        console.log(e)

        if(!e.target.classList.contains('draggable')){
            return;
        }

        var element=e.target;

        while(!element.classList.contains('draggable'))
            element=element.parentElement;
        
        if(!element.classList.contains('draggable'))
            return;

        dragTarget=element;

        ghost.style.width=element.offsetWidth+'px';
        ghost.style.height=element.offsetHeight+'px';

        positionGhost(e);
        
        document.addEventListener(
            'mousemove',
            drag
        );

        document.addEventListener(
            'touchmove',
            drag
        );

        document.addEventListener(
            'mouseup',
            drop
        );

        document.addEventListener(
            'touchend',
            drop
        );
    }

    function moveElement(element,insertBefore){
        if(!dragTarget || element==dragTarget)
            return;
        
        console.log(0>Array.prototype.indexOf.call(lists,element))
        
        if(!insertBefore){  
            if(0>Array.prototype.indexOf.call(lists,element))
                return;
            
            element.appendChild(dragTarget);
            return;
        }

        var parent=element;
        
        console.log(parent);
        while(0>Array.prototype.indexOf.call(lists,parent))
            parent=parent.parentElement;
        
        console.log(parent);
        if(0>Array.prototype.indexOf.call(lists,parent))
            return;

        parent.insertBefore(dragTarget,element);

    }

    function drag(e){
        e.preventDefault();
        positionGhost(e);
    }

    function drop(e){
        e.preventDefault();
        ghost.style.display='none';
        dragTarget=false;
        document.removeEventListener(
            'mousemove',
            drag
        );

        document.removeEventListener(
            'touchmove',
            drag
        );

        document.removeEventListener(
            'mouseup',
            drop
        );

        document.removeEventListener(
            'touchend',
            drop
        );
    }

    function positionGhost(e){
        e.preventDefault();
        var location={
            x:e.clientX,
            y:e.clientY
        }

        if(!location.x){
            location.x=e.touches.item(0).clientX;
            location.y=e.touches.item(0).clientY;
        }

        ghost.style.display='block';
        ghost.style.top=location.y-dragTarget.offsetHeight/2+'px';
        ghost.style.left=location.x+1+'px';

        var element=document.elementFromPoint(location.x,location.y);

        if(element.classList.contains('draggable')){
            moveElement(element,true);
            return;
        }
        
        if(0>Array.prototype.indexOf.call(lists,element))
            return;

        moveElement(element);
    }
}