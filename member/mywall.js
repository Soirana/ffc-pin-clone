
var Linker = React.createClass({
	redirect: function(){
		window.location.href = "/member/adder.html";
	},
	render: function(){
		return <button onClick = {this.redirect}>Add pic</button>;
	}
})

var Main = React.createClass({
	getInitialState: function(){
      	return {
      		 array: JSON.parse(JSON.stringify(this.props.arr)),
      		 arre: JSON.parse(JSON.stringify(this.props.arr)),
      		 showCaption: true
      			}
    },
    handleHide: function(){
    	this.setState({showCaption: !this.state.showCaption});
    },
    home: function(){
		window.location.href = "/?h";
	},
    error: function(ind){
    	var temp = JSON.parse(JSON.stringify(this.state.array));
    	temp[ind].link = '../cat.jpg';
    	temp[ind].title = 'replaced broken';
    	this.setState({array: JSON.parse(JSON.stringify(temp))});
    },
    remove: function(ind){
    	var temp = JSON.parse(JSON.stringify(this.state.array));
    	temp.splice(ind, 1);
    	this.setState({array: JSON.parse(JSON.stringify(temp))});
    	$.get( "/linksRemove", this.state.arre[ind])
		.done(function(data) {});
		this.setState({arre: JSON.parse(JSON.stringify(temp))});
    },
	render: function(){
		console.log(this.state.array);
		var buttonText
		if (this.state.showCaption === true){
			buttonText = 'Hide caption'
		} else{
			buttonText = 'Show caption'
		}
		return	<div>
					<button onClick = {this.handleHide}>{buttonText}</button>
					<button onClick = {this.home}>Home page</button>
					<Linker/>
					<div id = 'container'>
					 <div id="myContent"> 
						{this.state.array.map((listValue, index)=>{
          					if (this.state.showCaption) {
          	          			return <figure>
          	                    			<img src={listValue.link} alt={listValue.title} title = {listValue.title} key = {index}
                    			 			onError={()=>this.error(index)}></img>
                    						<figcaption >{listValue.title}<span onClick = {()=>this.remove(index)}>Remove</span></figcaption>
                 						</figure>
                 		}
                 		return <img src={listValue.link} alt={listValue.title} title = {listValue.title} key = {index}
                    			 			onError={()=>this.error(index)}></img>
            				})}
            			</div>
            			</div>
            	</div>
	}
});

$.get( "/linksGet", {name: false})
		.done(function(data) {
			ReactDOM.render(<Main arr = {data.raw}></Main>,
       				document.getElementById('target'));
			});