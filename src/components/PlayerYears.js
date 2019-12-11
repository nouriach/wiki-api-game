import React from 'react';

// how can the Id be included in the className?
const PlayerYears = props => {
    const listItems = props.years.map((years, id) =>
        <p key={id} className="years">{years}</p>
    )
    return (
        <>
        <div>
            <h3>Years:</h3>
        </div>
        <div>
            {listItems}
        </div>
        </>
    )
}

export default PlayerYears;