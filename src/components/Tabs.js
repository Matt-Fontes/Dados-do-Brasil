import React from 'react';

export default function Tabs({
    onClick,
}) {

    const renderOption = (title, key) => (
        <div
            className="tab-option"
            onClick={() => onClick(key)}
        >
            {title}
        </div>
    );

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: 80,
                borderBottom: 'solid 1px #fff9'
            }}
        >
            {renderOption('Setores da Economia', 'pib')}
            {renderOption('TBA', 'tba')}
        </div>
    );
}
