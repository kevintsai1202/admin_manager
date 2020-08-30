import React from 'react'
import 'animate.css'
import {BorderBox1, BorderBox8, DigitalFlop} from '@jiaminghi/data-view-react'
import {get} from "../../utils/ajax";

/**
 * DataV-React
 * 详细介绍官方文档 http://datav-react.jiaminghi.com/guide/
 * */
class Home extends React.Component {
    state={
        orderSale: 0,
        transferInfoCount: 0,
        usersCount: 0
    };
   componentDidMount() {
       this.getWelcome();
   }

   getWelcome = async () =>{
       const res = await get('/welcome');
       if (res.code === 0){
           this.setState({
               orderSale: res.data.orderSale,
               transferInfoCount: res.data.transferInfoCount,
               usersCount: res.data.usersCount
           })
       }
   };

    render() {
        const saleConfig = {
            number: [this.state.orderSale],
            content: '销售总额{nt}元',
            style: {
                fontSize: 20,
            }
        };
        const transferConfig = {
            number: [this.state.transferInfoCount],
            content: '发布总量{nt}个',
            style: {
                fontSize: 20,
            }
        };
        const userConfig = {
            number: [this.state.usersCount],
            content: '用户总数{nt}位',
            style: {
                fontSize: 20,
            }
        };
        return(
            <BorderBox1 style={styles.BorderBox1}>
                <BorderBox8 style={styles.BorderBox11}>
                    <DigitalFlop config={saleConfig} style={styles.DigitalFlop} />
                </BorderBox8>
                <BorderBox8 style={styles.BorderBox11}>
                    <DigitalFlop config={transferConfig} style={styles.DigitalFlop} />
                </BorderBox8>
                <BorderBox8 style={styles.BorderBox11}>
                    <DigitalFlop config={userConfig} style={styles.DigitalFlop} />
                </BorderBox8>
            </BorderBox1>
        )
    }
}

const styles = {
    BorderBox1:{
        textAlign:'center',
        padding:'15px',
        height:'80vh'
    },
    BorderBox11:{
        display:'inline-block',
        width: '22%',
        height:'150px',
        margin:'50px',
        padding:'5px'
    },
    DigitalFlop:{
      marginTop:'20px'
    }
};

export default Home

