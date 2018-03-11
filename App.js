import React from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import { Body, Title, Right, Container, Header, Content, Button, Icon, List, ListItem, Text } from 'native-base';

export default class App extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      items: []
    }
  }

  // Retrieve the list of items from Airtable
  getItems() {
    // Airtable API endpoint, replace with your own
    let airtableUrl = "https://api.airtable.com/v0/appIJIcJ8emn8gPKx/items?&view=Grid%20view";

    // Needed for Airtable authorization, replace with your own API key
    let requestOptions = {
      headers: new Headers({
        'Authorization': 'Bearer keynL0orE7IDZRjfE'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.setState({
        items: json.records
      });
    });
  }

  // Runs when the application loads (i.e. the "App" component "mounts")
  componentDidMount() {
    this.getItems(); // refresh the list when we're done
  }

  // Complete an item
  completeItems(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appIJIcJ8emn8gPKx/items/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keynL0orE7IDZRjfE', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          name: data.fields.name + " *completed*"
        }
      })
    };

    // // Needed for Airtable authorization
    // let requestOptions = {
    //   method: 'PATCH',
    //   headers: new Headers({
    //     'Authorization': 'Bearer keynL0orE7IDZRjfE', // replace with your own API key
    //     'Content-type': 'application/json'
    //   }),
    //   body: JSON.stringify({
    //     fields: {
    //       status: "completed"
    //     }
    //   })
    // };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getItems(); // refresh the list when we're done
    });
  }

  // // Downvote an item
  // downvoteItems(data, secId, rowId, rowMap) {
  //   // Slide the row back into place
  //   rowMap[`${secId}${rowId}`].props.closeRow();
  //
  //   // Airtable API endpoint
  //   let airtableUrl = "https://api.airtable.com/v0/appIJIcJ8emn8gPKx/items/" + data.id;
  //
  //   // Needed for Airtable authorization
  //   let requestOptions = {
  //     method: 'PATCH',
  //     headers: new Headers({
  //       'Authorization': 'Bearer keynL0orE7IDZRjfE', // replace with your own API key
  //       'Content-type': 'application/json'
  //     }),
  //     body: JSON.stringify({
  //       fields: {
  //         quantity: data.fields.quantity - 1
  //       }
  //     })
  //   };
  //
  //   // Form the request
  //   let request = new Request(airtableUrl, requestOptions);
  //
  //   // Make the request
  //   fetch(request).then(response => response.json()).then(json => {
  //     this.getItems(); // refresh the list when we're done
  //   });
  // }

  // // Ignore an item
  // ignoreItems(data, secId, rowId, rowMap) {
  //   // Slide the row back into place
  //   rowMap[`${secId}${rowId}`].props.closeRow();
  //
  //   // Create a new array that has the item removed
  //   let newItemsData = this.state.items.slice();
  //   newItemsData.splice(rowId, 1);
  //
  //   // Set state
  //   this.setState({
  //     items: newItemsData
  //   });
  // }

  // Delete an item
  deleteItems(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Create a new array that has the item removed
    let newItemsData = this.state.items.slice();
    newItemsData.splice(rowId, 1);

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appIJIcJ8emn8gPKx/items/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': 'Bearer keynL0orE7IDZRjfE', // replace with your own API key
        'Content-type': 'application/json'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getItems(); // refresh the list when we're done
    });
  }

  // The UI for each row of data
  renderRow(data) {
    return (
      <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Body>
          <Text>{data.fields.name}</Text>
        </Body>
        <Right>
          <Text note>{data.fields.quantity} quantity</Text>
        </Right>
      </ListItem>
    )
  }

  // The UI for what appears when you swipe right
  renderSwipeRight(data, secId, rowId, rowMap) {
    return (
      <Button full success onPress={() => this.completeItems(data, secId, rowId, rowMap)}>
        <Icon active name="checkmark"/>
      </Button>
    )
  }

  // The UI for what appears when you swipe left
  renderSwipeLeft(data, secId, rowId, rowMap) {
    return (
      <Button full danger onPress={() => this.deleteItems(data, secId, rowId, rowMap)}>
        <Icon active name="trash"/>
      </Button>
    )
  }

  render() {
    let rows = this.ds.cloneWithRows(this.state.items);
    return (
      <Container>
        <Header>
          <Body>
            <Title>Shopping List</Title>
          </Body>
        </Header>
        <Content>
          <List
            dataSource={rows}
            renderRow={(data) => this.renderRow(data)}
            renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
            renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </Content>
      </Container>
    );
  }
}
