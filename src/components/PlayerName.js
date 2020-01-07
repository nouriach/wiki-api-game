import React from 'react';

class PlayerName extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            guess: '',
            playerName: props.name,
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
        e.preventDefault();
        console.log(this.state)
        let playerGuess = this.state.guess;
        let answer = this.state.playerName;
        console.log(playerGuess);
        console.log(answer) ;
        if (playerGuess === answer) {
            console.log('correct answer');
            this.setState({
                guess: '',
                showAnswer: true,
            })
            console.log('passed name', this.state)
        }
        else {
            console.log('your answer is wrong');
            this.setState({
                guess: '',
            })
        }

    }

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
                    <p className="result">{this.state.playerName}</p>
                </div>
            </>
            )
        }
    }
}

export default PlayerName;