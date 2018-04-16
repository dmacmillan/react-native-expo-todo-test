import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Button
} from 'react-native';
import fire from './fire'
import Todo from './Todo'


// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>Open up App.js to start working on your app!</Text>
//         <Text>Hello world!</Text>
//         <Text>Test</Text>
//       </View>
//     );
//   }
// }

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTodo: '',
      todos: []
    };
  }

  componentWillMount(){
    let todoRef = fire.database().ref('todos').orderByKey().limitToLast(100);
    todoRef.on('child_added', snapshot => {
      /* Update React state when todo is added at Firebase Database */
      let todo = { text: snapshot.val(), key: snapshot.key };
      // console.log(`todoRef::on::child_added: ${JSON.stringify(todo)}`)
      this.setState({ todos: [todo].concat(this.state.todos) });
    })
    todoRef.on('child_removed', snapshot => {
      /* Update React state when todo is added at Firebase Database */
      let todo = { text: snapshot.val(), key: snapshot.key }
      // console.log(`todo to remove: ${JSON.stringify(todo)}`)
      let newTodos = this.state.todos
      // console.log(`newTodos: ${JSON.stringify(newTodos)}`)
      const index = newTodos.map((e) => e.key).indexOf(todo.key)
      // console.log(`index to remove: ${index}`)
      newTodos.splice(index, 1)
      this.setState({ todos: newTodos });
    })
  }

  addTodo(e){
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the todo to Firebase */
    fire.database().ref('todos').push( this.state.currentTodo );
    this.setState({currentTodo: ''})
  }

  removeTodo = (itemKey, e) => {
    // e.preventDefault();
    // console.log(`itemKey: ${itemKey}`)
    fire.database().ref('todos').child(itemKey).remove();
  }

  render() {
    return (
      <View style={{'marginTop': 50}}>
        <TextInput
          onChangeText={(text) => {
            return this.setState({currentTodo: text})
          }}
          value={this.state.currentTodo}
        />
        <Button
          type="submit"
          title="Submit"
          onPress={this.addTodo.bind(this)}
        />
        <FlatList
          data={this.state.todos}
          renderItem={
            ({item}) => (
              <View
                style={styles.container}
              >
                <Text style={styles.todo}>{item.text}</Text>
                <View
                  style={styles.todo}
                >
                  <Button
                    title='Delete'
                    onPress={(e) => this.removeTodo(item.key, e)}
                  />
                </View>
              </View>
            )
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  todo: {
    width: 100
  }
});
