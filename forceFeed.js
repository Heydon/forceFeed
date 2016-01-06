/*
* forceFeed.js
* author: Heydon Pickering (http://www.heydonworks.com)
* Released under the WTFPL license (http://sam.zoy.org/wtfpl/)
*/

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function () {
      return (root.forceFeed = factory());
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals
    root.forceFeed = factory();
  }
}(this, function () {
  return function forceFeed(ingredients) {

    // Save this function's arguments for use later
    var argsObject = arguments[0];

    // Get a true array of elements with the
    // data-forcefeed attribute
    var elems = [].slice.call(document.querySelectorAll('[data-forcefeed]'));

    // Define shuffle function for randomizing content
    function shuffle(array) {
      for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
      return array;
    }

    // Iterate over the elements
    elems.forEach(function(el) {

      // Split the data-forcefeed value into an array
      var split = el.getAttribute('data-forcefeed').split('|');

      // Create the settings object
      var settings = {
        set: split[0], // the content set (array) from object arg
        min: parseInt(split[1]), // lower limit
        max: parseInt(split[2]) // upper limit
      };

      // Get the content array we're dealing with
      // for this element from settings.set
      var buffet = argsObject[settings.set];

      if (!buffet) {
        throw new Error('A forceFeed.js parameter, ' + split[0] + ', for the element ' + el.outerHTML + ' is not recognized.');
      }

      // Initialize quantity, sample and food vars
      var quantity, sample, food;

      // If there is a max parameter
      if (settings.max) {

        // Get the randomized (between parameters) quantity
        // of content with which to force feed this element
        quantity = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;

      } else {

        // Treat setting.min as the exact quantity
        quantity = settings.min;

      }

      // If the quantity of items is not larger than the
      // buffet itself
      if (quantity <= buffet.length) {

        // Shuffle buffet ready for sampling
        // (ensures unique items if each item in the array is indeed unique)
        sample = shuffle(buffet).slice(0, quantity);

      } else {

        sample = [];

        // Keep sampling until quantity condition met
        // (uniqueness of each item must be sacrificed)
        for (var i = 0; i <= quantity; i++) {
          sample.push(buffet[Math.floor(Math.random()*buffet.length)]);
        }

      }

      // Stringify the sample
      food = sample.join(' ');

      // Make the "food" string the text node of the element
      el.innerHTML = food;

    });
  };
}));
