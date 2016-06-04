
var Logger = React.createClass({
	log: function(){
		window.location.href = "/twitter";

	},
	render: function(){
		return <button onClick = {this.log}>Twitter login</button>	
	}});

var Main = React.createClass({
	getInitialState: function(){
      	return { array: []}
    },
    error: function(ind){
       	var temp = this.state.array.slice();
    	temp[ind].link = 'cat.jpg';
    	temp[ind].title = 'replaced broken';
    	this.setState({array: temp.slice()});

    },
    search: function(){
    	self= this;
    	$.get( "/linksGet", {name: this.refs.namer.value})
		.done(function(data) {
			self.setState({array: data.raw});
		});
    },
    random: function(){
    	self = this;
    	$.get( "/linksGet", {name: 'random'})
		.done(function(data) {
			self.setState({array: data.raw});
		});
    },
	render: function(){
		var hider;
		if(window.location.href.split('?').length===1){
			hider = <div>
						<Logger/>
					</div>	;
		}
		return 	<div>
					{hider}
					<input ref="namer" type='text' placeholder ='User name'></input>
					<br/>
					<button onClick = {this.search}>Search</button>
					<button onClick = {this.random}>Random</button>
					<div id = 'container'>
					 <div id="myContent"> 
					{this.state.array.map((listValue, index)=>{
          	          return <img src={listValue.link} alt={listValue.title} title = {listValue.title} key = {index}
                    			key = {index} id = {"img"+index} onError={()=>this.error(index)}></img>
               		})}
           			</div>	
            			</div>
				</div>
	}
});

ReactDOM.render(<Main/>, document.getElementById("target"));