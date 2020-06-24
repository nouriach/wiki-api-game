import React from 'react';

const PlayerGames = props => {
    return (
        <>
        <div className="contentContainer">
            <h3>Total Premier League Games</h3>
            <p className="result">{props.games}</p>
        </div>
        </>
    )
}

export default PlayerGames;
