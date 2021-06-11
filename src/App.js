import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import Header from './components/header/header.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.actions';

//const HatsPage = () => (
//  <div>
//   <h1>HATS PAGE</h1> 
//  </div>
//  );

class App extends React.Component {
  // constructor() {
  //   super();

  //   this.state = {
  //     currentUser: null
  //   };
  // }

  unsubscribeFromAuth = null;

  //se l'utente si è loggato mostralo

  componentDidMount() {
    const {setCurrentUser} = this.props;

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      // this.setState({ currentUser: user });

      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot => {
          // this.setState({
          //   currentUser: 
            setCurrentUser ({
              id: snapShot.id,
              ...snapShot.data()
            });
          });
      }
      setCurrentUser(userAuth); //se l'utente si disconnette lo saprà
    });
  }

  //chiudi la sottoscrizione dello script

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
  return (
    <div>
      <Header />
      <Switch>
       <Route exact path='/' component={HomePage} />   
       <Route path='/shop' component={ShopPage} />
       <Route exact path='/signin' 
         render= {() => this.props.currentUser ? 
          (<Redirect to='/' />) : 
          (<SignInAndSignUpPage />)
          } />    
      </Switch>
    </div>
  );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
