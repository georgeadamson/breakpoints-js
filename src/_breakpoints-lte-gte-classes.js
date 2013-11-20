
// OPTIONAL: Add lt/gt/lte/gte classes to represent "larger than tablet" etc (eg: "gt-tablet")

;(function( updateClassNames ){

  var bind = $.fn.on ? 'on' : 'bind'

  updateClassNames()
  $(window)[bind]( 'breakpoint', updateClassNames )

})( function(){ // updateClassNames()

  /* jshint laxcomma:true, asi:true, debug:true, curly:false, camelcase:true, browser:true */
  /* global console */

  var currentBreakpoint = window.breakpoints.current
    , breakpointNames   = window.breakpoints.names
    , i                 = breakpointNames.length
    , smallest          = 1     // Index of smallest breakpoint in the breakpointNames array.
    , largest           = i - 1 // Index of largest  breakpoint in the breakpointNames array.
    , oldClasses        = []
    , newClasses        = []
    , currentIdx        = 0
    , name
    , ltePrefix         = 'lte-'
    , gtePrefix         = 'gte-'


  // Derive names of lte/gte range classes to add & remove: (Eg: "gte-tablet lte-desktop" etc)
  while( --i ){

    name = breakpointNames[i]

    // Note the index of the current breakpoint when we happen upon it in the loop:
    if( name === currentBreakpoint ) currentIdx = i

    newClasses.push( currentIdx >= i ? gtePrefix + name : ltePrefix + name )

    if( name === currentBreakpoint ){
      // Skip lte-largest and gte-smallest because they're pointless:
      ( i === largest  ? oldClasses : newClasses ).push( ltePrefix + name );
      ( i === smallest ? oldClasses : newClasses ).push( gtePrefix + name )
    }else{
      oldClasses.push( currentIdx <= i ? gtePrefix + name : ltePrefix + name )
    }

  }


  $('html').addClass(    newClasses.join(' ') )
           .removeClass( oldClasses.join(' ') )
         
})

