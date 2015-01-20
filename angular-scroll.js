/*
*  angular-scroll v1.0.0
*  Scrolling the Angular way
*  Copyright 2015 Pavel Gavrilenko
*  Examples and docs: https://github.com/gavr-pavel/angular-scroll
*/
;(function () {

    'use strict';

    angular
        .module('scroll', [])
        .factory('scroll', scrollFactory)
        .directive('scrollRoot', scrollRoot)
        .directive('scrollItem', scrollItem);



    scrollFactory.$inject = ['$timeout', '$window'];

    function scrollFactory ($timeout, $window) {

        var doc = $window.document,
            docRoot = doc.documentElement,
            docBody = doc.body;

        return function (obj) {

            var options = {
                root: null,
                target: null,
                duration: 600,
                callback: null
            };

            $timeout(function () {
                if (!(options.root instanceof Element)) {
                    throw new Error('Root element is not provided!');
                }
                if (!(options.target instanceof Element)) {
                    throw new Error('Target element is not provided!');
                }
                if (typeof options.duration !== 'number') {
                    throw new Error('Duration is not a number!');
                }
                scroll(options);
            });

            var chainObj1 = {
                to: function (target) {
                    options.target = target;
                    return chainObj2;
                }
            };
            var chainObj2 = {
                in: function (duration) {
                    options.duration = duration;
                    this.in = null;
                    return this;
                },
                then: function (callback) {
                    options.callback = callback;
                }
            };

            if (obj instanceof Element) {
                options.root = obj;
                return chainObj1;
            } else {
                options = obj;
            }

        };


        function scroll (opts) {

            var viewportWidth = opts.root.clientWidth,
                viewportHeight = opts.root.clientHeight,
                contentWidth = opts.root.scrollWidth,
                contentHeight = opts.root.scrollHeight,
                rootIsBody = opts.root === docBody,
                scrollTo = rootIsBody ? bodyScrollTo : regularScrollTo,
                rootOffset = opts.root.getBoundingClientRect(),
                targetOffset = opts.target.getBoundingClientRect(),
                started = new Date().getTime(),
                from = scrollTo(),
                to = {
                    left: Math.min(
                        from.left + targetOffset.left - (rootIsBody ? 0 : rootOffset.left),
                        contentWidth - viewportWidth
                    ),
                    top: Math.min(
                        from.top + targetOffset.top - (rootIsBody ? 0 : rootOffset.top),
                        contentHeight - viewportHeight
                    )
                };

            $window.requestAnimationFrame(step);


            function step () {
                var pos = (new Date().getTime()-started) / opts.duration,
                    progress = easeInOutCubic(pos),
                    scrollLeft,
                    scrollTop;

                if (progress < 1) {
                    scrollLeft = from.left + (to.left-from.left) * progress;
                    scrollTop = from.top + (to.top-from.top) * progress;
                    scrollTo(scrollLeft, scrollTop);
                    $window.requestAnimationFrame(step);
                } else {
                    scrollTo(to.left, to.top);
                    if (typeof opts.callback === 'function') {
                        opts.callback.call(null);
                    }
                }
            }

            function regularScrollTo (left, top) {
                if (left != void(0) && top != void(0)) {
                    opts.root.scrollLeft = left;
                    opts.root.scrollTop = top;
                } else {
                    return {
                        left: opts.root.scrollLeft,
                        top: opts.root.scrollTop
                    };
                }
            }

            function bodyScrollTo (left, top) {
                if (left != void(0) && top != void(0)) {
                    docRoot.scrollLeft = docBody.scrollLeft = left;
                    docRoot.scrollTop = docBody.scrollTop = top;
                } else {
                    return {
                        left: docRoot.scrollLeft || docBody.scrollLeft,
                        top: docRoot.scrollTop || docBody.scrollTop
                    };
                }
            }

            function easeInOutCubic (pos) {
                if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3);
                return 0.5 * (Math.pow((pos-2),3) + 2);
            }

        }


    }




    scrollRoot.$inject = ['scroll'];

    function scrollRoot (scroll) {

        var items = {};

        return {
            scope: true,
            link: link,
            controller: ['$scope', controller]
        };

        function link ($scope, $elem, $attrs) {
            var root = $elem[0];

            $scope.scrollTo = function (blockName) {
                var target = items[blockName];
                scroll(root).to(target).in(550);
            };
        }

        function controller ($scope) {
            /*jshint validthis:true */
            this.pushItem = function (name, elem) {
                items[name] = elem;
            };
        }

    }




    function scrollItem () {

        return {
            require: '^scrollRoot',
            link: link
        };

        function link ($scope, $elem, $attrs, scrollRootCtrl) {
            scrollRootCtrl.pushItem($attrs.scrollItem, $elem[0]);
        }

    }

})();
