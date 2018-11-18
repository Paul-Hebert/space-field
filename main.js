var options = {
    target: '#space-field'
};

var starPrototype = {
    settings: {

    },
    size: {
        max: 5,
        min: 3
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

var spaceField = {
    settings: {
        depth: 5,
        starDensity: 1/10000,
        starCount: function(layerDensity){
            return spaceField.size.area() * spaceField.settings.starDensity * layerDensity;
        }
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

        spaceField.functions.log('Field initiated.');
        spaceField.functions.log('Settings:');
        spaceField.functions.log(spaceField.settings, 'table');
        spaceField.functions.log('Size:');
        spaceField.functions.log(spaceField.size, 'table');

        for(var d = spaceField.settings.depth; d > 0; d--){
            var layer = document.createElement('div');
            layer.className = 'layer';
            field.append(layer);

            for(var i = 0; i < spaceField.settings.starCount(d); i++){
                var star = document.createElement('div');
                star.className = 'star';

                // get minimum size
                var starSize = starPrototype.size.min;

                // add a random number to get between min and max
                starSize += (starPrototype.size.max - starPrototype.size.min) * Math.random();

                // shrink stars in back layer.
                starSize *= 1/d;

                spaceField.functions.setStyles(star, {
                    "left": Math.random() * spaceField.size.width,
                    "top": Math.random() * spaceField.size.height,
                    "width": starSize + "px",
                    "height": starSize + "px",
                    "background": spaceField.functions.randomRGB(starPrototype.colorRange),
                    "box-shadow": `0px 0px ${1/d}px ${1/d}px rgba(255,255,255,0.33)`,
                });

                layer.append(star);
            }
        }
    },
    functions: {
        log: function(content, action = 'log'){
            console[action](content);
        },
        setStyles: function(target, styles){
            Object.keys(styles).forEach(function(key){
                target.style[key] = styles[key];
            });
        },
        randomRGB: function(colorRange){
            var red = spaceField.functions.randomColorValue(colorRange.red)
            var green = spaceField.functions.randomColorValue(colorRange.green)
            var blue = spaceField.functions.randomColorValue(colorRange.blue)

            return `rgb(${red},${green},${blue})`
        },
        randomColorValue: function(color){
            return color.min + ((color.max - color.min) * Math.random());
        }
    }
};

window.addEventListener('load', spaceField.init(options));