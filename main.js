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
        max: 90,
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
    }, 
    speed: {
        min: 0.5, 
        max: 5
    }
}

function Asteroid(domElement){
    this.domElement = domElement;
    this.direction = spaceField.functions.helpers.randomAngle();
    this.speed = spaceField.functions.helpers.randomNumber({min: 0.5, max: 5});
    this.x = domElement.style.left.replace("px", "");
    this.y = domElement.style.top.replace("px", "");
    this.radius = domElement.style.width.replace("px", "")/2;
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
    loop: function() {
        spaceField.asteroids.forEach(asteroid => {
            var yChange = Math.sin(asteroid.direction) * asteroid.speed;
            var xChange = Math.cos(asteroid.direction) * asteroid.speed;
            
            asteroid.x = +asteroid.x + xChange;
            asteroid.y = +asteroid.y + yChange;

            spaceField.functions.helpers.setStyles(asteroid.domElement, {
                left: asteroid.x + "px",
                top: asteroid.y + "px"
            });

            var offHorizontally = spaceField.functions.helpers.underZeroOrOverMax(asteroid.x, spaceField.size.width, asteroid.radius);
            var offVertically = spaceField.functions.helpers.underZeroOrOverMax(asteroid.y, spaceField.size.height, asteroid.radius);

            // This asteroid is off the edge. We'll replace this one with a new one moving in from the edge of the screen.
            // We'll reuse the object and dom element and update them.
            if(offHorizontally || offVertically){
                // Pick an edge: 0 = left, 1 = down, 2 = right, 3 = bottom
                var newEdge = spaceField.functions.helpers.randomInt({min: 0, max: 3});

                // Figure out our new location based on the edge.
                if(newEdge === 0 || newEdge === 2){
                    asteroid.y = spaceField.functions.helpers.randomY(newSize);

                    if(newEdge === 0){
                        asteroid.x = 0 - asteroid.radius;
                    } else{
                        asteroid.x = spaceField.size.width + asteroid.radius;
                    }
                } else{
                    asteroid.x = spaceField.functions.helpers.randomX(newSize);

                    if(newEdge === 1){
                        asteroid.y = 0 - asteroid.radius;
                    } else{
                        asteroid.y = spaceField.size.height + asteroid.radius;
                    }
                }

                // Choose an angle that will move in from the edge we've chosen.
                asteroid.direction = spaceField.functions.helpers.randomNumber({
                    min: (newEdge * 90), 
                    max: ((newEdge + 1) * 90) 
                });

                // Calculate a new random size and update our objects
                var newSize = spaceField.functions.helpers.randomNumber(asteroidPrototype.size);

                asteroid.radius = newSize/2;

                spaceField.functions.helpers.setStyles(asteroid.domElement, {
                    width: newSize + "px",
                    height: newSize + "px"
                });

                // Calculate a new random speed
                asteroid.speed = spaceField.functions.helpers.randomNumber(asteroidPrototype.speed);
            }
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

        spaceField.functions.helpers.log('Stars Generated.');

        for(var d = spaceField.settings.planetCount; d > 0; d--){
            var layer = spaceField.functions.generate.layer(field, 'planet-layer');

            spaceField.functions.generate.planet(layer);
        }

        spaceField.functions.helpers.log('Planets Generated.');

        for(var d = spaceField.settings.asteroidLayers; d > 0; d--){
            var asteroidCount = spaceField.functions.helpers.randomNumber(spaceField.settings.asteroidsPerLayer);

            var layer = spaceField.functions.generate.layer(field, 'asteroid-layer');

            for(var i = 0; i < asteroidCount; i++){
                spaceField.functions.generate.asteroid(layer);
            }
        }

        spaceField.functions.helpers.log('Asteroids Generated:');
        spaceField.functions.helpers.log(spaceField.asteroids);        

        // init loop
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
            // Applies a number of CSS rules to a DOM element
            // Expects an object of the following format:
            // { "background": "#BADA55", color: "#C0FF13" }
            setStyles: function(target, styles){
                Object.keys(styles).forEach(function(key){
                    target.style[key] = styles[key];
                });
            },
            // Returns a random RGB color
            randomRGB: function(colorRange){
                var red = spaceField.functions.helpers.randomNumber(colorRange.red)
                var green = spaceField.functions.helpers.randomNumber(colorRange.green)
                var blue = spaceField.functions.helpers.randomNumber(colorRange.blue)

                return `rgb(${red},${green},${blue})`
            },
            // Returns a number between two values.
            // Expects an object of the following format:
            // { min: 0, max: 50 }
            randomNumber: function(numberRange){
                // Get minimum number
                var number = numberRange.min;

                // Add a random number to get between min and max
                return number += (numberRange.max - numberRange.min) * Math.random();
            },
            // This is trickier than you'd first guess since you don't want the min and max to be less likely to be chosen.
            // Solution modified from SO: https://stackoverflow.com/a/1527820/7816145
            randomInt: function(numberRange){
                numberRange.min = Math.ceil(numberRange.min);
                numberRange.max = Math.floor(numberRange.max + 1);
                return Math.floor(spaceField.functions.helpers.randomNumber(numberRange));
            },
            randomSizeWithDepth: function(sizeRange, depth){
                var size = spaceField.functions.helpers.randomNumber(sizeRange);

                // Shrink objects in back layers.
                return size/depth;
            },
            // returns a number between 0 and 360
            randomAngle: function(){
                return spaceField.functions.helpers.randomNumber({min: 0, max: 360});
            },
            randomX: function(diameter){
                return (Math.random() * spaceField.size.width) - diameter/2;
            },
            randomY: function(diameter){
                return (Math.random() * spaceField.size.height) - diameter/2;
            },
            underZeroOrOverMax(number, max, adjustment){
                return (number > max + adjustment) || (number < 0 - adjustment);
            }
        }
    }
};

window.addEventListener('load', spaceField.init({
    target: '#space-field'
}));