import React from 'react';

const PlayerGames = props => {
    // const listItems = props.games.map((games, id) =>
    //     <p key={id} className="games">{games}</p>
    // )
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