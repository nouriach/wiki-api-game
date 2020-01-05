import React from 'react';

const PlayerGames = props => {
    // const listItems = props.games.map((games, id) =>
    //     <p key={id} className="games">{games}</p>
    // )
    return (
        <>
        <div>
            <p>Total Premier League Games:</p>
            <h2>{props.games}</h2>
        </div>
        </>
    )
}

export default PlayerGames;