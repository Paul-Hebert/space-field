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

var asteroidPrototype = {
    className: 'asteroid',
    size: {
        max: 13,
        min: 5
    }
}

function Asteroid(domElement){
    this.domElement = domElement;
    this.direction = spaceField.functions.helpers.randomAngle();
    this.speed = spaceField.functions.helpers.randomNumber({min: 0.5, max: 5});
    this.x = domElement.style.left.replace("px", "");
    this.y = domElement.style.top.replace("px", "");
}

var spaceField = {
    settings: {
        starDepth: 5,
        starDensity: 1/10000,
        starCount: function(layerDensity){
            return spaceField.size.area() * spaceField.settings.starDensity * layerDensity;
        },
        planetCount: 7,
        asteroidLayers: 10,
        asteroidsPerLayer: {
            min: 3,
            max: 8
        }
    },
    size: {
        width: null,
        height:  null,
        area: function(){
            return spaceField.size.width * spaceField.size.height;
        }
    },
    asteroids: [],
    loop: function(timestamp) {
        spaceField.asteroids.forEach(asteroid => {
            var yChange = Math.sin(asteroid.direction) * asteroid.speed;
            var xChange = Math.cos(asteroid.direction) * asteroid.speed;
            
            asteroid.x = +asteroid.x + xChange;
            asteroid.y = +asteroid.y + yChange;

            spaceField.functions.helpers.setStyles(asteroid.domElement, {
                left: asteroid.x + "px",
                top: asteroid.y + "px"
            });
        });

        window.requestAnimationFrame(spaceField.loop);
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

        for(var d = spaceField.settings.asteroidLayers; d > 0; d--){
            var asteroidCount = spaceField.functions.helpers.randomNumber(spaceField.settings.asteroidsPerLayer);

            var layer = spaceField.functions.generate.layer(field, 'asteroid-layer');

            for(var i = 0; i < asteroidCount; i++){
                spaceField.functions.generate.asteroid(layer);
            }
        }

        window.requestAnimationFrame(spaceField.loop);
    },
    functions: {
        generate: {
            object: function(prototype, depth){
                var object = document.createElement('div');
                object.className = prototype.className;

                objectSize = spaceField.functions.helpers.randomSizeWithDepth(prototype.size, depth);

                spaceField.functions.helpers.setStyles(object, {
                    "left": spaceField.functions.helpers.randomX(objectSize) + "px",
                    "top": spaceField.functions.helpers.randomY(objectSize) + "px",
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
            asteroid: function(container){
                var asteroid = spaceField.functions.generate.object(asteroidPrototype, 1);

                spaceField.asteroids.push(new Asteroid(asteroid));

                container.append(asteroid);
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
            randomNumber: function(numberRange){
                // get minimum number
                var number = numberRange.min;

                // add a random number to get between min and max
                return number += (numberRange.max - numberRange.min) * Math.random();
            },
            randomSizeWithDepth: function(sizeRange, depth){
                var size = spaceField.functions.helpers.randomNumber(sizeRange);

                // shrink objects in back layers.
                return size/depth;
            },
            randomAngle: function(){
                return spaceField.functions.helpers.randomNumber({min: 0, max: 360});
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