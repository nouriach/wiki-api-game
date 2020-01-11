import React from 'react';

class PlayAgain extends React.Component {
    render () {
        return (
            <>
                <h3>Score: {this.props.score} / 5 </h3>
            </>
        );
    }
}


export default PlayAgain;
