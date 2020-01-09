import React from 'react';

const PlayerClubs = props => {
    // const listItems = props.clubs.map((teams, id) =>
    //     <p key={id} className="club">{teams}</p>
    // )
    return (
        <>
        <div className="contentContainer">
            <div>
                <h3>Previous Premier League Teams</h3>
            </div>
            <div className="clubs-container">
                <p className="result">{props.clubs}</p>
            </div>
        </div>
        </>
    )
}

export default PlayerClubs;