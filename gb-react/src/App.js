import React from 'react';
import logo from './logo.svg';
import './Api';
import './glassbeads.css';
import Navbar from './Navbar';
import Main from './Main';

class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        data: "",
        page: "",
        uid: undefined,
      };
      this.setView = this.setView.bind(this);
      this.setUid = this.setUid.bind(this);
    }

    setView(viewPage, viewData) {
      this.setState(state => ({
        page: viewPage,
        data: viewData,
      }));
    }

    setUid(newUid) {
      this.setState({uid: newUid});
    }

  render() {
    return (
      <div id="app">
        <Navbar
          setView={this.setView}
          setUid={this.setUid}
          uid={this.state.uid}
        />
        <Main
          setView={this.setView}
          setUid={this.setUid}
          page={this.state.page}
          data={this.state.data}
          uid={this.state.uid}
        />
      </div>
    );
  }
}

export default App;
