import React from 'react';

const PlayerYears = props => {
    // const listItems = props.years.map((years, id) =>
    //     <p key={id} className="years">{years}</p>
    // )
    return (
        <>
        <div>
            <p>He played between:</p>
            <h2>{props.years}</h2>
        </div>
        </>
    )
}

export default PlayerYears;