import React, { useState } from 'react';
import { Tooltip } from 'antd';

export default function HorizontalTimelinePicker({
    onClick
}) {

    const [selected, setSelected] = useState(2002);

    const years = [...Array(19).keys()];

    const handleClick = value => {
        setSelected(value);
        onClick(value);
    }

    const renderOption = value => (
        <Tooltip title={value}>
            <div className="option-container" onClick={() => handleClick(value)}>
                <div className={`option ${value === selected ? 'selected' : ''}`} />
            </div>
        </Tooltip>
    );

    return (
        <div
            className="timeline-picker"
        >
            {
                years.map(value => renderOption(2002 + value))
            }
        </div>
    );
}
