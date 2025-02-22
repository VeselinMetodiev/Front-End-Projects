import React, { Component, Dispatch } from 'react';
import { View, TextInput, StyleSheet, Button } from 'react-native';
import { connect } from 'react-redux';
import { loginStart, signUpStart, UserAction } from '../redux/actions/actions';
import { StoreState } from '../redux/reducers';

export interface Credentials {
    username: string;
    password: string;
}

interface LoginFormProps {
    onSignInSubmit: (credentials: Credentials) => void;
    onSignUp():void;
}

type LoginFormState = Credentials;

  
  

export default class LoginForm extends Component<LoginFormProps, LoginFormState> {
    state: Readonly<LoginFormState> = {
        username: '',
        password: '',
    }

    handleFieldChanged = (field: keyof Credentials & string, value: string) => {
        this.setState({ [field]: value } as Pick<Credentials, keyof Credentials>);
    }

    handleSignIn = () => {
        console.log(this.props.onSignInSubmit)
        this.props.onSignInSubmit({username: this.state.username, password: this.state.password});
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput onChangeText={this.handleFieldChanged.bind(this, 'username')} placeholder="Username" style={styles.input} />
                <TextInput onChangeText={this.handleFieldChanged.bind(this, 'password')} secureTextEntry={true} placeholder="Password" style={styles.input} />
                <View style={styles.buttons}>
                    <Button
                        onPress={this.handleSignIn}
                        title="SignIn"
                        color="#542867"
                        accessibilityLabel="SignIn"
                    />
                    <View style={{width: 10}} />
                    <Button
                        onPress={this.props.onSignUp}
                        title="SignUp"
                        color="#841584"
                        accessibilityLabel="SignUp"
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 30,
        borderRadius: 10,
        width: '80%',
        backgroundColor: "#B2C8DF",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        height: 40,
        margin: 5,
        width: '90%',
        borderWidth: 1,
        padding: 10,
    },
    buttons: {
        fontSize: 45,
        marginTop: 20,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});