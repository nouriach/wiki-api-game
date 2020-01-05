import React from 'react';

const PlayerName = props => {

    return (
        <>
            <div>
                <h2>Answer:</h2>
                <p>{props.name}</p>
            </div>
        </>
    )
}

export default PlayerName;