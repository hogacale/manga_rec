import React from 'react'
import MultiRangeSlider from './components/MultiRangeSlider'
import MultiSelectDropdown from "./components/MultiSelectDropdown";
import Button from "react-bootstrap/Button";
import "./filter.css"
// import RecommendTable from "./Recommender";


class FilterTable extends React.Component{
    constructor(props) {
        super(props);
        //Constants
        this.ccTMin = 1;
        this.ccTMax = 6477;
        this.pTMin = 1;
        this.pTMax = 27691;
        this.rdTMin = 1946;
        this.rdTMax = 2022;
        this.state = {
            ccMin: this.ccTMin,
            ccMax: this.ccTMax,
            pMin: this.pTMin,
            pMax: this.pTMax,
            rdMin: this.rdTMin,
            rdMax: this.rdTMax,
            genres: ['Adventure', 'Comedy', 'Slice of Life', 'Boys Love', 'Sci-Fi', 'Action', 'Horror', 'Suspense', 'Girls Love', 'Gourmet', 'Sports', 'Avant Garde', 'Supernatural', 'Fantasy', 'Romance', 'Ecchi', 'Drama', 'Mystery'],
            genreSelected: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            themes: ['Historical', 'Time Travel', 'Visual Arts', 'Military', 'Love Polygon', 'Mecha', 'Martial Arts', 'Racing', 'Samurai', 'Strategy Game', 'CGDCT', 'Mythology', 'High Stakes Game', 'Idols (Male)', 'Reincarnation', 'Pets', 'Team Sports', 'Workplace', 'Isekai', 'Gag Humor', 'Memoir', 'Harem', 'Villainess', 'Detective', 'Performing Arts', 'Reverse Harem', 'Childcare', 'Otaku Culture', 'Mahou Shoujo', 'Anthropomorphic', 'Survival', 'Magical Sex Shift', 'Music', 'Delinquents', 'Organized Crime', 'Adult Cast', 'Medical', 'Showbiz', 'Crossdressing', 'Gore', 'Psychological', 'School', 'Combat Sports', 'Parody', 'Romantic Subtext', 'Space', 'Iyashikei', 'Video Game', 'Educational', 'Vampire', 'Super Power'],
            themeSelected: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            demographics: ['Kids', 'Seinen', 'Shoujo', 'Josei', 'Shounen'],
            demographicsSelected: [false, false, false, false, false],
            demographicsSelectedEx: [false, false, false, false, false],
            themeSelectedEx: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            genreSelectedEx: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            mangaStatus: ['On Hiatus', 'Finished', 'Publishing', 'Discontinued'],
            selectedStatus: [false, false, false, false],
        }
        this.handleCCMinimumChange = this.handleCCMinimumChange.bind(this);
        this.handleCCMaximumChange = this.handleCCMaximumChange.bind(this);
        this.handlePMinimumChange = this.handlePMinimumChange.bind(this);
        this.handlePMaximumChange = this.handlePMaximumChange.bind(this);
        this.handleRDMinimumChange = this.handleRDMinimumChange.bind(this);
        this.handleRDMaximumChange = this.handleRDMaximumChange.bind(this);
        this.handleGenreChange = this.handleGenreChange.bind(this);
        this.handleDemoChange = this.handleDemoChange.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleGenreChangeEx = this.handleGenreChangeEx.bind(this);
        this.handleDemoChangeEx = this.handleDemoChangeEx.bind(this);
        this.handleThemeChangeEx = this.handleThemeChangeEx.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //Data formatting
    handleSubmit(e){
        console.log("Submitting")
        let message = [];
        let temp;
        //Popularity  min,max
        temp = [this.state.pMin,this.state.pMax]
        message[0] = temp;
        //Release Date min,Max
        temp = [this.state.rdMin,this.state.rdMax];
        message[1] = temp;
        //Chapter Count min,Max
        temp = [this.state.ccMin,this.state.ccMax];
        message[2] = temp;
    //Status
        message[3] = this.state.selectedStatus;
    //    genre
        temp = this.state.genreSelected;
        message[4] = temp;
    //    Theme
        temp = this.state.themeSelected;
        message[5] = temp;
    //    Demographic
        temp = this.state.demographicsSelected;
        message[6] = temp;
        //genre ex
        message[7] = this.state.genreSelectedEx;
        //theme ex
        message[8] = this.state.themeSelectedEx;
        //demo ex
        message[9] = this.state.demographicsSelectedEx;

        const toPython = JSON.stringify(message);
        console.log(toPython);
        // alert(toPython);
        let url = new URL("http://localhost:3000/recommend");
        url.searchParams.set('filters',toPython);
        window.location.href = url;
    }

    handleThemeChangeEx(e){
        //This function is non destructive way to update a specific element in the state array
        //Set tempSelected to a copy of the state
        let tempSelected = this.state.themeSelectedEx;
        let item = tempSelected[e.target.id];
        item = !item;
        tempSelected[e.target.id] = item;
        this.setState({themeSelectedEx: tempSelected});
    }

    handleDemoChangeEx(e){
        let tempSelected = this.state.demographicsSelectedEx;
        let item = tempSelected[e.target.id];
        item = !item;
        tempSelected[e.target.id] = item;
        this.setState({demographicsSelectedEx: tempSelected});
    }

    handleGenreChangeEx(e){
        let tempSelected = this.state.genreSelectedEx;
        let item = tempSelected[e.target.id];
        item = !item;
        tempSelected[e.target.id] = item;
        this.setState({genreSelectedEx: tempSelected});
    }

    handleThemeChange(e){
        let tempSelected = this.state.themeSelected;
        let item = tempSelected[e.target.id];
        item = !item;
        tempSelected[e.target.id] = item;
        this.setState({themeSelected: tempSelected});
    }

    handleStatusChange(e){
        let tempSelected = this.state.selectedStatus;
        let item = tempSelected[e.target.id];
        item = !item;
        tempSelected[e.target.id] = item;
        this.setState({selectedStatus: tempSelected});
    }

    handleDemoChange(e){
        let tempSelected = this.state.demographicsSelected;
        let item = tempSelected[e.target.id];
        item = !item;
        tempSelected[e.target.id] = item;
        this.setState({demographicsSelected: tempSelected});
    }

    handleGenreChange(e){
        let tempSelected = this.state.genreSelected;
        let item = tempSelected[e.target.id];
        item = !item;
        tempSelected[e.target.id] = item;
        this.setState({genreSelected: tempSelected});
    }

    handlePMinimumChange(e){
        const value = Math.min(+e.target.value, this.state.pMax -1 );
        this.setState({
            pMin: value,
        });
        e.target.value = value.toString();
    }

    handlePMaximumChange(e){
        const value = Math.max(+e.target.value, this.state.pMin + 1);
        this.setState({
            pMax: value,
        });
        e.target.value = value.toString();
    }

    handleRDMinimumChange(e){
        //Do not really know how this function actually works
        const value = Math.min(+e.target.value, this.state.rdMax -1 );
        this.setState({
            rdMin: value,
        });
        e.target.value = value.toString();
    }

    handleRDMaximumChange(e){
        const value = Math.max(+e.target.value, this.state.rdMin + 1);
        this.setState({
            rdMax: value,
        });
        e.target.value = value.toString();
    }

    handleCCMinimumChange(e){
        const value = Math.min(+e.target.value, this.state.ccMax -1 );
        this.setState({
            ccMin: value,
    });
        e.target.value = value.toString();
    }

    handleCCMaximumChange(e){
        const value = Math.max(+e.target.value, this.state.ccMin + 1);
        this.setState({
            ccMax: value,
        });
        e.target.value = value.toString();
    }

    render(){
        return(
            <div >
                    <table>
                        <tr height="85px" >
                            <h5>Popularity</h5>
                            <MultiRangeSlider
                                tMax={this.pTMax}
                                tMin={this.pTMin}
                                min={this.state.pMin}
                                max={this.state.pMax}
                                handleMinimumChange={this.handlePMinimumChange}
                                handleMaximumChange={this.handlePMaximumChange}
                            />
                        </tr>
                        <tr height="85px">
                            <h5>Release Date</h5>
                            <MultiRangeSlider
                                tMax={this.rdTMax}
                                tMin={this.rdTMin}
                                min={this.state.rdMin}
                                max={this.state.rdMax}
                                handleMinimumChange={this.handleRDMinimumChange}
                                handleMaximumChange={this.handleRDMaximumChange}
                            />
                        </tr>
                        <tr height="85px">
                            <h5>Chapter Count</h5>
                            <MultiRangeSlider
                                tMax={this.ccTMax}
                                tMin={this.ccTMin}
                                min={this.state.ccMin}
                                max={this.state.ccMax}
                                handleMinimumChange={this.handleCCMinimumChange}
                                handleMaximumChange={this.handleCCMaximumChange}
                            />
                        </tr>
                        <tr height="100px">
                            <td>
                            <h5>Genre [Include]</h5>
                                <div>
                                    <MultiSelectDropdown
                                        type={"Genre"}
                                        list={this.state.genres}
                                        selected={this.state.genreSelected}
                                        onChange={this.handleGenreChange}
                                        handleOnUnselect={this.handleGenreChange}
                                    />
                                </div>
                            </td>
                            <td>
                                <h5>Genre [Exclude]</h5>
                                <MultiSelectDropdown
                                    type={"Genre"}
                                    list={this.state.genres}
                                    selected={this.state.genreSelectedEx}
                                    onChange={this.handleGenreChangeEx}
                                    handleOnUnselect={this.handleGenreChangeEx}
                                />
                            </td>
                        </tr>
                        <tr height="100px">
                            <td>
                                <div>
                                    <h5>Theme [Include]</h5>
                                    <MultiSelectDropdown
                                        type={"Theme"}
                                        list={this.state.themes}
                                        selected={this.state.themeSelected}
                                        onChange={this.handleThemeChange}
                                        handleOnUnselect={this.handleThemeChange}
                                    />
                                </div>
                            </td>
                            <td>
                                <h5>Theme [Exclude]</h5>
                                <MultiSelectDropdown
                                    type={"Theme"}
                                    list={this.state.themes}
                                    selected={this.state.themeSelectedEx}
                                    onChange={this.handleThemeChangeEx}
                                    handleOnUnselect={this.handleThemeChangeEx}
                                />
                            </td>
                        </tr>
                        <tr height="100px">
                            <td>
                                <h5>Demographic [Include]</h5>
                                <MultiSelectDropdown
                                    type={"Demographic"}
                                    list={this.state.demographics}
                                    selected={this.state.demographicsSelected}
                                    onChange={this.handleDemoChange}
                                    handleOnUnselect={this.handleDemoChange}
                                />
                            </td>
                            <td>
                                <h5>Demographic [Exclude]</h5>
                                <MultiSelectDropdown
                                    type={"Demographic"}
                                    list={this.state.demographics}
                                    selected={this.state.demographicsSelectedEx}
                                    onChange={this.handleDemoChangeEx}
                                    handleOnUnselect={this.handleDemoChangeEx}
                                />
                            </td>
                        </tr>
                        <tr height="100px">
                            <td>
                                <h5>Status [Exclude]</h5>
                                <MultiSelectDropdown
                                    type={"Status"}
                                    list={this.state.mangaStatus}
                                    selected={this.state.selectedStatus}
                                    onChange={this.handleStatusChange}
                                    handleOnUnselect={this.handleStatusChange}
                                />
                            </td>
                        </tr>
                    </table>
                    <Button as="input" type="submit" value="Apply Filters" onClick={this.handleSubmit}/>
            </div>
        )
    }
}



export default FilterTable