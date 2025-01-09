//need to convert into arbitary standard unit first (meter) and then convert into desired unit
    //eg.10 yard / 1.09361 meter per yard = 9.144 meter
    //since yard cancels out only meter left
//credits Aj-Seven github
export function convertLength(firstUnit, secUnit, value) {
    const lengthUnit = {
        'm': 1,
        'cm': 100,
        'mm': 1000,
        'km': 0.001,
        'inch': 39.37008,
        'foot': 3.28084,
        'yard': 1.09361,
        'mile': 0.000621371
    }
    const valueInMeter = value / lengthUnit[firstUnit];
    return (valueInMeter * lengthUnit[secUnit]).toFixed(5);
}

export function convertWeight(firstUnit, secUnit, value) {
    const lengthUnit = {
        'g': 1,
        'mg': 1000,
        'kg': 0.001,
        'ounce': 0.035274,
        'pound': 0.0022046249999752,
    }
    const valueInGram = value / lengthUnit[firstUnit];
    return (valueInGram * lengthUnit[secUnit]).toFixed(5);
}

export function convertTemperature(firstUnit, secUnit, value) {
    let valueInCelsius;
    switch (firstUnit) {
        case 'f':
            valueInCelsius = (value - 32) * 0.55555;
            break;
        case 'k':
            valueInCelsius = value - 273.15;
            break;
        default:
            valueInCelsius = value;
    }

    if (secUnit === 'k') { //celsius to kelvin formula
        return (parseFloat(valueInCelsius) + 273.15).toFixed(5);
    } else if (secUnit === 'f') { //celsius to fahrenheit formula
        return (parseFloat(valueInCelsius) * 1.8 + 32).toFixed(5);
    } else { 
        return valueInCelsius.toFixed(5);
    }
}