import React from 'react';

const PlayerName = props => {

    return (
        <>
            <div className="contentContainer">
                <h3>Answer</h3>
                <p className="result">{props.name}</p>
            </div>
        </>
    )
}

export default PlayerName;