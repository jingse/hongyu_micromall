import React from 'react';
import {Flex, WhiteSpace, WingBlank} from "antd-mobile";
import Card from "../../../components/card/index.jsx";
import SaleManager from "../../../manager/SaleManager.jsx";
import {ProductCard} from "../../../components/product_card/proCard.jsx";


export const Recommend = (props) => {
    if (!props.recommend || JSON.stringify(props.recommend) === "[]")
        return null;

    const content = props.recommend && props.recommend.map((item, index) => {

        return <ProductCard key={index}
                            targetLink={{pathname: '/redirect', state: item.id}}
                            cardProductImgUrl={SaleManager.getSalesDetailIcon(item.images)}
                            cardProductName={item.name}
                            cardProductHasSold=""
                            cardProductPlatformPrice=""/>;

    });

    return <Card className="general_container">
        <WingBlank>
            <WhiteSpace/>

            <div className="recommend">

                <div className="para_title">推荐产品</div>

                <WhiteSpace/>
                <Flex style={{flexWrap: 'wrap', backgroundColor: '#eee'}}>
                    {content}
                </Flex>
                <WhiteSpace/>

            </div>

        </WingBlank>
    </Card>
};
