/**
 * SCB EU Cookie Consent Application
 *
 * @module cookieconsent
 *
 */

(function(){

  function CookieConsent(callback){
 
    this.init();
    
    this._callback = callback;
    
  }


/**
 * Get Consent 
 * @namespace CookieConsent
 */
 
CookieConsent.prototype = {
 
   init: function(){
    
    // Check for existence of cookies  

    if(!this.cookies.readCookie('euCookie')){
  
      this.appendElements();
      this.requestCookie();
  
    }    
  }

  ,appendElements: function(){
 
   this.body = document.body;
   this.cookieOverlay = document.createElement('div');
   this.cookiePrompt = document.createElement('div');

   // Append cookieOverlay

   this.cookieOverlay.setAttribute('id','CookieOverlay');
   this.cookieOverlay.setAttribute("style", "display:block");
   this.body.appendChild(this.cookieOverlay);
 
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
       self = this,
       callback_result='';

   mygetrequest.onreadystatechange=function(){

    if (mygetrequest.readyState==4){

     if (mygetrequest.status==200 || window.location.href.indexOf("http")==-1){

      self.cookiePrompt.setAttribute('id',"CookiePop");

      self.body.appendChild(self.cookiePrompt);

      document.getElementById("CookiePop").innerHTML=mygetrequest.responseText

      // Once Appended AddEvent Handler

      var button_positive = document.getElementById('Button-Positive'),
          button_negative = document.getElementById('Button-Negative'),
          button_negative_remember = document.getElementById('Button-Negative-DontRemember')


      /**
       * Add Click Handler : Consent : Yes, Store Cookie
       */
      
      self.handlers.registerEventHandler(button_positive, "click", function(e){
      
        // Add Cookie to remmeber this option      
        self.cookies.createCookie('euCookie',true,30);
        self.detachCookiePopup("Yes");
        e.preventDefault();

      });

      /**
       * Add Click Handler : Consent : No, Store cookie to remember this choice
       */

       self.handlers.registerEventHandler(button_negative, "click", function(e){
       
         // Add Cookie to remmeber this option
         self.cookies.createCookie('euCookie',true,30);
         self.detachCookiePopup("No");
         return false;

       });
     
       /**
        * Add Click Handler : Consent : No, Do not store any cookies
        */

       self.handlers.registerEventHandler(button_negative_remember, "click", function(e){       
         // Delete Existing Cookie
         self.cookies.eraseCookie('euCookie');       
         self.detachCookiePopup("Never");         
         e.preventDefault();
       });
              

     }
     else{
      alert("An error has occured making the request")
     }

    }
   }
   mygetrequest.open("GET", 'cookie-list.html', true)
   mygetrequest.send(null)
 
 }
 ,detachCookiePopup: function(callback_result){
    
   // Remove Child : Unregister All Event Handlers
 
   if(this.cookiePrompt) this.body.removeChild(this.cookiePrompt);
   if(this.cookieOverlay) this.body.removeChild(this.cookieOverlay);                            
   
   // call if callback is callable
    if (typeof this._callback === "function") {
      this._callback.apply(this, [callback_result]);
    }
   
   
 } 
 /**
  * Add Event Handlers 
  * @namespace COOKIECONSENT
  * @class handlers
  */
 
 ,handlers: {
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
 }
 
 /**
  * Add/Read/Delete Cookies
  * @namespace COOKIECONSENT
  * @class cookies
  */
 
 
 , cookies: {

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
 }
};

 
// Initialize the App 

window.onload = function(){
  
  var cookie_consent = new CookieConsent(helper);  
  
};


})(this);

// Callback Function

function helper(){
  var _result = Array.prototype.slice.apply(arguments)[0];
  console.log(_result);
}
