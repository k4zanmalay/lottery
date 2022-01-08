import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
/*  constructor(props) {    //You can change the constructor with ES6 version syntax below
    super(props);           // if you only need class for storing states
    this.state = {manager: 'Sneed'};
  }*/
  state = {
    manager: '',
    account: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
   // const address = await ethereum.request({method: 'eth_requestAccounts'});
    const account = await web3.eth.getAccounts();
    const manager = await lottery.methods.manager().call({from: account[0]});
    const players = await lottery.methods.getPlayers().call({from: account[0]});
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager, players, balance, account: account[0]});
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({message: 'Waiting on transaction success...'});
    await lottery.methods.enterLottery().send({from: this.state.account, value: web3.utils.toWei(this.state.value, 'ether')});
    this.setState({message: 'You have been entered!'});

  }
  onClick = async (event) => {
    event.preventDefault();
    this.setState({message: 'Waiting on transaction success...'});
    await lottery.methods.pickWinner().send({from: this.state.account});
    this.setState({message: 'A winner has been picked!'});

  }
  render() {
    return(
      <div>
        <h2>Lottery contract</h2>
        <p>
          This contract is managed by {this.state.manager}. 
          There are currently {this.state.players.length} people participating in lottery,
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input 
              value={this.state.value}
              onChange={event => this.setState({value: event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr/>
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
