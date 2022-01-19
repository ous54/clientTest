import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  useMutation,
  gql,
  useQuery
} from "@apollo/client";
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
//import { WebSocketLink } from "@apollo/client/link/ws";

/*const link = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true,
  },
});
*/

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});
const MESSAGES_GET = gql`
query{
    messages {
      id
      message
    }
  }`;

  const POST_MESSAGE = gql`
  mutation($message: String!, $userId: ID!) {
    addMessage(userID: $userId, message: $message){
        id
        userId
        message
      }
  }
`;

const Messages = ({ user }) => {
    const { data } = useQuery(MESSAGES_GET);
    if(!data)
        return null;
    console.log(data.messages);

    return (
        <>
        dsd
        { data.messages && data.messages.map(({id, message}) => {
           <div id={id}>
               {message}
           </div>
        })}
       </>
    );
}

const Chat = () => {
    const [state, stateSet] = React.useState({
        userId: "Oussama",
        message: "",
      });
      const [postMessage] = useMutation(POST_MESSAGE);
      const onSend = () => {
          console.log("here");
        if (state.message.length > 0) {
          postMessage({
            variables: state,
          });
        }
        stateSet({
          ...state,
          message: "",
        });
      };
    return (
    <div>
        <Messages user ="oussama" />
        <Row>
        <Form xs={2} style={{ padding: 0 }}>
        <Form.Label>User</Form.Label>
        <Form.Control type="text" placeholder="Enter email"
           value={state.userId}
           onChange={(evt) =>
             stateSet({
               ...state,
               user: evt.target.value,
             })
           } />
                  <Form.Label>Message</Form.Label>
                  <Form.Control type="text" placeholder="Enter message"
           value={state.message}
           onChange={(evt) =>
             stateSet({
               ...state,
               message: evt.target.value,
             })
           }
           onKeyUp={(evt) => {
            if (evt.keyCode === 13) {
              onSend();
            }
          }} />
  
          <Button onClick={() => onSend()} style={{ width: "100%" }}>
            Send
          </Button>
        </Form>
      </Row>    
    </div>
    )
}

export default () => (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  );