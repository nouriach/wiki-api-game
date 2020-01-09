import React from 'react';

class PlayAgain extends React.Component {
    render () {
        return (
            <>
                <button className="button" onClick={this.props.sendFunction}>Give Up?</button>
            </>
        );
    }
}


export default PlayAgain;
