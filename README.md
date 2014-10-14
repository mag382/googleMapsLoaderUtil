##Introduction
This utility was created as an alternative to the async plugin that is currently available for loading google maps in
RequireJS (https://github.com/millermedeiros/requirejs-plugins).  That plugin works great if you want to have google maps
available as a dependency in a RequireJS module.

The googleMapsLoaderUtil takes a different approach by loading the google maps API asynchronously outside of the RequireJS
framework.  This allows for finer grained control over connection errors and timeout errors than the require JS framework.
It solves the issue of wanting to recover gracefully when google maps in unavailable instead of completely stopping the
loading of your RequireJS modules.

##Basic Usage
Copy the googleMapsLoaderUtil.js file into your project, and add it as a dependency to whatever module requires google maps.
The utility will immediately start loading google maps in the background once included:

```js
define(['googleMapsLoaderUtil', function(GoogleMapsLoaderUtil) {

});
```

Since Google Maps loads asynchronously, any logic you have which requires access to the 'google' API object will need to
wait until it has completely loaded.  The waitForGoogleMaps method provides a way to invoke methods once the Google API
has loaded.

```js
define(['googleMapsLoaderUtil', function(GoogleMapsLoaderUtil) {

    var success = function() {
        //do your google maps work
    }

    var error = function() {
        //Show some kind of warning to the user that google maps was unavailable.
    }

    //This will wait for 10 seconds for the google map to load before invoking the error method, checking every 500ms.
    //The success method will be invoked once the Google Map API is available.
    GoogleMapsLoaderUtil.waitForGoogleMaps(success, error, 500, 20);
});
```

##Author
Matthew Garber