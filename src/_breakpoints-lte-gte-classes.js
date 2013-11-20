
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
    , oldClasses        = []
    , newClasses        = []
    , currentIdx        = 0
    , name
    , ltePrefix         = 'lte-'
    , gtePrefix         = 'gte-'


  // Derive names of lt/gt/lte/gte ranges classes to add & remove: (Eg: "gt-tablet lte-widescreen" etc)
  while( --i ){

    name = breakpointNames[i]

    // Note the index when we happen upon the current breakpoint in the loop.
    if( name === currentBreakpoint ) currentIdx = i

    newClasses.push( currentIdx >= i ? gtePrefix + name : ltePrefix + name )

    if( name === currentBreakpoint )
      newClasses.push( ltePrefix + name )
    else
      oldClasses.push( currentIdx <= i ? gtePrefix + name : ltePrefix + name )

  }


  $('html').addClass(    newClasses.join(' ') )
           .removeClass( oldClasses.join(' ') )
         
})

