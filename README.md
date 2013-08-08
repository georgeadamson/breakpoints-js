breakpoints-js
==============

Tiny script to sync CSS Media Query Breakpoints to Javascript.

If you also include the breakpoints.js in your project you can test things like this window.breakpoints.small === true and bind to a custom *breakpoint* event.

You define the names of your breakpoints in your CSS.

Rudimentary detection of display type using breakpoints defined in the CSS. The JS will store the results in global *breakpoints* variable.
The advantage of this technique is simply that the breakpoints need only be defined in the css and not duplicated in the JS too.

The files you need are in the /src folder. See /src/breakpoints.scss to understand how this works. Unlike other solutions, this does not rely on pseudo elements or css transition events. 
Note: Use with *respond.js* to make this Media Query technique work in IE6-8 etc.

By George Adamson - https://github.com/georgeadamson/breakpoints-js

Sample usage: (with breakpoints.js)
```javascript
<link rel="stylesheet" href="breakpoints.css"/>
<script src="breakpoints.min.js"></script>
<script>
  var currentDisplayType = window.breakpoints.current                  // Eg: "large"
  if( window.breakpoints.medium ) { ... }
  $(window).on('breakpoint', function( currentBreakpoint, previousBreakpoint ){ ... } )
</script>
```

Sample usage: (without breakpoints.js)
```javascript
<link rel="stylesheet" href="breakpoints.css">
<script>
  var currentDisplayType = $('HEAD').css('fontFamily')                 // Eg: "large"
  var allDisplayTypes    = $('HEAD *').css('fontFamily').split(/,\s*/) // Eg: ["defaultbreakpoint", "small", "medium", "large"]
</script>
```
