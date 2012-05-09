/**
 * SCB EU Cookie Consent Application
 *
 * @module cookieconsent
 *
 */

var COOKIECONSENT = {};


/**
 * Get Consent 
 * @namespace COOKIECONSENT
 * @class get_consent
 */
 
COOKIECONSENT.get_consent = {
  
 init: function(){
   
  // Check for existence of cookies  
  
  if(!COOKIECONSENT.cookies.readCookie('euCookie')){
    
    this.appendElements();
    this.requestCookie();
    
  }    
   
 }      
 ,appendElements: function(){
   
   var cc = this;
   cc.body = document.body;
   cc.cookieOverlay = document.createElement('div');
   cc.cookiePrompt = document.createElement('div');

   // Append cookieOverlay

   cc.cookieOverlay.setAttribute('id','CookieOverlay');
   cc.cookieOverlay.setAttribute("style", "display:block");
   cc.body.appendChild(cc.cookieOverlay);
   
 }
,ajaxRequest: function(){
  
  var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE
   if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
    for (var i=0; i<activexmodes.length; i++){
     try{
      return new ActiveXObject(activexmodes[i])
     }
     catch(e){
      //suppress error

     }
    }
   }
   else if (window.XMLHttpRequest) // if Mozilla, Safari etc
    return new XMLHttpRequest()
   else
    return false
  
 }
 ,requestCookie: function(){
   
   var mygetrequest=new this.ajaxRequest(),
       cc = this;

   mygetrequest.onreadystatechange=function(){

    if (mygetrequest.readyState==4){

     if (mygetrequest.status==200 || window.location.href.indexOf("http")==-1){


      cc.cookiePrompt.setAttribute('id',"CookiePop");

      cc.body.appendChild(cc.cookiePrompt);

      document.getElementById("CookiePop").innerHTML=mygetrequest.responseText

      // Once Appended AddEvent Handler

      var button_positive = document.getElementById('Button-Positive'),
          button_negative = document.getElementById('Button-Negative'),
          button_negative_remember = document.getElementById('Button-Negative-DontRemember')


      /**
       * Add Click Handler : Consent : Yes, Store Cookie
       */

      COOKIECONSENT.handlers.registerEventHandler(button_positive, "click", function(e){
        
        // Add Cookie to remmeber this option
        
        COOKIECONSENT.cookies.createCookie('euCookie',true,30);

        cc.detachCookiePopup();
        return false;

      });

      /**
       * Add Click Handler : Consent : No, Store cookie to remember this choice
       */

       COOKIECONSENT.handlers.registerEventHandler(button_negative, "click", function(e){
         
         // Add Cookie to remmeber this option

         COOKIECONSENT.cookies.createCookie('euCookie',true,30);

         cc.detachCookiePopup();
         return false;

       });

       
       /**
        * Add Click Handler : Consent : No, Do not store any cookies
        */

       COOKIECONSENT.handlers.registerEventHandler(button_negative_remember, "click", function(e){
         
         // Delete Existing Cookie

         COOKIECONSENT.cookies.eraseCookie('euCookie');
         
         cc.detachCookiePopup();
         return false;

       });

     }
     else{
      alert("An error has occured making the request")
     }

    }
   }
   mygetrequest.open("GET", 'cookie.html', true)
   mygetrequest.send(null)
   
 }
 ,detachCookiePopup: function(){
   
   var cc = this;
   
   // Remove Child : Unregister All Event Handlers
   
   if(cc.cookiePrompt) cc.body.removeChild(cc.cookiePrompt);
   if(cc.cookieOverlay) cc.body.removeChild(cc.cookieOverlay);                            
   
 } 
};

/**
 * Add/Read/Delete Cookies
 * @namespace COOKIECONSENT
 * @class cookies
 */
 
COOKIECONSENT.cookies = {
  
  /*
   * @param: Name, @param: value, @param : days (Expires in how many days)
   */
  createCookie: function(name, value, days){

     if (days) {
     		var date = new Date();
     		date.setTime(date.getTime()+(days*24*60*60*1000));
     		var expires = "; expires="+date.toGMTString();
     	}
     	else var expires = "";
     	document.cookie = name+"="+value+expires+"; path=/";

    // var cookie_expiry = expiry? expiry : new Date((new Date()).getTime() + 30*24*60*60*1000);
    // document.cookie = name+'=true; expires='+cookie_expiry+'; path=/'

   }
   ,readCookie: function(name){
      var nameEQ = name + "=";
     	var ca = document.cookie.split(';');
     	for(var i=0;i < ca.length;i++) {
     		var c = ca[i];
     		while (c.charAt(0)==' ') c = c.substring(1,c.length);
     		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
     	}
     	return null;
   }
   ,eraseCookie: function(name){
     this.createCookie(name,"",-1);
   }
};


/**
 * Add Event Handlers 
 * @namespace COOKIECONSENT
 * @class handlers
 */
 
COOKIECONSENT.handlers = {
 
 registerEventHandler: function(node, event, handler){
    if(typeof node.addEventListener == "function"){
      node.addEventListener(event, handler, false);
    }
    else{
      node.attachEvent("on" + event, handler);
    }
 }
 ,unregisterEventHandler: function(node, event, handler){
   if(typeof node.removeEventListener == "function"){
     node.removeEventListener(event, handler, false);
   }
   else{
     node.detachEvent("on" + event, handler);
   }
   
  }
  
};



// Initialize the App

COOKIECONSENT.get_consent.init();