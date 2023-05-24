import React, { useState, useEffect } from "react";
import MapBoxMap from "./MapBoxMap";
// import csvFile from './../assets/municipiosGeoData.csv';
import simplifiedGeojson from './../assets/ddds/geojsonSimplificado.json';
import rgbJson from './../assets/rgb.json'
import HorizontalTimelinePicker from "./HorizontalTimelinePicker";

export default function IBGEStuff() {
    const [data, setData] = useState([]);
    const [polygons, setPolygons] = useState([]);
    const [year, setYear] = useState(2002);

    const drawPolygonsFromRGB = () => {
        const formattedPolygons = simplifiedGeojson.features.map((city, index) => {

            const parsedGeojson = city.geometry;

            const color = rgbJson[city.properties.codigo_ibge][year];

            const obj = {
                path: parsedGeojson?.coordinates ? parsedGeojson.coordinates[0] : [],
                codigo_ibge: city.properties.codigo_ibge,
                color: color ? `rgb(${color.r},${color.g},${color.b})` : 'rgb(0,0,0)',
                ...city.properties,
            };

            return obj;
        });


        setPolygons(formattedPolygons);
    }

    // const generateGeojsonForMapshaper = () => {
    //     fetch(csvFile)
    //         .then(response => response.text())
    //         .then(csvData => {
    //             // Process the CSV data
    //             const rows = csvData.split('\n'); // Split by new line
    //             const formattedRows = rows.map(row => row.split('$')); // Split each row by comma
            
    //             // Use the data as needed
    //             // console.log(formattedRows);
    //             const dados = formattedRows.splice(1);

    //             const ddds = dados.reduce((prev, curr) => {
    //                 const ddd = curr[8];
        
        
    //                 if (!prev[ddd]) {
    //                     prev[ddd] = [];
    //                 }
    //                 prev[ddd].push({
    //                     type: 'Feature',
    //                     properties: {
    //                         ddd,
    //                         codigo_ibge: curr[0],
    //                         nome: curr[1],
    //                         latitude: curr[2],
    //                         longitude: curr[3],
    //                         capital: curr[4],
    //                         codigo_uf: curr[5],
    //                         estado: curr[6],
    //                         siafi_id: curr[7],
    //                         fuso_horario: curr[9],
    //                     },
    //                     geometry: JSON.parse(curr[10]),
    //                 });
        
    //                 return prev;
    //             }, {});
        
        
    //             Object.entries(ddds).forEach(([key, value]) => {
    //                 const correctGeojson = {
    //                     type: 'FeatureCollection',
    //                     properties: {
    //                         ddd: key,
    //                     },
    //                     features: value,
    //                 };
        
    //                 var blob = new Blob([JSON.stringify(correctGeojson)], {type: "application/json"});
    //                 var url  = URL.createObjectURL(blob);
        
    //                 var a = document.createElement('a');
    //                 a.href        = url;
    //                 a.download    = "backup.json";
    //                 a.textContent = "Download backup.json";
        
    //                 a.setAttribute('download', `${key}.json`);
    //                 document.body.appendChild(a);
    //                 a.click();
    //             });
    //         })
    //         .catch(error => {
    //             // Handle any errors
    //             console.error('Error:', error);
    //         });
        
    // }
    
    useEffect(() => {
        // Rode para gerar o arquivo do MapShaper
        // generateGeojsonForMapshaper();
        
        drawPolygonsFromRGB();
    }, [year]);
    
    
    return (
        <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ width: '100%', margin: 'auto', display: 'block', height: 'calc(100vh - 80px)' }}>
                <MapBoxMap
                    height="100%"
                    zoom={3.5}
                    polygons={polygons}
                    polygonOnClick={console.log}
                >
                    <div style={{ position: 'absolute', bottom: 48, width: '100%', display: 'flex' }}>
                        <HorizontalTimelinePicker onClick={setYear}/>
                    </div>
                </MapBoxMap>
            </div>
        </div>
    );
}