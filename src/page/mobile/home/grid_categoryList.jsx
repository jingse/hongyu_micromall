import React from 'react';
import {Flex} from 'antd-mobile';
import {Separator} from "./separator.jsx";
import homeApi from "../../../api/home.jsx";
import {ProductCard} from "../../../components/product_card/proCard.jsx";

export default class CategoryGrid extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        this.requestTopNOfCategory(this.props.categoryId);
    }

    requestTopNOfCategory(categoryId) {
        console.log("categoryId", categoryId);
        homeApi.getTopNOfCategory(categoryId, 6, (rs) => {
            console.log("llfrs", rs, categoryId);
            if (rs && rs.success) {
                const grid = rs.obj;
                this.setState({
                    data: grid
                });
            }
        });
    }


    render() {
        const {categoryPropData, categoryId, picUrl} = this.props;

        let categoryData = categoryPropData;
        if (!categoryData || JSON.stringify(categoryData) === "{}")
            return null;

        let topOfCategory = this.state.data;
        if (!topOfCategory || JSON.stringify(topOfCategory) === "{}")
            return null;


        const content = topOfCategory && topOfCategory.map((item, index) => {
            return <ProductCard key={index}
                                targetLink={`/product/${item.specialty.id}`}
                                cardProductImgUrl={item.iconURL.mediumPath}
                                cardProductName={item.specialty.name}
                                cardProductHasSold={item.hasSold}
                                cardProductPlatformPrice={item.pPrice}/>;
        });


        return <div>
            {content.length > 0 ? <Separator separatorData={categoryData} categoryData={categoryId} picUrl={picUrl}/> : <div/>}

            <Flex className="flex" style={{flexWrap: 'nowrap', overflow: 'scroll'}}>
                {content}
            </Flex>
        </div>
    }
}
