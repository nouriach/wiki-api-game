import React from 'react';

// how can the Id be included in the className?
const PlayerGoals = props => {
    const listItems = props.goals.map((goals, id) =>
        <p key={id} className="goals">{goals}</p>
    )
    return (
        <>
        <div>
            <h3>Goals:</h3>
        </div>
        <div>
            {listItems}
        </div>
        </>
    )
}

export default PlayerGoals;