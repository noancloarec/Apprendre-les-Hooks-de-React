import React from 'react'

const Counter : React.FC = () => {
    console.log('Counter renders')
    let counter = 0;
    return <div>
        <p>Vous avez cliqué {counter} fois</p>
        <button onClick={()=> counter++ }>Incrementer</button>
    </div>
}
export default Counter
