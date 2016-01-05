const JMETER_ID = "jmeter@redline13.com";
 
function initializeJmeterObserver() {
    jmeterObserver.register();
}
 
var jmeterObserver = {
    _uninstall : false,
    observe : function(subject, topic, data) {
    },
    register : function() {
    },
    unregister : function() {
    }
}
 
window.addEventListener("load", initializeJmeterObserver, false);
