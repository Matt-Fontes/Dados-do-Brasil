import React, { useEffect, useState } from "react";
import MapBoxMap from "./MapBoxMap";
import simplifiedGeojson from './../assets/ddds/geojsonSimplificado.json';
import HorizontalTimelinePicker from "./HorizontalTimelinePicker";
import rgbJson from './../assets/rgb.json'
import { Badge, Checkbox } from "antd";

export default function MapaDeCalorSetores() {

    const color = {
        agro: '#0a0',
        industria: '#a00',
        servicos: '#00a',
    }

    const [polygons, setPolygons] = useState([]);
    const [year, setYear] = useState('2002');
    const [selectedType, setSelectedType] = useState('agro');
    const [colored, setColored] = useState(false);

    const getSquare = (lng, lat) => {
        const offsetAmount = 0.1;
        return [
            [lng - offsetAmount, lat - offsetAmount],
            [lng - offsetAmount, lat + offsetAmount],
            [lng + offsetAmount, lat + offsetAmount],
            [lng + offsetAmount, lat - offsetAmount],
            [lng - offsetAmount, lat - offsetAmount],
        ];
    }

    
    const  normalize = (min, max, value) => {
        return (value - min) / (max - min);
    }

    const create3DPolygons = () => {
        let max = 0;
        const formattedPolygons = simplifiedGeojson.features.map((city, index) => {
            const parsedGeojson = city.geometry;
            
            
            const pibData = rgbJson[city.properties.codigo_ibge][year];
            const { va_industria: industria, va_agropecuaria: agro, va_servicos: servicos } = (pibData || {});
            if (servicos > max) max= servicos;

            const types = {
                agro,
                industria,
                servicos,
            };

            const sectorMax = {
                agro: 3533041014,
                industria: 66082751683,
                servicos: 528404000000,
            }

            const colorful = pibData ? `rgb(${pibData.r},${pibData.g},${pibData.b})` : 'rgb(0,0,0)';
            const definedColor = colored ? colorful : color[selectedType];

            const obj = {
                path: parsedGeojson?.coordinates ? getSquare(parseFloat(city.properties.longitude), parseFloat(city.properties.latitude)) : [],
                codigo_ibge: city.properties.codigo_ibge,
                color: definedColor,
                industria,
                agro,
                servicos,
                base_height: 0,
                height: normalize(0 , sectorMax[selectedType], types[selectedType]) * 4000000,
                level: 1,
                name: city.properties.codigo_ibge,
                ...city.properties,
            };

            return obj;
        });

        console.log(max);

        console.log(formattedPolygons);
        setPolygons(formattedPolygons);
    }

    const renderOption = (label, value) => {

        const definedColor = value === selectedType ? color[value] : '#666';
        return (
            <div
                className={`type-picker ${value === selectedType ? 'type-picker-selected' : ''}`}
                onClick={() => setSelectedType(value)}
                style={{
                    padding: '10px 18px',
                    border: 'solid 1px',
                    borderRadius: 8,
                    borderColor: value === selectedType ? definedColor : '#fff4',
                }}
            >
                <Badge color={definedColor} text={label} className="type-picker-badge" />
            </div>
        );
    };

    useEffect(() => {
        create3DPolygons();
    }, [year, selectedType, colored]);

    return (
        <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ width: '100%', margin: 'auto', display: 'block', height: 'calc(100vh - 80px)' }}>
                <MapBoxMap
                    height="100%"
                    zoom={3.5}
                    onClick={({ lngLat }) => console.log(lngLat)}
                    polygons3d={polygons}
                    minZoom={1}
                >
                    <div style={{ position: 'absolute', bottom: 48, width: '100%', display: 'flex' }}>
                        <HorizontalTimelinePicker onClick={setYear}/>
                    </div>
                    <div
                        className="type-picker-container"
                        style={{
                            position: 'absolute',
                            right: 24,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            textAlign: 'left',
                            height: 240,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            backgroundColor: '#fff1',
                            transition: 'background-color .3s ease',
                            padding: 24,
                            borderRadius: 10,
                            color: '#eee',
                        }}
                    >
                        {renderOption('Indústria', 'industria')}
                        {renderOption('Agropecurária', 'agro')}
                        {renderOption('Serviços', 'servicos')}
                        <Checkbox defaultChecked={false} style={{ color: '#ddd' }} onChange={({target}) => setColored(target.checked)}>Colorido</Checkbox>
                    </div>
                </MapBoxMap>
            </div>
        </div>
    );
}