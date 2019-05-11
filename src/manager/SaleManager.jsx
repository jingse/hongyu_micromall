// sales和sales_group列表页用到的函数
function getSalesContent(ruleType, substracts, discounts, presents) {
    switch (ruleType) {
        case "满减":
            return substracts && substracts.map((item, index) => {
                return "满" + item.fullFreeRequirement + "元减" + item.fullFreeAmount + "元"
            });
        case "满折":
            return discounts && discounts.map((item, index) => {
                return "满" + item.discountRequirenment + "元打" + item.discountOff + "折"
            });
        case "满赠":
            return presents && presents.map((item, index) => {
                return "满" + item.fullPresentRequirenment + "元赠" + item.fullPresentProductNumber
            });
    }
}

// sales和sales_group的Detail页面用到的函数
function getDetailSalesContent(ruleType, substracts, discounts, presents) {
    switch (ruleType) {
        case "满减":
            return substracts && substracts.map((item, index) => {
                return "满" + item.fullFreeRequirement + "元减" + item.fullFreeAmount + "元"
            });
        case "满折":
            return discounts && discounts.map((item, index) => {
                return "满" + item.discountRequirenment + "元打" + item.discountOff + "折"
            });
        case "满赠":
            return presents && presents.map((item, index) => {
                return "满" + item.fullPresentRequirenment + "元赠" + item.fullPresentProduct.name + "*" + item.fullPresentProductNumber
            });
    }
}

//首页用到的函数
function getHomeSalesContent(ruleType, substracts, discounts, presents) {
    switch (ruleType) {
        case "满减":
            return substracts && substracts.map((item, index) => {
                return "满" + item.fullFreeRequirement + "减" + item.fullFreeAmount + "元"
            });
        case "满折":
            return discounts && discounts.map((item, index) => {
                return "满" + item.discountRequirenment + "打" + item.discountOff * 10 + "折"
            });
        case "满赠":
            return presents && presents.map((item, index) => {
                // return "满" + item.fullPresentRequirenment + "赠" + item.fullPresentProduct.name +"*"+item.fullPresentProductNumber
                return "满" + item.fullPresentRequirenment + "赠商品"
            });
    }
}


//sales和sales_group的detail页面都用到的函数
function getSalesDetailIcon(salesImages) {
    let img = null;
    salesImages && salesImages.map((item, index) => {
        if (item.isLogo)
            img = item.mediumPath
    });
    return img
}

function getSalesIconImg(salesImages) {
    let img = null;
    salesImages.pics && salesImages.pics.map((item, index) => {

        // 产品下架了，优惠却没下架的情况
        if (JSON.stringify(salesImages.hySingleitemPromotions) === "[]")
            return item.mediumPath;

        if (!salesImages.hySingleitemPromotions[0].hyPromotion.syncTagpic) {
            if (item.isTag)
                img = item.mediumPath;
        } else {
            if (item.isLogo)
                img = item.mediumPath;
        }
    });
    return img
}

//sales_group的detail页面多用到的一个函数
function getSalesGroupIconImg(salesImages) {
    let img = null;
    salesImages && salesImages.map((item, index) => {
        if (item.isTag)
            img = item.mediumPath
    });
    return img
}

function gerSalesGroupIconByItem(item) {
    let img = null;
    item.pics && item.pics.map((image, index) => {
        if (image.isTag)
            img = image.mediumPath
    });
    return img
}

function getSalesGroupIconImgArray(salesImages) {
    let img = null;
    salesImages && salesImages.map((item, index) => {
        if (item.isTag)
            img = item
    });
    return img
}

const SaleManager = {
    getSalesContent,
    getDetailSalesContent,
    getHomeSalesContent,

    getSalesIconImg,
    getSalesGroupIconImg,
    gerSalesGroupIconByItem,
    getSalesGroupIconImgArray,
    getSalesDetailIcon,
};

export default SaleManager;