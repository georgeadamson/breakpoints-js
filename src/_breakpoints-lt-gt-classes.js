
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
    , ltPrefix          = 'lt-'
    , gtPrefix          = 'gt-'


  // Derive names of lt/gt range classes to add & remove: (Eg: "gt-tablet lt-widescreen" etc)
  while( --i ){

    name = breakpointNames[i]

    // Note the index of the current breakpoint when we happen upon it in the loop:
    if( name === currentBreakpoint ) currentIdx = i

    oldClasses.push( currentIdx > i ? ltPrefix + name : gtPrefix + name )
      
    if( name === currentBreakpoint )
      oldClasses.push( ltPrefix + name )
    else
      newClasses.push( currentIdx < i ? ltPrefix + name : gtPrefix + name )

  }


  $('html').addClass(    newClasses.join(' ') )
           .removeClass( oldClasses.join(' ') )
         
})

