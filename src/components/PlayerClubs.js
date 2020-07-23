import React from 'react';

const PlayerClubs = props => {
  const rows = props.clubs.map((row, index) => {

    return (
        <p key={index}>{row}</p>
    )
  })
  return(
    <div className="contentContainer">
      <div>
        <h3>Previous Premier League Teams</h3>
      </div>
      <div className="clubs-container">
        <div className="result">{rows}</div>
      </div>
    </div>
  )
}
export default PlayerClubs;
