import React from 'react';

class PlayAgain extends React.Component {
    render () {
        let wording = (!this.props.wording) ? "Restart Game" : this.props.wording
        return (
            <>
                <button className="button" onClick={this.props.restartGame}>{wording}</button>
            </>
        );
    }
}


export default PlayAgain;
