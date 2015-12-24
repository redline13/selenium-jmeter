
/**
 * Navigate to the preferences for this Plugin*/
function showJmeterOptions(){
	Components.utils.import('resource://gre/modules/Services.jsm');
	Services.wm.getMostRecentWindow('navigator:browser').BrowserOpenAddonsMgr('addons://detail/jmeter@redline13.com/preferences');	
}
