import React from 'react';

class PlayAgain extends React.Component {
    render () {
        return (
            <>
                <button className="button" onClick={this.props.restartGame}>Restart Game</button>
            </>
        );
    }
}


export default PlayAgain;
