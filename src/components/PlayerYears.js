import React from 'react';

const PlayerYears = props => {
    return (
        <>
        <div className="contentContainer">
            <h3>He played between</h3>
            <p className="result">{props.years}</p>
        </div>
        </>
    )
}

export default PlayerYears;
