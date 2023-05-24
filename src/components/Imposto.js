import React, { useEffect, useState } from "react";
import MapBoxMap from "./MapBoxMap";
import simplifiedGeojson from './../assets/ddds/geojsonSimplificado.json';
import heatmapData from './../assets/heatmap.json';
import HorizontalTimelinePicker from "./HorizontalTimelinePicker";

export default function Imposto() {

    const [polygons, setPolygons] = useState([]);
    const [year, setYear] = useState('2002');
    const [opacity, setOpacity] = useState(0.7);

    const heatmapAttributes = {
        'heatmap-weight': [
            'interpolate',
            ['exponential', 1/2],
            ['get', 'ratio'],
            0,
            0,
            186,
            1
        ],
        'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172, 0)',
            0.1,
            'rgb(33,102,172)',
            0.2,
            'rgb(33,102,172)',
            0.5,
            'rgb(127,255,0)',
            0.7,
            'rgb(255,255,90)',
            0.8,
            'rgb(239,155,101)',
            0.85,
            'rgb(250,180,98)',
            1,
            'rgb(250,90,90)',
        ],
        'heatmap-radius': ['interpolate', ['exponential', 1.25], ['zoom'], 3, 3, 11, 100],
        'heatmap-opacity': opacity,
    }

    const createHeatMap = () => {
        console.log(simplifiedGeojson);
        let max = 0;
        const formattedPolygons = simplifiedGeojson.features.map((city, index) => {
        
            const codIBGE = city.properties.codigo_ibge;
            const cityData = heatmapData[codIBGE][year];

            if (Math.sqrt(cityData?.ratio) > max) {
                max = Math.sqrt(cityData.ratio);
            }

            return ({
                longitude: city.properties.longitude,
                latitude: city.properties.latitude,
                ratio: cityData?.ratio ? Math.sqrt(cityData.ratio) : 0,
            });
        });

        setPolygons(formattedPolygons);
    }

    useEffect(() => {
        createHeatMap();
    }, [year]);

    return (
        <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ width: '100%', margin: 'auto', display: 'block', height: 'calc(100vh - 80px)' }}>
                <MapBoxMap
                    height="100%"
                    zoom={3.5}
                    heatMapMarkers={polygons}
                    polygonOnClick={console.log}
                    heatmapAttributes={heatmapAttributes}
                >
                    <div style={{ position: 'absolute', bottom: 48, width: '100%', display: 'flex' }}>
                        <HorizontalTimelinePicker onClick={setYear}/>
                    </div>
                </MapBoxMap>
            </div>
        </div>
    );
}