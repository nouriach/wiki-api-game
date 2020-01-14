import React from 'react';

class Countdown extends React.Component {
    render () {
        return (
            <>
                <h3 id="countdown-result">Countdown: {this.props.minutes}:{this.props.seconds} </h3>
            </>
        );
    }
}


export default Countdown;
