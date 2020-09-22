import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      requestId:"",
      requestedbookName:"",
      bookStatus:"",
      userdocId:"",
      docId:"",
      isBookrequestActive:""
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest =(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        book_status : 'requested',
        date : firebase.firestore.FieldValue.serverTimestamp()
    })
    await this.getBookrequest()
    db.collection('users').where('email_id','==',userId).get().then().then((snapshot)=>{
      snapshot.forEach((doc)=>{db.collection('users').doc(doc.id).update({isBookrequestActive:true})})
    })

    this.setState({
        bookName :'',
        reasonToRequest : ''
    })

    return Alert.alert("Book Requested Successfully")
  }

getBookrequest=()=>{
  var bookRequest=db.collection('requested_books').where('user_id','==',this.state.userId).get().then((snapshot)=>{
    snapshot.forEach((doc)=>{if(doc.data().book_status !== 'received'){this.setState({requestId:doc.data().request_id,
    requestedbookName:doc.data().requestedbookName, 
  bookStatus:doc.data().book_status,
docId:doc.id})}})
  })
}

isBookrequestActive(){
  db.collection('users').where("email_id",'==',this.state.userId).onSnapshot(snapshot=>{
    snapshot.forEach(doc=>{this.setState({isBookrequestActive:true})})
  })
}

receiverBooks=(bookName)=>{
  var userId = this.state.userId
  var requestId = this.state.requestId
  db.collection('received_books').add({
    user_id:userId, book_name:bookName, request_id:requestId, book_status:"received"
  })
}

sendNotification = ()=>{
  db.collection('users').where('email_id','==',this.state.userId).get().then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var firstname = doc.data().first_name;
      var lastname = doc.data().last_name
      db.collection('all_notifications').where('request_id','==',this.state.requestId).get().then((snapshot)=>{
        snapshot.forEach((doc)=>{
          var donorid=doc.data().donor_id,
          var bookname=doc.data().book_name
          db.collection('all_notifications').add({
            'targeted_userid':donorid, message:firstname+''+lastname+'received the book'+bookName,
            notification_status:'unread', book_name:bookname
          })
        })
      })
    })
  })
}

updaterequestStatus=()=>{
  db.collection('requested_books').doc(this.state.docId).update({book_status:'received'})
  db.collection('users').where('email_id','==',this.state.userId).get().them((snapshot)=>{
    snaopshot.forEach((doc)=>{db.collection('users').doc(doc.id).update({isBookrequestActive:false})})
  })
}

componentDidMount(){
  this.getBookrequest()
  this.isBookrequestActive()
}

  render(){
    if(this.state.isBookrequestActive == true){
      return(
      <View><Text>book name</Text><Text>{this.state.requestedbookName}</Text>
      <View><Text>book status</Text><Text>{this.state.book_status}</Text>
      <TouchableOpacity style={{backgroundColor='white',width=50,height=100}} onPress={()=>{
        this.sendNotification()
        this.updaterequestStatus()
        this.receiverBooks(this.state.requestedbookName)
      }}><Text>I received the book</Text></TouchableOpacity></View>
      </View>
      )
    }
    else{

    
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.setState({
                        bookName:text
                    })
                }}
                value={this.state.bookName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
