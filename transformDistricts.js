var turf = require('turf')
var fs = require('fs')

//var mergeOut = turf.merge(fc.features);

function write(name, feature) {
    if(fs.existsSync(name))
        fs.unlinkSync(name);
    fs.writeFileSync(name, JSON.stringify(feature));
}

function union(feature, featureCollection) {
    for(var i=0; i<featureCollection.features.length; i++) {
        feature = turf.union(feature, featureCollection.features[i]);
    }
    return feature;
}

function erase(feature, featureCollection) {
    for(var i=0; i<featureCollection.features.length; i++) {
        feature = turf.erase(feature, featureCollection.features[i]);
    }
    return feature;
}

var senateDistricts = JSON.parse(fs.readFileSync('maps/va_senate_districts_19_38.geojson', 'utf8'));
var senate38to19 = JSON.parse(fs.readFileSync('maps/va_senate_38_to_19_hb1428.geojson', 'utf8'));

var houseDistricts = JSON.parse(fs.readFileSync('maps/va_house_districts_7_8_12.geojson', 'utf8'));
var house12to7 = JSON.parse(fs.readFileSync('maps/va_house_12_to_7_hb1417.geojson', 'utf8'));
var house12to8 = JSON.parse(fs.readFileSync('maps/va_house_12_to_8_hb1417.geojson', 'utf8'));
var house7to12 = JSON.parse(fs.readFileSync('maps/va_house_7_to_12_hb1417.geojson', 'utf8'));
var house8to12 = JSON.parse(fs.readFileSync('maps/va_house_8_to_12_hb1417.geojson', 'utf8'));

for(var i=0; i<senateDistricts.features.length; i++) {
    var feature = senateDistricts.features[i];
    var featureName = feature.properties.namelsad;
    
    if(featureName === 'State Senate District 19') {
        feature = union(feature, senate38to19);
    }
    if(featureName === 'State Senate District 38') {
        feature = erase(feature, senate38to19);
    }
    
    senateDistricts.features[i] = feature;
}
write('maps/va_senate_districts_19_38_new.geojson', senateDistricts);

for(var i=0; i<houseDistricts.features.length; i++) {
    var feature = houseDistricts.features[i];
    var featureName = feature.properties.namelsad;
    
    if(featureName === 'State House District 7') {
        feature = union(feature, house12to7);
        feature = erase(feature, house7to12);
    }
    if(featureName === 'State House District 8') {
        feature = union(feature, house12to8);
        feature = erase(feature, house8to12);
    }
    if(featureName === 'State House District 12') {
        feature = union(feature, house7to12);
        feature = union(feature, house8to12);
        feature = erase(feature, house12to7);
        feature = erase(feature, house12to8);
    }
    
    houseDistricts.features[i] = feature;
}
write('maps/va_house_districts_7_8_12_new.geojson', houseDistricts);
