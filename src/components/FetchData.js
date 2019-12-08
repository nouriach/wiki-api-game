import React from 'react'


class FetchData extends React.Component {
    
    componentDidMount = () => {
        // fetch('https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=Alan%20Shearer')
        fetch('https://en.wikipedia.org/w/api.php?&origin=*&action=parse&format=json&prop=sections&prop=wikitext&prop=text&page=Alan%20Shearer')
        .then(response => response.json())
        .then(data => console.log(data.parse.text))
        .catch(err => console.error(err))
    }

    render() {
        return (
        <>
            <h1>hello</h1>
        </>
        )
    }
}

export default FetchData;