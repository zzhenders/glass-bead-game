import React from 'react';
import logo from './logo.svg';
import './Api';
import './App.css';
import Navbar from './Navbar';
import Main from './Main';

class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        data: "/posts/search?terms=e",
        page: "aggregate",
        uid: 2,
      };
      this.setView = this.setView.bind(this);
    }

    setView(viewPage, viewData) {
      return () => {
        this.setState(state => ({
          page: viewPage,
          data: viewData,
        }));
      }
    } 

  render() {
    return (
      <div id="app">
        <Navbar setView={this.setView} uid={this.state.uid}/>
        <Main setView={this.setView} page={this.state.page} data={this.state.data} uid={this.state.uid}/>
      </div>
    );
  }
}

export default App;
