import React from 'react';

class PlayAgain extends React.Component {
    render () {
        return (
            <>
                <button className="button" onClick={this.props.sendFunction}>Play Again</button>
            </>
        );
    }
}


export default PlayAgain;
