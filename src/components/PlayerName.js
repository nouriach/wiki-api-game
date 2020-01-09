import React from 'react';

class PlayerName extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            guess: '',
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
            })
            this.props.setGameState();
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
            return (
            <>
                <div>
                    <form>
                        <input type="text" placeholder="Who is it?" name="guess" value={this.state.guess} onChange={this.handleChange} />
                        <button type="submit" onClick={this.handleSubmit}>Submit</button>
                    </form>                 
                </div>
            </>
            )
        }
    }

export default PlayerName;