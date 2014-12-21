/**
 * @fileOverview Sortable Module responsible for all sorting related 
 * actions for both desktop and mobile
 *  - drag and drop
 *  - touch events enabled
 *  
 */

/**
 * @function touchDrag
 * 
 * @param {string|object} dropTargetClasses comma deliminated list of classes for drop areas. 
 * if an object it can include any or all of the param names as key value pairs
 * @param {string} dragTargetClasses comma deliminated list of classes to add onto this particular ghost element
 * @param {type} draggingClass class to be dragged
 * @param {type} dropClass class to be dropped
 * @param {boolean} noAutoDrop boolean value true or flase if auto drop available
 * @param {boolean} noGhost boolean value true or false if ghost class available
 * @param {sring} ghostClass class for ghost 
 * @param {string} ghostContent text content to be included inside of the ghost div
 * @returns {void}
 */

function touchDrag(dropTargetClasses, dragTargetClasses, draggingClass, dropClass, noAutoDrop, noGhost, ghostClass, ghostContent){
    if(typeof dropTargetClasses ==='object'){
        dragTargetClasses   = dropTargetClasses.dragTargetClasses;
        draggingClass       = dropTargetClasses.draggingClass;
        dropClass           = dropTargetClasses.dropClass;
        noAutoDrop          = dropTargetClasses.noAutoDrop;
        noGhost             = dropTargetClasses.noGhost;
        ghostClass          = dropTargetClasses.ghostClass;
        ghostContent        = dropTargetClasses.ghostContent;
        dropTargetClasses   = dropTargetClasses.dropTargetClasses;
    }
    
    if(!dragTargetClasses)
        dragTargetClasses='li';
    
    if(!draggingClass)
        draggingClass='touchDrag-dragging';
    
    if(!dropClass)
        dropClass='touchDrag-dropped';
    
    if(!ghostClass)
        ghostClass='touchDrag-ghost';
    
    var dragTarget=false;
    var ghost=false;
    
    if(!noGhost)
        buildGhost(ghostClass,ghostContent);
    
    var dropTargets=document.querySelectorAll(dropTargetClasses);
    
    for(var i=0; i<dropTargets.length; i++){
        dropTargets[i].addEventListener(
            'mousedown',
            startDrag
        );

        dropTargets[i].addEventListener(
            'touchstart',
            startDrag
        );
        var items=dropTargets[i].querySelectorAll(dragTargetClasses);
        for(var j=0; j<items.length; j++){
            items[j].classList.add('touchDrag-draggable');
        }
    }
    
    /**
     * @memberOf function: touchDrag
     * 
     * @function buildGhost
     * 
     * @param {string} ghostClass
     * @param {string} ghostContent
     * @returns {void}
     */
    function buildGhost(ghostClass,ghostContent){
        ghost=document.createElement('div');
        ghost.style.position='absolute';
        ghost.style.zIndex=1e4;
        ghost.style.backgroundColor='rgba(100,100,100,.7)';
        ghost.style.display='none';

        if(ghostClass){
            ghost.classList.add(
                ghostClass
            );
        }

        if(ghostContent){
           ghost.innerHTML=ghostContent;
        }

        document.getElementsByTagName('body')[0].appendChild(ghost);
    }
    
    function startDrag(e){
        if(!e.target.classList.contains('touchDrag-draggable')){
            return;
        }
        
        var element=e.target;

        while(!element.classList.contains('touchDrag-draggable'))
            element=element.parentElement;
        
        if(!element.classList.contains('touchDrag-draggable'))
            return;

        element.classList.add(draggingClass);
        
        dragTarget=element;
        
        if(ghost){
            ghost.style.width=element.offsetWidth+'px';
            ghost.style.height=element.offsetHeight+'px';
        }
        
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
        if(!dragTarget || element === dragTarget)
            return;
        
        if(!insertBefore){  
            if(0>Array.prototype.indexOf.call(dropTargets,element))
                return;
            showDropClass();
            element.appendChild(dragTarget);
            return;
        }

        var parent=element;
        
        while(0>Array.prototype.indexOf.call(dropTargets,parent))
            parent=parent.parentElement;
        
        if(0>Array.prototype.indexOf.call(dropTargets,parent))
            return;
        
        showDropClass();
        parent.insertBefore(dragTarget,element);

    }

    function drag(e){
        e.preventDefault();
        positionGhost(e);
    }

    function drop(e){
        e.preventDefault();
        if(ghost)
            ghost.style.display='none';
        
        dragTarget.classList.remove(draggingClass);
        showDropClass();
        
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
        };

        if(!location.x){
            location.x=e.touches.item(0).clientX;
            location.y=e.touches.item(0).clientY;
        }
        
        var target=ghost;
        if(target)
            target.style.display='block';
        
        if(!target)
            target=dragTarget;
        
        target.style.top=location.y-dragTarget.clientHeight/2+'px';
        target.style.left=location.x+1+'px';
        
        if(noAutoDrop)
            return;
        
        var element=document.elementFromPoint(location.x,location.y);
        
        if(element.classList.contains('touchDrag-draggable')){
            moveElement(element,true);
            
            return;
        }
        
        if(0>Array.prototype.indexOf.call(dropTargets,element))
            return;

        moveElement(element);
    }
    
    function showDropClass(){
        if(!dragTarget)
            return;
        
        dragTarget.classList.add(dropClass);
        dragTarget.dropTime=new Date().getTime(); 
        
        (
            function(element){
                setTimeout(
                    function(){
                        if(element.dropTime>new Date().getTime()-300)
                            return;
                        
                        element.classList.remove(dropClass);
                    },
                    300
                );
            }
        )(dragTarget);
    }
}