const alpha2 = {"Afghanistan": "AF", "Aland Islands": "AX", "Albania": "AL", "Algeria": "DZ", "American Samoa": "AS", "Andorra": "AD", "Angola": "AO", "Anguilla": "AI", "Antarctica": "AQ", "Antigua And Barbuda": "AG", "Argentina": "AR", "Armenia": "AM", "Aruba": "AW", "Australia": "AU", "Austria": "AT", "Azerbaijan": "AZ", "Bahamas": "BS", "Bahrain": "BH", "Bangladesh": "BD", "Barbados": "BB", "Belarus": "BY", "Belgium": "BE", "Belize": "BZ", "Benin": "BJ", "Bermuda": "BM", "Bhutan": "BT", "Bolivia": "BO", "Bosnia And Herzegovina": "BA", "Botswana": "BW", "Bouvet Island": "BV", "Brazil": "BR", "British Indian Ocean Territory": "IO", "Brunei Darussalam": "BN", "Bulgaria": "BG", "Burkina Faso": "BF", "Burundi": "BI", "Cambodia": "KH", "Cameroon": "CM", "Canada": "CA", "Cape Verde": "CV", "Cayman Islands": "KY", "Central African Republic": "CF", "Chad": "TD", "Chile": "CL", "China": "CN", "Christmas Island": "CX", "Cocos (Keeling) Islands": "CC", "Colombia": "CO", "Comoros": "KM", "Congo": "CG", "Congo, Democratic Republic": "CD", "Cook Islands": "CK", "Costa Rica": "CR", "Cote D\"Ivoire": "CI", "Croatia": "HR", "Cuba": "CU", "Cyprus": "CY", "Czech Republic": "CZ", "Denmark": "DK", "Djibouti": "DJ", "Dominica": "DM", "Dominican Republic": "DO", "Ecuador": "EC", "Egypt": "EG", "El Salvador": "SV", "Equatorial Guinea": "GQ", "Eritrea": "ER", "Estonia": "EE", "Ethiopia": "ET", "Falkland Islands (Malvinas)": "FK", "Faroe Islands": "FO", "Fiji": "FJ", "Finland": "FI", "France": "FR", "French Guiana": "GF", "French Polynesia": "PF", "French Southern Territories": "TF", "Gabon": "GA", "Gambia": "GM", "Georgia": "GE", "Germany": "DE", "Ghana": "GH", "Gibraltar": "GI", "Greece": "GR", "Greenland": "GL", "Grenada": "GD", "Guadeloupe": "GP", "Guam": "GU", "Guatemala": "GT", "Guernsey": "GG", "Guinea": "GN", "Guinea-Bissau": "GW", "Guyana": "GY", "Haiti": "HT", "Heard Island & Mcdonald Islands": "HM", "Holy See (Vatican City State)": "VA", "Honduras": "HN", "Hong Kong": "HK", "Hungary": "HU", "Iceland": "IS", "India": "IN", "Indonesia": "ID", "Iran, Islamic Republic Of": "IR", "Iraq": "IQ", "Ireland": "IE", "Isle Of Man": "IM", "Israel": "IL", "Italy": "IT", "Jamaica": "JM", "Japan": "JP", "Jersey": "JE", "Jordan": "JO", "Kazakhstan": "KZ", "Kenya": "KE", "Kiribati": "KI", "Korea": "KR", "North Korea": "KP", "Kuwait": "KW", "Kyrgyzstan": "KG", "Lao People\"s Democratic Republic": "LA", "Latvia": "LV", "Lebanon": "LB", "Lesotho": "LS", "Liberia": "LR", "Libyan Arab Jamahiriya": "LY", "Liechtenstein": "LI", "Lithuania": "LT", "Luxembourg": "LU", "Macao": "MO", "Macedonia": "MK", "Madagascar": "MG", "Malawi": "MW", "Malaysia": "MY", "Maldives": "MV", "Mali": "ML", "Malta": "MT", "Marshall Islands": "MH", "Martinique": "MQ", "Mauritania": "MR", "Mauritius": "MU", "Mayotte": "YT", "Mexico": "MX", "Micronesia, Federated States Of": "FM", "Moldova": "MD", "Monaco": "MC", "Mongolia": "MN", "Montenegro": "ME", "Montserrat": "MS", "Morocco": "MA", "Mozambique": "MZ", "Myanmar": "MM", "Namibia": "NA", "Nauru": "NR", "Nepal": "NP", "Netherlands": "NL", "Netherlands Antilles": "AN", "New Caledonia": "NC", "New Zealand": "NZ", "Nicaragua": "NI", "Niger": "NE", "Nigeria": "NG", "Niue": "NU", "Norfolk Island": "NF", "Northern Mariana Islands": "MP", "Norway": "NO", "Oman": "OM", "Pakistan": "PK", "Palau": "PW", "Palestinian Territory, Occupied": "PS", "Panama": "PA", "Papua New Guinea": "PG", "Paraguay": "PY", "Peru": "PE", "Philippines": "PH", "Pitcairn": "PN", "Poland": "PL", "Portugal": "PT", "Puerto Rico": "PR", "Qatar": "QA", "Reunion": "RE", "Romania": "RO", "Russian Federation": "RU", "Rwanda": "RW", "Saint Barthelemy": "BL", "Saint Helena": "SH", "Saint Kitts And Nevis": "KN", "Saint Lucia": "LC", "Saint Martin": "MF", "Saint Pierre And Miquelon": "PM", "Saint Vincent And Grenadines": "VC", "Samoa": "WS", "San Marino": "SM", "Sao Tome And Principe": "ST", "Saudi Arabia": "SA", "Senegal": "SN", "Serbia": "RS", "Seychelles": "SC", "Sierra Leone": "SL", "Singapore": "SG", "Slovakia": "SK", "Slovenia": "SI", "Solomon Islands": "SB", "Somalia": "SO", "South Africa": "ZA", "South Georgia And Sandwich Isl.": "GS", "Spain": "ES", "Sri Lanka": "LK", "Sudan": "SD", "Suriname": "SR", "Svalbard And Jan Mayen": "SJ", "Swaziland": "SZ", "Sweden": "SE", "Switzerland": "CH", "Syrian Arab Republic": "SY", "Taiwan": "TW", "Tajikistan": "TJ", "Tanzania": "TZ", "Thailand": "TH", "Timor-Leste": "TL", "Togo": "TG", "Tokelau": "TK", "Tonga": "TO", "Trinidad And Tobago": "TT", "Tunisia": "TN", "Turkey": "TR", "Turkmenistan": "TM", "Turks And Caicos Islands": "TC", "Tuvalu": "TV", "Uganda": "UG", "Ukraine": "UA", "United Arab Emirates": "AE", "United Kingdom": "GB", "United States": "US", "United States Outlying Islands": "UM", "Uruguay": "UY", "Uzbekistan": "UZ", "Vanuatu": "VU", "Venezuela": "VE", "Vietnam": "VN", "Virgin Islands, British": "VG", "Virgin Islands, U.S.": "VI", "Wallis And Futuna": "WF", "Western Sahara": "EH", "Yemen": "YE", "Zambia": "ZM", "Zimbabwe": "ZW"}

