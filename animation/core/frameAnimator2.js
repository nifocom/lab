    var animationObjects = new Array();

    var FrameAnimator = (function () {

        // Constructor
        FrameAnimator = function (animObj) {
            this.animObj = animObj;
        }

        FrameAnimator.prototype.getImgName = function (frameIdx, seqName,isOneZero) {

            var name = frameIdx;
            if (frameIdx < 10) {
                name = '0' + frameIdx;
            }
            if (isOneZero == false )
            {
                if (frameIdx >= 100)
                {
                    name = '0'+name;
                }
                else
                {
                    name = '00' + name;
                }
            }
            return  seqName + name + ".png";
        }

        // Try to start animation if it's not already started
        FrameAnimator.prototype.startAnimation = function (elementId) {

            // check if no active animatiomn with same animator running now
            if (this.animObj.isAnimationRunning != true) {
                this.animObj.isAnimationRunning = true;
                this.animObj.startTime = Date.now();
                requestAnimFrame(function (time) {
                    animationObjects[elementId].frameAnimation.doAnimationStep(time, elementId)
                }, $('#' + this.animObj.elementId));
            }
            console.log("startAnimation for " + this.animObj.elementId + " is not possible");
        }

        FrameAnimator.prototype.getImgSource = function(objBaseName,idx, name, isOneZero){
            var src = this.getImgName(idx, objBaseName,isOneZero);
            if ( $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase()))
            { 
               // console.log('Working in chrome');
            }
            else
            {
                var cachedImg = new Image();
                cachedImg.src = src;
             }
             return src;     
        }

        FrameAnimator.prototype.goNext = function(time){
            // check animation duration
            var elapsedTime = time - this.animObj.startTime;
            var duration = {};
            if (this.animObj.duration != undefined)
                duration = this.animObj.duration;
            else
                duration =  this.animObj.numFrames /  this.animObj.fps

            if ( elapsedTime > duration )
            {
                // animation was finised. Idx should be set to start position
                this.animObj.isAnimationRunning = false;
                this.animObj.currentFrmIdx = 0;
                //
                return 0;
            }

            //var currentIdx = Math.round(((this.animObj.fps) * currentDuration) / 1000)+1;
            var singleFrameDuration = duration/this.animObj.numFrames;

            var nextIdx = Math.round(elapsedTime/singleFrameDuration);

            // -- double check -- nextIdx
            if ( nextIdx >= this.animObj.numFrames )
            {
                // check situation when mouse still over element and we should continue animation from beginning
                if ( hoverElem != undefined && hoverElem.id == this.animObj.elementId )
                {
                    this.animObj.startTime = Date.now();
                }
                else
                {
                    this.animObj.isAnimationRunning = false;
                }
                this.animObj.currentFrmIdx = 0;
                return 0;
            }

             // all checks passed, returning new idx
            this.animObj.currentFrmIdx = nextIdx;
            return nextIdx;
        }

        // Function which determine correct frame and show it
        FrameAnimator.prototype.doAnimationStep = function (time, elem) {

            console.log("doAnimationStep : " + this.animObj.elementId);
            // duration after animation start (current animation duration)
			if ( time == null || time == undefined)
			{
				time = Date.now();
			}

            // get current Index based on time
            var currentIdx  = this.goNext(time);

            switch (this.animObj.type)
            {
               case 'background-forward':
                    return this.doBackgroundForwardAnimation(currentIdx,this.animObj.elementId)

               case 'lazyBuble':
                   return this.doLazyBubleAnimation(currentIdx,this.animObj.elementId)

               case 'backward':
                   return this.doSimpleAnimation(this.animObj.numFrames -currentIdx, this.animObj.elementId, 1)

               case 'forward':

               default:
                    // it's simple animation
                  return this.doSimpleAnimation(currentIdx, this.animObj.elementId, this.animObj.numFrames)
            }
        };

        FrameAnimator.prototype.doBackgroundForwardAnimation = function (currentIdx,elId){
            var xOffset = currentIdx * this.animObj.frameWidth;
            $('#'+elId).css("background-position",-xOffset+"px " + "0px");
            console.log("doBackgroundForwardAnimation " + xOffset);
            if ( this.animObj.isAnimationRunning )
            {
                console.log("doBackgroundForwardAnimation recall doAnimationStep");
                requestAnimFrame(function (time) {
                    animationObjects[elId].frameAnimation.doAnimationStep(time, elId)
                }, $('#' + elId));
            }
        }

        FrameAnimator.prototype.doLazyBubleAnimation = function (currentIdx,elId) {
            var xPercent = 0.4;

            // total animation duration
            var totalAnimDuration = this.animObj.numFrames / this.animObj.fps * 1000;
            var frameIdxIfXpersent = Math.round(this.animObj.fps * totalAnimDuration * xPercent / 1000);

            if (currentIdx <= frameIdxIfXpersent) { // do 'forward' movement
                return   this.doSimpleAnimation(currentIdx, elId, this.animObj.numFrames);
            }
            else {  // do 'backward' movement
                var xPositionOffset = Math.round(currentIdx - frameIdxIfXpersent);
                return this.doSimpleAnimation(Math.round(frameIdxIfXpersent - xPositionOffset), elId, 1);
            }
        }

        FrameAnimator.prototype.doSimpleAnimation = function (currentIdx, elId, lastFrame) {
            // check if count of frames inside animation have enought elements for show
            if (lastFrame == currentIdx || currentIdx < 0 || currentIdx >= this.animObj.numFrames) {
                console.log('anim ' + elId + ': reached the end' + currentIdx);

                // check which element now is under mouse

                this.animObj.isAnimationRunning = false;
                var src = this.getImgSource(this.animObj.objBaseName,1,this.animObj.objBaseName, this.animObj.isOneZero);
                $('#' + this.animObj.elementId).attr("src", src);
                //console.log('img for element ' + this.animObj.elementId  + 'was setted to ' +  1)

                if ( hoverElem != undefined )
                {
                    try
                    {
                        if ( hoverElem.id == this.animObj.elementId )
                        {
                            animationObjects[elId].frameAnimation.startAnimation(elId);
                        }
                    }
                    catch(err)
                    {

                    }
                }

                return;
            }
            
            // get current idx of animated object and check if we need to change it
            if (this.animObj.currentFrmIdx != currentIdx) {
               //console.log('anim ' + elId + ' current idx: ' + this.animObj.currentFrmIdx + ': calculated index for show ' + currentIdx);
                // get src for image
                var src = this.getImgSource(this.animObj.objBaseName,currentIdx,this.animObj.objBaseName,this.animObj.isOneZero);
                // take relevant frame
                $('#' + this.animObj.elementId).attr("src", src);
                // change currentFrmIdx idx
                this.animObj.currentFrmIdx = currentIdx;
            }

            // continue animation. Call next step
            requestAnimFrame(function (time) {
                animationObjects[elId].frameAnimation.doAnimationStep(time, elId)
            }, $('#' + elId));

        }

        FrameAnimator.prototype.reset = function () {
            this.animObj.currentFrmIdx = 1;
            this.animObj.lastTick = Date.now();
        };

        return FrameAnimator;
    })();

    function initAnimationObj(obj) {
        // assume that object is not exist in list
        animationObjects[obj.elementId] = obj;

        obj.frameAnimation = new FrameAnimator(obj);
        obj.lastTick = Date.now();
        obj.currentFrmIdx = 1;

        $("#" + obj.elementId).hover(function () {
            hoverElem = this;
            animationObjects[$(this).attr("id")].frameAnimation.startAnimation(obj.elementId);
        });
        $("#" + obj.elementId).mousemove(function () {
            hoverElem = this;
            animationObjects[$(this).attr("id")].frameAnimation.startAnimation(obj.elementId);
        });
        $("#" + obj.elementId).mouseleave(function(){
            hoverElem = undefined;
        })
    }

    /*/ Look for all animation groups in body


       
       var imgNames = ['_01.','_02.','_03.','_04.','_05.','_06.','_07.','_08.','_09.','_10.',
                     '_11.','_12.','_13.','_14.','_15.','_16.','_17.','_18.','_19.', '_20.',
                     '_21.','_22.','_23.','_24.','_25.','_26.','_28.'];
       // 
       var el = new AnimationInfo();
       el.init(imgNames, 'aenl_N','n',frameAnim);
       frameAnim.addElement(el);
       
       el = new AnimationInfo();
       el.init(imgNames, 'aenl_I','i',frameAnim);
       frameAnim.addElement(el);
       
       el = new AnimationInfo();
       el.init(imgNames, 'aenl_F','f',frameAnim);
       frameAnim.addElement(el);
       
       el = new AnimationInfo();
       el.init(imgNames, 'aenl_O','o',frameAnim);
       frameAnim.addElement(el);  
    */


