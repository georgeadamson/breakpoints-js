/*!
 * Sync CSS Mediaquery Breakpoints to Javascript. Use with breakpoints.css.
 * George Adamson - https://github.com/georgeadamson/breakpoints-js
 */

;(function ( define, factory ) {

  // Register as an anonymous AMD module if relevant, otherwise assume old-skool browser globals:
  if (typeof define === "function" && define.amd){
    define(["jquery"], factory);
  }else{
    factory( jQuery );
  }

})( window.define, function($) {

  // The JS will store the results in global breakpoints variable and raise a breakpoint event whenever they change.
  // The advantage of this technique is simply that the breakpoints need only be defined in the css and not duplicated in the JS too.
  // Eg: window.breakpoints.phone === true
  // IMPORTANT: Must be used with breakpoints.scss.
  //            Use with respond.js to use this Media Query technique in IE6-8 etc.

  // v1.0   - Original version. September 2013.
  // v1.0.1 - Experiments with detecting DPA breakpoints too. Work in progress.
  // v1.1   - Add lt/gt "range" classes to the <html> element too, to represent "greater than tablet" etc (eg: "gt-tablet"). (Assumes breakpoints are defined in size order in css)
  // v1.2   - Add lte/gte "range" classes to the <html> element too, to represent "greate or equal to tablet" etc (eg: "gte-tablet"). (Assumes breakpoints are defined in size order in css)

  /* jshint laxcomma:true, asi:true, debug:true, curly:false, camelcase:true, browser:true */
  /* global define, console */
 
 
  // @codekit-append "_breakpoints-lt-gt-classes.js"
  // @codekit-append "_breakpoints-lte-gte-classes.js"

  // Only include this file in development environment:
  // @codekit-append "_breakpoints-tests.js"


  // This will result in a global window.breakpoints property:
  var moduleName        = 'breakpoints'

  , doDprClasses       = false // <-- Not ready for prime time.
  , doLtGtClasses      = true
  , doLteGteClasses    = true

  // Keep a reference to regularly used elements:
    , win               = window
    , doc               = document
    , root              = doc.documentElement
    , breakpointEl      = doc.getElementsByTagName('head')[0] // This element's css tells us the current breakpoint name.
    , breakpointsEl     = 'LINK'                              // This element's css tells us the names of all the breakpoints.
    , dprEl             = doc.getElementById('dpr') || $('<meta id=dpr>').appendTo( breakpointEl )[0]

  // Define a global variable on which to define custom display-size properties: (Eg: breakpoints.phone = true & breakpoints.tablet = false)
    , breakpoints       = win[moduleName] || ( win[moduleName] = {} )

  // Name of custom event to raise whenever breakpoints change as a result of the css media queries:
    , breakpointEvent   = 'breakpoint'

  // Less-than & Greater-than prefixes to prepend to breakpoint names to form the breakpoint range names. 
    , noPrefix          = 'no-'
    , ltPrefix          = 'lt-'
    , gtPrefix          = 'gt-'
    , ltePrefix         = 'lte-'
    , gtePrefix         = 'gte-'

  // Fake font name to help highlight when the breakpoints stylesheet is missing:
    , stylesMissing     = noPrefix + moduleName + '-stylesheet'

  // Determine which property will tell us the window's x & y position: (Hard to read because it is optimised for minification)
    , screen            = 'screen'
    , screenX           = screen + ( ( screen + 'X' ) in win ? 'X' : 'Left' )   // Use window.screenX or window.screenLeft
    , screenY           = screen + ( ( screen + 'Y' ) in win ? 'Y' : 'Top'  )   // Use window.screenY or window.screenTop

  // Flag for tracking changes to the currently detected breakpoint:
    , previous          = null
    , previousDpr       = null
    , previousPos       = { x: win[screenX], y: win[screenY] }

  // Regex to find commas in a css fontFamily and to trim spaces or quotes from a atring:
    , reComma           = /\s*,\s*/
    , reTrim            = /^[\s'"]*|[\s'"]*$/g

  // Helper to read custom font from specified element: (Assumes common browser default serif & sans-serif fonts are not the names of your custom breakpoints)
    , getFontOf         = function( elem ){
        var font = $(elem).css('fontFamily')
        return ( !font || /^serif|sans-serif|times|arial|helvetica/i.test(font) ) ? stylesMissing : font.replace(reTrim,'')
    }

  // Helper to build a hash of breakpoint names. Used by detectBreakpoint(). The currently detected breakpoint will be true, the others false:
    , buildHashOf       = function( names, current ){
        var name, result = { current: current }, i = names.length
        while( --i ){ name = names[i]; result[name] = ( name === current ) }
        return result
    }

  // Detect iframe because we may need to respond to iframe-resize events, even on a device with fixed browser display size: (Bit unlikely perhaps? Oh well)
    , isIframe          = ( win.top !== win.self )

  // Feature-detect which browser event(s) to listen to: (For detecting breakpoint changes)
    , orientationchange = 'orientationchange'
    , resize            = ' resize' // The preceeding space is deliberate, so it's easier to concatenate if necessary.
    , resizeEvent       = ( 'on'+orientationchange in win ) ? orientationchange + ( isIframe ? resize : '' ) : resize


  // Define our breakpoints object now and whenever the display or orientation changes:
  ;(function( detectBreakpoint ){

    var bind = $.fn.on ? 'on' : 'bind'

    detectBreakpoint()

    $(win)[bind]( resizeEvent, detectBreakpoint )

    // For detecting when the window might have been dragged into another display.
    // TODO: Inspect window.devicePixelRatio too
    if( doDprClasses ) setInterval( function(){

      var currentPos = { x: win[screenX], y: win[screenY] }
      if( currentPos.x !== previousPos.x || currentPos.y !== previousPos.y ){
        detectBreakpoint( currentPos )
      }

    }, 500 )


  })( function( currentPos ) { // detectBreakpoint()

    // Media Queries will set the name of the current breakpoint as a fake fontFamily on the hidden HEAD element. We simply read the corresponding values:
    var $root      = $(root)
      , current    = getFontOf( breakpointEl ) || stylesMissing                           // Read current breakpoint name: (We expect this to vary depending on which mediaquery is being applied right now)
      , currentDpr = doDprClasses && getFontOf( dprEl )                                   // Read current dpr name.
      , names      = getFontOf( $(breakpointEl).children(breakpointsEl) ).split(reComma)  // Derive array of all possible breakpoints defined in css so we can iterate through them: (See detect-display.scss for definition of these values)
      , detected   = buildHashOf( names, current )                                        // Build a new breakpoints object with a key for each of the breakpoint names defined in the css.
      , length     = names.length
      , i          = 0
      , name
      , isCurrent
      , isCurrentDpr


    // Make the list of all breakpoints available on the global variable:
    breakpoints.names = names


    // Ensure this is falsy if it isn't coordinates: (Because sometime it is an event object, depending how this function was called)
    currentPos = doDprClasses && currentPos && ( 'x' in currentPos ) && currentPos


    if( current !== previous || ( doDprClasses && currentDpr !== previousDpr || ( currentPos && ( currentPos.x !== previousPos.x || currentPos.y !== previousPos.y ) ) ) ){

      // Update our global namespace with the current state of each breakpoint:
      for( name in detected ){
        breakpoints[name] = detected[name]
      }

      // Set device classes on the HTML element, in much the same style as modernizr: (Eg: "phone no-tablet no-desktop")
      // Note: Beware of using for(i in names) instead because if another script has augmented Array.prototype with methods, we'd iterate those too.
      for( i=0; i < length; i++ ){

        name = names[i]

        // Discard any "no-" prefix from the font name: (Unless it is our fake stylesMissing font name)
        if( name.indexOf(noPrefix) === 0 && name !== stylesMissing ) name = name.substr(3)
        
        isCurrent = !!breakpoints[name]

        $root
          .toggleClass(            name,     isCurrent )
          .toggleClass( noPrefix + name,    !isCurrent )
          // Work in progress: Not quite ready for prime time:
          //.toggleClass( 'dpr-' + previousDpr, previousDpr === currentDpr )
          //.addClass( 'dpr-' + currentDpr )

      }

      // Make a note of the previous width & dpr breakpoints:
      if( current !== previous ){
        breakpoints.previous = previous;
        previous             = current
      }

      if( doDprClasses ){
        if( currentDpr !== previousDpr ){ breakpoints.previousDpr = previousDpr; previousDpr = currentDpr }
        breakpoints.currentDpr = currentDpr
      }

      // This is how your own code can react to breakpoint changes:
      triggerBreakpointEvent()

      if( currentPos ){
        previousPos.x = currentPos.x
        previousPos.y = currentPos.y
      }

    }

  })



  function triggerBreakpointEvent(){

    // WORK IN PROGRESS: Refactoring to raise event natively instead of relying on jQuery.
    // Raise custom BREAKPOINT changed event: (If you need to ignore initial firing of this during page load, "previous" will be null the first time this fires)
    // var e
    //
    // if( window.CustomEvent ){
    // 
    //   // Raise custom event natively:
    //   e = new CustomEvent( breakpointEvent, { currentBreakpoint: current, previousBreakpoint: previous })
    //   window.dispatchEvent(e)
    // 
    // }
    // else if( document.createEvent ){
    // 
    //   // Raise custom event natively using oldskool syntax:
    //   e = document.createEvent('Event')
    //   e.initEvent( breakpointEvent, true, true )
    //   window.dispatchEvent(e)
    // 
    // }
    // else{
    // 
    //   // Raise event using jQuery:
    //   $ = $ || window.jQuery || window.$
    //   if( $ ){
           $(win).trigger( breakpointEvent, [ breakpoints ] )
    //   }
    // 
    // }

  }


})
