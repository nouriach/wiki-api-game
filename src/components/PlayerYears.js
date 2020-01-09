import React from 'react';

const PlayerYears = props => {
    // const listItems = props.years.map((years, id) =>
    //     <p key={id} className="years">{years}</p>
    // )
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