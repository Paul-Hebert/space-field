var options = {
    target: '#space-field'
};

var starPrototype = {
    className: 'star',
    size: {
        max: 4,
        min: 2
    },
    colorRange: {
        red: {
            min:180,
            max:255
        },
        green: {
            min:180,
            max:255
        },
        blue: {
            min:180,
            max:255
        }
    }
}

var planetPrototype = {
    className: 'planet',
    size: {
        max: 70,
        min: 10
    },
    colorRange: {
        red: {
            min:100,
            max:200
        },
        green: {
            min:100,
            max:200
        },
        blue: {
            min:100,
            max:200
        }
    }
}

var spaceField = {
    settings: {
        starDepth: 5,
        starDensity: 1/10000,
        starCount: function(layerDensity){
            return spaceField.size.area() * spaceField.settings.starDensity * layerDensity;
        },
        planetCount: 7
    },
    size: {
        width: null,
        height:  null,
        area: function(){
            return spaceField.size.width * spaceField.size.height;
        }
    },
    init: function(settings){
        var field = document.querySelector(settings.target);

        spaceField.size.width = field.scrollWidth;
        spaceField.size.height = field.scrollHeight;

        spaceField.functions.helpers.log('Field initiated.');
        spaceField.functions.helpers.log('Settings:');
        spaceField.functions.helpers.log(spaceField.settings, 'table');
        spaceField.functions.helpers.log('Size:');
        spaceField.functions.helpers.log(spaceField.size, 'table');

        for(var d = spaceField.settings.starDepth; d > 0; d--){
            var layer = spaceField.functions.generate.layer(field, 'star-layer');

            for(var i = 0; i < spaceField.settings.starCount(d); i++){
                spaceField.functions.generate.star(layer, d);
            }
        }

        for(var d = spaceField.settings.planetCount; d > 0; d--){
            var layer = spaceField.functions.generate.layer(field, 'planet-layer');

            spaceField.functions.generate.planet(layer);
        }
    },
    functions: {
        generate: {
            object: function(prototype, depth){
                var object = document.createElement('div');
                object.className = prototype.className;

                objectSize = spaceField.functions.helpers.randomSize(prototype.size, depth);

                spaceField.functions.helpers.setStyles(object, {
                    "left": spaceField.functions.helpers.randomX(objectSize),
                    "top": spaceField.functions.helpers.randomY(objectSize),
                    "width": objectSize + "px",
                    "height": objectSize + "px",
                });

                return object;
            },
            star: function(container, depth){
                var star = spaceField.functions.generate.object(starPrototype, depth);

                spaceField.functions.helpers.setStyles(star, {
                    "background": spaceField.functions.helpers.randomRGB(starPrototype.colorRange),
                    "box-shadow": `0px 0px ${1/depth}px ${1/depth}px rgba(255,255,255,0.33)`
                });

                container.append(star);
            },
            planet: function(container){
                var planet = spaceField.functions.generate.object(planetPrototype, 1);

                var backgroundHighlight = spaceField.functions.helpers.randomRGB(planetPrototype.colorRange)

                spaceField.functions.helpers.setStyles(planet, {
                    "background-image": `radial-gradient(#000 50%, ${backgroundHighlight})`,
                    "box-shadow": "0px 0px 7px 3px rgba(255,255,255,0.1)"
                });

                container.append(planet);
            },
            layer: function(container, className){
                var layer = document.createElement('div');
                layer.className = 'layer ' +  className;
                container.append(layer);

                return layer;
            }
        },
        helpers: {
            log: function(content, action = 'log'){
                console[action](content);
            },
            setStyles: function(target, styles){
                Object.keys(styles).forEach(function(key){
                    target.style[key] = styles[key];
                });
            },
            randomRGB: function(colorRange){
                var red = spaceField.functions.helpers.randomColorValue(colorRange.red)
                var green = spaceField.functions.helpers.randomColorValue(colorRange.green)
                var blue = spaceField.functions.helpers.randomColorValue(colorRange.blue)

                return `rgb(${red},${green},${blue})`
            },
            randomColorValue: function(color){
                return color.min + ((color.max - color.min) * Math.random());
            },
            randomSize: function(sizeRange, depth){
                // get minimum size
                var size = sizeRange.min;

                // add a random number to get between min and max
                size += (sizeRange.max - sizeRange.min) * Math.random();

                // shrink objects in back layers.
                return size/depth;
            },
            randomX: function(diameter){
                return (Math.random() * spaceField.size.width) - diameter/2;
            },
            randomY: function(diameter){
                return (Math.random() * spaceField.size.height) - diameter/2;
            }
        }
    }
};

window.addEventListener('load', spaceField.init(options));