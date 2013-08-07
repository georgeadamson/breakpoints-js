breakpoints-js
==============

Tiny script to sync CSS Media Query Breakpoints to Javascript

Rudimentary detection of display type using breakpoints defined in the CSS. Store the results in global object variable.
The advantage of this technique is simply that the breakpoints need only be defined in the css and not duplicated in the JS too.

The file you need are in the /src folder. See /src/breakpoints.scss to understand how this works.

Eg: If you include the javascript in your project you can test things like this: window.breakpoints.medium === true

IMPORTANT: Must be used with breakpoints.scss.
           Use with respond.js to use this Media Query technique in IE6-8 etc.

By George Adamson - https://github.com/georgeadamson/breakpoints-js

