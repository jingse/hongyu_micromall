import React from "react";
import "./numStepper.less";

export const NumStepper = (props) => {
    return <div className={props.isProduct ? "step_product" : "step1"}>
        <div className={props.isProduct ? "add_minus_product" : "add_minus"} onClick={props.minusNumAction}
             style={{ backgroundImage: 'url(./images/icons/minus.png)'}}>
        </div>
        <div className={props.isProduct ? "value_product" : "value"}>{props.numVal}</div>
        <div className={props.isProduct ? "add_minus_product" : "add_minus"} onClick={props.addNumAction}
             style={{ backgroundImage: 'url(./images/icons/add.png)'}}>
        </div>
    </div>
};