import React, { Component, FormEvent } from 'react'
import { View, StyleSheet, ScrollView, Pressable, Text, Button } from 'react-native'
import { TextInput } from 'react-native-paper'

interface DynamicFormState {
    textValue: string; // this will be attached with each input onChangeText
    numInputs: number; // our number of inputs, we can add the length or decrease
    inputs: string[]
}

export default class DynamicForm extends Component<{}, DynamicFormState> {
    state: Readonly<DynamicFormState> = {
        textValue: '',
        numInputs: 1,
        inputs: []
    }

    setInputValue = (index: number, value: string) => {
        // first, we are storing input value to refInputs array to track them
        const inputs = this.state.inputs;
        inputs[index] = value;
        // we are also setting the text value to the input field onChangeText
        this.setState({ textValue: value })
    }

    addInput = () => {
        // add a new element in our refInputs array
        this.setState({ inputs: this.state.inputs.concat('') });
        // increase the number of inputs
        this.setState({ numInputs: this.state.numInputs + 1 });
    }

    removeInput = (i: number) => {
        // remove from the array by index value
        this.setState({ inputs: this.state.inputs.splice(i, 1) });
        // decrease the number of inputs
        this.setState({ numInputs: this.state.numInputs - 1 });
    }

    addFields = () => {
        const inputs: JSX.Element[] = [];
        for (let i = 0; i < this.state.numInputs; i++) {
            inputs.push(
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>{i + 1}.</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={value => this.setInputValue(i, value)}
                        value={this.state.inputs[i]}
                    />
                    {/* To remove the input */}
                    <Pressable onPress={() => this.removeInput(i)} style={{ marginLeft: 5 }}>
                        <Button title={''} color="red" />
                    </Pressable>
                </View>
            );
        }
       return inputs;
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                 <>{this.addFields()}</>
                <Pressable onPress={this.addInput} style={styles.addButton}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Add a new answer</Text>
                </Pressable>
                <View style={{ marginTop: 25 }}>
                    <Text>Answers:</Text>
                    {this.state.inputs.map((value, i) => {
                        return <Text key={i} style={styles.answer}>{`${i + 1} - ${value}`}</Text>
                    })}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgreen',
    },
    addButton: {

    },
    answer: {

    },
    input: {

    }
})
