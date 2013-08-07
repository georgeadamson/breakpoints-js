
// Rudimentary detection of display type using breakpoints defined in the CSS. Store the results in global object variable.
// The advantage of this technique is simply that the breakpoints don't have to be defined and duplicated in the JS too.
// Eg: window.breakpoints.phone === true
// IMPORTANT: Must be used with breakpoints.scss.
//            Use with respond.js to use this Media Query technique in IE6-8 etc.
// By George Adamson - https://github.com/georgeadamson/breakpoints-js

;(function( window, undefined ){

/* jshint laxcomma:true, asi:true, debug:true, curly:false, camelcase:true, browser:true */
/* global define, console */

  (function (factory) {

    // Register as an anonymous AMD module if relevant, otherwise assume oldskool browser globals:
    if (typeof define === "function" && define.amd)
      define(["jquery"], factory);
    else
      factory( jQuery );

  })(function( $ ) {

    var moduleName     = 'breakpoints'

    // Define a global variable on which to define custom display-size properties: (Eg: breakpoints.phone = true & breakpoints.tablet = false)
      , breakpoints    = window[moduleName] || ( window[moduleName] = {} )

    // Flag for tracking changes to the currently detected breakpoint:
      , previous       = null
                       
      , stylesMissing  = 'missing-breakpoints-stylesheet'

      // Helper to read custom font from specified element:
      , getFontOf      = function( elem ){
        var font = $(elem).css('fontFamily')
        return ( !font || /^(sans-)?serif/.test(font) ) ? '' : font
      }

    // Helper to build a hash of breakpoint names. Used by detectBreakpoint(). The currently detected display will have a true value, the others false:
      , mapBreakpoints = function( names, current ){
          var name, result = { current: current }
          for( name in names ){ result[name] = ( name === current ) }
          return result
        }

    // Detect iframe because we may need to respond to iframe-resize events, even on a device with fixed browser display size:
      , inIframe       = window.top && window.top !== window

      , resizeEvent    = ( 'onorientationchange' in window ) ? 'orientationchange' + ( inIframe ? 'resize' : '' ) : 'resize'



    // Define a .device detection object now and whenever display or orientation changes:
    ;(function( detectBreakpoint ){

      detectBreakpoint()

      $(window).on( resizeEvent, detectBreakpoint )

    })(function(){

      // Media Queries will set the name of the current breakpoint as a fake fontFamily on the hidden HEAD element. We simply read the corresponding values:
      var head     = document.getElementsByTagName('head')[0]
        , current  = getFontOf( head ) || stylesMissing               // Read currently applicable display type: (We rely on this to vary, depending on which mediaquery is being applied right now)
        , names    = getFontOf( $(head).children() ).split(/\s*,\s*/) // Read list of all possible display variants defined in css so we can iterate through them: (See detect-display.scss for definition of these values)
        , detected = mapBreakpoints( names, current )                 // Populate new breakpoints hash with a key for each of the breakpoint names defined in the css.
        , total    = names.length
        , i        = 0
        , name
        , isCurrent

      if( current !== previous ){

        // Update our global namespace with the current state of each breakpoint:
        for( name in detected ){
          breakpoints[name] = detected[name]
        }

        // Bonus feature: Set device classes on the HTML element, in much the same style as modernizr: (Eg: "phone no-tablet no-desktop")
        // Note: Beware of using for(i in names) instead because if another script has augmented Array.prototype with methods, we'd iterate those too.
        for(; i < total; i++ ){

          name      = names[i].replace(/^no-/,'')
          isCurrent = breakpoints[name]

          $('HTML')
            .toggleClass(         name,  isCurrent )
            .toggleClass( 'no-' + name, !isCurrent )

        }

        // Raise custom BREAKPOINT changed event: (If you need to ignore initial firing of this during page load, "previous" will be null the first time this fires)
        $(window).trigger( 'breakpoint', [ current, previous ] )
        previous = current

      }

    })

  })

})(this)