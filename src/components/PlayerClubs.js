import React from 'react';

// how can the Id be included in the className?
const PlayerClubs = props => {
    const listItems = props.clubs.map((teams, id) =>
        <p key={id} className="club">{teams}</p>
    )
    return (
        <>
        <div>
            <h3>Previous Teams:</h3>
        </div>
        <div>
            <p>{listItems}</p>
        </div>
        </>
    )
}

export default PlayerClubs;