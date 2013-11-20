// Rudimentary unit tests for breakpoint classes on the <html> element.
// Outputs simple pass/fail into to the console for expected and unexpected class names at the current breakpoint.
// Resize browser to test the full range of breakpoints and to ensure classes are updated as expected.
// You don't need this in live code.

;(function( testBreakpoint ){

  testBreakpoint()

  $(window).on( 'breakpoint', testBreakpoint )

})( function(){

  // jshint laxcomma:true, asi:true, debug:true, curly:false, camelcase:false, browser:true
  /* global console */

  var expectedClassNames = {

      phone      : 'phone no-tablet no-desktop no-widescreen lt-tablet lt-desktop lt-widescreen lte-phone gte-phone lte-tablet lte-desktop lte-widescreen'
    , tablet     : 'no-phone tablet no-desktop no-widescreen gt-phone lt-desktop lt-widescreen gte-phone gte-tablet lte-tablet lte-desktop lte-widescreen'
    , desktop    : 'no-phone no-tablet desktop no-widescreen gt-phone gt-tablet lt-widescreen gte-phone gte-tablet gte-desktop lte-desktop lte-widescreen'
    , widescreen : 'no-phone no-tablet no-desktop widescreen gt-phone gt-tablet gt-desktop gte-phone gte-tablet gte-desktop gte-widescreen lte-widescreen'

  }

  var unwantedClassNames = {

      phone      : 'no-phone tablet desktop widescreen lt-phone gt-phone gt-tablet gt-desktop gt-widescreen gte-tablet gte-tablet gte-desktop gte-widescreen'
    , tablet     : 'phone no-tablet desktop widescreen lt-phone lt-tablet gt-tablet gt-desktop gt-widescreen lte-phone gte-desktop gte-widescreen'
    , desktop    : 'phone tablet no-desktop widescreen lt-phone lt-tablet lt-desktop gt-desktop gt-widescreen lte-phone lte-tablet gte-widescreen'
    , widescreen : 'phone tablet desktop no-widescreen lt-phone lt-tablet lt-desktop lt-widescreen lte-phone lte-tablet lte-desktop'

  }

  var root    = $('HTML')
    , current = window.breakpoints.current
    , pass
    , names
    , fails
    , logOrWarn


  // Bail out if browser does not support console:
  if( !window.console ) return


  // Test for valid breakpoint class names at current breakpoint:
  names     = expectedClassNames[current] || ''
  fails     = $.map( names.split(' '), function(cls){ return ( !cls || root.is( '.' + cls ) ) ? undefined : cls })
  logOrWarn = fails.length ? 'warn' : 'log'
  if( console[logOrWarn] ) console[logOrWarn]( fails.length ? 'FAIL:' : 'PASS:', 'Expected classes:', fails.length ? fails : names || 'none' )
  
  
  // Test for invalid breakpoint class names at current breakpoint:
  names     = unwantedClassNames[current] || ''
  fails     = $.map( names.split(' '), function(cls){ return ( !cls || root.is( ':not(.' + cls + ')' ) ) ? undefined : cls })
  logOrWarn = fails.length ? 'warn' : 'log'
  if( console[logOrWarn] ) console[logOrWarn]( fails.length ? 'FAIL:' : 'PASS:', 'Unexpected classes:', fails.length ? fails : names || 'none' )

})