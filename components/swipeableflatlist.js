import React,{Component} from 'react'
import {View,Text, Dimensions,StyleSheet} from 'react-native'
import { ListItem } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view'
import db from '../config'
export default class SwipableFlatlist extends Component{
    constructor(props){
        super(props);
        this.state={allnotifications:this.props.allnotifications}

    }
    updatemarkasread=(notification)=>{
        db.collection("all_notifications").doc(notification.doc_id).update({"notification_status":"read"})
    }
        onSwipevalueChanged=swipedata=>{
        var allnotifications=this.state.allnotifications
        const {key,value}=swipedata
        if(value< -Dimensions.get("window").width){
            const newdata=[...allnotifications]
            const previndex=allnotifications.findIndex(item=>item.key == key);
            this.updatemarkasread(allnotifications[previndex])
            newdata.splice(previndex,1 )
            this.setState({allnotifications:newdata})
        }
    }
    renderItem=data=>(
        <ListItem leftElement={<Icon name="book" type="font-awesome" color="black"/>}
        title={data.item.book_name}
        subtitle={data.item.message}
        bottomDivider/>

    )
    renderHiddenItems=()=>(
<View style={this.styles.rowBack}><View style={[this.styles.backRightBtn,this.styles.backRightBtnRight]}>
    <Text style={this.styles.backTextWhite}>
    </Text></View></View>
    );
    render(){
        return(
            <View style={this.styles.container}><SwipeListView disableRightSwipe 
            data={this.state.allnotifications}
            renderItem={this.renderItem}
            renderHiddenItem={this.renderHiddenItem}
            rightOpenValue={-Dimensions.get("window").width}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onSwipevalueChange={this.onSwipevalueChange}/></View>
        )
    }
}
const styles = StyleSheet.create({
     container: { backgroundColor: 'white', flex: 1, },
      backTextWhite: { color: '#FFF', fontWeight:'bold', fontSize:15 }, 
      rowBack: { alignItems: 'center', backgroundColor: '#29b6f6', flex: 1, 
      flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15, }, 
      backRightBtn: { alignItems: 'center', bottom: 0, justifyContent: 'center', 
      position: 'absolute', top: 0, width: 100, }, 
backRightBtnRight: { backgroundColor: '#29b6f6', right: 0, }, });