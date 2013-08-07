breakpoints-js
==============

Tiny script to sync CSS Media Query Breakpoints to Javascript

Rudimentary detection of display type using breakpoints defined in the CSS. Store the results in global object variable.
The advantage of this technique is simply that the breakpoints don't have to be defined and duplicated in the JS too.
Eg: window.breakpoints.phone === true
IMPORTANT: Must be used with breakpoints.scss.
           Use with respond.js to use this Media Query technique in IE6-8 etc.

By George Adamson - https://github.com/georgeadamson/breakpoints-js
