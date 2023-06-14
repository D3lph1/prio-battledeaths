const mapping = {
    'Turkey/Ottoman Empire': 'Turkey',
    'Sri Lanka (Ceylon)': 'Sri_Lanka',
    'German Federal Republic': 'Germany',
    'United States of America': 'USA',
    'United Kingdom': 'England',
    'Italy/Sardinia': 'Italy',
    'Republic of Korea': 'South_Korea',
    'Cote D’Ivoire': 'Ivory_Coast',
    'Kyrgyz Republic': 'Kyrgyzstan'
}

export function countryNameOnGlobe(name) {
    name = name.trim()

    if (mapping.hasOwnProperty(name)) {
        return mapping[name]
    }

    return name.replaceAll(' ', '_').replace(/\W+/g, '')
}