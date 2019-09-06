import React from 'react';
import logo from './logo.svg';
import { checkAuthentication } from './Api';
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
        checkedSession: false
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

    loadSession() {
      return checkAuthentication().then((data) => {
        if (data.uid === null) {
          this.setView(
            '',
            '');
          this.setUid(undefined);
        } else {
          this.setView(
            'aggregate',
            `/users/${data.uid}/following/recent-posts`
            )
          this.setUid(data.uid);
        }
      })
    }

    componentDidMount() {
      this.loadSession()
      .then(() => this.setState({checkedSession: true}));
    }

  render() {
    return (
      <div id="app">
        { this.state.checkedSession
          ?
          <>
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
          </>
          :
          <>
            <nav></nav>
            <div id="main"></div>
          </>
        }
      </div>
    );
  }
}

export default App;
