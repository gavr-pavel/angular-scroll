# angular-scroll
Scrolling the Angular way

## [Demo](http://gavr-pavel.github.io/angular-scroll/demo.html)

## Usage

First, you have to include the module in your app:
```javascript
var app = angular.module('App', ['duScroll']);
```

##### scroll-root and scroll-item directives
```html
<!--
scroll-root attribute tells that element is scrollable;
    the scrollTo method is added to the scope.
scroll-item="someId" attribute tells that scrollable element
    can be scrolled to it's position by calling scrollTo('someId').
-->
<div class="scrollable" scroll-root>
    <div scroll-item="first_block">
        ...
        <button ng-click="scrollTo('second_block')">To the next block!</button>
    </div>
    ...
    <div scroll-item="second_block">
        ...
        <button ng-click="scrollTo('one_more_block')">To the next block!</button>
    </div>
    <div scroll-item="one_more_block">
        ...
        <button ng-click="scrollTo('first_block')">Back to start</button>
    </div>
</div>
```


##### scroll service
```javascript
scroll({
    root: someElement,                // Element to be scrolled
    target: someInnerElement,         // Element inside the scrollable element
    duration: 700,                    // Animation duration in ms (default is 600)
    callback: function () {/* ... */} // The callback is called
                                      //     after the animation has been ended
});
 
 
// OR
 
 
scroll(someElement)
    .to(someInnerElement)
    .in(700)
    .then(function () {/* ... */});
 
// Duration and callback arguments are optional
//     so you can omit them:
scroll(someElement).to(someInnerElement);
```

## Browser support
*angular-scroll* uses `requestAnimationFrame`, so if you want it working in [old browsers](http://caniuse.com/#feat=requestanimationframe) you should use a polyfill. I'd recommend [that one](https://gist.github.com/paulirish/1579671).
