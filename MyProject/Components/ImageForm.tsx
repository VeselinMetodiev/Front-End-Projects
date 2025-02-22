import React, { Component } from 'react'
import { Button, TextInput, View, Text, StyleSheet } from 'react-native';
import { ImageModel } from '../model/Image';
import { IdType, ImageListener, Optional } from '../model/shared-types'
import ImagePickerExample from './ImagePicker';
import * as yup from "yup";
import { Formik } from 'formik';
import ImageDatePicker from './ImageDatePicker';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ImageFormProps {
  image: Optional<ImageModel>;
  onCreateImage: ImageListener
}

interface ImageFormState {
  title: string,
  description: string,
  tags: string[],
  imageURI: string,
  authorName: string,
  dateOfPicture: string,
  id: string,
}

export default class ImageForm extends Component<ImageFormProps, ImageFormState> {
  state: Readonly<ImageFormState> = {
  title: this.props.image?.title || '',
  description: this.props.image?.description || '',
  tags: this.props.image?.tags || [],
  imageURI: this.props.image?.imageURI || '',
  authorName: this.props.image?.authorName || '',
  dateOfPicture: this.props.image?.dateOfPicture || '',
  id: this.props.image?.id?.toString() || '',
  }

  renderError = (message: string) => {
  return <Text>{message}</Text>;
  }
  setDate: any;

  handleFieldChanged(field: string, text: string) {
    const stateUpdate = { [field]: text } as unknown as ImageFormState;
    this.setState(stateUpdate);
  }

  handleImageReset = () => {
    this.setState({title: '', description: '', tags: [], imageURI: '', authorName: '', dateOfPicture: ''})
}

handleImageSubmit = (values : Partial<ImageModel>) => {
  this.props.onCreateImage(new ImageModel(
      values.title!,
      values.description!,
      this.state.tags,
      this.state.imageURI ? this.state.imageURI : values.imageURI!,
      values.authorName!,
      this.state.dateOfPicture,
      this.state.id ? parseInt(this.state.id) : undefined));
      this.setState({title: '', description: '', tags: [], imageURI: '', authorName: '', dateOfPicture: ''})
}

handleSetImage = (imageURL: string) => {
  this.setState({imageURI: imageURL})
}

handleDate = (date: string) => {
  console.log('setting state for date:' + date)
this.setState({dateOfPicture: date})
}

  render() {
    return (
         <View style={styles.container}>
      <View style={styles.registrationForm}>
      <Text style={styles.titleText}> Image Form </Text>
      <Formik
        initialValues={{ 
          title: this.state.title,
          description: this.state.description, 
          authorName: this.state.authorName,
          imageURI: this.state.imageURI, 
          tags: [],
        }}
        onSubmit={values => console.log(JSON.stringify(values))}
        validationSchema={yup.object().shape({
          title: yup
            .string()
            .required()
            .min(2)
            .max(40),
          description: yup
            .string()
            .max(256),
          authorName: yup
            .string()
            .min(3)
            .max(40),
        })}
       >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, resetForm }) => (
          <View style={styles.registrationForm}>
            <TextInput
              value={values.title}
              style={styles.input}
              onChangeText={handleChange('title')}
              onBlur={() => setFieldTouched('title')}
              placeholder="Title"
            />
            {touched.title && errors.title &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.title}</Text>
            }            
            <TextInput
              value={values.description}
              style={styles.input}
              onChangeText={handleChange('description')}
              onBlur={() => setFieldTouched('description')}
              placeholder="Description"
            />
            {touched.description && errors.description &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.description}</Text>
            }
            <TextInput
              value={values.authorName}
              style={styles.input}
              onChangeText={handleChange('authorName')}
              placeholder="Author"
              onBlur={() => setFieldTouched('authorName')}
            />
            {touched.authorName && errors.authorName &&
              <Text style={{ fontSize: 14, color: '#FF0D10' }}>{errors.authorName.toUpperCase()}</Text>
            }
             <TextInput
              value={values.imageURI}
              style={styles.input}
              onChangeText={handleChange('imageURI')}
              placeholder="Image URL"
              onBlur={() => setFieldTouched('imageURI')}
            />
            {touched.imageURI && errors.imageURI &&
              <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.imageURI}</Text>
            }
            <ImagePickerExample onSubmit={this.handleSetImage}/>
            <ImageDatePicker onSetDate={this.handleDate}/>
            <View style={styles.buttons}>
            <FontAwesome.Button
              color="#841584"
              disabled={!isValid}
              onPress={() => {this.handleImageSubmit(values); resetForm()}}
              accessibilityLabel="Submit Image"
              name={'envelope'}
              size={40}
            >
            Submit
            </FontAwesome.Button>
              <FontAwesome.Button
          onPress={() => {this.handleImageReset; resetForm()}}
          color="#842317"
          accessibilityLabel="Reset Form"
          name='resistance'
          size={40}
        >
Reset
</FontAwesome.Button>
        </View>
          </View>
        )}
      </Formik>
      </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: '100%',
    backgroundColor: "#B2C8DF",
    borderRadius: 10,
    paddingTop: 70,
    //padding: 140,
  },
  registrationForm: {
    alignItems: "center",
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    borderColor: "#6E85B7",
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 10,
    padding: 12,
    width: 300,
  },
  buttons: {
    fontSize: 45,
    marginTop: 20,
    marginBottom: 30,
    flexDirection: 'row',
    gap: 10,
},
});
