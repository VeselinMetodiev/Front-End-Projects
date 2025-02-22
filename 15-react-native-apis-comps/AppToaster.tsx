import React, { Component } from 'react'
import { Pressable, View, Text } from 'react-native';
import Toaster from './Toaster'

interface AppState {
    visible: boolean;
}

export default class App extends Component {
    state: Readonly<AppState> = {
        visible: false,
    }

    messages = ['You got a message.', 'You are seeing a Toaster', 'It is great.']

    showToaster = () => {
        this.setState({visible: true})
    }

    hideToaster = () => {
        this.setState({visible: false})
    }
    
  render() {
    return (
        <View>
        <Pressable onPress={this.showToaster}>
            <Text>Click</Text>
        </Pressable>
        <Toaster delay={4000} messages={this.messages} duration={500} positionX={320} positionY={100} visible={this.state.visible}/>
        </View>
      
    )
  }
}
