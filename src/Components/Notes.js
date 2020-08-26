import React from "react"
//import NotesData from '../NotesData.js'
import '../Notes.css'

class Notes extends React.Component {

    constructor() {
        super()
        this.state = {
            noteInput : "",
            notes: [],
            id: "",
            buttonText:"Add",
            buttonName:"Add",
            dateCreated:""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleEdit = this.handleEdit.bind(this)

    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value    
        })
    }

    async handleClick(event) {
        event.preventDefault()
        
        var method
        var newNotes
        var apiUrl

        if(event.target.name === "Save") 
        {
            method = "PUT"
           
            apiUrl = "https://localhost:44371/api/notes/" + this.state.id

            newNotes = 
            {
                id: this.state.id,
                noteText : this.state.noteInput,
                dateCreated:this.state.dateCreated
            }
            
        } else {
            method = "POST"
             apiUrl = "https://localhost:44371/api/notes"
             newNotes = 
             {
                 noteText : this.state.noteInput,
                 dateCreated: new Date().toISOString()
             }
        }

            const requestOptions = {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNotes)
            };

            console.log(requestOptions)
            const response = await fetch(apiUrl, requestOptions);

            
            this.getNotes()
            if (response.status ===204 ||  response.status ===201){
                this.setState({
                    noteInput : "",
                    buttonName:"Add",
                    buttonText:"Add"
                })
            }
            
            
    }


    handleEdit(n){
        this.setState({noteInput:n.noteText,
                        buttonText:"Save",
                        buttonName:"Save",
                        id:n.id,
                        dateCreated:n.dateCreated})
    }

    async handleDelete(n) {
        const requestOptions = {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        };

        const response = await fetch("https://localhost:44371/api/notes/" + n.id, requestOptions);
        
        this.getNotes()
    }

    componentDidMount() {
        this.getNotes()
    }

    getNotes() {
        fetch("https://localhost:44371/api/notes")
        
            .then((response) => response.json())
            .then(notesData => {
                    this.setState({ notes: notesData });
                })  
    }

    render() {
        return(<div>
            <div className="note-editor">
                <textarea 
                    className="textarea" 
                    type = "text" 
                    name= "noteInput" 
                    placeholder="Please enter your note here" 
                    value = {this.state.noteInput} 
                    onChange = {this.handleChange}>
                </textarea>
            
                <button 
                    align = "right" 
                    className="add-button" 
                    name={this.state.buttonName} 
                    onClick={this.handleClick}>{this.state.buttonText}
                </button>
            </div>
            <table className ="list">
                <tbody>
                    {this.state.notes.map( (item, key) => {
                    return (
                        <tr key = {key} >
                        <td>
                            <center>
                                <button  className="add-button" onClick={() => this.handleEdit(item)}>Edit</button>
                            </center>
                        </td>
                        <td>
                            <center>
                                <button className="add-button" onClick={() => this.handleDelete(item)}>Delete</button>
                            </center>
                        </td>
                        <td><center>{item.noteText}</center></td>
                        <td><center>
                        {
                                new Intl.DateTimeFormat("en-GB", {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                    hour: 'numeric', 
                                    minute: 'numeric'
                                }).format(new Date(item.dateCreated))
                        }

                        </center></td>
                    </tr>
                    )
                })}
             </tbody>  
            </table>
            
        </div>)
    }
}

export default Notes