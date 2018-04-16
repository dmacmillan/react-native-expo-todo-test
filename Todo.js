import React, { Component } from 'react'
import fire from './fire'
import { Text, TextInput } from 'react-native';

class Todo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: props.name,
      itemKey: props.itemKey,
      isBeingEdited: false
    }

    // Bind to make 'this' work in the callback
    this.handleClick = this.handleClick.bind(this)
    this.updateName = this.updateName.bind(this)
  }

  componentWillMount(){
    const todoRef = fire.database().ref('todos').child(this.state.itemKey)
    todoRef.on('child_changed', snapshot => {
      let todo = { text: snapshot.val(), id: snapshot.key }
      let newTodos = this.state.todos
      const index = newTodos.map((e) => e.id).indexOf(todo.id)
      newTodos[index] = todo
      this.setState({ todos: newTodos });
    })
  }

  handleClick() {
    console.log('clicked')
    this.setState(prevState => ({
      isBeingEdited: !prevState.isBeingEdited
    }))
  }

  updateName() {
    console.log('updated')
    this.setState(prevState => ({
      isBeingEdited: !prevState.isBeingEdited,
      name: this.refs.newName.value
    }))
    fire.database().ref('todos').child(this.state.itemKey).set(this.refs.newName.value)
  }

  deleteName() {
    console.log('deleting')
  }

  renderInput() {
    return (
      <TextInput
        onBlur={this.updateName}
        defaultValue={this.state.name}
        ref='newName'
      />
    )
  }

  renderParagraph() {
    return (
      <Text onClick={this.handleClick}>
        {this.state.name}
      </Text>
    )
  }

  render() {
    if (this.state.isBeingEdited) {
      return this.renderInput()
    } else {
      return this.renderParagraph()
    }
  }
}

export default Todo
