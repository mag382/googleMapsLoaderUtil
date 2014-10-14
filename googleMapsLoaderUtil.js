/**
 * This utility class will asynchronously load the google maps api javascript files.  RequireJS does not have the ability
 * to load libraries asynchronously.  There is an async extension that will load google maps through RequireJS, but
 * there were not enough hooks available for timeout and script load error conditions.
 *
 * This object will start to load google maps as soon as it is included in any other dependency.  Anything that depends
 * on google maps existence can use the waitForGoogleMaps method, which will continuously check if the google libraries are
 * available, and invoke either success or error callbacks.
 *
 * @author Matthew Garber
 */
define([

],

    function() {

        var _googleMapsCallbackId = 'googleMapsCallback' + Date.now();
        var _googleMapsLoadComplete = false;
        var _scriptLoadError = false;

        /**
         * Private function that handles injecting the google maps script.
         * @private
         */
        var _injectGoogleMapsScript = function(){
            var googleMapScript;
            var scriptElements;
            var src = 'https://maps.google.com/maps/api/js?sensor=false&callback=' + _googleMapsCallbackId;
            googleMapScript = document.createElement('script');
            googleMapScript.type = 'text/javascript';
            googleMapScript.async = true;
            googleMapScript.src = src;

            googleMapScript.onerror = function() {
                _scriptLoadError = true;
                console.log('Error loading: ' + src + '.');
            }
            scriptElements = document.getElementsByTagName('script')[0];
            scriptElements.parentNode.insertBefore(googleMapScript,scriptElements);
        };

        /**
         * Callback method for when the map has completed loading.  A private boolean variable is set to true to allow the
         * waitForGoogleMaps function to know the loading has completed.
         * @private
         */
        var _mapLoadCallback = function() {
            _googleMapsLoadComplete = true;
        };

        //Set the map load callback on the window (as is required by the google API), and inject the script.
        window[_googleMapsCallbackId] = _mapLoadCallback.bind(this);
        _injectGoogleMapsScript();

        return {
            /**
             * This method should be invoked by anything that requires the 'google' library object to be available.
             * It will check the status of the google library every intervalDelay MS, for a max number of numTries.
             * If the google library is available during these checks, the successCallback will be invoked.  If any kind
             * of error or timeout occurs, or the total numTries is exceeded, then the errorCallback will be invoked.
             *
             * The maximum amount of time this method will check for google maps is numTries * intervalDelay.
             *
             * @param successCallback Method to invoke after successful loading of google maps
             * @param errorCallback Optional callback to invoke if google maps fails to load.
             * @param intervalDelay The delay between checks for the google API.
             * @param numTries The number of times to check for the google API.
             * @returns {*|Number} The interval id of the polling process.  This interval will automatically be cleared
             *                     by the waitForGoogleMaps method, but is made available if manual stoppage is desired.
             */
            waitForGoogleMaps: function(successCallback, errorCallback, intervalDelay, numTries) {
                var currentTryCount = 0;
                var intervalId = setInterval(function() {
                    currentTryCount ++;
                    if(currentTryCount >= numTries || _scriptLoadError) {
                        clearInterval(intervalId);
                        if(errorCallback) {
                            errorCallback();
                        }
                    } else if(_googleMapsLoadComplete) {
                        clearInterval(intervalId);
                        successCallback();
                    }
                }, intervalDelay);

                return intervalId;
            }
        }
    }
);