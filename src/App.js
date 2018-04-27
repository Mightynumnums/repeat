import React, { Component } from 'react';
import './App.css';
import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';

class App extends Component {
  constructor() {
    super()
    this.state = {}
  }
  onListenClick() {
    //"https://stream.watsonplatform.net/speech-to-text/api/token"
    //'http://localhost:3002/api/speech-to-text/token'
    fetch('http://localhost:3002/api/speech-to-text/token')
      .then(function (response) {
        return response.text();
      }).then((token) => {
        var stream = recognizeMic({
          token: token,
          objectMode: true, // send objects instead of text
          extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
          format: true // optional - performs basic formatting on the results such as capitals an periods
        });
        stream.on('data', (data) => {
          this.setState({
            text: data.alternatives[0].transcript
          })
        });
        stream.on('error', function (err) {
          console.log(err);
        });
        document.querySelector('#stop').onclick = stream.stop.bind(stream);
      }).catch(function (error) {
        console.log(error);
      });
  }
  render() {
    return (
      <div className="App">
        <div className="navtext">
          <h3>A silly app that tells you what you said with text</h3>
          <h4>With zero accuracy..</h4>
        </div>
        <button onClick={this.onListenClick.bind(this)} id="stop">TALK TO ME</button>
        <div className="words">{this.state.text}</div>
      </div>
    );
  }
}

export default App;