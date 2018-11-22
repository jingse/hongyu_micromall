import React from 'react';
import {Link} from 'react-router-dom';
import { WhiteSpace,ActivityIndicator} from "antd-mobile";
import Layout from "../../../common/layout/layout.jsx";
import Navigation from "../../../components/navigation/index.jsx";


export default class redirect extends React.Component{

    constructor(props,context) {
        super(props,context);
        this.state = {
            animating: false
        };
    }

    showToast(id){
        this.setState({ animating: !this.state.animating });
        this.closeTimer = setTimeout(() => {
          this.setState({ animating: !this.state.animating });
          this.linkto(id)
          
        }, 1000);
    }
    linkto(id){
        history.replaceState(null,null,'/#/home')
        this.context.router.history.push({pathname:`/product/${id}`});
    }
    componentWillMount(){
        console.log("this.props555",this.props.location.state)
        this.showToast(this.props.location.state)
    }
    componentWillUnmount() {
        clearTimeout(this.closeTimer);
    }


    render() {

        return <Layout>

        <Navigation title="跳转中..." left={true}/>

            <ActivityIndicator 
                toast
                text="跳转中..."
                animating={this.state.animating}
              />

    </Layout>
        
    }
}


redirect.contextTypes = {
    router:React.PropTypes.object
};