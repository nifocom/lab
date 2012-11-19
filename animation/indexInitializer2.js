var hoverElem;

var PageInitializer = (function () {
     
    PageInitializer = function()
    {
        this.loader = new PxLoader();

    }
     
    PageInitializer.prototype.getImgName = function (frameIdx, seqName, isOneZero) {
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
        
    PageInitializer.prototype.addAnimObjImagesList = function(seqName, numImgs,isOneZero)
    {
        var i = 1;
        for (i = 1; i < numImgs; i++)
        {
            this.loader.addImage(this.getImgName(i, seqName,isOneZero));
        }
            
    }
    doAnimation = function (group)
    {
           var keys = Object.keys(animationObjects);
                    var keyIdx;
                    for ( keyIdx in keys)
                    {
                        var obja = animationObjects[keys[keyIdx]];
                        if  (obja.group == group)
                        {
                            obja.frameAnimation.startAnimation(obja.elementId);
                        }
                    }
    }
 
    PageInitializer.prototype.init = function(pageName)
    {
        var nifoLogoInitializer = function()
        {
            var obj = {
                group:"nifoLogo",
                elementId:"animated-element1",
                objBaseName:"img/nifoLogo/n",
                numFrames:30,
                fps:25,
                type:'forward',
                isOneZero:true
            };initAnimationObj(obj);

            var obj = {
                group:"nifoLogo",
                objBaseName:"img/nifoLogo/i",
                numFrames:30,
                fps:25,
                elementId:"animated-element2",
                type:'forward',
                isOneZero:true
            };initAnimationObj(obj);

            var obj = {
                group:"nifoLogo",
                objBaseName:"img/nifoLogo/f",
                numFrames:30,
                fps:25,
                elementId:"animated-element3",
                type:'forward',
                isOneZero:true
            }; initAnimationObj(obj);

            var obj = {
                group:"nifoLogo",
                objBaseName:"img/nifoLogo/o",
                numFrames:30,
                fps:25,
                elementId:"animated-element4",
                type:'forward',
                isOneZero:true
            };initAnimationObj(obj);
        }


        var contactReasonInitializer = function()
        {

           var obj = {
                group:"contactReason",
                elementId:"contactReason_employment",
                objBaseName:"img/contactReason/employment/Employment",
                numFrames:80,
                fps:60,
                type:'forward',
                isOneZero:false
            };
            initAnimationObj(obj);


            var obj = {
                group:"contactReason",
                objBaseName:"img/contactReason/investment/Investment",
                numFrames:150,
                fps:80,
                elementId:"contactReason_investment",
                type:'forward',
                isOneZero:false

            };initAnimationObj(obj);

            var obj = {
                group:"contactReason",
                objBaseName:"img/contactReason/partnership/Partnership",
                numFrames:122,
                fps:80,
                elementId:"contactReason_partnership",
                type:'forward',
                isOneZero:false
            };

         /*   var obj = {
                group:'contactReason',
                elementId:'contactReason_partnership',
                numFrames:122,
                frameWidth:200,
                duration: 1000,
                type:'background-forward',
                backgroundImage:'img/partnership.png'
            };                                  */
                initAnimationObj(obj);
        }

        switch ( pageName )
        {
            case 'index':
            {
                map = new Map("small_map");
                map.showMap();
                locationInstance = new Location();
                locationInstance.init();
                 this.loader.addImage("img/countdown/digits.png");

                /*this.addAnimObjImagesList("img/logo/n",30,true);
                              this.addAnimObjImagesList("img/logo/i",30,true);
                               this.addAnimObjImagesList("img/logo/f",30,true);
                             this.addAnimObjImagesList("img/logo/o",30,true);*/

                // callback that will be run once images are ready
                this.loader.addCompletionListener(function() {
                        nifoLogoInitializer();
                        contactReasonInitializer();
                    //doAnimation('logo');
                    }
                    );
                this.loader.start();
                break;

            }
            case 'index_contact':
            {
                //this.addAnimObjImagesList("img/contactReason/partnership/Partnership",122,false);
                //this.addAnimObjImagesList("img/contactReason/investment/Investment",150,false);
                //this.addAnimObjImagesList("img/contactReason/employment/Employment",80,false);
                /*this.loader.addCompletionListener(
                                function()
                                {
                                    contactReasonInitializer();
                                }          */
                 //)
               // this.loader.start();
            }
            default:
            {
            }
        };

    }
    
    return PageInitializer;
})();