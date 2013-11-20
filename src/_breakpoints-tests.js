// Rudimentary unit tests for breakpoint classes on the <html> element.
// Outputs simple pass/fail into to the console for expected and unexpected class names at the current breakpoint.
// Resize browser to test the full range of breakpoints and to ensure classes are updated as expected.
// You don't need this in live code.

;(function( testBreakpoint ){

  var bind = $.fn.on ? 'on' : 'bind'

  testBreakpoint()

  $(window)[bind]( 'breakpoint', testBreakpoint )

})( function(){

  // jshint laxcomma:true, asi:true, debug:true, curly:false, camelcase:false, browser:true
  /* global console */

  // Note: We explicity do not expect to see lte-widescreen (lte largest) and gte-phone (gte smallest) because they're pointless.

  var expectedClassNames = {

      phone      : 'phone no-tablet no-desktop no-widescreen lt-tablet lt-desktop lt-widescreen lte-phone lte-tablet lte-desktop'
    , tablet     : 'no-phone tablet no-desktop no-widescreen gt-phone lt-desktop lt-widescreen gte-tablet lte-tablet lte-desktop'
    , desktop    : 'no-phone no-tablet desktop no-widescreen gt-phone gt-tablet lt-widescreen gte-tablet gte-desktop lte-desktop'
    , widescreen : 'no-phone no-tablet no-desktop widescreen gt-phone gt-tablet gt-desktop gte-tablet gte-desktop gte-widescreen'

  }

  var unwantedClassNames = {

      phone      : 'no-phone tablet desktop widescreen lt-phone gt-phone gt-tablet gt-desktop gt-widescreen gte-phone gte-tablet gte-tablet gte-desktop gte-widescreen lte-widescreen'
    , tablet     : 'phone no-tablet desktop widescreen lt-phone lt-tablet gt-tablet gt-desktop gt-widescreen gte-phone lte-phone gte-desktop gte-widescreen lte-widescreen'
    , desktop    : 'phone tablet no-desktop widescreen lt-phone lt-tablet lt-desktop gt-desktop gt-widescreen lte-phone gte-phone lte-tablet gte-widescreen lte-widescreen'
    , widescreen : 'phone tablet desktop no-widescreen lt-phone lt-tablet lt-desktop lt-widescreen lte-phone gte-phone lte-tablet lte-desktop lte-widescreen'

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
  console[logOrWarn]( fails.length ? 'FAIL:' : 'PASS:', 'Expected breakpoint classes:', fails.length ? fails : names || 'none' )
  
  
  // Test for invalid breakpoint class names at current breakpoint:
  names     = unwantedClassNames[current] || ''
  fails     = $.map( names.split(' '), function(cls){ return ( !cls || root.is( ':not(.' + cls + ')' ) ) ? undefined : cls })
  logOrWarn = fails.length ? 'warn' : 'log'
  console[logOrWarn]( fails.length ? 'FAIL:' : 'PASS:', 'Unexpected breakpoint classes:', fails.length ? fails : names || 'none' )

})