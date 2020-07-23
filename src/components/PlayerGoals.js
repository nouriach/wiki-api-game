import React from 'react';

const PlayerGoals = props => {
    return (
        <>
        <div className="contentContainer">
            <h3>Goals</h3>
            <p className="result">{props.goals}</p>
        </div>
        </>
    )
}

export default PlayerGoals;
