import React from 'react';

const PlayerClubs = props => {
    // const listItems = props.clubs.map((teams, id) =>
    //     <p key={id} className="club">{teams}</p>
    // )
    return (
        <>
        <div>
            <p>Previous Teams:</p>
        </div>
        <div className="clubs-container">
            <h3>{props.clubs}</h3>
        </div>
        </>
    )
}

export default PlayerClubs;