function BaseAnimatedElement()
{
    // TODO: update defaults 
    this.fps = 5;
    
    this.fpsTicks = 1000 / this.fps;
    this.animMode = 'simple';
    this.direction = 'none'; // 'back', 'forward'
    this.animationStartTime = null;
    
    // TODO: make it in use
    this.frameStep = 5;
    
    
};

// animMode s:
 // 'lazybubble' - forward then backward
 // 'simple' - one-by-one forward or backward

BaseAnimatedElement.prototype.formatImgSourcesArray = function(arrayData, path, ext)
{
    var preparedArray = [];
    for (var element in arrayData)
    {
        var a = path+arrayData[element]+ext;
        preparedArray.push( a.replace("_", "") );
    }
    return preparedArray;
}

BaseAnimatedElement.prototype.init = function(imagesArray, elementId, name, frameAnim )
{
    this.frameAnim = frameAnim;
   this.images = this.formatImgSourcesArray(imagesArray,'img\\logo\\'+name,'png');
   this.elementId = elementId;
   this.currFrameIdx = 0;
   this.countOfFrames = this.images.length;
   this.lastTick = null;
  
   // TODO: attach to mousemove event here
   return this;  
}

BaseAnimatedElement.prototype.scheduleAnimation = function(/*TODO: insert stopFrameNumber and direction*/)
{
    // check first if we on animate mode
    if (this.direction == 'none' & this.animMode == 'simple')
        {
            // should start animation rigth now
            this.currFrameIdx = 0;
            this.direction = 'forward';
            this.animationStartTime =  Date.now();
            this.lastTick = Date.now();
            updateState(null,this);
        }
    // TODO: check other modes here
    // Logic should include current state of animation. 
}

BaseAnimatedElement.prototype.getNextFrame = function( )
{
    if (this.animMode == 'simple')
        {
            if (this.currFrameIdx == this.images.length - 1)
                {
                    // reached last frame returning null
                    return null;
                }
            else
                {
                    this.currFrameIdx = this.currFrameIdx +1; 
                    this.lastTick =  Date.now();
                    return this.images[this.currFrameIdx];
                }
        }
     // TODO: add 'lazybubble' animation here
     return null;
}

BaseAnimatedElement.prototype.reset = function( )
{
    this.currFrameIdx = 0;
    this.direction = 'none';
    this.animationStartTime =  null;
    this.lastTick = null;
}


