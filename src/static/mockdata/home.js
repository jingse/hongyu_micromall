var data = {
    "code":1,
    "data":{
        "rows":[
            {
                "style_id":"carousel_view",
                "ratio":0.5,
                "data":[
                    {
                        "img_url":"./images/banner1.jpg",
                        "url":"/product/1"
                    },
                    {
                        "img_url":"./images/banner2.jpg",
                        "url":"/product/2"
                    },
                    {
                        "img_url":"./images/banner3.jpg",
                        "url":"/product/3"
                    },
                    {
                        "img_url":"./images/banner4.jpg",
                        "url":"/product/4"
                    }
                ]
            },
            {
                "style_id":"contact_info_view",
                "ratio":0.5,
                "data":{
                    "title":"土特产微商城",

                }
            },
            {
                "style_id":"grid_view",
                "ratio":0.5,
                "data":{
                    "orientation": "h",
                    "weight": 1,
                    "cells": [
                        {
                            "image_url": "./images/4.jpg",
                            "url":"/product/1",
                            "weight": 1
                        },
                        {   
                            "orientation": "v",
                            "weight": 1,
                            "cells": [
                                {
                                    "image_url": "./images/5.jpg",
                                    "url":"/product/1",
                                    "weight": 1
                                },
                                {   
                                    "orientation": "h",
                                    "weight": 1,
                                    "cells": [
                                        {
                                            "image_url": "./images/4.jpg",
                                            "url":"/product/1",
                                            "weight": 1
                                        },
                                        {
                                            "image_url": "./images/5.jpg",
                                            "url":"/product/1",
                                            "weight": 1
                                        } 
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "style_id":"separator_view",
                "ratio":0.5,
                "data":{
                    "title":"水果专区",
                    "img_url":"./images/4.jpg",
                    "url":"/category"
                }
            }
        ],
    }
};

export default data;
