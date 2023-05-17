import React, { useState, useEffect } from "react";
import MapBoxMap from "./MapBoxMap";
import csvFile from './../assets/municipiosGeoData.csv';
import rgbJson from './../assets/rgb.json'

export default function IBGEStuff() {
    const [data, setData] = useState([]);
    const [polygons, setPolygons] = useState([]);

    // useEffect(() => {
    //     axios.get('https://servicodados.ibge.gov.br/api/v3/malhas/municipios/4104303?formato=application/vnd.geo+json')
    //         .then(({ data }) => {
    //             console.log(data);
    //             setCoords([{
    //                 path: data.features[0].geometry.coordinates[0],
    //                 base_height: 0,
    //                 height: 3000000,
    //                 level: 1,
    //                 color: 'red',
    //                 name: 'test',
    //             }]);
    //         })
    //         .catch(console.log)
    // }, []);

    useEffect(() => {
        if(data.length) {
            // console.log(data);
            const formattedPolygons = data.map((city, index) => {

                const parsedGeojson = JSON.parse(city[10] || '{}');

                const color = rgbJson[city[0]]['2020'];

                const obj = {
                    path: parsedGeojson.coordinates ? parsedGeojson.coordinates[0] : null,
                    codigo_ibge: city[0],
                    color: `rgb(${color.r},${color.g},${color.b})`,
                };
                return obj;
            });
            setPolygons(formattedPolygons);
        }
    }, [data]);

    useEffect(() => {
        fetch(csvFile)
            .then(response => response.text())
            .then(csvData => {
                // Process the CSV data
                const rows = csvData.split('\n'); // Split by new line
                const formattedRows = rows.map(row => row.split('$')); // Split each row by comma
            
                // Use the data as needed
                // console.log(formattedRows);
                setData(formattedRows.splice(1));
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });
    }, []);

    // useEffect(() => {
        // fetch(rgbFile)
        //     .then(response => response.text())
        //     .then(csvData => {
        //         // Process the CSV data
        //         const rows = csvData.split('\n'); // Split by new line
        //         const formattedRows = rows.map(row => row.split(',')); // Split each row by comma
            
        //         // Use the data as needed
        //         console.log(formattedRows);
        //         const only2002 = formattedRows.splice(1).reduce((prev, curr) => {
        //             if (curr[1] == 2002) {
        //                 return ({
        //                     ...prev,
        //                     [curr[0]]: `rgb(${curr[2]},${curr[3]},${curr[4]})`,
        //                 });
        //             }
        //             return prev;
        //         }, {});
        //         console.log(only2002);
        //         setColors(only2002);
                // setColors(formattedRows.splice(1).reduce((prev, curr) => {
                //     return ({
                //         ...prev,
                //         [curr[1]]: {
                //             ...prev[curr[1]],
                //             [curr[0]]: `rgb(${curr[2]},${curr[3]},${curr[4]})`,
                //         },
                //     });
                // }, {}));
            // })
            // .catch(error => {
            //     // Handle any errors
            //     console.error('Error: ', error);
            // });
    // }, []);
    
    
    return (
        <div style={{ width: '100%', height: '100svh', display: 'flex', background: '#131313' }}>
            <div style={{ width: '60%', margin: 'auto', display: 'block' }}>
                <MapBoxMap zoom={3} polygons={polygons} polygonOnClick={console.log} />
            </div>
        </div>
    );
}