;(function ( $, window, document, undefined ) {
	'use strict';
	
	var $window = $(window),
		$document = $(document),
	
	    // Create the defaults once
		pluginName = 'catWall',
        defaults = {
			infiniteScroll: true,
			pageSize: 30,
			imageSrc: undefined
        };

	// Binds an instance of CatWall to load page
	// when the user scrolls to the bottom of the page
	function bind(instance) {
		$window.scroll(function (event) {
			// -60 to trigger on iPhone
			if($window.scrollTop() >= $document.height() - $window.height() - 60) {
				instance.loadPage();
			}
		});
	}

    // The actual plugin constructor
    function Plugin( element, options ) {
		this.$element = $(element);
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }

	// Initialization
    Plugin.prototype.init = function () {
		this.$element.addClass('catwall');
		this.loadPage();
		
		if (this.options.infiniteScroll) {
			bind(this);
		}
    };
	
	// Creates an array of images of the given size
	// Uses time since epoch as cache buster
	Plugin.prototype.createImages = function (arraySize) {
		var images = [];
		var t = (new Date()).getTime();

		for (var i = arraySize; i--;) {
			var image = new Image();
			image.src = this.options.imageSrc + '&v=' + t + i;
			images.push(image);
		}
		
		return images;
	};
	
	// Append images to the wall
	Plugin.prototype.loadPage = function () {
		var images = this.createImages(this.options.pageSize);
		
		// Wrap images
		images = images.map(function (image) {
			return $('<div>', { 'class': 'catwall-wrapper' }).append(image);
		});
		
		// jQuery uses document fragment to add elements in bulk
		this.$element.append(images);
	};

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );