import React from 'react';

class Score extends React.Component {
    render () {
        return (
            <>
                <button className="button" onClick={this.props.sendFunction}>Skip Player</button>
            </>
        );
    }
}


export default Score;
