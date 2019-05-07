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
        if (item.isLogo) {
            img = item.mediumPath
        }
    });
    console.log("img", img);
    return img
}



const SaleManager = {
    getSalesContent,
    getDetailSalesContent,
    getHomeSalesContent,

    getSalesDetailIcon
};

export default SaleManager;