import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

// Composes the sign in page, which will include the Sign in Form component and the Sign up link, for those who haven't signed up yet

const SignInPage = () => (
    <div>
        <h1>SignIn</h1>
        <SignInForm />
        <SignUpLink />
    </div>
);

// Initialize the state of our sign in variables

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

// Build standard react component, which we will later wrap with Firebase and React Router to add props

class SignInFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }

    onSubmit = event => {
        //Grab most recent state to populate email and password variables which will be submitted to Firebase
        const {email, password} = this.state;

        //Call firebase API for the async sign in function.
        //If it resolves, reset the component's state to initial and send the user to home page
        //If it fails, set the component state to the error
        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({...INITIAL_STATE});
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({error});
            })
        //Prevent the default behavior of the sign in async function, which reloads the page
        event.preventDefault();
    };

    //Basic onchange async function to update state for any input
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <form onSbumit={this.onSubmit}>
                <input
                    name="email"
                    value = {email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    name="password"
                    value = {password}
                    onChange = {this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <button disabled = {isInvalid} type = "submit">
                    Sign In
                </button>

                {error && <p>{error.message} </p>}
            </form>
        );
    }
}
//Wrap the base sign in component with Router and Firebase to allow additional props to be used
const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };