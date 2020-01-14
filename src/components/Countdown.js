import React from 'react';

class Countdown extends React.Component {
    render () {
        return (
            <>
                <h3>Countdown: {this.props.minutes}:{this.props.seconds} </h3>
            </>
        );
    }
}


export default Countdown;
