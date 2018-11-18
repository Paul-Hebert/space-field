var options = {
    target: '#space-field'
};

var starPrototype = {
    settings: {

    },
    size: {
        max: 7,
        min: 3
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
        console.log(field);
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

                // add a ranodm number to get between min and max
                starSize += ((starPrototype.size.max - starPrototype.size.min) * Math.random());

                // shrink stars in back layer.
                starSize *= 1/d;

                spaceField.functions.setStyles(star, {
                    left: Math.random() * spaceField.size.width,
                    top: Math.random() * spaceField.size.height,
                    width: starSize + "px",
                    height: starSize + "px"
                })

                layer.append(star);
            }
        }
    },
    functions: {
        log: function(content, type = 'log'){
            console[type](content);
        },
        setStyles: function(target, styles){
            Object.keys(styles).forEach(function(key){
                target.style[key] = styles[key];
            });
        }
    }
};

window.addEventListener('load', spaceField.init(options));