import React from 'react';

class PlayerName extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            guess: '',
            showAnswer: false,
    };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit  = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState ({
            [name]: value,   
        })
        console.log(value);
    }

    handleSubmit = (e) => {
        console.log('hello from handleSubmit')
        console.log('player name from parent', this.props.playerName)
        e.preventDefault();
        console.log(this.state)
        let playerGuess = this.state.guess;
        let answer = this.props.playerName;
        console.log(playerGuess);
        console.log(answer) ;
        if (playerGuess === answer) {
            console.log('correct answer');
            this.setState({
                guess: '',
                showAnswer: true,
            })
        }
        else {
            console.log('your answer is wrong');
            this.setState({
                guess: '',
            })
        }
    }

    // NEXT STEP

    /*****
     Once the player selects 'play again', how can the div below switch to the original display?
     
     ****/

    render () {
        let { showAnswer } = this.state;

        if (!showAnswer) {

            return( 
            <div>
                <form>
                    <input type="text" placeholder="Who is it?" name="guess" value={this.state.guess} onChange={this.handleChange} />
                    <button type="submit" onClick={this.handleSubmit}>Submit</button>
                </form>                 
            </div>
            )
        }
        else {
            return (
            <>
                <div>
                    <form>
                        <input type="text" placeholder="Who is it?" name="guess" value={this.state.guess} onChange={this.handleChange} />
                        <button type="submit" onClick={this.handleSubmit}>Submit</button>
                    </form>                 
                </div>
                <div className="contentContainer nameResults-container">
                    <h3>Answer</h3>
                    <p className="result">{this.props.playerName}</p>
                </div>
            </>
            )
        }
    }
}

export default PlayerName;