const alpha2Aliases = {
    'Russia': 'RU',
    'United States of America': 'US',
    'USA': 'US',
    'UK': 'GB',
    'Italy/Sardinia': 'IT',
    'Turkey/Ottoman Empire': 'TR',
    "Cote D\"Ivoire": 'CI',
    'Cote D’Ivoire': 'CI',
    'Democratic Republic of Congo (Zaire)': 'CD',
    'Zimbabwe (Rhodesia)': 'ZW',
    'Iran': 'IR',
    'Sri Lanka (Ceylon)': 'LK',
    'Laos': 'LA',
    'Syria': 'SY',
    'Bosnia and Herzegovina': 'BA',
    'Trinidad and Tobago': 'TT',
    'Libya': 'LY',
    'Surinam': 'SR',
    'Rumania': 'RO',
    'German Federal Republic': 'DE',
    'Republic of Korea': 'KR',
    'Republic of Armenia': 'AM',
    'UAE': 'AE',
    'Kyrgyz Republic': 'KG'
}

const extra = {
    'Soviet Union': 'soviet_union.svg',
    'Yugoslavia': 'yugoslavia.svg',
    'North Yemen': 'north_yemen.svg',
    'South Yemen': 'south_yemen.svg',
    'North Vietnam': 'north_vietnam.svg',
    'Democratic Republic of Vietnam': 'north_vietnam.svg',
    'South Vietnam': 'south_vietnam.svg',
    'Czechoslovakia': 'сzech.svg',

    'Republic of Abkhazia': 'abkhazia.svg',

    'FMLN': 'fmln.svg',
    'POLISARIO': 'polisario.svg',
    'UNITA': 'unita.svg',
    'OLF': 'olf.svg',
    'PKK': 'pkk.svg',
    'PLA': 'pla.png',
    'Renamo': 'renamo.png',
    'MTA': 'mta.svg',
    'Arakan Insurgents': 'arakan_insurgents.png',
    'MEK': 'mek.svg',
    'SWAPO': 'swapo.svg',
    "Jam'iyyat-i Islami-yi Afghanistan": 'jamiyyat.svg',
    'URNG': 'urng.svg',
    'LTTE': 'ltte.svg',
    'PIRA': 'pira.svg',
    'CPP': 'cpp.svg',
    'MNLF': 'mnlf.svg',
    'KIO': 'kio.svg',
    'SPLM/A': 'splma.svg',
    'SCIRI': 'sciri.svg',
    'WSLF': 'wslf.svg',
    'ANC': 'anc.svg',
    'KNU': 'knu.svg',
    'SNM': 'snm.svg',
    'Fretilin': 'fretilin.svg',
    'Contras/FDN': 'contras_fdn.png',
    'JSS/SB': 'jss_sb.png',
    'Popular Front': 'popular_front.svg',
    'MRTA': 'mrta.svg',
    'Sendero Luminoso': 'sendero_luminoso.svg',
    'CPB': 'cpb.svg',
    'Sikh insurgents': 'sikh_insurgents.svg',
    'ETA': 'eta.svg',
    'KDPI': 'kdpi.svg',
    'EPRP': 'eprp.svg',
    'KDP': 'kdp.svg',
    'EPLF': 'eplf.svg',
    'FSLN': 'fsln.png',
    'ELN': 'eln.svg',
    'TPLF': 'tplf.svg',
    'FUNCINPEC': 'funcinpec.png',
    'PFLP': 'pflp.svg',
    'EPRDF': 'eprdf.svg',
    'JVP': 'jvp.svg',
    'LRA': 'lra.svg',
    'ALF': 'alf.svg',
    'NMSP': 'nmsp.svg',
    'FPR': 'fpr.svg',
    'Fatah': 'fatah.svg',
    'RUF': 'ruf.png',
    'NDFB': 'ndfb.svg',
    'Republic of Nagorno-Karabakh': 'republic_of_nagorno_karabakh.svg',
    'MFDC': 'mfdc.svg',
    'Hezbollah': 'hezbollah.svg',
    'Hamas': 'hamas.svg',
    'NSCN – IM': 'nscn_im.svg',
    'RSO': 'rso.png',
    'Autonomous Province of Western Bosnia': 'autonomous_province_of_western_bosnia.svg',
    'Chechen Republic of Ichkeria': 'chechen_republic_of_ichkeria.svg',
    'KR': 'kr.svg',
    'AFDL': 'afdl.svg',
    'ULFA': 'ulfa.svg',
    'CNDD': 'cndd.svg',
    'UNLF': 'unlf.svg',
    'ONLF': 'onlf.svg',
    'FRUD': 'frud.svg',
    'PUK': 'puk.png',
    'ARDUF': 'arduf.png',
    'EZLN': 'ezln.svg',
    'GAM': 'gam.svg',
    'NLFT': 'nlft.svg',
    'FNL': 'fnl.svg',
    'MILF': 'milf.svg',
    'KPNLF': 'kpnlf.svg',
    'PLO groups': 'plo_groups.svg',
    'PLO  groups': 'plo_groups.svg',
    'UIFSA': 'uifsa.svg',
    'ATTF': 'attf.png'
}

export function flag(name) {
    name = name.trim()

    if (alpha2.hasOwnProperty(name)) {
        return flagForAlpha2(alpha2[name])
    }

    if (alpha2Aliases.hasOwnProperty(name)) {
        return flagForAlpha2(alpha2Aliases[name])
    }

    if (extra.hasOwnProperty(name)) {
        return flagForExtra(import.meta.env.BASE_URL + '/flags/' + extra[name])
    }

    return `<img src="${import.meta.env.BASE_URL}/flags/noflag.svg" width="20" />`
}

function flagForAlpha2(alpha2) {
    return `<span class="fi fi-${alpha2.toLowerCase()}"></span>`
}

function flagForExtra(svgPath) {
    return `<img src="${svgPath}" width="20" />`
}
