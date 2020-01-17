import React from 'react';

class PlayAgain extends React.Component {
    render () {
        return (
            <>
                <button className="button" onClick={this.props.sendFunction}>Next Player</button>
                <p>test: {this.props.gameState}</p>
            </>
        );
    }
}


export default PlayAgain;
