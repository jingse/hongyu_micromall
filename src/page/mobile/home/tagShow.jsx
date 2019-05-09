import React from 'react';
import {Link} from 'react-router-dom';
import {Flex} from 'antd-mobile';
import {getServerIp} from "../../../config.jsx";
import homeApi from "../../../api/home.jsx";
import {ProductCard} from "../../../components/product_card/proCard.jsx";

export default class TagShow extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        this.requestTopTag(this.props.tagId);
    }


    requestTopTag(tagId) {
        homeApi.getTopNOfTags(tagId, 9, (rs) => {
            if (rs && rs.success) {
                const tag = rs.obj;
                this.setState({
                    data: tag
                });
            }
        });
    }

    render() {
        let topOfCategory = this.state.data;
        if (!topOfCategory || JSON.stringify(topOfCategory) === "{}")
            return null;

        const {name, tagId, picUrl} = this.props;

        const content = topOfCategory && topOfCategory.map((item, index) => {
            return <ProductCard key={index}
                                targetLink={`/product/${item.specialty.id}`}
                                cardProductImgUrl={item.iconURL.mediumPath}
                                cardProductName={item.specialty.name}
                                cardProductHasSold={item.hasSold}
                                cardProductPlatformPrice={item.pPrice}/>;
        });


        return <div>
            {
                content.length > 0 ?
                    <Link to={{pathname: `/home/tag`, category: name, categoryId: tagId}}>
                        <img src={"http://" + getServerIp() + picUrl} height='120' width='100%'/>
                    </Link>
                    :
                    <div/>
            }


            <Flex style={{flexWrap: 'nowrap', overflow: 'scroll'}}>
                {content}
            </Flex>

        </div>
    }
}
