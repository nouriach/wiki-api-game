import React from 'react';

// how can the Id be included in the className?
const PlayerGames = props => {
    const listItems = props.games.map((games, id) =>
        <p key={id} className="games">{games}</p>
    )
    return (
        <>
        <div>
            <h3>Appearances:</h3>
        </div>
        <div>
            {listItems}
        </div>
        </>
    )
}

export default PlayerGames;