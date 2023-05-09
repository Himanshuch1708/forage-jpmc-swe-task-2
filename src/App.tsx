import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean, // A flag to toggle showing the Graph component
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
    };
  }

  /**
   * Toggle the showGraph flag when the button is clicked and
   * start fetching data from the server every 100ms
   */
  handleToggleButtonClick() {
    // Toggle the flag
    this.setState({
      showGraph: !this.state.showGraph,
    });

    // Start fetching data from the server every 100ms
    const intervalId = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Stop fetching data if the server does not return any data
        if (serverResponds.length === 0) {
          clearInterval(intervalId);
        }

        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server
        this.setState({ data: [...this.state.data, ...serverResponds] });
      });
    }, 100);
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
      return (<Graph data={this.state.data}/>);
    }
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => this.handleToggleButtonClick()}
          >
            {this.state.showGraph ? 'Stop Streaming Data' : 'Start Streaming Data'}
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
