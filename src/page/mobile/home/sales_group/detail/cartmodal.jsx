import React from 'react';
import {Modal, Toast} from 'antd-mobile';
import "./index.less";
import proApi from "../../../../../api/product.jsx";

export default class CartModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        const data = this.props.modalData;
        let active = {};

        console.log('this.props.modalData', data)
        console.log('this.props.productData', this.props.productData)
        console.log('isWebusiness', localStorage.getItem('isWebusiness'))


        for (let i in data) {
            Object.assign(active, data[0]);
        }
        return {
            active,
            val: 1,
            isWebusiness: localStorage.getItem('isWebusiness'),
            myoptions: "",
            ischange: -1
        };
    }

    componentWillMount() {
    }

    onChange = (val) => {
        this.setState({val});
    };


    clickSelector(option) {
        let tempID = option.id;

        console.log('option', option);
        console.log('tempID', tempID);

        proApi.getSpecialtySpecificationDetailBySpecificationID(tempID, (rs) => {
            console.log('llrs', rs);

            if (rs.obj.length === 0) {
                Toast.fail('暂无库存', 0.7);
                console.log('暂无库存');
                return
            }
            if (!rs.success) {
                console.log('error');
                return
            }
            if (rs && rs.success) {
                const salePrice = rs.obj[0].pPrice;
                const mPrice = rs.obj[0].mPrice;
                const inboud = rs.obj[0].inbound;
                this.setState({
                    active: Object.assign(this.state.active, option),
                    salePrice: salePrice,
                    mPrice: mPrice,
                    inbound: inboud,
                    specificationId: option.id,
                    divideMoney: rs.obj[0].divideMoney,
                    myoptions: option.specification
                });
            }

        });

    }


    render() {

        const footer = [{
            text: '确定',
            onPress: () => {
                console.log("asdasd", this.state.val, this.props.limit, this.state.myoptions, this.props.guige);

                if (this.state.val > this.props.limit) {
                    Toast.info("超出限购数量！");
                } else {
                    this.props.hideModal && this.props.hideModal('success');
                    this.props.selectorText && this.props.selectorText(this.state.active, this.state.val,
                        this.state.specificationId, this.state.mPrice, this.state.salePrice, 'success');
                }
            }
        }];


        return <Modal
            visible={this.props.modal}
            popup
            animationType="slide-up"
            closable
            onClose={() => {
                this.props.hideModal && this.props.hideModal('close');
            }}
            footer={footer}
            className="popup_modal"
        >
            <div className="popup_modal_content">
                <div style={{float: 'left', marginLeft: '1rem'}}>数量</div>
                <div className="step">
                    <div className="add_minus" onClick={() => {
                        this.setState({val: (this.state.val - 1) > 1 ? this.state.val - 1 : 1})
                    }}
                         style={{
                             backgroundImage: 'url(./images/icons/minus.png)', backgroundRepeat: 'no-repeat',
                             backgroundPosition: 'center'
                         }}>
                    </div>
                    <div className="value">
                        {this.state.val}
                    </div>
                    <div className="add_minus" onClick={() => {
                        this.setState({val: (this.state.val + 1 > this.state.inbound ? this.state.val : this.state.val + 1)})
                    }}
                         style={{
                             backgroundImage: 'url(./images/icons/add.png)', backgroundRepeat: 'no-repeat',
                             backgroundPosition: 'center'
                         }}>
                    </div>
                </div>
            </div>
        </Modal>
    }
}
