var tests = {
    // This test is pretty rough. It should theoretically show a fairly even distribution between the four numbers.
    // If one is way high or low, this would catch it, but it requires human review, and could potentially get weird random results sometimes.
    getRandomSide: function(){
        var counts = {
            zeros: 0,
            ones: 0,
            twos: 0,
            threes: 0
        }

        for(i = 0; i < 100000; i++){
            var newSide = spaceField.functions.helpers.randomInt({min: 1, max: 4});

            switch(newSide){
                case 0: {
                    counts.zeros++;
                    break;
                }
                case 1: {
                    counts.ones++;
                    break;
                }
                case 2: {
                    counts.twos++;
                    break;
                }
                case 3: {
                    counts.threes++;
                    break;
                }
            }
        }

        console.table(counts);
    }
}

tests.getRandomSide();