import React from 'react';

const PlayerGoals = props => {
    // const listItems = props.goals.map((goals, id) =>
    //     <p key={id} className="goals">{goals}</p>
    // )
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