import React from 'react';

class PlayerAnswer extends React.Component {
    render () {
        return (
        <>
            <h3>Answer</h3>
            <p className="result">{this.props.playerName}</p>
        </>
        );
    }
}


export default PlayerAnswer;
