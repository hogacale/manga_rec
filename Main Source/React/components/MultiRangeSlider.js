import './MultiRangeSlider.css';
import React, {useImperativeHandle} from 'react';
import classnames from 'classnames'

/*
This whole component is designed to be resuable for any data presented to it.
Therefore it is generic
 */


class MultiRangeSlider extends React.Component {
    constructor(props) {
        super(props);
        this.minRef = React.createRef();
        this.maxRef = React.createRef();
        this.onMinimumChange = this.onMinimumChange.bind(this);
        this.onMaximumChange = this.onMaximumChange.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
        this.onFocusOutMax = this.onFocusOutMax.bind(this);
        this.handleMinKeyDown = this.handleMinKeyDown.bind(this);
        this.handleMaxKeyDown = this.handleMaxKeyDown.bind(this);
    }

    //The entire purpose of this and the function below is to allow the user to press enter to submit a value with the slider
    handleMinKeyDown(e){
        if (e.key === "Enter") {
            if(e.target.value === "")
                e.target.value = this.props.min;
            this.props.handleMinimumChange(e)
        }
    }

    handleMaxKeyDown(e){
        if (e.key === "Enter") {
            if(e.target.value === "")
                e.target.value = this.props.max;
            this.props.handleMaximumChange(e)
        }
    }

    //These next two are the same as the two above but activate when the user no longer selects the input
    onFocusOut(e){
        // console.log("unfocused")
        if(e.target.value === "")
            e.target.value = this.props.min;
        this.props.handleMinimumChange(e)
    }

    onFocusOutMax(e){
        // console.log("unfocused")
        if(e.target.value == "")
            e.target.value = this.props.max;
        this.props.handleMaximumChange(e);
    }

    //These two deal with the slider itself
    onMinimumChange(e){
        this.props.handleMinimumChange(e);
        this.minRef.current.value = e.target.value.toString();
    }

    onMaximumChange(e){
        this.props.handleMaximumChange(e);
        this.maxRef.current.value = e.target.value.toString();
    }

    render() {
        return (
            <>
                <input
                    type="range"
                    min={this.props.tMin}
                    max={this.props.tMax}
                    value={this.props.min}
                    onChange={this.onMinimumChange}
                    className={classnames("thumb thumb--zindex-3", {
                        "thumb--zindex-5": 1 > this.props.max - 100
                    })}
                />
                <input
                    type="range"
                    min={this.props.tMin}
                    max={this.props.tMax}
                    value={this.props.max}
                    onChange={this.onMaximumChange}
                    className="thumb thumb--zindex-4"
                />
                <div className="slider">
                    <div className="slider__track"/>
                    <div className="slider__range"/>
                    <input className={"slider__left-value"} onKeyDown={this.handleMinKeyDown} ref={this.minRef} placeholder={this.props.min} onBlur={this.onFocusOut} />
                    <input className={"slider__right-value"} onKeyDown={this.handleMaxKeyDown} ref={this.maxRef} onKeyDown={this.handleMaxKeyDown} placeholder={this.props.max} onBlur={this.onFocusOutMax}/>
                </div>
            </>
        );
    }
}

export default MultiRangeSlider;
