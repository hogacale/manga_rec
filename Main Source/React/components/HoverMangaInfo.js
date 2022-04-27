import React, {useRef, useState} from "react";
import ReactDOM from "react-dom"
import Overlay from "react-bootstrap/Overlay"
import Button from "react-bootstrap/Button"
import "./HoverMangaInfo.css"

//This onject just holds the html for the overlay
class MangaInfoHolder extends React.Component{
    constructor(props) {
        super(props);
        // console.log("MangaInfoHolder is ", this.props.manga);
    }

    render() {
        return (
            <div className=".container-sm my-component p-4" id="popup">
                <div className="g-0 border h-md-250 position-relative">
                    <div className="col p-3 d-flex flex-column position-static">
                        <h3 className="text-center text-white">{this.props.manga.title}</h3>
                    </div>
                    <div className="col min-height-3 p-1 position-static midSection">
                        <p className="text-white align-middle pt-2 pl-4 position-relative">Chapter Count: {this.props.manga.chapterCount}</p>
                    </div>
                    <div className="col pt-4 pl-4 description">
                        <span className="text-white description">{this.props.manga.description}</span>

                    </div>
                    <div className="pl-4">
                        <table className="text-white">
                            <tbody>
                            <tr>
                                <th scope="row" className="pl-4">Popularity</th>
                                <td className="pl-4 text-light">{this.props.manga.popularity}</td>
                            </tr>
                            <tr>
                                <th scope="row" className="pl-4">release Date</th>
                                <td className="p-2">{this.props.manga.releaseDate}</td>
                            </tr>
                            <tr>
                                <th scope="row" className="pl-4">genre</th>
                                <td className="pl-2">{this.props.manga.genre}</td>
                            </tr>
                            <tr>
                                <th scope="row" className="pl-4">Theme</th>
                                <td className="pl-2">{this.props.manga.theme}</td>
                            </tr>
                            <tr>
                                <th scope="row" className="pl-4">Demographic</th>
                                <td className="pl-2">{this.props.manga.demographic}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

//This function deals with all the logic and such to display the overlay
export default function HoverMangaInfo(props) {
    // const [show, setShow] = useState(false);
    const target = useRef();
    target.current = props.target
    const manga = props.manga;
    // console.log(props.target);
    return(
        <>
            {/*props.target is a reference created on the search.js page*/}
            <Overlay target={props.target} show={props.show} placement="right-start">
                {({ placement, arrowProps, show: _show, popper, ...props}) => (
                <div
                    {...props}
                    style={{
                        position: 'absolute',
                        padding: '2px 12px',
                        color: 'white',
                        borderRadius: 3,
                        ...props.style,
                    }}
                >
                    {/*<img src="https://pocket-syndicated-images.s3.amazonaws.com/5ed65c5ae9b8c.jpg" width="100" height="100"/>*/}
                <MangaInfoHolder
                    manga={manga}
                />
                </div>
                )}
            </Overlay>
        </>
    );
}
