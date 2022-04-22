import logo from "./logo.svg";
import "./App.css";
import React from "react";
import lottery from "./lottery";
import web3 from "./web3";
class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    console.log("mn", manager);
    const players = await lottery.methods.getPlayers().call();
    // const balance = await lottery.methods.getBalance(lottery.options.address);
    this.setState({ manager, players });
  }
  onSubmit = async (event) => {
    event.preventDefault();
    //for sending transactions we necesarily need the accounts unlike during calls which automaically has a default
    const accounts = await web3.eth.requestAccounts();

    this.setState({ message: "waiting on transaction success...." });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });
    this.setState({ message: "You have been entered!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.requestAccounts();

    this.setState({ message: "waiting on transaction success...." });
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    this.setState({ message: "a winner has been picked!" });
  };
  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>this contract is managed by {this.state.manager}</p>
        <p>
          there are currently {this.state.players.length} people competing to
          win {web3.utils.fromWei(this.state.balance, "ether")} ether
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>want to try your luck?</h4>
          <div>
            <label>amount to enter race</label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>ready to pick a winner?</h4>
        <button onClick={this.onClick}>pick winner</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
